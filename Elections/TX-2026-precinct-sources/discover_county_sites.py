#!/usr/bin/env python3
"""Find each Texas county's official site, its elections page and its results
page, for the counties `tx_2026_precinct_sources.csv` has no `results_url` for.

Why this exists: 42 of 254 counties had a located results page, and the other
212 were never looked up. The counties that matter most for precinct coverage
are the long tail -- 213 counties averaging 21 precincts each, 26.6% of every
precinct in Texas -- and none of them can be scraped until someone knows where
their results live. Their canvasses are due between November 6 and December 3,
so the pipeline wants to be ready before the files appear, not after.

Three stages per county, each stopping as soon as it succeeds:

1. **Host.** Texas counties cluster on a few naming conventions
   (`co.<name>.tx.us`, `<name>countytx.gov`, `<name>county.org`, ...). Try them
   in order of how common they are, HTTPS first, then HTTP for the `.tx.us`
   ones, many of which still have no certificate.
2. **Elections page.** Follow the first link on the homepage whose text or href
   looks like an elections department.
3. **Results page.** From there, the first link that looks like election
   results, preferring one that mentions a precinct report.

Writes one row per county, including the failures, because "we looked and found
nothing" is a result worth keeping.

    ./discover_county_sites.py [--out county_sites.csv] [--only Harrison,Polk]
                              [--workers 6] [--all]
"""
import argparse, csv, html, os, re, socket, sys, urllib.error, urllib.parse
import urllib.request, concurrent.futures as cf

HERE = os.path.dirname(os.path.abspath(__file__))
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")
TIMEOUT = 9

# Ranked, because the first election-ish link on a county homepage is usually
# the wrong one. Coryell lists "County Clerk" above "Elections", and the clerk's
# site carries no results at all.
ELECTION_STRONG = re.compile(r"\belections?\b", re.I)
ELECTION_WEAK = re.compile(r"voter|county clerk|elections? administration", re.I)
RESULTS_LINK = re.compile(r"election results|results|canvass", re.I)
PRECINCT_HINT = re.compile(r"precinct", re.I)
# A site's own search page matches "results" and means nothing.
NOT_RESULTS = re.compile(r"/search|search\.results|\bsearch\b", re.I)
# Several counties just link to the state's results site. That is worth
# recording as a fact about the county, not as the county's results page.
STATE_SITE = re.compile(r"sos\.state\.tx\.us|votetexas\.gov", re.I)
SKIP_LINK = re.compile(r"^(mailto:|tel:|javascript:|#)|\.(jpg|png|gif|css|js)$", re.I)


def hosts_for(name):
    """Candidate hostnames, most likely first."""
    n = name.lower().replace(".", "").strip()
    compact = n.replace(" ", "")
    hyphen = n.replace(" ", "-")
    seen, out = set(), []
    for scheme, host in (
            ("https", f"www.co.{compact}.tx.us"),
            ("https", f"www.{compact}countytx.gov"),
            ("https", f"www.{compact}county.org"),
            ("https", f"co.{compact}.tx.us"),
            ("https", f"www.co.{hyphen}.tx.us"),
            ("https", f"www.{compact}cotx.gov"),
            ("https", f"{compact}county.org"),
            ("https", f"www.{compact}countytexas.gov"),
            ("https", f"www.{compact}county.texas.gov"),
            ("https", f"{compact}county.texas.gov"),
            ("https", f"www.{hyphen}county.org"),
            ("https", f"www.{compact}tx.gov"),
            ("http", f"www.co.{compact}.tx.us"),
            ("http", f"co.{compact}.tx.us"),
            ("http", f"www.co.{hyphen}.tx.us")):
        url = f"{scheme}://{host}/"
        if url not in seen:
            seen.add(url)
            out.append(url)
    return out


def plausible(url, name):
    """Is this still a county's own site?

    `co.harrison.tx.us` has lapsed and now 302s to a campaign-tracker domain.
    Following a county hostname wherever it points means scraping, and
    recording, whoever bought the expired name. So the final host has to still
    look like the county's: a .tx.us/.tx.gov/.gov host, or one containing the
    county name.
    """
    host = (urllib.parse.urlsplit(url).hostname or "").lower()
    if not host:
        return False
    if host.endswith((".tx.us", ".tx.gov", ".gov", ".state.tx.us")):
        return True
    compact = name.lower().replace(".", "").replace(" ", "")
    return compact in host.replace("-", "")


def encode(url):
    """Percent-encode the path and query. Four counties failed the first pass
    with InvalidURL purely because their links contain spaces
    ("page/Elections 2026", "upload/page/9613/Bond Election.pdf")."""
    parts = urllib.parse.urlsplit(url)
    return urllib.parse.urlunsplit(parts._replace(
        path=urllib.parse.quote(parts.path, safe="/%:@&=+$,;~!*'()"),
        query=urllib.parse.quote(parts.query, safe="/%:@&=+$,;?~!*'()")))


def get(url, timeout=TIMEOUT):
    url = encode(url)
    # A fuller set of browser headers: nine counties answered the first pass
    # with 403 to a bare User-Agent alone.
    req = urllib.request.Request(url, headers={
        "User-Agent": UA,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "identity",
        "Connection": "close"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        ctype = r.headers.get("Content-Type", "")
        if "html" not in ctype and "text" not in ctype:
            return r.geturl(), ""
        return r.geturl(), r.read(400_000).decode("utf-8", "replace")


def try_hosts(name):
    """-> (resolved_url, note). Skips a host whose DNS does not exist."""
    tried = 0
    for url in hosts_for(name):
        host = urllib.parse.urlsplit(url).hostname
        try:
            socket.getaddrinfo(host, None)
        except socket.gaierror:
            continue                      # no such name; costs no HTTP request
        tried += 1
        try:
            final, body = get(url)
            if not plausible(final, name):
                return "", "", (f"{host} redirects off-domain to "
                                f"{urllib.parse.urlsplit(final).hostname} "
                                f"-- lapsed name, not followed")
            if body:
                return final, body, ""
            return final, "", "resolved but served no html"
        except urllib.error.HTTPError as exc:
            if exc.code in (401, 403):
                return url, "", f"HTTP {exc.code} (blocks scripted clients)"
        except Exception:
            continue
    return "", "", ("no candidate hostname resolved" if not tried
                    else "hosts resolved but none answered")


def links(base, body):
    out = []
    for m in re.finditer(r'<a\b[^>]*href="([^"]+)"[^>]*>(.*?)</a>', body, re.S | re.I):
        # Unescape the href too: hrefs carry &amp; in query strings, and a URL
        # kept that way is not the URL the browser would fetch.
        href = html.unescape(m.group(1).strip())
        text = html.unescape(re.sub(r"<[^>]+>", " ", m.group(2))).strip()
        if SKIP_LINK.search(href):
            continue
        out.append((urllib.parse.urljoin(base, href), re.sub(r"\s+", " ", text)))
    return out


def pick(cands, pattern, prefer=None):
    hits = [(u, t) for u, t in cands if pattern.search(t) or pattern.search(u)]
    if prefer:
        better = [h for h in hits if prefer.search(h[1]) or prefer.search(h[0])]
        if better:
            return better[0]
    return hits[0] if hits else (None, None)


def election_candidates(cands, limit=3):
    """Elections-page links, best first, deduplicated."""
    def rank(item):
        url, text = item
        if ELECTION_STRONG.search(text):
            return 0
        if ELECTION_STRONG.search(url):
            return 1
        return 2
    hits = [(u, t) for u, t in cands
            if ELECTION_STRONG.search(t) or ELECTION_STRONG.search(u)
            or ELECTION_WEAK.search(t) or DEEP_ELECTION.search(t)]
    hits.sort(key=rank)
    out, seen = [], set()
    for u, t in hits:
        key = u.split("#")[0]
        if key not in seen:
            seen.add(key)
            out.append((u, t))
    return out[:limit]


# Second-pass link patterns. The first pass looked for the word "results";
# these counties file the same thing under a year, a month, "unofficial",
# "canvass" or "returns", or bury it one level down in a document archive.
DEEP_RESULTS = re.compile(
    r"unofficial|canvass|returns|precinct|cumulative|20(2[4-9])\b"
    r"|november|general election", re.I)
DEEPER_PAGE = re.compile(r"archive|document|prior|past|previous|report|20(2[4-9])\b"
                         r"|election information|election results", re.I)
DEEP_ELECTION = re.compile(
    r"\belections?\b|election information|county clerk|voter|departments?"
    r"|offices|elected officials", re.I)


def deep_results(base, body, depth=0):
    """-> (url, label) for anything that looks like a results document.

    Prefers a precinct report, then any November 2026 artifact, then any
    canvass or unofficial-results link. Follows one archive page deeper.
    """
    cands = [(u, t) for u, t in links(base, body) if not NOT_RESULTS.search(u)
             and not STATE_SITE.search(u)]
    for pattern in (PRECINCT_HINT, re.compile(r"nov(ember)?\.?\s*3,?\s*2026|11[-/.]0?3[-/.]2026", re.I),
                    DEEP_RESULTS):
        hit = [(u, t) for u, t in cands if pattern.search(t) or pattern.search(u)]
        if hit:
            return hit[0]
    if depth == 0:
        for u, t in cands:
            if DEEPER_PAGE.search(t) or DEEPER_PAGE.search(u):
                try:
                    final, body2 = get(u)
                except Exception:
                    continue
                if body2:
                    found = deep_results(final, body2, depth + 1)
                    if found[0]:
                        return found
    return (None, None)


def discover(name):
    row = {"county": name, "site": "", "elections_url": "", "results_url": "",
           "results_label": "", "note": ""}
    site, body, note = try_hosts(name)
    row["site"], row["note"] = site, note
    if not body:
        return row
    cands = election_candidates(links(site, body))
    if not cands:
        row["note"] = "site found, no elections link on the homepage"
        return row
    notes = []
    for eurl, _ in cands:
        if not row["elections_url"]:
            row["elections_url"] = eurl
        try:
            final, ebody = get(eurl)
        except Exception as exc:
            notes.append(f"{type(exc).__name__} on {eurl}")
            continue
        if not ebody:
            notes.append(f"no html at {eurl}")
            continue
        usable = [(u, t) for u, t in links(final, ebody)
                  if not NOT_RESULTS.search(u)]
        state = [(u, t) for u, t in usable
                 if STATE_SITE.search(u) and RESULTS_LINK.search(t + u)]
        usable = [(u, t) for u, t in usable if not STATE_SITE.search(u)]
        rurl, rtext = pick(usable, RESULTS_LINK, prefer=PRECINCT_HINT)
        if not rurl:
            rurl, rtext = deep_results(final, ebody)
        if not rurl and state:
            row["elections_url"] = final
            row["note"] = "elections page links results out to the state site only"
            return row
        if rurl:
            row["elections_url"] = final
            row["results_url"], row["results_label"] = rurl, rtext[:80]
            return row
    row["note"] = ("elections page found, no results link on it"
                   if not notes else "; ".join(notes[:2]))
    return row


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=os.path.join(HERE, "county_sites.csv"))
    ap.add_argument("--inventory",
                    default=os.path.join(HERE, "tx_2026_precinct_sources.csv"))
    ap.add_argument("--only", help="comma-separated county names")
    ap.add_argument("--retry", action="store_true",
                    help="re-run the counties an earlier pass could not resolve")
    ap.add_argument("--all", action="store_true",
                    help="include counties that already have a results_url")
    ap.add_argument("--workers", type=int, default=6)
    args = ap.parse_args()

    with open(args.inventory, newline="") as fh:
        inv = list(csv.DictReader(fh))
    if args.only:
        # --only names counties explicitly, so it must not be filtered by what
        # the inventory already holds -- that is the whole point of naming them.
        want = [c.strip() for c in args.only.split(",") if c.strip()]
        known = {r["county"].lower(): r["county"] for r in inv}
        todo = [known.get(c.lower(), c) for c in want]
    elif args.retry:
        # Re-run the counties a previous pass could not resolve, which the
        # merge recorded in format_notes.
        todo = [r["county"] for r in inv
                if "auto-discovered, no results link" in (r.get("format_notes") or "")
                or not (r.get("results_url") or "").strip()]
    else:
        todo = [r["county"] for r in inv
                if args.all or not (r.get("results_url") or "").strip()]
    print(f"{len(todo)} counties to look up", flush=True)

    rows = []
    with cf.ThreadPoolExecutor(max_workers=args.workers) as pool:
        for row in pool.map(discover, todo):
            rows.append(row)
            flag = "OK " if row["results_url"] else ("~  " if row["site"] else "-- ")
            print(f"{flag}{row['county']:16s} {row['results_url'] or row['site'] or row['note']}",
                  flush=True)

    if not rows:
        # Writing an empty file over a finished crawl destroys it. This
        # happened: `--only` was silently filtered to nothing by the inventory
        # and the 212-county result was overwritten with a header alone.
        sys.exit("no counties matched; refusing to overwrite "
                 f"{os.path.basename(args.out)}")
    rows.sort(key=lambda r: r["county"])
    with open(args.out, "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=["county", "site", "elections_url",
                                           "results_url", "results_label", "note"])
        w.writeheader()
        w.writerows(rows)
    got = sum(1 for r in rows if r["results_url"])
    site = sum(1 for r in rows if r["site"])
    print(f"\n{got} results pages, {site} sites found, {len(rows) - site} counties "
          f"with no reachable site -> {args.out}")


if __name__ == "__main__":
    main()
