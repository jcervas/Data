#!/usr/bin/env python3
"""Second pass over the counties `discover_county_sites.py` left without a
results page.

The first crawler walks one path -- homepage, elections page, first results
link -- and stops at the first match. That is the right shape for finding the
obvious cases fast, and it found 44 counties. What it cannot do is reach a file
that sits three clicks in, behind a document center or an "Election Results"
landing page with a year menu, which is where most of the remaining 48 counties
keep theirs.

So this one breadth-first searches each county's own site instead of following
a single path, scores every link it sees, and writes the ranked candidates
rather than picking one. Judgment about which candidate is real belongs in
`verify_and_merge.py`, which fetches and grades them; this script's only job is
to stop missing them.

Indiana specifics that shape the crawl:

* Roughly a quarter of counties have no site of their own and live on
  `in.gov/counties/<slug>/`, so that host is always seeded and always allowed
  as in-scope, but only under the county's own path.
* eGov and CivicPlus document centers are listing pages, not documents. They
  score low as candidates but high as pages worth expanding.
* Three hosts (Allen, Delaware, Elkhart) 403 every scripted client no matter
  the headers. They are reported as such rather than retried.

    ./sweep_unresolved.py [--out sweep_candidates.csv] [--only Clark,Monroe]
                          [--workers 8] [--pages 60]
"""
import argparse, csv, html, os, re, socket, sys, urllib.error, urllib.parse
import urllib.request, concurrent.futures as cf

HERE = os.path.dirname(os.path.abspath(__file__))
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")
TIMEOUT = 12

YEAR_2026 = re.compile(r"(?<!\d)2026(?!\d)|G26|GE26", re.I)
GENERAL = re.compile(r"general|\bG26\b|nov(ember)?\.?\s*3,?\s*2026"
                     r"|11[-/.]0?3[-/.]2026", re.I)
RESULTS = re.compile(r"result|canvass|returns|tabulat|vote\s*total|summary", re.I)
PRECINCT = re.compile(r"precinct|by\s*pct|\bpct\b", re.I)
PRIOR = re.compile(r"(?<!\d)20(0\d|1\d|2[0-5])(?!\d)|primary", re.I)
# A boundary page names precincts without reporting a vote. Scored out here so
# it never outranks a real results file; rejected outright in verify_and_merge.
BOUNDARY = re.compile(r"boundar|district[ _-]?map|redistrict|precincts?[ _-]?map"
                      r"|voting[ _-]?precincts", re.I)
DOC = re.compile(r"\.(pdf|xlsx?|csv|txt|docx?)(\?|$)", re.I)
SKIP = re.compile(r"^(mailto:|tel:|javascript:|#)"
                  r"|\.(jpg|jpeg|png|gif|svg|css|js|zip|mp4|ico)(\?|$)", re.I)
# Pages worth opening even though they are not themselves results.
EXPAND = re.compile(r"\belections?\b|election board|clerk|voter|results|canvass"
                    r"|document|archive|news|notice|department|government"
                    r"|offices?\b|20\d\d", re.I)
NOISE = re.compile(r"/search|calendar|employment|job|agenda|minutes|tax[- ]sale"
                   r"|property|assessor|sheriff|jail|court[- ]record|gis/|login"
                   r"|facebook|twitter|youtube|instagram", re.I)


def slugs(name):
    n = name.lower().replace(".", "").strip()
    out = [n.replace(" ", ""), n.replace(" ", "-")]
    if n.startswith("st "):
        out += ["st" + n[3:].replace(" ", ""), "saint" + n[3:].replace(" ", "")]
    return list(dict.fromkeys(out))


def encode(url):
    p = urllib.parse.urlsplit(url)
    return urllib.parse.urlunsplit(p._replace(
        path=urllib.parse.quote(p.path, safe="/%:@&=+$,;~!*'()"),
        query=urllib.parse.quote(p.query, safe="/%:@&=+$,;?~!*'()")))


def get(url, timeout=TIMEOUT):
    """Returns (final_url, html). Non-html bodies come back as '' -- a PDF is a
    candidate to grade later, not a page to crawl."""
    req = urllib.request.Request(encode(url), headers={
        "User-Agent": UA,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "identity",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document", "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none", "Sec-Fetch-User": "?1",
        "Connection": "close"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        ctype = r.headers.get("Content-Type", "")
        if "html" not in ctype and "text/" not in ctype:
            return r.geturl(), ""
        return r.geturl(), r.read(600_000).decode("utf-8", "replace")


def links(base, body):
    out = []
    for m in re.finditer(r'<a\b[^>]*?href=["\']([^"\']+)["\'][^>]*>(.*?)</a>',
                         body, re.S | re.I):
        href = html.unescape(m.group(1).strip())
        if SKIP.search(href):
            continue
        text = html.unescape(re.sub(r"<[^>]+>", " ", m.group(2)))
        out.append((urllib.parse.urljoin(base, href).split("#")[0],
                    re.sub(r"\s+", " ", text).strip()))
    return out


def in_scope(url, host, name):
    """The county's own host, or its own corner of in.gov/counties/."""
    p = urllib.parse.urlsplit(url)
    if p.scheme not in ("http", "https"):
        return False
    h = (p.hostname or "").lower()
    if h == host:
        return True
    if h.endswith("in.gov") and "/counties/" in p.path:
        return any(f"/counties/{s}/" in p.path + "/" for s in slugs(name))
    return False


def score(url, label):
    """How much a link looks like a 2026 general precinct results file.

    The tokens are tested separately rather than for adjacency: a real filename
    is `2026-Unofficial-General-Election-Precinct-Results`, which no adjacency
    pattern survives.
    """
    s = f"{url} {label}"
    pts = 0
    if RESULTS.search(s):
        pts += 3
    if YEAR_2026.search(s):
        pts += 3
    if GENERAL.search(s):
        pts += 2
    if PRECINCT.search(s):
        pts += 3
    if DOC.search(url):
        pts += 1
    if BOUNDARY.search(s) and not RESULTS.search(s):
        pts -= 6
    if PRIOR.search(s) and not YEAR_2026.search(s):
        pts -= 2
    return pts


def worth_opening(url, label, depth):
    if depth >= 3:
        return False
    if DOC.search(url):
        return False
    s = f"{url} {label}"
    if NOISE.search(s) and not RESULTS.search(s):
        return False
    return bool(EXPAND.search(s))


def seeds(name, row):
    out = []
    for key in ("elections_url", "site"):
        v = (row.get(key) or "").strip()
        if v:
            out.append(v)
    for s in slugs(name):
        out += [f"https://www.in.gov/counties/{s}/election-info/",
                f"https://www.in.gov/counties/{s}/"]
    seen, uniq = set(), []
    for u in out:
        if u not in seen:
            seen.add(u)
            uniq.append(u)
    return uniq


def sweep(args_pair):
    name, row, max_pages = args_pair
    found, seen, blocked = {}, set(), []
    queue = [(u, 0) for u in seeds(name, row)]
    host = ""
    pages = 0
    while queue and pages < max_pages:
        url, depth = queue.pop(0)
        if url in seen:
            continue
        seen.add(url)
        try:
            socket.getaddrinfo(urllib.parse.urlsplit(url).hostname or "", None)
        except socket.gaierror:
            continue
        try:
            final, body = get(url)
        except urllib.error.HTTPError as exc:
            if exc.code in (401, 403):
                blocked.append(f"HTTP {exc.code} {urllib.parse.urlsplit(url).hostname}")
            continue
        except Exception:
            continue
        pages += 1
        if not body:
            continue
        if not host:
            host = (urllib.parse.urlsplit(final).hostname or "").lower()
        for u, label in links(final, body):
            if not in_scope(u, host, name):
                continue
            pts = score(u, label)
            if pts >= 6:
                prev = found.get(u)
                if not prev or pts > prev[0]:
                    found[u] = (pts, label[:110], depth)
            if u not in seen and worth_opening(u, label, depth):
                queue.append((u, depth + 1))
    best = sorted(found.items(), key=lambda kv: -kv[1][0])[:6]
    return {"county": name, "pages_crawled": pages,
            "blocked": "; ".join(sorted(set(blocked))[:2]),
            "candidates": [{"url": u, "score": v[0], "label": v[1], "depth": v[2]}
                           for u, v in best]}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=os.path.join(HERE, "sweep_candidates.csv"))
    ap.add_argument("--inventory",
                    default=os.path.join(HERE, "in_2026_precinct_sources.csv"))
    ap.add_argument("--sites", default=os.path.join(HERE, "county_sites.csv"))
    ap.add_argument("--only")
    ap.add_argument("--workers", type=int, default=8)
    ap.add_argument("--pages", type=int, default=60)
    args = ap.parse_args()

    with open(args.inventory, newline="") as fh:
        inv = list(csv.DictReader(fh))
    with open(args.sites, newline="") as fh:
        sites = {r["county"]: r for r in csv.DictReader(fh)}

    if args.only:
        want = {c.strip().lower() for c in args.only.split(",")}
        todo = [r["county"] for r in inv if r["county"].lower() in want]
    else:
        todo = [r["county"] for r in inv if not (r.get("results_url") or "").strip()]
    print(f"{len(todo)} counties to sweep, up to {args.pages} pages each",
          flush=True)

    jobs = [(c, sites.get(c, {}), args.pages) for c in todo]
    out = []
    with cf.ThreadPoolExecutor(max_workers=args.workers) as pool:
        for res in pool.map(sweep, jobs):
            out.append(res)
            top = res["candidates"][0] if res["candidates"] else None
            mark = "OK " if top and top["score"] >= 9 else (
                "~  " if top else "-- ")
            print(f"{mark}{res['county']:14s} pages={res['pages_crawled']:<3} "
                  f"{(str(top['score']) + ' ' + top['url']) if top else (res['blocked'] or 'nothing')}",
                  flush=True)

    if not out:
        sys.exit("no counties swept; refusing to overwrite the candidate file")
    rows = []
    for res in sorted(out, key=lambda r: r["county"]):
        if not res["candidates"]:
            rows.append({"county": res["county"], "rank": 0, "score": "",
                         "url": "", "label": "", "depth": "",
                         "pages_crawled": res["pages_crawled"],
                         "blocked": res["blocked"]})
            continue
        for i, c in enumerate(res["candidates"], 1):
            rows.append({"county": res["county"], "rank": i, "score": c["score"],
                         "url": c["url"], "label": c["label"], "depth": c["depth"],
                         "pages_crawled": res["pages_crawled"],
                         "blocked": res["blocked"]})
    with open(args.out, "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=["county", "rank", "score", "url",
                                           "label", "depth", "pages_crawled",
                                           "blocked"])
        w.writeheader()
        w.writerows(rows)
    hit = sum(1 for r in out if r["candidates"])
    strong = sum(1 for r in out if r["candidates"]
                 and r["candidates"][0]["score"] >= 9)
    print(f"\n{hit}/{len(out)} counties produced a candidate "
          f"({strong} scoring 9+) -> {args.out}")


if __name__ == "__main__":
    main()
