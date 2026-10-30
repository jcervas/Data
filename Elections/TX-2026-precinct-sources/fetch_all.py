#!/usr/bin/env python3
"""One driver for all 42 resolved Texas counties, writing a manifest.

    python3 fetch_all.py                    # discover everything, write manifest
    python3 fetch_all.py --download         # also save the files
    python3 fetch_all.py --browser          # include Hays + McLennan
    python3 fetch_all.py --only dallas,harris
    python3 fetch_all.py --date 2024-11-05  # a past election

Covers the three access paths this directory documents:

  * 32 Clarity counties      -> per-precinct detail.xml  (fetch_clarity.py)
  * 8 county-hosted sites    -> precinct PDFs/CSV        (fetch_non_clarity.py)
  * 2 Cloudflare counties    -> real Chrome              (browser_fetch.mjs)

Writes manifest.json (full detail, nested per county) and manifest.csv (one row
per file, for a spreadsheet or a join against tx_2026_precinct_sources.csv).
Re-running is safe: discovery makes no changes, and --download overwrites.
"""

import argparse
import csv
import datetime as dt
import hashlib
import io
import json
import os
import re
import shutil
import subprocess
import sys
import zipfile
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.dont_write_bytecode = True      # this is a data directory, not a package

import fetch_clarity as CL          # noqa: E402
import fetch_non_clarity as NC      # noqa: E402

INVENTORY = os.path.join(HERE, "tx_2026_precinct_sources.csv")
BROWSER_HELPER = os.path.join(HERE, "browser_fetch.mjs")


def key(name):
    return re.sub(r"[^a-z]", "", name.lower())


def inventory():
    """fips / rank / registered voters, keyed by squashed county name."""
    rows = {}
    if not os.path.exists(INVENTORY):
        return rows
    with open(INVENTORY) as f:
        for r in csv.DictReader(f):
            rows[key(r["county"])] = {
                "fips": r["fips"],
                "rank_by_rv": int(r["rank_by_rv"]) if r["rank_by_rv"] else None,
                "registered_voters": int(r["registered_voters"]) if r["registered_voters"] else 0,
                "platform": r["platform"],
            }
    return rows


def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


# --- the three access paths ---------------------------------------------------

def do_clarity(slug, date_str, download, outdir, scan=False):
    """Clarity county: one detail.xml holding every precinct in every contest."""
    out = {"county": slug.replace("_", " "), "path_kind": "clarity",
           "source": f"{CL.BASE}/{slug}/", "files": []}
    eid, err = CL.find_eid(slug, date_str, scan=scan)
    if err:                      # could not tell; this is a failure, not a no
        out["status"] = err
        return out
    if not eid:
        out["status"] = f"no site staged for {date_str}"
        return out
    out["election_id"] = eid
    ver = CL.get(f"{CL.BASE}/{slug}/{eid}/current_ver.txt").strip()
    if not ver.isdigit():
        out["status"] = f"bad version {ver!r}"
        return out
    out["version"] = ver
    url = f"{CL.BASE}/{slug}/{eid}/{ver}/reports/detailxml.zip"
    blob = CL.get(url, binary=True)
    xml = zipfile.ZipFile(io.BytesIO(blob)).read("detail.xml").decode("utf-8", "replace")
    tag = lambda t: (re.search(f"<{t}>(.*?)</{t}>", xml) or [None, None])[1]
    rec = {"label": "detail.xml", "url": url, "bytes": len(blob),
           "election_name": tag("ElectionName"), "election_date": tag("ElectionDate"),
           "contests": len(re.findall("<Contest ", xml)),
           "precinct_nodes": len(re.findall("<Precinct ", xml))}
    if download:
        os.makedirs(outdir, exist_ok=True)
        path = os.path.join(outdir, f"{slug}_detail.xml")
        with open(path, "w") as f:
            f.write(xml)
        rec["path"] = path
        rec["sha256"] = sha256(path)
    out["files"].append(rec)
    out["status"] = "ok"
    return out


def do_county_site(county, date, download, outdir):
    """County-hosted site: candidate precinct reports, checked with a HEAD."""
    out = {"county": county.title(), "path_kind": "county-site", "files": []}
    try:
        hits = NC.HANDLERS[county](date)
    except Exception as exc:
        # Distinguish "the site threw us out for now" from "the scraper broke".
        # Brazoria rate-limits bursts and recovers on its own, so a 403 here is
        # a soft miss that the next scheduled run picks up.
        msg = str(exc)
        out["status"] = ("rate-limited (403), retry next run" if "403" in msg
                         else f"{type(exc).__name__}: {msg}")
        out["error_detail"] = msg
        return out
    for label, url in hits:
        status, size = NC.head(url)
        rec = {"label": label, "url": url, "status": status, "bytes": size}
        if download and status == 200:
            try:
                path, n = NC.save(url, outdir, county)
                rec.update(path=path, bytes=n, sha256=sha256(path))
            except Exception as exc:
                rec["error"] = str(exc)
        out["files"].append(rec)
    out["status"] = "ok" if any(f.get("status") == 200 for f in out["files"]) \
        else "nothing reachable yet"
    return out


def do_browser(county, download, outdir):
    """Cloudflare county: hand off to real Chrome and read back its JSON."""
    out = {"county": county.title(), "path_kind": "browser", "files": [],
           "source": NC.BROWSER_ONLY[county][0]}
    if not shutil.which("node"):
        out["status"] = "needs Node 22+"
        return out
    cmd = ["node", BROWSER_HELPER, county, "--json", "--out", outdir]
    if download:
        cmd.append("--download")
    proc = subprocess.run(cmd, capture_output=True, text=True)
    body = proc.stdout.strip()
    if not body:
        out["status"] = (proc.stderr.strip().splitlines() or ["no output"])[-1][:120]
        return out
    try:
        rows = json.loads(body[body.index("["):])
    except Exception as exc:
        out["status"] = f"unparsable helper output: {exc}"
        return out
    for r in rows:
        rec = {"label": r.get("label"), "url": r.get("url"),
               "election": r.get("election"), "bytes": r.get("bytes"),
               "status": 200 if r.get("path") or not download else r.get("error") or 200}
        if r.get("path"):
            rec["path"] = r["path"]
            if os.path.exists(r["path"]):
                rec["sha256"] = sha256(r["path"])
        if r.get("error"):
            rec["error"] = r["error"]
        out["files"].append(rec)
    out["status"] = "ok" if out["files"] else "nothing found"
    return out


# --- driver -------------------------------------------------------------------

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--date", default="2026-11-03")
    p.add_argument("--download", action="store_true")
    p.add_argument("--browser", action="store_true",
                   help="include Hays and McLennan (needs Node 22+ and Chrome)")
    p.add_argument("--only", default="", help="comma-separated county names")
    p.add_argument("--outdir", default="tx_precinct_out")
    p.add_argument("--manifest", default="manifest")
    p.add_argument("--workers", type=int, default=6)
    p.add_argument("--scan", action="store_true",
                   help="when a county's elections.json is unusable, probe the "
                        "Clarity id band for its site (slow, cached after)")
    a = p.parse_args()

    date = dt.date.fromisoformat(a.date)
    date_str = f"{date.month}/{date.day}/{date.year}"
    only = {key(c) for c in a.only.split(",") if c.strip()}
    inv = inventory()

    jobs = []
    for slug in CL.SLUGS:
        if not only or key(slug.replace("_", " ")) in only:
            jobs.append(("clarity", slug))
    for county in NC.ORDER:
        if only and key(county) not in only:
            continue
        if county in NC.BROWSER_ONLY:
            jobs.append(("browser", county))
        else:
            jobs.append(("county", county))

    def run(job):
        kind, name = job
        try:
            if kind == "clarity":
                return do_clarity(name, date_str, a.download, a.outdir, a.scan)
            if kind == "county":
                return do_county_site(name, date, a.download, a.outdir)
            if not a.browser:
                return {"county": name.title(), "path_kind": "browser",
                        "status": "skipped (pass --browser)", "files": [],
                        "source": NC.BROWSER_ONLY[name][0]}
            return do_browser(name, a.download, a.outdir)
        except Exception as exc:
            return {"county": name.replace("_", " ").title(), "path_kind": kind,
                    "status": f"{type(exc).__name__}: {exc}", "files": []}

    # Clarity and the county sites are independent hosts, so fan out; the browser
    # counties run last and alone, since each drives its own Chrome.
    parallel = [j for j in jobs if j[0] != "browser"]
    serial = [j for j in jobs if j[0] == "browser"]
    with ThreadPoolExecutor(max_workers=a.workers) as pool:
        results = list(pool.map(run, parallel))
    results += [run(j) for j in serial]

    for r in results:
        meta = inv.get(key(r["county"]), {})
        r["fips"] = meta.get("fips")
        r["rank_by_rv"] = meta.get("rank_by_rv")
        r["registered_voters"] = meta.get("registered_voters", 0)
    results.sort(key=lambda r: (r["rank_by_rv"] is None, r["rank_by_rv"] or 0))

    live = [r for r in results if r["status"] == "ok"]
    rv_total = sum(v["registered_voters"] for v in inv.values()) or 1
    manifest = {
        "generated_utc": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"),
        "election_date": a.date,
        "downloaded": a.download,
        "counties_attempted": len(results),
        "counties_with_data": len(live),
        "files": sum(len(r["files"]) for r in results),
        "bytes": sum(f.get("bytes") or 0 for r in results for f in r["files"]),
        "registered_voters_covered": sum(r["registered_voters"] for r in live),
        "share_of_state_rv": round(sum(r["registered_voters"] for r in live) / rv_total, 4),
        "counties": results,
    }
    with open(a.manifest + ".json", "w") as f:
        json.dump(manifest, f, indent=1)
    cols = ["county", "fips", "rank_by_rv", "registered_voters", "path_kind",
            "county_status", "label", "election", "url", "status", "bytes",
            "path", "sha256", "contests", "precinct_nodes"]
    with open(a.manifest + ".csv", "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=cols, extrasaction="ignore")
        w.writeheader()
        for r in results:
            base = {k: r.get(k) for k in
                    ("county", "fips", "rank_by_rv", "registered_voters", "path_kind")}
            base["county_status"] = r["status"]
            if not r["files"]:
                w.writerow(base)
            for fl in r["files"]:
                w.writerow({**base, **fl})

    print(f"{'#':>3} {'county':<13}{'path':<12}{'files':>5}  {'bytes':>13}  status")
    for r in results:
        n = len(r["files"])
        b = sum(f.get("bytes") or 0 for f in r["files"])
        rank = r["rank_by_rv"] or ""
        print(f"{rank:>3} {r['county'][:12]:<13}{r['path_kind']:<12}{n:>5}  "
              f"{b:>13,}  {r['status'][:46]}")
    print(f"\n{manifest['counties_with_data']}/{manifest['counties_attempted']} "
          f"counties with data, {manifest['files']} files, "
          f"{manifest['bytes']:,} bytes")
    print(f"covering {manifest['registered_voters_covered']:,} registered voters "
          f"({manifest['share_of_state_rv']:.1%} of Texas)")
    print(f"wrote {a.manifest}.json and {a.manifest}.csv")


if __name__ == "__main__":
    sys.exit(main())
