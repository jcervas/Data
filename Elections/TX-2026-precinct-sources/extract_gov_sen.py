#!/usr/bin/env python3
"""Pull the Governor and U.S. Senator precinct results out of the Clarity
detail.xml files the poller downloads and key every row to the TLC PCTKEY so
the results join to the 2026 precinct shapefile.

Two things make this more than a column rename.

**Split rows are additive.** Where a county reports both `0366` and
`0366 - L01`, the suffixed rows are extra voters (limited ballots, federal-only
ballots, joint-election voters), not a breakdown of the bare row:
`bare + splits` reproduces Clarity's own `Choice/@totalVotes` per candidate to
the vote, while `bare` alone falls short -- by 21% in Wood's Governor race. So
every row sharing a base precinct id is summed and nothing is dropped. Each
county's summed total is checked back against `@totalVotes`, and a mismatch is
reported rather than written out quietly.

**Labels are normalized against TLC, not by guesswork.** Counties write the
same precinct half a dozen ways -- `01` (Gregg), `1004-01` (Dallas),
`137 - BS1` (Galveston), `232.3` for TLC's `2323` (Galveston again),
`Bald Prairie 4` (Robertson), `1A3B` (Lamar, a merged precinct that is a real
TLC id and must not be padded). Rather than ranking those patterns, this
generates candidate forms and accepts the first one that actually exists in
TLC's precinct set for that county. Anything that matches nothing is listed.

    ./extract_gov_sen.py [--files DIR] [--out CSV] [--date M/D/YYYY]
"""
import argparse, csv, os, re, sys, xml.etree.ElementTree as ET
from collections import defaultdict

# Runs under `python3 -I`, which keeps the script's own directory off sys.path,
# so point at it explicitly rather than dropping the isolation flag.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from tlc_precincts import precincts_by_fips, DEFAULT_DBF

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_FILES = os.path.expanduser("~/tx-2026-enr/files")
RACES = (("governor", r"govern"), ("us_senate", r"u\.?\s*s\.?\s*sen|united states sen"))
NOT_THIS_RACE = re.compile(r"lieutenant|lt\.", re.I)
# Rows that are a ballot type, not a place: Clarity carries them alongside the
# precincts in some counties and they have nowhere to join.
COUNTYWIDE = re.compile(r"^(fed(eral)?[\s_-]*only|limited|provisional|uocava)\b", re.I)
PREFIX = re.compile(r"^(?:precinct|pct\.?|prec\.?)\s*", re.I)
# Counties label the same candidate at least five ways: 'Gina Hinojosa',
# 'DEM Gina Hinojosa', 'Gina Hinojosa (DEM)', 'DEM GINA HINOJOSA', 'GINA
# HINOJOSA'. Split the party off and case-fold so the rows aggregate.
PARTIES = ("DEM", "REP", "LIB", "GRN", "IND", "W-I")
PARTY_LEAD = re.compile(r"^(%s)[\s.:-]+" % "|".join(PARTIES), re.I)
PARTY_TRAIL = re.compile(r"[\s(\[]+(%s)[)\]]?\s*$" % "|".join(PARTIES), re.I)
WRITE_IN = re.compile(r"^(write[\s-]?in|unassigned write)", re.I)
# Counties that disagree on a candidate's name rather than just its case. Only
# certified write-ins have needed this so far: Hidalgo prints 'Brad Hall' where
# Brazoria, Denton and Tarrant print 'Bradford "Brad" Hall'. Keyed on the
# already-case-folded, quote-stripped name; add a line when a new split shows up
# in the distinct-candidate count rather than guessing at a nickname rule.
ALIASES = {"Bradford Brad Hall": "Brad Hall"}


def fips_by_county():
    path = os.path.join(HERE, "geo", "county57_precinct_counts.csv")
    with open(path, newline="") as fh:
        return {r["county"].lower(): r["fips3"] for r in csv.DictReader(fh)}


def pad(s):
    """'1' -> '0001', '1C' -> '001C', '232.3' -> '2323'. '' if not that shape."""
    m = re.match(r"^(\d+)([A-Z]*)$", s)
    if not m:
        return ""
    digits, alpha = m.groups()
    return digits.rjust(4 - len(alpha), "0") + alpha


def candidates(label):
    """Every plausible TLC id for a reported label, best guesses first.

    Order matters, and subtly. Galveston reports both `230 - BS12` and
    `230.1 - BS12`, and TLC Galveston holds *both* `0230` and `2301`. If the
    dot-cut form (`230` -> `0230`) were offered before the dot-stripped one
    (`230.1` -> `2301`), the two labels would collapse onto one precinct and the
    county would quietly lose a row. So every base's direct and dot-stripped
    forms are offered first, and the lossy rewrites -- cut at the dot, take a
    trailing number -- only after all of those have missed.
    """
    seen, out = set(), []

    def add(*forms):
        for form in forms:
            form = (form or "").strip()
            if form and form not in seen:
                seen.add(form)
                out.append(form)

    def variants(b):
        # A dot or a hyphen inside an id is punctuation, not structure:
        # Galveston's '232.3' is TLC's '2323', and Matagorda's '01-A' and
        # Brooks's '03-S' are TLC's '001A' and '003S'.
        nodot = b.replace(".", "")
        nosep = nodot.replace("-", "")
        return (b, nodot, pad(nodot), nosep, pad(nosep))

    s = re.sub(r"\s+", " ", label.strip().upper())
    bases = []
    for b in (s.split(" - ")[0].strip() if " - " in s else None,
              PREFIX.sub("", s).strip(), s):
        if b and b not in bases:
            bases.append(b)

    for b in bases:                     # faithful readings first
        add(*variants(b))
    for b in bases:                     # then the lossy ones
        trimmed = re.sub(r"-\d+$", "", b)          # Dallas '1004-01' -> '1004'
        if trimmed != b:
            add(*variants(trimmed))
        if "." in b:                                # Ector '110.7' -> '0110'
            add(*variants(b.split(".")[0]))
        tail = re.search(r"(\d+)\s*$", b)           # 'BALD PRAIRIE 4' -> '0004'
        if tail and not b[0].isdigit():
            add(*variants(tail.group(1)))
    return out


def resolve(label, valid):
    """-> (prec_id, status): matched / no_tlc_match / countywide / unparsed.

    A label that parses cleanly but names a precinct TLC does not have is kept,
    not dropped: Nueces reports `103 - 01` and `130 - 01`, and TLC's primary
    file has no 0103 or 0130, which is real 26P-to-26G churn rather than a bad
    label. Dropping those rows would have cost Nueces 2,159 Governor votes and
    left the county total silently short.
    """
    if COUNTYWIDE.match(label.strip()):
        return "COUNTYWIDE", "countywide"
    forms = candidates(label)
    for cand in forms:
        if cand in valid:
            return cand, "matched"
    best = next((c for c in forms if re.match(r"^\d{4}$|^\d{3}[A-Z]$|^\d[A-Z]\d[A-Z]$", c)), "")
    return (best, "no_tlc_match") if best else ("", "unparsed")


def split_party(name):
    """'DEM Gina Hinojosa' -> ('Gina Hinojosa', 'DEM'). Party '' if absent."""
    s = re.sub(r"\s+", " ", name.strip())
    party = ""
    m = PARTY_LEAD.match(s)
    if m:
        party, s = m.group(1).upper(), s[m.end():]
    else:
        m = PARTY_TRAIL.search(s)
        if m:
            party, s = m.group(1).upper(), s[:m.start()]
    # Clarity writes 'Bradford "Brad" Hall'; the county PDFs drop the quotes.
    s = s.replace('"', "").replace("\u201c", "").replace("\u201d", "")
    s = re.sub(r"\s+", " ", s).strip(" .,-")
    if WRITE_IN.match(s):
        return "Write-in", party
    # Counties differ only in case, so title-case anything shouted, and leave
    # mixed-case names alone so 'McDonald' and "O'Brien" survive.
    if s and s == s.upper():
        s = " ".join(w.capitalize() for w in s.split())
    return ALIASES.get(s, s), party


def ivotes(s):
    try:
        return int(s)
    except (TypeError, ValueError):
        return 0


def find_contest(root, pattern):
    for c in root.findall(".//Contest"):
        text = c.get("text") or ""
        if re.search(pattern, text, re.I) and not NOT_THIS_RACE.search(text):
            return c
    return None


def county_rows(path, fips, valid):
    root = ET.parse(path).getroot()
    date = (root.findtext("ElectionDate") or "").strip()
    county = os.path.basename(path).replace("_detail.xml", "").replace("_", " ")
    rows, notes = [], []
    for race, pattern in RACES:
        contest = find_contest(root, pattern)
        if contest is None:
            notes.append(f"{race}: contest not in file")
            continue
        tally = defaultdict(lambda: defaultdict(int))   # prec -> candidate -> votes
        reported = defaultdict(int)                     # candidate -> Clarity total
        party_of = {}
        no_tlc, unparsed, countywide = set(), set(), 0
        status_of = {}
        for choice in contest.findall("Choice"):
            raw = (choice.get("text") or "").strip()
            name, party = split_party(raw)
            party_of[name] = party
            reported[name] += ivotes(choice.get("totalVotes"))
            for p in choice.findall(".//VoteType/Precinct"):
                label = p.get("name") or ""
                prec, status = resolve(label, valid)
                if status == "unparsed":
                    unparsed.add(label)
                    continue
                if status == "no_tlc_match":
                    no_tlc.add(prec)
                if status == "countywide":
                    countywide += 1
                status_of[prec] = status
                tally[prec][name] += ivotes(p.get("votes"))
        summed = defaultdict(int)
        for prec, by_cand in sorted(tally.items()):
            key = "" if prec == "COUNTYWIDE" or not fips else str(int(fips)) + prec
            for cand, votes in sorted(by_cand.items()):
                summed[cand] += votes
                rows.append({
                    "county": county, "fips3": fips, "precinct": prec,
                    "pctkey": key, "race": race, "candidate": cand,
                    "party": party_of.get(cand, ""), "votes": votes,
                    "tlc_match": status_of.get(prec, ""), "election_date": date,
                })
        off = {c: summed[c] - reported[c] for c in reported if summed[c] != reported[c]}
        if off:
            notes.append(f"{race}: total off by {off}")
        # Two different kinds of empty, and only one of them reconciles badly.
        # Lubbock stages a clean zero template -- precinctsReported=0, every
        # total 0 -- so the sums agree and nothing above fires. Hood reports 29
        # precincts and real county totals with every per-precinct value the
        # string 'N/A'. Both are unusable; say so rather than let a county of
        # zeros read as a county that voted.
        if not sum(summed.values()):
            notes.append(f"{race}: STAGED BUT EMPTY, no votes published "
                         f"(precinctsReported="
                         f"{contest.get('precinctsReported') or '?'})")
        if no_tlc:
            notes.append(f"{race}: {len(no_tlc)} precinct(s) absent from TLC 26P, "
                         f"kept anyway: {sorted(no_tlc)[:4]}")
        if unparsed:
            notes.append(f"{race}: {len(unparsed)} unparseable label(s), dropped, "
                         f"e.g. {sorted(unparsed)[:3]}")
        if countywide:
            notes.append(f"{race}: {countywide} countywide ballot-type row(s)")
    return county, date, rows, notes


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--files", default=DEFAULT_FILES)
    ap.add_argument("--out", default=os.path.join(HERE, "gov_senate_precinct_2026.csv"))
    ap.add_argument("--dbf", default=DEFAULT_DBF)
    ap.add_argument("--date", default="11/3/2026",
                    help="only keep files for this ElectionDate ('' for any)")
    ap.add_argument("--also", action="append", default=[], metavar="CSV",
                    help="fold in a county CSV already parsed from a PDF by "
                         "parse_precinct_pdf.py (repeatable)")
    args = ap.parse_args()

    fips = fips_by_county()
    tlc = precincts_by_fips(args.dbf)
    all_rows, summary = [], []
    for name in sorted(f for f in os.listdir(args.files) if f.endswith("_detail.xml")):
        county_key = name.replace("_detail.xml", "").replace("_", " ").lower()
        code = fips.get(county_key, "")
        try:
            county, date, rows, notes = county_rows(
                os.path.join(args.files, name), code, tlc.get(code, set()))
        except ET.ParseError as exc:
            summary.append((name, "", 0, 0, 0, f"parse error: {exc}"))
            continue
        if args.date and date != args.date:
            summary.append((county, date, 0, 0, 0,
                            f"skipped: file is for {date or 'unknown date'}"))
            continue
        precs = {r["precinct"] for r in rows if r["precinct"] != "COUNTYWIDE"}
        voted = {r["precinct"] for r in rows if r["votes"] and r["precinct"] != "COUNTYWIDE"}
        all_rows.extend(rows)
        summary.append((county, date, len(precs), len(voted),
                        len(tlc.get(code, ())), "; ".join(notes)))

    for extra in args.also:
        # Folding the output file into itself doubles every row. A shell glob
        # of *_precinct_2026.csv matches gov_senate_precinct_2026.csv too, and
        # that produced 95,924 rows from 47,962.
        if os.path.abspath(extra) == os.path.abspath(args.out):
            print(f"skipping {os.path.basename(extra)}: that is the output file")
            continue
        with open(extra, newline="") as fh:
            added = list(csv.DictReader(fh))
        for r in added:
            r["candidate"], party = split_party(r["candidate"])
            r["party"] = r.get("party") or party
        kept = [r for r in added if not args.date
                or r.get("election_date") == args.date]
        all_rows.extend(kept)
        counties_added = sorted({r["county"] for r in kept})
        summary.append((", ".join(counties_added) or os.path.basename(extra),
                        args.date, len({r["precinct"] for r in kept}),
                        len({r["precinct"] for r in kept if int(r["votes"])}), 0,
                        f"folded in from {os.path.basename(extra)}"))

    # Only some counties print the party next to the name, so fill it in from
    # the counties that do -- a candidate's party is the same statewide.
    known = {}
    for r in all_rows:
        if r["party"]:
            known.setdefault((r["race"], r["candidate"]), r["party"])
    for r in all_rows:
        if not r["party"]:
            r["party"] = known.get((r["race"], r["candidate"]), "")

    fields = ["county", "fips3", "precinct", "pctkey", "race", "candidate", "party",
              "votes", "tlc_match", "election_date"]
    with open(args.out, "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=fields)
        w.writeheader()
        w.writerows(all_rows)

    print(f"{'county':13s} {'date':10s} {'prec':>5s} {'voted':>5s} {'TLC':>5s}  notes")
    for county, date, precs, voted, total, note in summary:
        print(f"{county:13s} {date:10s} {precs:5d} {voted:5d} {total:5d}  {note}")
    counties = {r["county"] for r in all_rows}
    print(f"\n{len(all_rows)} rows, {len(counties)} counties, "
          f"{len({(r['county'], r['precinct']) for r in all_rows})} precincts -> {args.out}")
    # ballot_board rows (Collin's 20 'LB nn' limited-ballot boards) and
    # COUNTYWIDE rows are meant to have no PCTKEY; anything else missing one is
    # a real problem.
    nokey = {r["county"] for r in all_rows
             if not r["pctkey"] and r["precinct"] != "COUNTYWIDE"
             and r.get("tlc_match") != "ballot_board"}
    if nokey:
        print(f"WARNING: no PCTKEY for {sorted(nokey)}", file=sys.stderr)


if __name__ == "__main__":
    main()
