#!/usr/bin/env python3
"""Find the host a county actually publishes on, for the counties the first two
passes left unresolved, and say which of several plausible hosts is real.

The reason this is a pass of its own: in Indiana the obvious hostname is wrong
often enough to be the main cost of the survey, and it is wrong in three
different ways that look alike from a crawler.

  parked   `kosciuskocounty.com` and `hancockcounty.org` both answer HTTP 200
           with 114 bytes of JavaScript that redirects to `/lander` -- a domain
           parking page. The real sites are `kosciusko.in.gov` and
           `hancockcoingov.com`. A crawler that follows 200s treats the parked
           name as the county site and then reports, correctly, that it has no
           election page.
  lapsed   `wellscounty.us` redirects off-domain to a gambling site. Same 200.
  renamed  the county is on a shared platform under a name nobody would guess:
           `gov.orange.in.datapitstop.us`, aliased as `orangecounty59.us`,
           where 59 is Orange's position in the alphabetical list of Indiana's
           92 counties. Hence COUNTY_NUM below.

So each candidate host is classified rather than just reached, and a county is
only called resolved when a host answers with something that looks like a
county. Writes host_resolution.csv.
"""
import concurrent.futures as cf, csv, os, re, socket, ssl, sys
import urllib.error, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
INVENTORY = os.path.join(HERE, "in_2026_precinct_sources.csv")
OUT = os.path.join(HERE, "host_resolution.csv")
# The winners, in the shape `sweep_unresolved.py --sites` expects, so the next
# pass runs off this file rather than off a hand-edited copy.
SITES = os.path.join(HERE, "county_sites_resolved.csv")
# A datapitstop shell and its `<county><N>.us` aliases serve the same ~8 KB
# directory stub. It is a real page about a real county, so no verdict rejects
# it, but it is never the site that holds the results -- the county's own CMS
# is. Anything smaller than this is a stub, not a county website.
CMS_MIN_BYTES = 12_000

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/120.0 Safari/537.36")

# Indiana's counties in alphabetical order; the index is the number that shows
# up in the datapitstop alias (`orangecounty59.us` -> Orange is the 59th).
COUNTY_NUM = {}
_ALPHA = """Adams Allen Bartholomew Benton Blackford Boone Brown Carroll Cass
Clark Clay Clinton Crawford Daviess Dearborn Decatur DeKalb Delaware Dubois
Elkhart Fayette Floyd Fountain Franklin Fulton Gibson Grant Greene Hamilton
Hancock Harrison Hendricks Henry Howard Huntington Jackson Jasper Jay Jefferson
Jennings Johnson Knox Kosciusko LaGrange Lake LaPorte Lawrence Madison Marion
Marshall Martin Miami Monroe Montgomery Morgan Newton Noble Ohio Orange Owen
Parke Perry Pike Porter Posey Pulaski Putnam Randolph Ripley Rush St.Joseph
Scott Shelby Spencer Starke Steuben Sullivan Switzerland Tippecanoe Tipton
Union Vanderburgh Vermillion Vigo Wabash Warren Warrick Washington Wayne Wells
White Whitley""".split()
for i, n in enumerate(_ALPHA, start=1):
    COUNTY_NUM[n.lower().replace(".", "")] = i

PARKED = re.compile(r'location\.href\s*=\s*["\']/lander', re.I)
COUNTYISH = re.compile(r"county|clerk|auditor|treasurer|commissioner|assessor",
                       re.I)
# Half of Indiana's county names belong to a county in some other state too,
# and the generic hostname usually went to the bigger one: knoxcounty.org is
# Knox County TENNESSEE, mococlerk.com is Monroe County ILLINOIS, and Pulaski's
# first crawl hit was elections.virginia.gov. So a host only counts as this
# county's when something ties it to Indiana -- either the hostname is
# Indiana-only by construction, or the page says so.
IN_HOSTNAME = re.compile(r"(^|\.)in\.gov$|\.in\.us$|-in\.gov$|county\d{1,2}\.us$"
                         r"|countyin\.gov$|\.in\.datapitstop\.us$", re.I)
IN_BODY = re.compile(r"\bIndiana\b|\bIN\s+4[67]\d{3}\b|\bin\.gov\b", re.I)
OTHER_STATE = re.compile(
    r"\b(Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|"
    r"Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Iowa|Kansas|Kentucky|"
    r"Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|"
    r"Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|"
    r"New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|"
    r"Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|"
    r"Virginia|Washington|West Virginia|Wisconsin|Wyoming)\b")


def slug(name):
    return name.lower().replace(" ", "").replace(".", "").replace("'", "")


def candidates(name):
    """Every hostname an Indiana county has actually been found at.

    There is no convention, only a list. Each of these is the real site of at
    least one county and a dead name for most of the others, so the only way
    to know is to ask all of them: Warrick is `warrickcounty.gov`, Gibson is
    `gibsoncounty-in.gov` with a hyphen, Starke and Kosciusko are
    `<slug>.in.gov`, Daviess is plain `daviess.org`, Tipton is `tiptongov.com`,
    and Orange is `orangecounty59.us` because Orange is the 59th county in
    alphabetical order.
    """
    s = slug(name)
    n = COUNTY_NUM.get(s)
    out = [f"https://www.{s}county.in.gov/", f"https://{s}county.in.gov/",
           f"https://www.{s}.in.gov/", f"https://{s}.in.gov/",
           f"https://www.in.gov/counties/{s}/",
           f"https://co.{s}.in.us/", f"https://www.{s}county.org/",
           f"https://{s}coingov.com/",
           f"https://www.{s}county.gov/", f"https://{s}countyin.gov/",
           f"https://{s}county-in.gov/", f"https://{s}.org/",
           f"https://www.{s}gov.com/"]
    if n:
        out += [f"http://gov.{s}county{n}.us/", f"http://clerk.{s}county{n}.us/",
                f"http://gov.{s}.in.datapitstop.us/"]
    return out


def fetch(url, timeout=20):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    with urllib.request.urlopen(req, timeout=timeout, context=ctx) as r:
        return r.geturl(), r.status, r.read(400_000).decode("utf-8", "replace")


def classify(url):
    """-> (verdict, final url, note). Verdicts: live, parked, offdomain,
    dead, blocked."""
    try:
        final, status, body = fetch(url)
    except urllib.error.HTTPError as e:
        return ("blocked" if e.code in (401, 403) else "dead", url,
                f"HTTP {e.code}")
    except (urllib.error.URLError, socket.timeout, ssl.SSLError,
            ConnectionError, OSError) as e:
        return "dead", url, str(e.__class__.__name__)
    except Exception as e:                        # malformed response, etc.
        return "dead", url, str(e.__class__.__name__)
    if PARKED.search(body) or (len(body) < 400 and "lander" in body):
        return "parked", final, "domain-parking lander"
    want = urllib.request.urlsplit(url).hostname if False else None
    h0 = re.sub(r"^www\.", "", (url.split("/")[2] or "")).lower()
    h1 = re.sub(r"^www\.", "", (final.split("/")[2] or "")).lower()
    if h0 != h1 and not h1.endswith(("in.gov", "in.us", h0)) \
            and not h0.endswith(h1):
        return "offdomain", final, f"redirects to {h1}"
    if len(body) < 1500 or not COUNTYISH.search(body):
        return "thin", final, f"{len(body)} bytes, nothing county-shaped"
    # Indiana check. A hostname under in.gov / .in.us / -in.gov / <name><N>.us
    # can only be Indiana's, so it needs no corroboration; anything else has to
    # say Indiana somewhere on the page.
    if not IN_HOSTNAME.search(h1):
        if not IN_BODY.search(body):
            other = OTHER_STATE.search(body)
            if other and other.group(1) != "Indiana":
                return ("outofstate", final,
                        f"says {other.group(1)}, never Indiana")
            return ("unconfirmed", final,
                    f"{len(body)} bytes, but nothing ties it to Indiana")
    return "live", final, f"{len(body)} bytes"


def main():
    rows = list(csv.DictReader(open(INVENTORY, newline="")))
    todo = [r for r in rows if not (r["precinct_data_url"] or r["results_url"])]
    if len(sys.argv) > 1:
        want = {a.lower() for a in sys.argv[1:]}
        todo = [r for r in todo if r["county"].lower() in want]
    print(f"resolving hosts for {len(todo)} counties", file=sys.stderr)

    jobs = [(r["county"], u) for r in todo for u in candidates(r["county"])]
    res = {}
    with cf.ThreadPoolExecutor(max_workers=24) as ex:
        futs = {ex.submit(classify, u): (c, u) for c, u in jobs}
        for f in cf.as_completed(futs):
            c, u = futs[f]
            try:
                res.setdefault(c, []).append((u,) + f.result())
            except Exception as e:
                res.setdefault(c, []).append((u, "dead", u, repr(e)))

    order = {"live": 0, "blocked": 1, "unconfirmed": 2, "thin": 3,
             "parked": 4, "outofstate": 5, "offdomain": 6, "dead": 7}
    winners = {}
    with open(OUT, "w", newline="") as fh:
        w = csv.writer(fh)
        w.writerow(["county", "candidate", "verdict", "final_url", "note"])
        for r in todo:
            c = r["county"]
            got = sorted(res.get(c, []), key=lambda t: order.get(t[1], 9))
            for u, verdict, final, note in got:
                w.writerow([c, u, verdict, final, note])
                # Pick the county's real CMS: live, not a shared shell, and the
                # largest such page. Size is the only signal that separates a
                # county website from the stub that describes one.
                if verdict != "live" or "datapitstop" in final:
                    continue
                m = re.match(r"(\d+) bytes", note or "")
                size = int(m.group(1)) if m else 0
                if size >= CMS_MIN_BYTES and size > winners.get(c, (0, ""))[0]:
                    winners[c] = (size, final)
            best = got[0] if got else None
            tag = f"{best[1]:9s} {best[2]}" if best else "nothing"
            print(f"{c:14s} {tag}")

    with open(SITES, "w", newline="") as fh:
        w = csv.writer(fh)
        w.writerow(["county", "site", "elections_url", "results_url",
                    "results_label", "note"])
        for c in sorted(winners):
            size, url = winners[c]
            w.writerow([c, url, "", "", "", f"resolve_hosts.py, {size} bytes"])

    print(f"\nwrote {OUT}", file=sys.stderr)
    print(f"wrote {SITES} ({len(winners)}/{len(todo)} counties with a real CMS "
          f"host; the rest are stubs, parked names or genuinely absent)",
          file=sys.stderr)


if __name__ == "__main__":
    main()
