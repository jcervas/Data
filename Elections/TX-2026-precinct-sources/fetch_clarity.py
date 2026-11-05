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
import time
import urllib.error
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


SCAN_LOG = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                        "scan_attempts.json")
# How long since a county's band was last probed before probing it again, and
# how many counties one process may probe at all. Both exist because Clarity
# pushes back: a 9-county sweep refused 112 of Comal's 400 ids, 369 of
# Montague's and all 400 of Clay's, and refused two cached-id downloads
# outright with HTTP 405. The poller fires every 15 minutes and now scans on
# every run, so without a cap each firing would re-probe ~2,400 ids.
#
# Together they rotate the work: a run spends its budget on whichever counties
# have gone longest unprobed, those get recorded, and the next run moves on to
# the others. Every county still gets scanned regularly; none gets hammered.
SCAN_RETRY_SECONDS = int(os.environ.get("TX_SCAN_RETRY", "900"))
SCAN_BUDGET = int(os.environ.get("TX_SCAN_BUDGET", "3"))
_SCAN_LOCK = threading.Lock()
_scans_spent = 0


def _scan_log():
    try:
        with open(SCAN_LOG) as f:
            return json.load(f)
    except Exception:
        return {}


def _scanned_recently(date, slug):
    when = _scan_log().get(date, {}).get(slug)
    return bool(when) and (time.time() - float(when)) < SCAN_RETRY_SECONDS


def _note_scan(date, slug):
    """Record that this county's band was probed just now, hit or miss.

    Refusals are logged too. A refused scan tells us nothing about the county,
    but it does tell us to leave Clarity alone for a while.
    """
    with _SCAN_LOCK:
        data = _scan_log()
        data.setdefault(date, {})[slug] = int(time.time())
        try:
            tmp = SCAN_LOG + ".tmp"
            with open(tmp, "w") as f:
                json.dump(data, f, indent=1, sort_keys=True)
            os.replace(tmp, SCAN_LOG)    # atomic: several counties scan at once
        except Exception:
            pass


def _claim_scan():
    """Take one of this process's scan slots, or return False."""
    global _scans_spent
    with _SCAN_LOCK:
        if _scans_spent >= SCAN_BUDGET:
            return False
        _scans_spent += 1
        return True


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
# 8 was fine for one county at a time. With the poller now scanning on every
# run, a 9-county sweep at 8 concurrent earned HTTP 405 from Clarity and the
# scan came back empty for three counties whose sites were up -- the throttle
# looked exactly like absence. 4 is slower and has not been refused.
_SCAN_GATE = threading.Semaphore(int(os.environ.get("TX_SCAN_GATE", "4")))
# Statuses that mean "we were refused", not "this id is not your election".
THROTTLE_CODES = (403, 405, 429, 503)


def scan_band(slug, date, workers=4):
    """Last-resort discovery: probe the id band for a site whose detail.xml
    says it is this election. Returns (eid_or_None, refusals).

    Needed because elections.json is an archive list that returns an empty body
    for many counties -- Bexar, Dallas, Tarrant, Fort Bend, Parker and Victoria
    were all found this way, not from their own listing.

    `refusals` counts replies that mean Clarity turned us away rather than that
    the id was not ours. A scan that ends with refusals found nothing *and*
    could not have: the caller must not read it as the county being unstaged.
    """
    import concurrent.futures as cf

    # A plain counter behind a lock. An itertools.count() was used here first
    # and was wrong twice over: reading it with next() increments it, so a
    # clean scan reported -1 refusals, and -1 is truthy -- every county that
    # genuinely had no site was reported as "Clarity is throttling". Exactly
    # the miss-vs-cannot-tell confusion this module exists to avoid.
    refusals = 0
    count_lock = threading.Lock()

    def probe(eid):
        with _SCAN_GATE:
            return _probe(eid)

    def _probe(eid):
        try:
            ver = get(f"{BASE}/{slug}/{eid}/current_ver.txt").strip()
        except urllib.error.HTTPError as exc:
            if exc.code in THROTTLE_CODES:
                nonlocal refusals
                with count_lock:
                    refusals += 1
            return None
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
                return hit, refusals
    return None, refusals


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
    # A listing that parses is still not a listing that is current. On
    # 2026-11-04 Bell's stopped at May 2026, Comal's at May 2025, Guadalupe's at
    # 2015, and Lubbock's and Jefferson's were an empty array -- all while the
    # November sites were the question being asked. So a usable listing with no
    # match is treated the same as a broken one: scan before believing it.
    if scan:
        if _scanned_recently(date, slug):
            return None, None            # probed minutes ago, nothing then
        if not _claim_scan():
            return None, (f"scan budget for this run is spent "
                          f"({SCAN_BUDGET} counties); the next run picks this up")
        _note_scan(date, slug)
        hit, refusals = scan_band(slug, date)
        if hit:
            return hit, None
        if refusals:
            return None, (f"band scan refused {refusals} time(s) "
                          f"(HTTP {'/'.join(map(str, THROTTLE_CODES))}); "
                          f"Clarity is throttling, not necessarily unstaged")
        return None, None                # scanned the band and genuinely absent
    if listing_err:
        return None, (f"elections.json unusable ({listing_err}); "
                      f"run with --scan to probe the id band")
    newest = max((e.get("Date") or "" for e in listing or []), default="")
    return None, (f"no {date} entry in elections.json"
                  + (f" (newest is {newest.split()[0]})" if newest else " (empty)")
                  + "; run with --scan to probe the id band")


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
