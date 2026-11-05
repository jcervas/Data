#!/usr/bin/env python3
"""Read precinct results out of a livevoterturnout.com "Election Night Results"
page -- the vendor Ellis and Cameron use.

This is the easiest source of the three. The whole county, every precinct and
every contest, is one static HTML page: no API, no pagination, no PDF. The
precinct tables are already in the markup, collapsed behind
`display: none`, so a plain GET is enough.

The shape per precinct/contest:

    <div class="list-item-precinct-race">
      <span class="race-title">1001-501 - Governor</span>
      ...
      <tr class="content-row">
        <td dc="true" class="pcd">REP Greg Abbott</td>   <- candidate
        <td dv="true" class="pcd">347</td>               <- votes
        <td dpe="true" class="pcd">24.72%</td>

Only `race-title` spans inside a `list-item-precinct-race` block are precinct
rows; the same class is used for the countywide section at the top of the page,
where the title is the contest name alone.

    ./parse_lvt_enr.py ellis [--url ...] [--out CSV]
"""
import argparse, csv, html, os, re, sys, urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from extract_gov_sen import RACES, resolve, split_party
from tlc_precincts import precincts_by_fips, DEFAULT_DBF

HERE = os.path.dirname(os.path.abspath(__file__))
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")

# county -> fips3, display name, ENR page
COUNTIES = {
    "ellis": ("139", "Ellis",
              "https://www.livevoterturnout.com/ENR/ellistxenr/11/en/Index_11.html"),
}

BLOCK = re.compile(r'class="list-item-precinct-race"(.*?)(?=class="list-item-precinct-race"|\Z)',
                   re.S)
# The countywide section at the top of the same page, used to check the
# precinct rows add up. Its blocks carry the contest name with no precinct.
COUNTYWIDE = re.compile(r'class="list-item-race"(.*?)(?=class="list-item-race"|\Z)', re.S)
RACE_TITLE = re.compile(r'<span class="race-title">([^<]+)</span>')
TITLE = re.compile(r'<span class="race-title">([^<]+)</span>')
ROW = re.compile(r'<td dc="true"[^>]*>(.*?)</td>.*?<td dv="true"[^>]*>([\d,]*)</td>', re.S)
TAGS = re.compile(r"<[^>]+>")
# The candidate cell holds the name twice: once visible, once in an sr-only
# span for screen readers. Stripping tags naively yields "Greg Abbott REP Greg
# Abbott", which merges with nothing and silently forks the candidate.
FIRST_SPAN = re.compile(r"<span\b[^>]*>(.*?)</span>", re.S)


def text(fragment):
    m = FIRST_SPAN.search(fragment)
    return html.unescape(TAGS.sub(" ", m.group(1) if m else fragment)).strip()


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read().decode("utf-8", "replace")


def parse(page, fips, county, valid, election_date):
    """-> (rows, problems). One row per precinct/race/candidate."""
    rows, problems, seen_titles = [], [], 0
    for block in BLOCK.findall(page):
        m = TITLE.search(block)
        if not m:
            continue
        title = html.unescape(m.group(1)).strip()
        if " - " not in title:
            continue                      # countywide block, not a precinct
        label, contest = title.split(" - ", 1)
        seen_titles += 1
        race = next((r for r, pat in RACES
                     if re.search(pat, contest, re.I)
                     and not re.search(r"lieutenant|lt\.", contest, re.I)), None)
        if race is None:
            continue
        prec, status = resolve(label, valid)
        if status == "unparsed":
            problems.append(f"could not read precinct label {label!r}")
            continue
        if status == "no_tlc_match":
            problems.append(f"precinct {prec} absent from TLC 26P, kept")
        for raw, votes in ROW.findall(block):
            name, party = split_party(text(raw))
            if not name:
                continue
            rows.append({
                "county": county, "fips3": fips, "precinct": prec,
                "pctkey": str(int(fips)) + prec, "race": race,
                "candidate": name, "party": party,
                "votes": int(votes.replace(",", "") or 0),
                "tlc_match": status, "election_date": election_date,
            })
    # The page prints its own countywide totals; the precinct rows must add up
    # to them. Ellis matches to the vote, which is what makes this source
    # trustworthy without a second download.
    official = {}
    for block in COUNTYWIDE.findall(page):
        m = RACE_TITLE.search(block)
        if not m:
            continue
        contest = html.unescape(m.group(1)).strip()
        if " - " in contest:
            continue
        race = next((r for r, pat in RACES
                     if re.search(pat, contest, re.I)
                     and not re.search(r"lieutenant|lt\.", contest, re.I)), None)
        if race:
            official[race] = sum(int((v or "0").replace(",", ""))
                                 for _, v in ROW.findall(block))
    for race, total in official.items():
        got = sum(r["votes"] for r in rows if r["race"] == race)
        if total and got != total:
            problems.append(f"{race}: precinct rows sum to {got:,} but the "
                            f"page's countywide total is {total:,} "
                            f"(off by {got - total:+,})")
    if not seen_titles:
        problems.append("no precinct blocks found -- the page layout may have "
                        "changed, or this election has no precinct results yet")
    return rows, problems


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("county", choices=sorted(COUNTIES))
    ap.add_argument("--url", help="override the ENR page")
    ap.add_argument("--dbf", default=DEFAULT_DBF)
    ap.add_argument("--date", default="11/3/2026")
    ap.add_argument("--out")
    args = ap.parse_args()

    fips, name, url = COUNTIES[args.county]
    out = args.out or os.path.join(HERE, f"{args.county}_precinct_2026.csv")
    valid = precincts_by_fips(args.dbf).get(fips, set())
    rows, problems = parse(fetch(args.url or url), fips, name, valid, args.date)

    fields = ["county", "fips3", "precinct", "pctkey", "race", "candidate",
              "party", "votes", "tlc_match", "election_date"]
    with open(out, "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=fields)
        w.writeheader()
        w.writerows(rows)

    precs = {r["precinct"] for r in rows}
    print(f"{name}: {len(rows)} rows, {len(precs)} precincts (TLC has {len(valid)})")
    for race in sorted({r["race"] for r in rows}):
        sub = [r for r in rows if r["race"] == race]
        print(f"  {race:10s} {len({r['precinct'] for r in sub}):3d} precincts, "
              f"{sum(r['votes'] for r in sub):,} votes")
    missing = sorted(valid - precs)
    if missing:
        print(f"  {len(missing)} TLC precinct(s) not reported: {missing[:8]}")
    for p in sorted(set(problems))[:10]:
        print(f"  - {p}")
    print(f"\n-> {out}")


if __name__ == "__main__":
    main()
