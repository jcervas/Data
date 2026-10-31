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
import threading
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


CACHE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "known_eids.json")


def _cache():
    try:
        with open(CACHE) as f:
            return json.load(f)
    except Exception:
        return {}


def _remember(date, slug, eid):
    """Persist a discovered id. elections.json is flaky and omits the current
    event for some counties, so once we have seen an id we keep it."""
    c = _cache()
    c.setdefault(date, {})[slug] = eid
    try:
        with open(CACHE, "w") as f:
            json.dump(c, f, indent=1, sort_keys=True)
    except Exception:
        pass


# Every November 2026 id discovered so far lands in this range. Clarity ids are
# global and sequential-ish, so when elections.json is useless a bounded scan
# finds the site. Hits are rare (most counties have none), so verifying each with
# detail.xml is cheap, and a hit is cached forever.
EID_BAND = (127250, 127650)

# A band scan is ~400 requests per county. fetch_all runs counties in parallel,
# so without a global cap a full sweep opens hundreds of sockets at once and the
# machine starts refusing its own connections (ECONNREFUSED on hosts that were
# fine a minute earlier). One semaphore across every scanning thread keeps the
# whole process polite no matter how many counties scan at the same time.
_SCAN_GATE = threading.Semaphore(8)


def scan_band(slug, date, workers=4):
    """Last-resort discovery: probe the id band for a site whose detail.xml
    says it is this election. Returns an eid or None.

    Needed because elections.json is an archive list that returns an empty body
    for many counties -- Bexar, Dallas, Tarrant, Fort Bend, Parker and Victoria
    were all found this way, not from their own listing.
    """
    import concurrent.futures as cf

    def probe(eid):
        with _SCAN_GATE:
            return _probe(eid)

    def _probe(eid):
        try:
            ver = get(f"{BASE}/{slug}/{eid}/current_ver.txt").strip()
        except Exception:
            return None
        if not ver.isdigit():
            return None
        try:
            blob = get(f"{BASE}/{slug}/{eid}/{ver}/reports/detailxml.zip", binary=True)
            xml = zipfile.ZipFile(io.BytesIO(blob)).read("detail.xml").decode(
                "utf-8", "replace")
        except Exception:
            return None
        m = re.search(r"<ElectionDate>(.*?)</ElectionDate>", xml)
        return eid if m and m.group(1).strip() == date else None

    with cf.ThreadPoolExecutor(max_workers=workers) as pool:
        for hit in pool.map(probe, range(EID_BAND[0], EID_BAND[1] + 1)):
            if hit:
                _remember(date, slug, hit)
                return hit
    return None


def find_eid(slug, date, scan=False):
    """Returns (eid_or_None, error_or_None).

    The two None cases are NOT the same thing and must not be conflated: no
    matching entry means the county has not stood up its site, while an error
    means we could not tell. Reporting the second as the first is how Denton
    silently vanished from a manifest on 2026-10-28 while its site was fine.
    """
    known = KNOWN_EIDS.get(date, {}).get(slug) or _cache().get(date, {}).get(slug)
    if known:
        return known, None
    listing, listing_err = None, None
    try:
        listing = json.loads(get(f"{BASE}/{slug}/elections.json"))
    except Exception as exc:
        listing_err = type(exc).__name__
    for e in listing if isinstance(listing, list) else []:
        if (e.get("Date") or "").startswith(date):
            eid = e.get("EID")
            _remember(date, slug, eid)
            return eid, None
    if listing_err:
        if scan:
            hit = scan_band(slug, date)
            if hit:
                return hit, None
            return None, None            # scanned and genuinely absent
        return None, (f"elections.json unusable ({listing_err}); "
                      f"run with --scan to probe the id band")
    return None, None


def fetch(slug, date, outdir):
    eid, err = find_eid(slug, date)
    if err:
        return f"{slug:<12} !! {err}"
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
