#!/usr/bin/env python3
"""Fetch North Carolina's statewide precinct results.

NCSBE publishes two things, and which one you want depends on what you are
measuring:

  --kind pct     the election-night file, one zip for the whole state. Fast and
                 live, but in 37 of 100 counties the early, absentee and
                 provisional votes arrive as county-level pseudo-precincts
                 (Real Precinct = N), which is 31% of the statewide vote with no
                 precinct attached.
  --kind sort    the precinct-sorted data, published after canvass, in which
                 every ballot sits in the voter's own precinct. NCSBE publishes
                 it both per county and as one STATEWIDE file (412 MB in 2024),
                 and this fetches STATEWIDE unless you name counties. It is the
                 file RDH builds from: 2,655 of the 2,657 precincts it shares
                 with our crosswalk are vote-identical.

    python3 fetch_nc.py --date 2026-11-03 --kind pct  --out nc_out
    python3 fetch_nc.py --date 2026-11-03 --kind sort --out nc_out \
            --counties WAKE GUILFORD CABARRUS MECKLENBURG

Writes into --out and prints one line per file. Safe to re-run; existing files
are skipped unless --force.
"""
import argparse
import io
import re
import pathlib
import sys
import urllib.error
import urllib.parse
import urllib.request
import zipfile

BASE = "https://s3.amazonaws.com/dl.ncsbe.gov/ENRS"
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "Chrome/129.0 Safari/537.36")


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=120) as r:
        return r.read()


def list_counties(date_us):
    """County names with a precinct-sort file, from the bucket listing."""
    prefix = f"ENRS/{date_us}/results_precinct_sort/"
    out, token = [], None
    while True:
        url = (f"https://s3.amazonaws.com/dl.ncsbe.gov/?list-type=2"
               f"&prefix={prefix}&max-keys=1000")
        if token:
            url += f"&continuation-token={urllib.parse.quote(token)}"
        body = get(url).decode("utf-8", "replace")
        out += [k.rsplit("/", 1)[1].replace("_PRECINCT_SORT.txt", "")
                for k in re.findall(r"<Key>(.*?)</Key>", body)
                if k.endswith("_PRECINCT_SORT.txt")]
        m = re.search(r"<NextContinuationToken>(.*?)</", body)
        if not m:
            return out
        token = m.group(1)


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--date", required=True, metavar="YYYY-MM-DD")
    ap.add_argument("--kind", choices=("pct", "sort"), default="pct")
    ap.add_argument("--out", default="nc_out")
    ap.add_argument("--counties", nargs="*",
                    help="for --kind sort: county names (default: all)")
    ap.add_argument("--force", action="store_true")
    a = ap.parse_args()

    y, m, d = a.date.split("-")
    date_us = f"{y}_{m}_{d}"
    out = pathlib.Path(a.out)
    out.mkdir(parents=True, exist_ok=True)

    if a.kind == "pct":
        url = f"{BASE}/{date_us}/results_pct_{y}{m}{d}.zip"
        try:
            blob = get(url)
        except urllib.error.HTTPError as e:
            sys.exit(f"{url}\n  HTTP {e.code} -- not published yet?")
        zf = zipfile.ZipFile(io.BytesIO(blob))
        for name in zf.namelist():
            p = out / name
            p.write_bytes(zf.read(name))
            print(f"  {name:<36}{p.stat().st_size:>12,} bytes")
        return 0

    if a.counties:
        want = [c.upper() for c in a.counties]
    else:
        listed = list_counties(date_us)
        if not listed:
            sys.exit(f"no precinct-sort files listed for {date_us}; "
                     f"they appear after canvass, not on election night")
        # One 412 MB file beats a hundred small ones, when it is there.
        want = ["STATEWIDE"] if "STATEWIDE" in listed else listed
    print(f"  {len(want)} county file(s)")
    for c in want:
        p = out / f"{c}.txt"
        if p.exists() and not a.force:
            print(f"  {c:<16} cached")
            continue
        url = f"{BASE}/{date_us}/results_precinct_sort/{c}_PRECINCT_SORT.txt"
        try:
            p.write_bytes(get(url))
        except urllib.error.HTTPError as e:
            print(f"  {c:<16} HTTP {e.code}")
            continue
        print(f"  {c:<16}{p.stat().st_size:>12,} bytes")
    return 0


if __name__ == "__main__":
    sys.exit(main())
