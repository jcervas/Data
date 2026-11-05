#!/usr/bin/env python3
"""Walk every county's known results page and pull its November 3, 2026 files.

`discover_county_sites.py` found where 180 counties keep their results. Only
25 of those were acted on, because only 25 named November in the link text the
crawl happened to capture. The rest point at a results *page*, or at a PDF
from an earlier election sitting on the same page as the new one -- so the page
has to be opened and read.

For each county: if its recorded URL is already a November 2026 PDF, take it;
otherwise open the page and take every link that names this election, by date
("11-03-2026", "November 3, 2026", "110326") or by a 2026 results word
("unofficial", "canvass", "precinct") alongside a November hint.

Downloads land in ~/tx-2026-enr/files as <county>_nov2026_<name>, which is
where `county_totals.py` and `parse_precinct_pdf.py` look for them.

    ./fetch_county_results.py [--only Harrison,Polk] [--workers 6] [--dry-run]
"""
import argparse, csv, html, os, re, sys, urllib.error, urllib.parse
import urllib.request, concurrent.futures as cf

HERE = os.path.dirname(os.path.abspath(__file__))
FILES = os.path.expanduser("~/tx-2026-enr/files")
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")

NOV = re.compile(r"nov(ember)?\.?\s*0?3,?\s*,?\s*2026|11[-/_. ]0?3[-/_. ]"
                 r"(20)?26|2026[-/_. ]11[-/_. ]0?3|110326|20261103", re.I)
RESULTY = re.compile(r"unofficial|official|canvass|results|precinct|cumulative", re.I)
# Don't take sample ballots, notices, or the reconciliation sheet as results.
NOT_RESULTS = re.compile(r"sample.?ballot|notice|polling|poling|location|"
                         r"reconcil|write-?in.?candidate|order|audit", re.I)
DOC = re.compile(r"\.(pdf|xlsx?|csv)($|\?)", re.I)
# Some counties publish results as a web page rather than a file. Hardin's
# election app serves Governor at "81.7% (16,954 votes)" with a running
# "Total votes: 20,755 - 19 of 19 precincts reporting", which is as good a
# source as any PDF and carries its own total. Those pages are saved as .html
# and read by the same candidate-name parser.
HTML_OK = re.compile(r"total votes|precincts reporting|unofficial results", re.I)


def encode(url):
    p = urllib.parse.urlsplit(url)
    return urllib.parse.urlunsplit(p._replace(
        path=urllib.parse.quote(p.path, safe="/%:@&=+$,;~!*'()"),
        query=urllib.parse.quote(p.query, safe="/%:@&=+$,;?~!*'()")))


def get(url, timeout=25, limit=1_500_000):
    req = urllib.request.Request(encode(url), headers={
        "User-Agent": UA, "Accept": "*/*", "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "identity", "Connection": "close"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.geturl(), r.headers.get("Content-Type", ""), r.read(limit)


def links(base, body):
    out = []
    for m in re.finditer(r'<a\b[^>]*href="([^"]+)"[^>]*>(.*?)</a>', body, re.S | re.I):
        href = html.unescape(m.group(1).strip())
        text = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", m.group(2)))).strip()
        if href.startswith(("mailto:", "tel:", "javascript:", "#")):
            continue
        out.append((urllib.parse.urljoin(base, href), text))
    return out


def november_docs(url, body_text):
    """Links on this page that name the November 3, 2026 election."""
    hits = []
    for u, t in links(url, body_text):
        blob = f"{t} {urllib.parse.unquote(u)}"
        if NOT_RESULTS.search(blob):
            continue
        if not NOV.search(blob):
            continue
        if not (DOC.search(u) or RESULTY.search(blob)):
            continue
        hits.append((u, t))
    # Prefer a precinct report, then anything else.
    hits.sort(key=lambda x: 0 if re.search(r"precinct", x[0] + x[1], re.I) else 1)
    return hits[:4]


def safe_name(county, url, text):
    base = os.path.basename(urllib.parse.urlsplit(url).path)
    base = urllib.parse.unquote(base) or re.sub(r"\W+", "_", text)[:40] or "results"
    base = re.sub(r"[^A-Za-z0-9._-]+", "_", base)[:90]
    if not re.search(r"\.(pdf|xlsx?|csv)$", base, re.I):
        base += ".pdf"
    return f"{county}_nov2026_{base}"


def work(row, dry):
    county = row["county"]
    slug = county.lower().replace(" ", "_").replace(".", "")
    url = row["results_url"]
    got, note = [], ""
    try:
        final, ctype, body = get(url)
    except urllib.error.HTTPError as exc:
        return county, [], f"HTTP {exc.code}"
    except Exception as exc:
        return county, [], type(exc).__name__
    if body[:4] == b"%PDF":
        cands = [(final, row.get("results_label") or "")]
        if not NOV.search(urllib.parse.unquote(final) + " " + (row.get("results_label") or "")):
            return county, [], "PDF but not labelled November 2026"
    else:
        try:
            cands = november_docs(final, body.decode("utf-8", "replace"))
        except Exception as exc:
            return county, [], f"parse: {type(exc).__name__}"
        if not cands:
            # The page may be an index whose November entry leads to the
            # results rather than holding them: Hardin lists "General
            # Election November 3, 2026" pointing at /results/election/13/.
            for u, t in links(final, body.decode("utf-8", "replace")):
                if NOV.search(f"{t} {urllib.parse.unquote(u)}") and \
                        not NOT_RESULTS.search(t):
                    try:
                        f2, _, b2 = get(u, timeout=40, limit=4_000_000)
                    except Exception:
                        continue
                    deeper = november_docs(f2, b2.decode("utf-8", "replace"))
                    if deeper:
                        cands = deeper
                        break
                    if HTML_OK.search(b2.decode("utf-8", "replace")):
                        cands = [(f2, t)]
                        break
        if not cands:
            return county, [], "no November 2026 link on the page"
    for u, t in cands:
        name = safe_name(slug, u, t)
        dest = os.path.join(FILES, name)
        if os.path.exists(dest):
            got.append(name + " (already held)")
            continue
        if dry:
            got.append(name + " (dry run)")
            continue
        try:
            _, _, blob = get(u, timeout=60, limit=250_000_000)
        except Exception as exc:
            note = f"{type(exc).__name__} on {os.path.basename(u)[:40]}"
            continue
        if blob[:4] != b"%PDF" and not re.search(r"\.(xlsx?|csv)$", name, re.I):
            text = blob.decode("utf-8", "replace")
            if not HTML_OK.search(text):
                note = "not a document"
                continue
            name = re.sub(r"\.pdf$", ".html", name)
            dest = os.path.join(FILES, name)
        with open(dest, "wb") as fh:
            fh.write(blob)
        got.append(f"{name} ({len(blob):,}b)")
    return county, got, note


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--sites", default=os.path.join(HERE, "county_sites.csv"))
    ap.add_argument("--only")
    ap.add_argument("--workers", type=int, default=6)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    with open(args.sites, newline="") as fh:
        rows = [r for r in csv.DictReader(fh) if r["results_url"]]
    if args.only:
        want = {c.strip().lower() for c in args.only.split(",")}
        rows = [r for r in rows if r["county"].lower() in want]
    print(f"{len(rows)} counties with a results page to check", flush=True)

    found = 0
    with cf.ThreadPoolExecutor(max_workers=args.workers) as pool:
        for county, got, note in pool.map(lambda r: work(r, args.dry_run), rows):
            if got:
                found += 1
                print(f"OK {county:16s} " + "; ".join(got), flush=True)
            else:
                print(f"-- {county:16s} {note}", flush=True)
    print(f"\n{found} of {len(rows)} counties yielded a November 2026 document")


if __name__ == "__main__":
    main()
