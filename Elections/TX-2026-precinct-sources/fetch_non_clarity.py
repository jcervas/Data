#!/usr/bin/env python3
"""Find (and optionally download) precinct-level results for the top-25 Texas
counties that are NOT on Clarity. Use fetch_clarity.py for the other 32.

    python3 fetch_non_clarity.py                      # discover: print URLs
    python3 fetch_non_clarity.py --download           # also fetch the files
    python3 fetch_non_clarity.py harris collin        # just these
    python3 fetch_non_clarity.py --date 2024-11-05    # a past election

Each county's site is shaped differently, so each gets its own handler. Two
counties (Hays, McLennan) sit behind a WAF that refuses any scripted request,
browser headers included; they are reported with the URL to open by hand.
"""

import argparse
import datetime as dt
import os
import re
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

HEADERS = {
    "User-Agent": ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                   "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
}

# Some county WAFs fingerprint the TLS handshake. Brazoria is the sharp case:
# it serves an OpenSSL-linked curl (200) and refuses both Apple's
# SecureTransport curl and Python's urllib (403) in the same second. So don't
# just take the first curl on PATH -- try candidates until one is accepted.
# Order matters: OpenSSL builds (conda, Homebrew) before Apple's /usr/bin/curl.
CURL_CANDIDATES = [c for c in [
    os.environ.get("CURL_BIN"),
    os.path.join(os.path.dirname(sys.executable), "curl"),   # conda/venv
    "/opt/homebrew/opt/curl/bin/curl",
    "/usr/local/opt/curl/bin/curl",
    "/opt/homebrew/bin/curl",
    "/usr/local/bin/curl",
    shutil.which("curl"),
    "/usr/bin/curl",
] if c and os.path.exists(c)]
# de-duplicate, keep order
CURL_CANDIDATES = list(dict.fromkeys(CURL_CANDIDATES))
CURL = CURL_CANDIDATES[0] if CURL_CANDIDATES else None

# Counties fronted by Cloudflare, which serves "Attention Required" to every
# scripted client (and to plain headless Chrome). browser_fetch.mjs drives real
# Chrome with --disable-blink-features=AutomationControlled, which gets through;
# pass --browser to hand these two off to it.
BROWSER_HELPER = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                              "browser_fetch.mjs")
BROWSER_ONLY = {
    "hays": ("https://www.hayscountytx.gov/Archive.aspx?AMID=53",
             "one ADID page per election: Canvass + Cumulative PDFs, Results Reports ZIP, "
             "and CVRExport ZIP (cast vote records, ballot level)"),
    "brazos": ("https://elections.brazoscountytx.gov/results/",
               "WordPress page of per-election PDFs; its WAF refuses every "
               "scripted client but real Chrome gets through"),
    "mclennan": ("https://www.mclennan.gov/Archive.aspx?lngArchiveMasterID=66",
                 "one ADID page per election with Cumulative + Canvass + Precinct PDFs"),
}


def _curl_once(binary, curl, url):
    args = [curl, "-sS", "-L", "--compressed", "--max-time", "60",
            "-w", "\n%{http_code}"]
    for k, v in HEADERS.items():
        args += ["-H", f"{k}: {v}"]
    p = subprocess.run(args + [url], capture_output=True)
    body, _, code = p.stdout.rpartition(b"\n")
    code = code.decode(errors="replace").strip()
    if code == "200" and body:
        return body if binary else body.decode("utf-8", "replace"), None
    detail = p.stderr.decode(errors="replace").strip().splitlines()
    return None, (f"{os.path.basename(os.path.dirname(curl))}/curl http={code or '?'}"
                  f" exit={p.returncode} bytes={len(body)}"
                  + (f": {detail[-1][:70]}" if detail else ""))


def _curl(url, binary=False):
    """TLS-fingerprint fallback, trying each curl build until one is accepted."""
    if not CURL_CANDIDATES:
        raise RuntimeError("no curl found and urllib was refused")
    notes = []
    for curl in CURL_CANDIDATES:
        out, note = _curl_once(binary, curl, url)
        if out is not None:
            return out
        notes.append(note)
    raise RuntimeError("; ".join(notes[:3]))


def fetch(url, binary=False, tries=3):
    """urllib first, curl second. Retries once or twice on a refusal, because
    several of these county sites throttle rather than block outright and come
    back a few seconds later."""
    last = None
    for attempt in range(tries):
        if attempt:
            time.sleep((0, 3, 15)[min(attempt, 2)])   # Brazoria throttles bursts
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=45) as r:
                body = r.read()
            return body if binary else body.decode("utf-8", "replace")
        except (urllib.error.HTTPError, urllib.error.URLError) as exc:
            last = exc
        try:
            return _curl(url, binary)
        except Exception as exc:
            last = exc
    raise RuntimeError(f"{url} unreachable after {tries} tries: {last}")


def links(html, base):
    """Every <a> as (anchor_text, absolute_url).

    Hrefs are percent-encoded on the way out: several counties link PDFs whose
    filenames contain spaces (Liberty, Angelina), and urllib rejects those with
    "URL can't contain control characters" rather than fetching them.
    """
    out = []
    for m in re.finditer(r'<a\b[^>]*href="([^"]+)"[^>]*>(.*?)</a>', html, re.S | re.I):
        href, text = m.group(1).strip(), re.sub(r"<[^>]+>", " ", m.group(2))
        text = re.sub(r"\s+", " ", text).strip()
        url = urllib.parse.urljoin(base, href)
        parts = urllib.parse.urlsplit(url)
        url = urllib.parse.urlunsplit(parts._replace(
            path=urllib.parse.quote(parts.path, safe="/%:@&=+$,;~!*'()"),
            query=urllib.parse.quote(parts.query, safe="/%:@&=+$,;?~!*'()")))
        out.append((text, url))
    return out


def by_text(html, base, pattern):
    rx = re.compile(pattern, re.I)
    return [(t, u) for t, u in links(html, base) if rx.search(t)]


def by_url(html, base, pattern):
    rx = re.compile(pattern, re.I)
    return [(t or u.rsplit("/", 1)[-1], u) for t, u in links(html, base) if rx.search(u)]


def dedupe(pairs):
    seen, out = set(), []
    for t, u in pairs:
        if u not in seen:
            seen.add(u)
            out.append((t, u))
    return out


# --- per-county handlers -----------------------------------------------------
# Each takes the election date and returns [(label, url), ...].

def harris(d):
    base = "https://appfiles.harrisvotes.com/harrisvotes/prd/Data/%s" % d.strftime("%m%y")
    hits = [("precinct report", base + "/precinct.pdf"),
            ("cumulative report", base + "/cumulative.pdf")]
    if d.month != 11:               # primaries split by party
        hits += [("precinct report (R primary)", base + "/rep-precinct.pdf"),
                 ("precinct report (D primary)", base + "/dem-precinct.pdf"),
                 ("cumulative (R primary)", base + "/rep-cumulative.pdf"),
                 ("cumulative (D primary)", base + "/dem-cumulative.pdf")]
    return hits


def montgomery(d):
    month = d.strftime("%B")
    direct = ("https://elections.mctx.org/results/"
              f"{d.year}_{month}_Precinct_Report.pdf")
    page = "https://elections.mctx.org/ElectionResults.asp"
    found = by_url(fetch(page), page, r"Precinct_Report\.pdf$")
    return dedupe([("precinct report (predicted name)", direct)] + found[:6])


def collin(d):
    page = "https://www.collincountytx.gov/elections/election-results"
    html = fetch(page)
    return dedupe(by_text(html, page, r"precinct")
                  + by_url(html, page, r"precinct.*\.(pdf|csv)"))


def brazoria(d):
    page = "https://www.brazoriacountyclerktx.gov/departments/elections/election-results"
    html = fetch(page)
    return dedupe([(t, u) for t, u in by_text(html, page, r"precinct")
                   if "showpublisheddocument" in u])


def cameron(d):
    page = "https://www.cameroncountytx.gov/elections/results/"
    html = fetch(page)
    hits = dedupe(by_url(html, page, r"(Precinct[-_]Result|PCTxPCT|pctxpct)[^/]*\.pdf$"))
    # Files live under uploads/<YYYY>/<MM>/; prefer the election's own month,
    # then its year, then whatever else is on the page.
    def rank(u):
        if f"/uploads/{d.year}/{d.month:02d}/" in u:
            return 0
        return 1 if f"/uploads/{d.year}/" in u else 2
    hits.sort(key=lambda p: rank(p[1]))
    return [h for h in hits if rank(h[1]) < 2][:12] or hits[:8]


def smith(d):
    """Listing is scrapable; the files are not. Smith stores them in a Laserfiche
    portal whose DocView endpoint 302s to itself without a browser session, so
    these URLs are reported for a human (or headless browser) to open."""
    page = "https://www.smith-county.com/236/Current-Election-Results"
    html = fetch(page)
    return dedupe(by_text(html, page, r"precinct"))


def webb(d):
    page = "https://www.webbcountytx.gov/425/Precinct-By-Precinct-Results"
    html = fetch(page)
    # The page also carries polling-site and redistricting PDFs; the precinct
    # reports are the three split by vote mode.
    return dedupe([(t, u) for t, u in by_url(html, page, r"/DocumentCenter/View/")
                   if re.match(r"(Combined|Early Voting|Election Day)\b", t, re.I)
                   and not re.search(r"site|polling", t, re.I)])


def ellis(d):
    index = "https://www.elliscountytx.gov/1355/2026-Election-Results"
    html = fetch(index)
    pages = [(t, u) for t, u in links(html, index)
             if re.search(r"/\d{3,4}/[A-Z]", u) and re.search(r"Election", u, re.I)]
    out = []
    for _, page in dedupe(pages)[:8]:
        try:
            sub = fetch(page)
        except Exception:
            continue
        out += [(t, u) for t, u in links(sub, page)
                if re.search(r"precinct", t, re.I)
                and re.search(r"DocumentCenter|\.pdf", u, re.I)]
    return dedupe(out) or [("Nov 3 2026 page (files not posted yet)",
                            "https://www.elliscountytx.gov/1402/"
                            "November-3-2026-General-and-Special-Elec")]


# --- second tier -------------------------------------------------------------
# Counties 26-70 by registered voters. Each is a page plus a label pattern for
# the precinct-level report, which is all these sites need: no two share a file
# naming convention, but all of them put the report behind a link whose text
# says what it is. Verified against the live sites on 2026-10-30.
SIMPLE = {
    "grayson": ("https://www.co.grayson.tx.us/page/elec.history",
                r"Pct_Summ|Pct.?Summ",
                "Official_<Party>_Party_Pct_Summ_Results_Report_<YYYY>.pdf"),
    "randall": ("https://www.randallcounty.gov/183/Election-Results",
                r"canvass", "DocumentCenter canvass reports"),
    "ector": ("https://www.ectorcountytx.gov/271/Elections",
              r"^Pct\.", "one PDF per precinct group, labelled Pct. 101, ..."),
    "taylor": ("https://www.taylorcounty.texas.gov/549/Archived-Election-Results",
               r"precinct results", "DocumentCenter: OFFICIAL ... Precinct Results"),
    "tom green": ("https://www.tomgreencountytx.gov/page/ele.ElectionsResults",
                  r"precinct results", "upload/page/0091/docs/<YYYY>/..."),
    "bowie": ("https://www.bowiecounty.org/1241/Past-Election-Results",
              r"pct ?x ?pct|precinct", "Official Results Pct X Pct (PDF)"),
    "henderson": ("https://www.henderson-county.com/225/Election-Results",
                  r"canvassing authority|precinct",
                  "Final Results for Canvassing Authority (PDF)"),
    "potter": ("https://www.pottercountytexasvotes.gov/archived-election-results",
               r"pct\.? ?x ?pct\.?|canvass", "Wix _files/ugd: ... Pct. x Pct."),
    "wise": ("https://www.co.wise.tx.us/315/Elections",
             r"precinct results", "DocumentCenter: Precinct Results Report"),
    "liberty": ("https://www.co.liberty.tx.us/page/liberty.elections.past.historical",
                r"precinct|canvass", "historical results page"),
}


def _simple(county):
    page, pattern, _ = SIMPLE[county]

    def handler(d, page=page, pattern=pattern):
        html = fetch(page)
        hits = by_text(html, page, pattern)
        hits = [(t, u) for t, u in hits
                if not re.search(r"\bmap|commissioner|justice of|constable", t, re.I)]
        return dedupe(hits)[:8] or [("results page (no precinct link matched)", page)]

    return handler


# Resolved only as far as a results page: no precinct-labelled link to key on,
# or the site refuses scripted access. Reported so they are not silently absent.
PAGE_ONLY = {
    "johnson": ("https://www.johnsoncountytx.org/departments/elections-office/"
                "current-election-results", "results page; no precinct link yet"),
    "angelina": ("https://www.angelinacounty.gov/elections/",
                 "PDF results under files/pdf/elections/; none precinct-labelled"),
    "orange": ("https://www.co.orange.tx.us/departments/elections",
               "elections page carries no results links"),
    "wichita": ("https://wichitacountytx.com/election_info/",
                "site returns 403 to every scripted client; needs a browser"),
}

HANDLERS = {"harris": harris, "collin": collin, "montgomery": montgomery,
            "brazoria": brazoria, "cameron": cameron, "smith": smith,
            "webb": webb, "ellis": ellis}
HANDLERS.update({c: _simple(c) for c in SIMPLE})
ORDER = ["harris", "collin", "montgomery", "brazoria", "cameron",
         "hays", "smith", "mclennan", "ellis", "webb",
         "brazos", "johnson", "grayson", "randall", "ector", "taylor",
         "wichita", "tom green", "bowie", "henderson", "potter", "wise",
         "liberty", "orange", "angelina"]


def head(url):
    """Return (status, content-length). A real HEAD, so checking a 10 MB PDF
    costs one round trip instead of downloading it."""
    if "portal.laserfiche.com" in url:
        return "viewer", 0          # session-based; see smith() note
    try:
        req = urllib.request.Request(url, headers=HEADERS, method="HEAD")
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, int(r.headers.get("Content-Length") or 0)
    except urllib.error.HTTPError as e:
        # Don't trust a HEAD failure: CivicPlus 404s a HEAD on document URLs
        # that redirect, and some WAFs 403 it. Confirm with a GET below.
        if e.code not in (403, 404, 405):
            return e.code, 0
    except urllib.error.URLError:
        pass
    if not CURL:
        return "no-curl", 0
    # Several of these sites answer HEAD with 403/404 but serve a GET fine
    # (Brazoria, Ellis), so fall back to a one-byte ranged GET.
    args = [CURL, "-sS", "-L", "--compressed", "--max-time", "40", "-r", "0-0",
            "-D", "-", "-o", "/dev/null"]
    for k, v in HEADERS.items():
        args += ["-H", f"{k}: {v}"]
    try:
        out = subprocess.run(args + [url], capture_output=True,
                             text=True, timeout=50).stdout
    except Exception as e:
        return type(e).__name__, 0
    codes = re.findall(r"^HTTP/[\d.]+ (\d{3})", out, re.M)
    if not codes:
        return "curl-fail", 0
    code = int(codes[-1])
    rng = re.search(r"(?im)^content-range:\s*bytes\s+\S+/(\d+)", out)
    if rng:
        return (200 if code in (200, 206) else code), int(rng.group(1))
    lens = re.findall(r"(?im)^content-length:\s*(\d+)", out)
    if code in (200, 206):
        return 200, int(lens[-1]) if lens else 0
    # Ellis' DocumentCenter 404s a ranged request but serves a plain GET.
    plain = [CURL, "-sS", "-L", "--compressed", "--max-time", "60",
             "-o", "/dev/null", "-w", "%{http_code} %{size_download}"]
    for k, v in HEADERS.items():
        plain += ["-H", f"{k}: {v}"]
    try:
        got = subprocess.run(plain + [url], capture_output=True,
                             text=True, timeout=70).stdout.split()
        if len(got) == 2 and got[0] == "200":
            return 200, int(got[1])
        if got and got[0] != "200":
            code = int(got[0])
    except Exception:
        pass
    # Last resort: a plain urllib GET. Ellis serves this but 404s both a HEAD
    # and a ranged GET, and refuses curl entirely.
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=60) as r:
            return r.status, len(r.read())
    except Exception:
        return code, 0


def save(url, outdir, county):
    os.makedirs(outdir, exist_ok=True)
    final = url
    try:                       # CivicPlus redirects /View/<id> to a slug URL
        req = urllib.request.Request(url, headers=HEADERS, method="HEAD")
        with urllib.request.urlopen(req, timeout=30) as r:
            final = r.url or url
    except Exception:
        pass
    name = urllib.parse.unquote(final.rsplit("/", 1)[-1].split("?")[0]) or "download"
    name = re.sub(r"[^A-Za-z0-9._-]", "_", name)[:120]
    if "." not in name:
        name += ".pdf"
    path = os.path.join(outdir, f"{county}_{name}")
    body = fetch(url, binary=True)
    with open(path, "wb") as f:
        f.write(body)
    return path, len(body)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("counties", nargs="*")
    p.add_argument("--date", default="2026-11-03", help="election date, YYYY-MM-DD")
    p.add_argument("--download", action="store_true")
    p.add_argument("--browser", action="store_true",
                   help="run the Cloudflare counties through browser_fetch.mjs "
                        "(needs Node 22+ and Chrome)")
    p.add_argument("--outdir", default="non_clarity_out")
    a = p.parse_args()
    d = dt.date.fromisoformat(a.date)

    wanted = [c.lower() for c in a.counties] or ORDER
    for county in wanted:
        if county in BROWSER_ONLY:
            url, note = BROWSER_ONLY[county]
            if not a.browser:
                print(f"{county:<11} BROWSER ONLY  {url}\n{'':<11}   {note}"
                      f"\n{'':<11}   re-run with --browser to fetch it")
                continue
            if not shutil.which("node"):
                print(f"{county:<11} needs Node 22+ for --browser; {url}")
                continue
            cmd = ["node", BROWSER_HELPER, county, "--out", a.outdir]
            if a.download:
                cmd.append("--download")
            subprocess.run(cmd)
            continue
        if county not in HANDLERS:
            print(f"{county:<11} unknown county")
            continue
        try:
            hits = HANDLERS[county](d)
        except Exception as exc:
            print(f"{county:<11} !! {type(exc).__name__}: {exc}")
            continue
        if not hits:
            print(f"{county:<11} nothing found")
            continue
        print(f"{county:<11} {len(hits)} candidate(s)")
        for label, url in hits:
            status, size = head(url)
            mark = "ok " if status == 200 else "-- "
            print(f"{'':<11} {mark}{str(status):<5}{size:>9,}b  {label[:44]:<46}{url}")
            if a.download and status == 200:
                try:
                    path, n = save(url, a.outdir, county)
                    print(f"{'':<11}     saved {n:,}b -> {path}")
                except Exception as exc:
                    print(f"{'':<11}     save failed: {exc}")


if __name__ == "__main__":
    sys.exit(main())
