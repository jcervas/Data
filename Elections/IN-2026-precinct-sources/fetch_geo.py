#!/usr/bin/env python3
"""Download Indiana's 2026 statewide precinct geography and derive the join key
table the results harvest will key against.

Why this exists: Indiana is the inverse of Texas. In Texas the geography was the
hard part and the Legislative Council shapefile had to be reverse-engineered;
here the state hands you a clean statewide precinct layer -- 5,121 polygons from
the Indiana General Assembly and the Election Division, refreshed annually --
and it is the *results* that have no statewide publisher. So the geography gets
pulled once, up front, and the crosswalk it yields becomes the fixed spine that
92 counties' returns get joined onto later.

The layer carries something the other states' precinct files do not: each
polygon already names the congressional (`c`), state senate (`s`) and state
house (`h`) district it sits in, so district rollups need no spatial join.

Source: IndianaMap / Indiana Geographic Information Office, hosted at
gisdata.in.gov. `Query,Sync,Extract`, 2,000 records per page, so this pages.

Writes, into geo/:
  downloads/in_2026_vtd.geojson   full polygons, as served (EPSG:4326)
  precinct_key_crosswalk.csv      one row per precinct, no geometry
  county_precinct_counts.csv      one row per county

    ./fetch_geo.py [--out-dir geo] [--page-size 1000]
"""
import argparse, csv, json, os, sys, time, urllib.error, urllib.parse, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
LAYER = ("https://gisdata.in.gov/server/rest/services/Hosted/"
         "Voting_District_Boundaries_2026/FeatureServer/0")
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")
TIMEOUT = 90
# Indiana's own layer spells the ID fields in lower case; keep them that way so
# the CSV matches the service and nobody has to guess at capitalization later.
FIELDS = ["county", "p26", "p26county", "p26_stfid", "c", "s", "h"]


def get(url, params, tries=4):
    q = urllib.parse.urlencode(params)
    for attempt in range(tries):
        try:
            req = urllib.request.Request(f"{url}?{q}", headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
                return json.loads(r.read().decode("utf-8", "replace"))
        except (urllib.error.URLError, json.JSONDecodeError, TimeoutError) as e:
            if attempt == tries - 1:
                raise
            # gisdata.in.gov throttles under repeated large geometry pulls.
            time.sleep(2 ** attempt)


def count():
    return get(LAYER + "/query", {"where": "1=1", "returnCountOnly": "true",
                                  "f": "json"})["count"]


def fetch_features(page_size):
    """Page through the layer. transferLimitExceeded is advisory; trust offsets."""
    total, out, offset = count(), [], 0
    while offset < total:
        page = get(LAYER + "/query", {
            "where": "1=1", "outFields": ",".join(FIELDS), "outSR": "4326",
            "returnGeometry": "true", "f": "geojson",
            "resultOffset": offset, "resultRecordCount": page_size})
        feats = page.get("features", [])
        if not feats:
            print(f"  empty page at offset {offset}; stopping short", file=sys.stderr)
            break
        out.extend(feats)
        offset += len(feats)
        print(f"  {len(out)}/{total}", file=sys.stderr)
    return total, out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out-dir", default=os.path.join(HERE, "geo"))
    ap.add_argument("--page-size", type=int, default=1000)
    a = ap.parse_args()
    dl = os.path.join(a.out_dir, "downloads")
    os.makedirs(dl, exist_ok=True)

    print("fetching Voting District Boundaries 2026", file=sys.stderr)
    expected, feats = fetch_features(a.page_size)
    if len(feats) != expected:
        print(f"WARNING: got {len(feats)} of {expected} features", file=sys.stderr)

    gj = os.path.join(dl, "in_2026_vtd.geojson")
    with open(gj, "w") as f:
        json.dump({"type": "FeatureCollection", "features": feats}, f)
    print(f"wrote {gj} ({os.path.getsize(gj)/1e6:.1f} MB, {len(feats)} features)")

    rows = []
    for ft in feats:
        p = ft.get("properties") or {}
        rows.append({k: (p.get(k) or "") for k in FIELDS})
    # Sort by the full state FIPS id so the crosswalk is stable across refreshes.
    rows.sort(key=lambda r: (r["p26_stfid"], r["p26"]))

    xw = os.path.join(a.out_dir, "precinct_key_crosswalk.csv")
    with open(xw, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=FIELDS)
        w.writeheader()
        w.writerows(rows)
    print(f"wrote {xw} ({len(rows)} precincts)")

    by_county = {}
    for r in rows:
        c = by_county.setdefault(r["county"], {"county_fips3": r["county"],
                                               "precincts": 0, "cds": set()})
        c["precincts"] += 1
        if r["c"]:
            c["cds"].add(r["c"])
    cc = os.path.join(a.out_dir, "county_precinct_counts.csv")
    with open(cc, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["county_fips3", "precincts", "congressional_districts"])
        for k in sorted(by_county):
            v = by_county[k]
            w.writerow([v["county_fips3"], v["precincts"],
                        "|".join(sorted(v["cds"]))])
    print(f"wrote {cc} ({len(by_county)} counties)")


if __name__ == "__main__":
    main()
