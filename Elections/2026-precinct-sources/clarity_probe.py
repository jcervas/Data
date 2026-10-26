"""Probe Clarity for a state's counties: is it there, and is 11/3/2026 staged?"""
import json, sys, urllib.request, concurrent.futures as cf

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "Chrome/129.0 Safari/537.36")
ST = sys.argv[1]
TARGET = sys.argv[2] if len(sys.argv) > 2 else "11/3/2026"
COUNTIES = [c.strip() for c in sys.stdin.read().split(",") if c.strip()]

def get(url):
    # Clarity gzips elections.json regardless of Accept-Encoding, so an
    # identity request still comes back compressed and json.load fails. An
    # earlier version of this probe reported those as missing sites.
    req = urllib.request.Request(url, headers={"User-Agent": UA,
                                               "Accept-Encoding": "gzip"})
    with urllib.request.urlopen(req, timeout=20) as r:
        body = r.read()
    if body[:2] == b"\x1f\x8b":
        import gzip
        body = gzip.decompress(body)
    return body.decode("utf-8", "replace")

def one(c):
    try:
        ev = json.loads(get(f"https://results.enr.clarityelections.com/{ST}/{c}/elections.json"))
    except Exception as e:
        return c, None, None, type(e).__name__
    if not isinstance(ev, list) or not ev:
        return c, 0, None, "empty"
    staged = next((e.get("EID") for e in ev
                   if (e.get("Date") or "").startswith(TARGET)), None)
    latest = max((e.get("Date") or "") for e in ev)
    return c, len(ev), staged, latest

with cf.ThreadPoolExecutor(max_workers=12) as ex:
    rows = list(ex.map(one, COUNTIES))

on = [r for r in rows if r[1]]
st26 = [r for r in on if r[2]]
print(f"{ST}: {len(on)} of {len(COUNTIES)} counties on Clarity; "
      f"{len(st26)} with {TARGET} staged")
for c, n, s, latest in sorted(rows):
    mark = f"EID {s}" if s else "--"
    print(f"  {c:<16}{(str(n) if n is not None else 'err'):>5} elections  "
          f"{mark:<12} latest {str(latest)[:10]}")
