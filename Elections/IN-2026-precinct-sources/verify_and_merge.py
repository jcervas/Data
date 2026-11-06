#!/usr/bin/env python3
"""Check what the crawl actually found, then fold the survivors into the
inventory at an honest verification level.

The crawl is deliberately credulous -- it follows the first results-ish link it
sees -- so it produces three kinds of junk that must not reach the inventory:

* **Off-domain.** `plausible()` guarded the county *homepage* but not the
  results link, so Pulaski came back pointing at elections.virginia.gov and
  Martin at history.house.gov. Any results host that is not the county's own or
  an in.gov host is dropped.
* **Right site, wrong document.** Warren returned a commissioner meeting
  schedule, Shelby a tax-sale list, Carroll a redistricting proposal. These are
  caught by requiring an election word in the URL or the fetched text.
* **Right subject, wrong thing.** Monroe's hit is its precinct *boundary* page,
  not results.

What survives is graded:
  verified          fetched a 2026 general precinct-level artifact
  verified-pattern  fetched a precinct artifact for an earlier 2026/2024
                    election at a live path, so the general will land the same way
  partial           a real results page, report type not resolved
  not verified      everything else

Rows seeded by hand in build_tracker.py are left alone -- the crawl does not get
to overwrite something a person checked.

    ./verify_and_merge.py [--sites county_sites.csv] [--dry-run]
"""
import argparse, csv, os, re, sys, urllib.error, urllib.parse, urllib.request
import concurrent.futures as cf

HERE = os.path.dirname(os.path.abspath(__file__))
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")
TIMEOUT = 15

ELECTION_WORD = re.compile(r"election|canvass|precinct|ballot|vote|returns", re.I)
PRECINCT = re.compile(r"precinct", re.I)
# Adjacency fails on real filenames: Fulton's is
# "2026-Unofficial-General-Election-Precinct-Results". Test the tokens
# separately and require both.
YEAR_2026 = re.compile(r"(?<!\d)2026(?!\d)|G26|GE26", re.I)
GENERAL = re.compile(r"general|\bG26\b|nov(ember)?\.?\s*3,?\s*2026"
                     r"|11[-/.]0?3[-/.]2026", re.I)
PRIMARY_OR_PRIOR = re.compile(r"primary|(?<!\d)2024(?!\d)|(?<!\d)2022(?!\d)", re.I)
# A boundary, district or precinct *map* page is about precincts without being
# results.
BOUNDARY_ONLY = re.compile(r"boundar|district[ _-]?map|redistrict"
                           r"|precincts?[ _-]?map|voting[ _-]?precincts", re.I)


def gen_2026(s):
    return bool(YEAR_2026.search(s) and GENERAL.search(s))


def plausible_host(url, county):
    host = (urllib.parse.urlsplit(url).hostname or "").lower()
    if not host:
        return False
    if host.endswith((".in.us", ".in.gov", ".state.in.us")) or host == "in.gov":
        return True
    flat = host.replace("-", "").replace(".", "")
    slug = county.lower().replace(".", "").replace(" ", "")
    if slug in flat:
        return True
    if slug.startswith("st") and ("st" + slug[2:]) in flat:
        return True
    # A .gov that names neither the county nor Indiana is somebody else's.
    return False


def head_or_get(url):
    """-> (status, content_type, text). Text only for html/plain."""
    req = urllib.request.Request(url, headers={
        "User-Agent": UA, "Accept": "*/*", "Accept-Encoding": "identity",
        "Connection": "close"})
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
            ctype = (r.headers.get("Content-Type") or "").lower()
            if "html" in ctype or "text/plain" in ctype:
                return r.status, ctype, r.read(300_000).decode("utf-8", "replace")
            return r.status, ctype, ""
    except urllib.error.HTTPError as e:
        return e.code, "", ""
    except Exception as e:
        return 0, type(e).__name__, ""


def grade(row):
    county, url = row["county"], (row.get("results_url") or "").strip()
    out = dict(row, verification="not verified", http="", ctype="",
               reject="", format_notes="")
    if not url:
        out["reject"] = row.get("note") or "no results link found"
        return out
    if not plausible_host(url, county):
        host = urllib.parse.urlsplit(url).hostname
        out["reject"] = f"off-domain hit ({host}); discarded"
        out["results_url"] = ""
        return out

    status, ctype, text = head_or_get(url)
    out["http"], out["ctype"] = status, ctype.split(";")[0]
    if status != 200:
        out["reject"] = f"HTTP {status}"
        return out

    haystack = f"{url} {row.get('results_label','')} {text[:300_000]}"
    # A boundary page or a precinct map names precincts and often sits under an
    # elections menu, so an election word in the link text does not redeem it.
    # Only the word "result" does.
    if BOUNDARY_ONLY.search(url) and not re.search(r"result", url, re.I):
        out["reject"] = "precinct boundary/map page, not results"
        out["results_url"] = ""
        return out
    if not ELECTION_WORD.search(f"{url} {row.get('results_label','')}") \
            and not ELECTION_WORD.search(text[:50_000]):
        out["reject"] = "no election content; wrong document"
        out["results_url"] = ""
        return out

    is_pdf = "pdf" in out["ctype"]
    label = f"{url} {row.get('results_label','')}"
    if PRECINCT.search(label) and gen_2026(label):
        out["verification"] = "verified"
        out["format_notes"] = (f"2026 general precinct file fetched directly "
                               f"({out['ctype'] or 'unknown type'})")
    elif PRECINCT.search(label) and PRIMARY_OR_PRIOR.search(label):
        out["verification"] = "verified-pattern"
        out["format_notes"] = ("precinct file for the 2026 primary or an earlier "
                               "general fetched at this path; the 2026 general "
                               "is expected alongside it")
    elif PRECINCT.search(label):
        out["verification"] = "verified-pattern"
        out["format_notes"] = ("precinct-results path fetched; election not named "
                               "in the url")
    elif PRECINCT.search(haystack) and gen_2026(haystack):
        out["verification"] = "partial"
        out["format_notes"] = "page names a 2026 general precinct report"
    elif is_pdf:
        out["verification"] = "partial"
        out["format_notes"] = "PDF reached; report type not confirmed"
    else:
        out["verification"] = "partial"
        out["format_notes"] = "results page reached; report type not confirmed"
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--sites", default=os.path.join(HERE, "county_sites.csv"))
    ap.add_argument("--inventory",
                    default=os.path.join(HERE, "in_2026_precinct_sources.csv"))
    ap.add_argument("--report", default=os.path.join(HERE, "site_verification.csv"))
    ap.add_argument("--workers", type=int, default=8)
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()

    with open(a.sites, newline="") as f:
        sites = list(csv.DictReader(f))
    graded = []
    with cf.ThreadPoolExecutor(max_workers=a.workers) as pool:
        for g in pool.map(grade, sites):
            graded.append(g)
            print(f"{g['verification']:17s} {g['county']:14s} "
                  f"{g['reject'] or g['results_url']}", flush=True)
    graded.sort(key=lambda r: r["county"])

    with open(a.report, "w", newline="") as f:
        cols = ["county", "site", "elections_url", "results_url", "results_label",
                "http", "ctype", "verification", "format_notes", "reject", "note"]
        w = csv.DictWriter(f, fieldnames=cols, extrasaction="ignore")
        w.writeheader()
        w.writerows(graded)
    print(f"\nwrote {a.report}")
    tally = {}
    for g in graded:
        tally[g["verification"]] = tally.get(g["verification"], 0) + 1
    print("  " + ", ".join(f"{k}: {v}" for k, v in sorted(tally.items())))

    if a.dry_run:
        return
    by_county = {g["county"]: g for g in graded}
    with open(a.inventory, newline="") as f:
        inv = list(csv.DictReader(f))
        cols = list(inv[0])
    merged = 0
    for r in inv:
        g = by_county.get(r["county"])
        if not g or not g.get("results_url"):
            continue
        # Never downgrade or overwrite a hand-checked row.
        if r.get("verification") in ("verified", "verified-pattern", "partial") \
                and r.get("results_url"):
            continue
        r["results_url"] = g["results_url"]
        r["platform"] = r["platform"] or f"county-hosted ({urllib.parse.urlsplit(g['site'] or g['results_url']).hostname})"
        r["format_notes"] = g["format_notes"]
        r["verification"] = g["verification"]
        if g["verification"] in ("verified", "verified-pattern"):
            r["precinct_data_url"] = g["results_url"]
        merged += 1
    with open(a.inventory, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        w.writerows(inv)
    print(f"merged {merged} rows into {os.path.basename(a.inventory)}")
    have = sum(1 for r in inv if (r.get("results_url") or "").strip())
    pre = sum(int(r["precincts"] or 0) for r in inv if (r.get("results_url") or "").strip())
    print(f"  {have}/92 counties with a results source, covering {pre}/5121 precincts")


if __name__ == "__main__":
    main()
