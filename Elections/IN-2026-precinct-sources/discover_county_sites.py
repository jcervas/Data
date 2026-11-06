#!/usr/bin/env python3
"""Find each Indiana county's official site, its elections page and its results
page, for the counties `in_2026_precinct_sources.csv` has no `results_url` for.

Why this exists: Indiana publishes no statewide precinct results, and unlike
Texas there is no Clarity tier to cover the big counties -- all 20 of the
largest return 404 under `results.enr.clarityelections.com/IN/`. Every one of
the 5,121 precincts has to come from one of 92 county sites, and the certified
precinct files start appearing after noon on November 16, 2026. Knowing where
they will appear is the prerequisite for fetching them.

Same three stages as the Texas crawler, with Indiana's naming conventions:

1. **Host.** Indiana counties cluster on `co.<name>.in.us` and
   `<name>county.in.gov`, with a long tail of vanity domains. A handful of the
   largest counties use names that no convention predicts (Marion is indy.gov,
   St. Joseph is sjcindiana.gov), so those are seeded.
2. **Elections page.** The first homepage link that looks like an elections
   department -- in Indiana usually the circuit court clerk, who is the county's
   election officer and the one who files the certified vote statement.
3. **Results page.** From there, the first link that looks like election
   results, preferring one that mentions a precinct report.

Writes one row per county, failures included.

    ./discover_county_sites.py [--out county_sites.csv] [--only Allen,Lake]
                               [--workers 6] [--all]
"""
import argparse, csv, html, os, re, socket, sys, urllib.error, urllib.parse
import urllib.request, concurrent.futures as cf

HERE = os.path.dirname(os.path.abspath(__file__))
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")
TIMEOUT = 9

# In Indiana the circuit court clerk runs elections, so "clerk" is a strong
# signal here rather than the wrong-turn it was in Texas.
ELECTION_STRONG = re.compile(r"\belections?\b|circuit court clerk|county clerk", re.I)
ELECTION_WEAK = re.compile(r"voter|election board|clerk", re.I)
RESULTS_LINK = re.compile(r"election results|results|canvass|returns", re.I)
PRECINCT_HINT = re.compile(r"precinct", re.I)
NOT_RESULTS = re.compile(r"/search|search\.results|\bsearch\b", re.I)
STATE_SITE = re.compile(r"indianavoters\.in\.gov|in\.gov/sos|enr\.indianavoters", re.I)
SKIP_LINK = re.compile(r"^(mailto:|tel:|javascript:|#)|\.(jpg|png|gif|css|js)$", re.I)
DEEP_RESULTS = re.compile(
    r"unofficial|canvass|returns|precinct|cumulative|20(2[4-9])\b"
    r"|november|general election", re.I)
DEEPER_PAGE = re.compile(r"archive|document|prior|past|previous|report|20(2[4-9])\b"
                         r"|election information|election results", re.I)
DEEP_ELECTION = re.compile(
    r"\belections?\b|election information|county clerk|circuit court clerk|voter"
    r"|departments?|offices|elected officials", re.I)

# Counties whose domain no convention predicts. Seeded rather than crawled-for,
# because a wrong guess here costs the biggest counties in the state.
KNOWN_HOSTS = {
    "Marion": "https://www.indy.gov/",
    "St. Joseph": "https://www.sjcindiana.gov/",
    "Allen": "https://www.allencountyin.gov/",
    "Tippecanoe": "https://www.tippecanoe.in.gov/",
    "Vanderburgh": "https://www.vanderburghgov.org/",
    "Elkhart": "https://www.elkhartcounty.com/",
}


def slugs(name):
    """Indiana county names that need more than lowercasing: 'St. Joseph',
    'LaPorte', 'LaGrange', 'DeKalb', 'Switzerland'."""
    n = name.lower().replace(".", "").strip()
    out = [n.replace(" ", ""), n.replace(" ", "-")]
    if n.startswith("st "):
        out.append("st" + n[3:].replace(" ", ""))
        out.append("saint" + n[3:].replace(" ", ""))
    return list(dict.fromkeys(out))


def hosts_for(name):
    """Candidate hostnames, most likely first."""
    seen, out = set(), []
    if name in KNOWN_HOSTS:
        out.append(KNOWN_HOSTS[name])
        seen.add(KNOWN_HOSTS[name])
    for s in slugs(name):
        for scheme, host in (
                ("https", f"www.co.{s}.in.us"),
                ("https", f"www.{s}county.in.gov"),
                ("https", f"{s}county.in.gov"),
                ("https", f"www.{s}countyin.gov"),
                ("https", f"co.{s}.in.us"),
                ("https", f"www.{s}county.us"),
                ("https", f"www.{s}county.org"),
                ("https", f"www.{s}county.com"),
                ("https", f"www.{s}countyindiana.gov"),
                ("https", f"in-{s}county.civicplus.com"),
                ("http", f"www.co.{s}.in.us"),
                ("http", f"co.{s}.in.us")):
            url = f"{scheme}://{host}/"
            if url not in seen:
                seen.add(url)
                out.append(url)
    return out


def plausible(url, name):
    """Still the county's own site? A lapsed county domain that now 302s to a
    parked page must not be recorded as the county's site."""
    host = (urllib.parse.urlsplit(url).hostname or "").lower()
    if not host:
        return False
    if host.endswith((".in.us", ".in.gov", ".gov", ".state.in.us")):
        return True
    flat = host.replace("-", "")
    return any(s.replace("-", "") in flat for s in slugs(name))


def encode(url):
    parts = urllib.parse.urlsplit(url)
    return urllib.parse.urlunsplit(parts._replace(
        path=urllib.parse.quote(parts.path, safe="/%:@&=+$,;~!*'()"),
        query=urllib.parse.quote(parts.query, safe="/%:@&=+$,;?~!*'()")))


def get(url, timeout=TIMEOUT):
    req = urllib.request.Request(encode(url), headers={
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
    tried = 0
    for url in hosts_for(name):
        host = urllib.parse.urlsplit(url).hostname
        try:
            socket.getaddrinfo(host, None)
        except socket.gaierror:
            continue
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


def deep_results(base, body, depth=0):
    cands = [(u, t) for u, t in links(base, body) if not NOT_RESULTS.search(u)
             and not STATE_SITE.search(u)]
    for pattern in (PRECINCT_HINT,
                    re.compile(r"nov(ember)?\.?\s*3,?\s*2026|11[-/.]0?3[-/.]2026", re.I),
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
            row["note"] = ("elections page links results out to the state ENR "
                           "only -- which is county-level, so no precinct data")
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
                    default=os.path.join(HERE, "in_2026_precinct_sources.csv"))
    ap.add_argument("--only", help="comma-separated county names")
    ap.add_argument("--all", action="store_true",
                    help="include counties that already have a results_url")
    ap.add_argument("--workers", type=int, default=6)
    args = ap.parse_args()

    with open(args.inventory, newline="") as fh:
        inv = list(csv.DictReader(fh))
    if args.only:
        want = [c.strip() for c in args.only.split(",") if c.strip()]
        known = {r["county"].lower(): r["county"] for r in inv}
        todo = [known.get(c.lower(), c) for c in want]
    else:
        todo = [r["county"] for r in inv
                if args.all or not (r.get("results_url") or "").strip()]
    print(f"{len(todo)} counties to look up", flush=True)

    rows = []
    with cf.ThreadPoolExecutor(max_workers=args.workers) as pool:
        for row in pool.map(discover, todo):
            rows.append(row)
            flag = "OK " if row["results_url"] else ("~  " if row["site"] else "-- ")
            print(f"{flag}{row['county']:16s} "
                  f"{row['results_url'] or row['site'] or row['note']}", flush=True)

    if not rows:
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
