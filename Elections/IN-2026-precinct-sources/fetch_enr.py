#!/usr/bin/env python3
"""Pull everything Indiana's statewide election-night feed will give you, and
record what it will not.

The feed behind enr.indianavoters.in.gov is an AngularJS app reading static JSON
out of `/site/data/`. Two things about it matter:

1. Its floor is the **county**. Each county's `JurR_<fips>` file holds exactly
   one reporting region -- the county itself, type "Locality" -- and the only
   precinct-shaped number anywhere in the app is a
   `TOTAL_ALLPRECINCTSREPORTING` counter. There is no precinct drill-down to
   scrape, so the 92 county offices are the only path to precinct returns.
2. What it *does* give is per-county registered voters, ballots cast, and the
   in-person/absentee split, which is the right weight for deciding which
   counties to chase first -- and the absentee share is advance warning of how
   much of a county's vote may arrive in countywide batches that no precinct can
   hold.

Filenames are versioned by `VersionType` from settings.json (a single letter,
currently "A"), *not* by the `VersionCode` timestamp -- a trap worth writing
down, since VersionCode looks like the obvious candidate and 404s.

Writes:
  enr_county_turnout_2026.csv   92 rows: RV, ballots, in-person, absentee
  county_election_offices.csv   92 rows: office name, address, phone, from JurR
  enr_snapshot.json             settings.json as fetched, for the audit trail

    ./fetch_enr.py [--out-dir .] [--skip-offices]
"""
import argparse, csv, json, os, sys, time, urllib.error, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = "https://enr.indianavoters.in.gov/site/data"
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")
TIMEOUT = 30


def get_json(name, tries=3):
    url = f"{BASE}/{name}.json"
    for attempt in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
                d = json.loads(r.read().decode("utf-8-sig", "replace"))
            # The feed wraps payloads in Root or root, inconsistently.
            for k in ("Root", "root"):
                if isinstance(d, dict) and k in d:
                    d = d[k]
            return d
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None
            if attempt == tries - 1:
                raise
            time.sleep(1 + attempt)
        except (urllib.error.URLError, json.JSONDecodeError, TimeoutError):
            if attempt == tries - 1:
                raise
            time.sleep(1 + attempt)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out-dir", default=HERE)
    ap.add_argument("--skip-offices", action="store_true")
    a = ap.parse_args()

    settings = get_json("settings")
    if not settings:
        sys.exit("settings.json unavailable")
    ver = settings["VersionType"]
    print(f"election {settings['CurrentElection']} type {settings['ElectionType']} "
          f"certified={settings['Certified']} version={settings['VersionCode']} "
          f"({ver})", file=sys.stderr)
    with open(os.path.join(a.out_dir, "enr_snapshot.json"), "w") as f:
        json.dump(settings, f, indent=1)

    turnout = get_json(f"statewideTurnout_{ver}")
    rows = turnout["CountyTurnout"] if turnout else []
    # The feed appends its own "Total" row; keep it out of the per-county table.
    rows = [r for r in rows if (r.get("County") or "").strip().lower() != "total"]
    out = os.path.join(a.out_dir, "enr_county_turnout_2026.csv")
    silent = []
    with open(out, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["county", "registered_voters", "ballots_cast", "in_person",
                    "absentee", "turnout_pct", "absentee_pct", "reports_turnout"])
        for r in sorted(rows, key=lambda x: x["County"]):
            rv, bc = r["REGISTERED_VOTERS"] or 0, r["VotersVoting"] or 0
            ab = r.get("Absentee") or 0
            # A county that has filed nothing shows as all zeros, not as absent.
            # Flag it rather than letting a 0 pass for a measurement.
            ok = "yes" if (rv or bc) else "no"
            if ok == "no":
                silent.append(r["County"])
            w.writerow([r["County"], rv, bc, r.get("InPerson") or 0, ab,
                        f"{100*bc/rv:.1f}" if rv else "",
                        f"{100*ab/bc:.1f}" if bc else "", ok])
    print(f"wrote {out} ({len(rows)} counties)")
    if silent:
        print(f"  {len(silent)} reporting nothing to the state feed: "
              f"{', '.join(silent)}")

    if a.skip_offices:
        return
    # FIPS from the Census national county file, so the ids are not guessed.
    ref = urllib.request.Request(
        "https://www2.census.gov/geo/docs/reference/codes2020/national_county2020.txt",
        headers={"User-Agent": UA})
    with urllib.request.urlopen(ref, timeout=TIMEOUT) as r:
        lines = r.read().decode("utf-8", "replace").splitlines()
    fips = []
    for ln in lines:
        p = ln.split("|")
        if len(p) > 4 and p[0] == "IN":
            fips.append((p[1] + p[2], p[4].replace(" County", "")))

    offices, single_region = [], 0
    for f5, name in sorted(fips):
        d = get_json(f"JurR_{f5}_{ver}")
        if not d:
            offices.append({"fips": f5, "county": name, "office_name": "",
                            "address": "", "city": "", "zip": "", "phone": "",
                            "reporting_regions": ""})
            continue
        reg = d.get("Region", {})
        oi = reg.get("Office_Info", {}) or {}
        rr = (reg.get("Reporting_Regions") or {}).get("Regions")
        n = len(rr) if isinstance(rr, list) else (1 if rr else 0)
        if n == 1:
            single_region += 1
        offices.append({
            "fips": f5, "county": name,
            "office_name": oi.get("GENERAL_OFFICE_NAME", ""),
            "address": oi.get("FULL_ADDRESS", ""), "city": oi.get("CITY", ""),
            "zip": oi.get("ZIP", ""), "phone": oi.get("PHONE", ""),
            "reporting_regions": n})
        print(f"  {name} ({f5}): {n} reporting region(s)", file=sys.stderr)

    out = os.path.join(a.out_dir, "county_election_offices.csv")
    with open(out, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(offices[0]))
        w.writeheader()
        w.writerows(offices)
    print(f"wrote {out} ({len(offices)} counties)")
    print(f"counties whose statewide feed exposes exactly one reporting region "
          f"(the county itself): {single_region}/{len(offices)}")


if __name__ == "__main__":
    main()
