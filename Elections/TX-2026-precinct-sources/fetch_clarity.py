#!/usr/bin/env python3
"""Pull per-precinct results for every Texas county on Clarity.

Usage:
    python3 fetch_clarity.py                 # all Clarity counties, 11/3/2026
    python3 fetch_clarity.py Bexar El_Paso   # just these
    python3 fetch_clarity.py --date 3/3/2026 # a different election

Writes <outdir>/<County>_detail.xml and prints one line per county. Counties
whose November site is not staged yet are reported and skipped, so this is safe
to run on a loop on election night.
"""

import argparse
import io
import json
import os
import re
import sys
import urllib.request
import zipfile

BASE = "https://results.enr.clarityelections.com/TX"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/129.0 Safari/537.36"

# Probed against all 254 counties on 2026-10-23.
SLUGS = [
    "Bastrop", "Bell", "Bexar", "Clay", "Comal", "Dallas", "Denton", "El_Paso",
    "Fort_Bend", "Galveston", "Gregg", "Guadalupe", "Hidalgo", "Hood", "Hunt",
    "Jefferson", "Kaufman", "Kendall", "Lamar", "Lubbock", "Midland", "Montague",
    "Nueces", "Parker", "Robertson", "Rockwall", "Rusk", "Tarrant", "Travis",
    "Victoria", "Williamson", "Wood",
]

# elections.json is an archive list and omits the current event for some
# counties, so seed the ids verified by hand.
KNOWN_EIDS = {
    "11/3/2026": {
        "Bexar": "127291", "Dallas": "127396", "El_Paso": "127348",
        "Fort_Bend": "127480", "Galveston": "127478", "Kaufman": "127485",
        "Lamar": "127484", "Parker": "127479", "Tarrant": "127297",
        "Victoria": "127359", "Wood": "127355",
    }
}


def get(url, binary=False):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Encoding": "identity"})
    with urllib.request.urlopen(req, timeout=45) as r:
        body = r.read()
    return body if binary else body.decode("utf-8", "replace")


def find_eid(slug, date):
    known = KNOWN_EIDS.get(date, {}).get(slug)
    if known:
        return known
    try:
        events = json.loads(get(f"{BASE}/{slug}/elections.json"))
    except Exception:
        return None
    for e in events if isinstance(events, list) else []:
        if (e.get("Date") or "").startswith(date):
            return e.get("EID")
    return None


def fetch(slug, date, outdir):
    eid = find_eid(slug, date)
    if not eid:
        return f"{slug:<12} -- no site staged for {date}"
    ver = get(f"{BASE}/{slug}/{eid}/current_ver.txt").strip()
    if not ver.isdigit():
        return f"{slug:<12} -- bad version {ver!r}"
    blob = get(f"{BASE}/{slug}/{eid}/{ver}/reports/detailxml.zip", binary=True)
    xml = zipfile.ZipFile(io.BytesIO(blob)).read("detail.xml").decode("utf-8", "replace")
    os.makedirs(outdir, exist_ok=True)
    with open(os.path.join(outdir, f"{slug}_detail.xml"), "w") as f:
        f.write(xml)
    tag = lambda t: (re.search(f"<{t}>(.*?)</{t}>", xml) or [None, "?"])[1]
    return (f"{slug:<12} eid={eid} ver={ver} {tag('ElectionDate')} "
            f"contests={len(re.findall('<Contest ', xml))} "
            f"precinct_nodes={len(re.findall('<Precinct ', xml))}")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("counties", nargs="*", default=None)
    p.add_argument("--date", default="11/3/2026")
    p.add_argument("--outdir", default="clarity_out")
    a = p.parse_args()
    for slug in (a.counties or SLUGS):
        try:
            print(fetch(slug, a.date, a.outdir), flush=True)
        except Exception as exc:
            print(f"{slug:<12} !! {type(exc).__name__}: {exc}", flush=True)


if __name__ == "__main__":
    sys.exit(main())
