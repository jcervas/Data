#!/usr/bin/env python3
"""Parse a "Precinct Results Report" PDF into the same rows as
`extract_gov_sen.py`, so county-hosted PDFs can sit beside the Clarity feeds.

This is the Hart/ES&S report layout, which several Texas counties publish --
Brazoria is the first one whose November 3, 2026 file appeared. It needs a text
layer, which not every county's export has: Collin's November report is the same
report rasterized into 50x5 pixel tiles with no text at all, and nothing here
can read that.

The layout, via `pdftotext -layout`, repeats a page header, then per precinct:

    1                                   2,180 of 4,827 registered voters = 45.16%

    Governor
    Choice             Party   Absentee Voting   Early Voting   Election Day   Total
    Greg Abbott        REP      29   44.62%     994   58.37%    207  51.36%   1,230  56.66%
    ...
                       Cast Votes:    65  100.00%  1,703 100.00%  403 100.00%  2,171 100.00%

The precinct heading repeats on every page, so the precinct is re-declared
rather than carried, and only the final "Total" column is kept.

    ./parse_precinct_pdf.py brazoria [--pdf FILE] [--out CSV]
"""
import argparse, csv, os, re, shutil, subprocess, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from extract_gov_sen import resolve
from tlc_precincts import precincts_by_fips, DEFAULT_DBF

HERE = os.path.dirname(os.path.abspath(__file__))

# county -> fips3, display name, glob for the downloaded file, and which
# report layout it publishes.
COUNTIES = {
    "brazoria": ("39", "Brazoria", "brazoria_6392934*.pdf", "hart"),
    # Collin's is a JasperReports "Precinct Summary": one TOTAL column instead
    # of Hart's absentee/early/election-day split, party as a row prefix, and
    # write-ins collapsed into a single "Write-In Totals" line.
    "collin": ("85", "Collin", "collin_precinct_nov2026*.pdf", "jasper"),
    # Small counties that publish the same Hart report. Found on 2026-11-04 by
    # discover_county_sites.py: their results pages had simply never been
    # located, which is why they looked like counties that had not published.
    "brooks": ("47", "Brooks", "brooks_nov2026_*.pdf", "hart"),
    "dawson": ("115", "Dawson", "dawson_nov2026_*.pdf", "hart"),
    "jim hogg": ("247", "Jim Hogg", "jim_hogg_nov2026_*.pdf", "hart"),
    "lipscomb": ("295", "Lipscomb", "lipscomb_nov2026_*.pdf", "hart"),
    "matagorda": ("321", "Matagorda", "matagorda_nov2026_*.pdf", "hart"),
    "fayette": ("149", "Fayette", "fayette_nov2026_*.pdf", "ew"),
    "hemphill": ("211", "Hemphill", "hemphill_nov2026_*.pdf", "ew"),
    # Scanned reports: same Electionware layout, but image-only, so they need
    # --ocr. Accept a county only if its TOTAL == absentee+early+election-day
    # rows all check out; Cochran's hand-ruled grid fails that badly.
    "briscoe": ("45", "Briscoe", "briscoe_nov2026_*", "ew"),
    "cochran": ("79", "Cochran", "cochran_nov2026_*", "ew"),
    "collingsworth": ("87", "Collingsworth", "collingsworth_nov2026_*", "ew"),
    "hockley": ("219", "Hockley", "hockley_nov2026_*", "ew"),
    "lampasas": ("281", "Lampasas", "lampasas_nov2026_*", "ew"),
    "madison": ("313", "Madison", "madison_nov2026_*", "ew"),
    "maverick": ("323", "Maverick", "maverick_nov2026_*", "ew"),
    "mcmullen": ("311", "McMullen", "mcmullen_nov2026_*", "ew"),
    "pecos": ("371", "Pecos", "pecos_nov2026_*", "ew"),
    "san augustine": ("405", "San Augustine", "san_augustine_nov2026_*", "ew"),
    "swisher": ("437", "Swisher", "swisher_nov2026_*", "ew"),
    "wilson": ("493", "Wilson", "wilson_nov2026_*", "ew"),
}
RACES = {"governor": "governor", "u.s. senator": "us_senate",
         "us senator": "us_senate", "united states senator": "us_senate"}

PRECINCT = re.compile(r"^(\S+)\s{2,}[\d,]+ of [\d,]+ registered voters")
# Jasper layout: 'PCT 139' heading, then 'REP Greg Abbott   312  24.47%' rows.
# Collin reports two kinds of unit and only one of them is a place: 267 'PCT nnn'
# election precincts and 20 'LB nn' limited-ballot boards. Matching only PCT
# leaves every LB block attributed to whichever precinct came last -- that put
# 2,531 stray votes into precinct 0271, which should hold 618.
J_UNIT = re.compile(r"^(PCT|LB)\s+(\S+)\s*$")
# When a unit cast no votes at all, the report drops the percentage column, so
# the percent group has to be optional or three whole precincts vanish.
J_CANDIDATE = re.compile(r"^(?:(REP|DEM|LIB|GRN|IND)\s+)?(\S.*?)\s{2,}"
                         r"([\d,]+)(?:\s+[\d.]+%)?\s*$")
J_STOP = ("Total Votes Cast", "Overvotes", "Undervotes", "Contest Totals")
J_RACES = {"governor": "governor", "united states senator": "us_senate",
           "u.s. senator": "us_senate", "us senator": "us_senate"}

# A third layout: Electionware's "Summary Results Report" broken out by
# precinct, as Fayette and Hemphill publish it. Same report family as Collin's
# but the columns are TOTAL first and then Absentee / Early / Election Day,
# with no percentage column at all, so a candidate line carries four numbers
# and the first one is the total. The precinct heading is either
# "Precinct 101 North" or a bare "101", and what identifies it in both cases is
# that a "Statistics" block follows it.
EW_HEAD = re.compile(r"^\s{0,8}(?:Precinct\s+)?([0-9][0-9A-Za-z.\-]*)(?:\s+\S.*)?$")
EW_CAND = re.compile(r"^(?:(REP|DEM|LIB|GRN|IND)\s+)?(\S.*?)\s{2,}"
                     r"([\d,]+)((?:\s+[\d,]+)*)\s*$")
# OCR collapses the column gaps to single spaces, so the text-PDF pattern above
# matches nothing on a scan. This variant accepts single spacing but demands
# the strong shape of a real data row -- a name then exactly four integers --
# which is also what makes the TOTAL checksum meaningful.
EW_CAND_OCR = re.compile(r"^(?:(REP|DEM|LIB|GRN|IND)\s+)?(\S.*?)[\s:;.]+"
                         r"([\d,]+)\s+([\d,]+)\s+([\d,]+)\s+([\d,]+)\s*$")
EW_STOP = ("Total Votes Cast", "Overvotes", "Undervotes", "Contest Totals",
           "Statistics", "Registered Voters", "Ballots Cast", "Voter Turnout")
COLUMNS = re.compile(r"^Choice\s+Party\s")
TERMINATOR = re.compile(r"^\s*(Cast Votes|Undervotes|Overvotes):")
# 'Greg Abbott  REP  29  44.62%  994  58.37%  207  51.36%  1,230  56.66%'
CANDIDATE = re.compile(r"""^(?P<name>\S.*?)\s{2,}
                           (?P<party>REP|DEM|LIB|GRN|IND)?\s*
                           (?P<nums>(?:[\d,]+\s+[\d.]+%\s*){4})$""", re.X)
NUMBER = re.compile(r"[\d,]+(?=\s)")
HEADER_NOISE = re.compile(
    r"Precinct Results Report|Unofficial Results|County$|Registered Voters"
    r"|Polling Places Reporting|Run Time|Run Date|^Page \d+$|=\s*[\d.]+%$"
    r"|General Election|Joint Election|^\d{1,2}/\d{1,2}/\d{4}$")


def to_int(s):
    return int(s.replace(",", ""))


OTHER_STATES = (
    "Alabama Alaska Arizona Arkansas California Colorado Connecticut Delaware "
    "Florida Georgia Hawaii Idaho Illinois Indiana Iowa Kansas Kentucky "
    "Louisiana Maine Maryland Massachusetts Michigan Minnesota Mississippi "
    "Missouri Montana Nebraska Nevada Ohio Oklahoma Oregon Pennsylvania "
    "Tennessee Utah Vermont Virginia Washington Wisconsin Wyoming").split()


def wrong_document(text, county):
    """Say why this file is not `county`, Texas -- or None if it looks right.

    The discovery crawl found `knoxcounty.org` for Knox County and happily
    downloaded a "Precinct Results Report" for **Knox County, Tennessee**,
    Marsha Blackburn for Governor and all. A county name alone does not
    identify a county, and a wrong-state file parses perfectly: it would have
    put Tennessee votes into a Texas table with no error anywhere.

    The test is deliberately narrow, because plenty of genuine Texas reports
    never print the state -- Brazoria's header is just "Brazoria County". So
    this rejects a file that names *another* state, not one that names none.
    """
    head = re.sub(r"\s+", " ", text[:4000])
    if not re.search(r"\btexas\b|\bTX\b", head, re.I):
        for state in OTHER_STATES:
            if re.search(rf"\b{state}\b", head):
                return f"names {state}, not Texas"
    if not re.search(re.escape(county.split()[0]), head, re.I):
        return f"does not mention {county}"
    return None


def ocr_text(path, dpi=300):
    """Rasterize and OCR a scanned report.

    Only worth doing for the Electionware layout, and only because that layout
    carries its own checksum: every candidate row prints TOTAL alongside
    Absentee, Early and Election Day, so `TOTAL == the other three` validates
    the OCR row by row. Swisher's scan reads perfectly that way; Cochran's
    hand-ruled grid does not, and the checksum is what tells them apart
    instead of a guess about scan quality.
    """
    import glob as _glob, subprocess as _sp, tempfile
    for tool in ("pdftoppm", "tesseract"):
        if not shutil.which(tool):
            sys.exit(f"{tool} not found; needed to read a scanned report")
    with tempfile.TemporaryDirectory() as tmp:
        stem = os.path.join(tmp, "pg")
        _sp.run(["pdftoppm", "-r", str(dpi), "-gray", "-png", path, stem],
                check=True, capture_output=True)
        out = []
        for page in sorted(_glob.glob(stem + "*.png")):
            r = _sp.run(["tesseract", page, "-", "--psm", "6"],
                        capture_output=True)
            out.append(r.stdout.decode("utf-8", "replace"))
        return "\f".join(out)


def pdf_text(path):
    """`pdftotext -layout`, which is what keeps the columns apart."""
    try:
        out = subprocess.run(["pdftotext", "-layout", path, "-"],
                             capture_output=True, check=True)
    except FileNotFoundError:
        sys.exit("pdftotext not found (brew install poppler)")
    except subprocess.CalledProcessError as exc:
        sys.exit(f"pdftotext failed on {path}: {exc.stderr.decode()[:200]}")
    return out.stdout.decode("utf-8", "replace")


def parse(text, fips, county, valid, election_date):
    """-> (rows, problems). One row per precinct/race/candidate."""
    rows, problems = [], []
    prec = race = None
    in_table = False
    tally = {}          # (prec, race) -> {candidate: (party, votes)}
    cast = {}           # (prec, race) -> the report's own Cast Votes total
    for line in text.splitlines():
        if not line.strip():
            continue
        # The precinct heading ends in '= 45.16%', which the header filter below
        # also matches, so claim it first.
        m = PRECINCT.match(line)
        if m:
            prec, race, in_table = m.group(1), None, False
            continue
        if HEADER_NOISE.search(line):
            continue
        if COLUMNS.match(line):
            in_table = race is not None
            continue
        m = TERMINATOR.match(line)
        if m:
            if m.group(1) == "Cast Votes" and race and prec:
                nums = NUMBER.findall(line.split(":", 1)[1])
                if len(nums) >= 4:
                    cast[(prec, race)] = to_int(nums[3])
            in_table = False
            continue
        if in_table:
            m = CANDIDATE.match(line)
            if m:
                nums = NUMBER.findall(m.group("nums") + " ")
                if len(nums) < 4:
                    problems.append(f"{prec}/{race}: unreadable row {line[:48]!r}")
                    continue
                name = re.sub(r"\s*\(W\)$", "", m.group("name")).strip()
                key = (prec, race)
                tally.setdefault(key, {})[name] = (m.group("party") or "",
                                                   to_int(nums[3]))
            elif not line.startswith(" "):
                in_table = False
            continue
        # A bare line between tables is a contest heading.
        head = line.strip().lower().rstrip(":")
        if head in RACES:
            race, in_table = RACES[head], False
        elif not line.startswith(" "):
            race = None

    for (prec, race), by_cand in sorted(tally.items()):
        if prec is None:
            problems.append(f"{race}: rows before any precinct heading, dropped")
            continue
        # Same TLC-validated normalizer as the Clarity path: these reports
        # write '03-S' and '01-A' where TLC has '003S' and '001A', and padding
        # without checking leaves every such precinct unjoined.
        resolved, status = resolve(prec, valid)
        padded = resolved or prec.rjust(4, "0")
        matched = status == "matched"
        if not matched:
            problems.append(f"precinct {prec!r} -> {padded} not in TLC 26P")
        total = sum(v for _, v in by_cand.values())
        reported = cast.get((prec, race))
        if reported is not None and total != reported:
            problems.append(f"{padded}/{race}: summed {total} vs "
                            f"Cast Votes {reported}")
        for cand, (party, votes) in sorted(by_cand.items()):
            rows.append({
                "county": county, "fips3": fips, "precinct": padded,
                "pctkey": str(int(fips)) + padded, "race": race,
                "candidate": cand, "party": party, "votes": votes,
                "tlc_match": "matched" if matched else "no_tlc_match",
                "election_date": election_date,
            })
    return rows, problems


def parse_jasper(text, fips, county, valid, election_date):
    """Parse the JasperReports 'Precinct Summary' layout (Collin).

    Reconciles each precinct/race against the block's own 'Total Votes Cast'
    line, which is what catches a page lost to a truncated download.
    """
    rows, problems = [], []
    prec = race = None
    tally, cast = {}, {}
    for line in text.splitlines():
        m = J_UNIT.match(line)
        if m:
            kind, ident = m.groups()
            # An LB board's votes are real and in the county total, but they
            # belong to no precinct, so they are kept under their own id and
            # never joined to geography.
            prec = ident if kind == "PCT" else f"LB{ident}"
            race = None
            continue
        head = line.strip()
        key = head.lower().rstrip(":")
        if key in J_RACES:
            race = J_RACES[key]
            continue
        if race is None or prec is None:
            continue
        if head.startswith(J_STOP):
            if head.startswith("Total Votes Cast"):
                nums = re.findall(r"[\d,]+", head[len("Total Votes Cast"):])
                if nums:
                    cast[(prec, race)] = to_int(nums[0])
            race = None
            continue
        if head.startswith("Vote For") or ("TOTAL" in head and "VOTE %" in head):
            continue
        m = J_CANDIDATE.match(line)
        if m:
            name = m.group(2).strip()
            if name.lower().startswith("write-in"):
                name = "Write-in"
            tally.setdefault((prec, race), {})[name] = (m.group(1) or "",
                                                        to_int(m.group(3)))

    for (prec, race), by_cand in sorted(tally.items()):
        is_board = prec.startswith("LB")
        padded = prec if is_board else prec.rjust(4, "0")
        matched = (not is_board) and padded in valid
        if is_board:
            status = "ballot_board"
        elif matched:
            status = "matched"
        else:
            status = "no_tlc_match"
            problems.append(f"precinct {padded} absent from TLC 26P")
        total = sum(v for _, v in by_cand.values())
        reported = cast.get((prec, race))
        if reported is not None and total != reported:
            problems.append(f"{padded}/{race}: summed {total} vs "
                            f"Total Votes Cast {reported}")
        for cand, (party, votes) in sorted(by_cand.items()):
            rows.append({
                "county": county, "fips3": fips, "precinct": padded,
                "pctkey": "" if is_board else str(int(fips)) + padded,
                "race": race, "candidate": cand, "party": party,
                "votes": votes, "tlc_match": status,
                "election_date": election_date,
            })
    missing = sorted(valid - {r["precinct"] for r in rows})
    if missing:
        problems.append(f"{len(missing)} TLC precinct(s) absent from the "
                        f"report: {missing[:8]}")
    return rows, problems


def parse_ew_summary(text, fips, county, valid, election_date):
    """Electionware "Summary Results Report" broken out by precinct."""
    lines = text.splitlines()
    rows, problems, checks = [], [], []
    prec = race = None
    tally, cast = {}, {}

    def next_nonblank(i, n=5):
        out = []
        for nxt in lines[i + 1:i + 1 + 12]:
            if nxt.strip():
                out.append(nxt.strip())
                if len(out) >= n:
                    break
        return out

    for i, line in enumerate(lines):
        head = line.strip()
        m = EW_HEAD.match(line)
        # Fayette writes "Precinct 101 North" and Hemphill a bare "101"; what
        # marks either as a precinct heading is the Statistics block under it,
        # which in Fayette sits below the column header rather than directly
        # beneath.
        if m and any(x.startswith("Statistics") for x in next_nonblank(i)):
            prec, race = m.group(1), None
            continue
        # Every contest heading is followed by "Vote For n". Hemphill prints no
        # "Total Votes Cast" line at all, so a parser that only resets on a
        # terminator keeps the previous race open and piles every later
        # contest into it -- Governor came out at 28,226 votes in a county of
        # 3,000. Treating the heading itself as the boundary fixes that, and
        # needs no terminator to exist.
        following = next_nonblank(i, 1)
        if following and following[0].startswith("Vote For"):
            race = J_RACES.get(head.lower().rstrip(":"))
            continue
        if race is None or prec is None:
            continue
        if head.startswith(EW_STOP):
            if head.startswith("Total Votes Cast"):
                nums = re.findall(r"[\d,]+", head[len("Total Votes Cast"):])
                if nums:
                    cast[(prec, race)] = to_int(nums[0])
            race = None
            continue
        if head.startswith("Vote For") or "TOTAL" in head:
            continue
        m = EW_CAND.match(line)
        ocr = False
        if not m:
            m = EW_CAND_OCR.match(line)
            ocr = bool(m)
        if m:
            name = m.group(2).strip()
            if name.lower().startswith("write-in"):
                name = "Write-in"
            total = to_int(m.group(3))
            if ocr:
                parts = [to_int(m.group(i)) for i in (4, 5, 6)]
            else:
                parts = [to_int(x) for x in m.group(4).split()] if m.group(4) else []
            # TOTAL should equal Absentee + Early + Election Day. On a text
            # PDF this is a free sanity check; on an OCR'd scan it is the
            # thing that decides whether the county is usable at all.
            if len(parts) == 3 and sum(parts) != total:
                checks.append(f"{prec}/{race} {name}: {total} != "
                              f"{'+'.join(map(str, parts))}")
            tally.setdefault((prec, race), {})[name] = (m.group(1) or "", total)

    for (prec, race), by_cand in sorted(tally.items()):
        resolved, status = resolve(prec, valid)
        padded = resolved or prec.rjust(4, "0")
        if status != "matched":
            problems.append(f"precinct {prec!r} -> {padded} not in TLC 26P")
        total = sum(v for _, v in by_cand.values())
        reported = cast.get((prec, race))
        if reported is not None and total != reported:
            problems.append(f"{padded}/{race}: summed {total} vs "
                            f"Total Votes Cast {reported}")
        for cand, (party, votes) in sorted(by_cand.items()):
            rows.append({
                "county": county, "fips3": fips, "precinct": padded,
                "pctkey": str(int(fips)) + padded, "race": race,
                "candidate": cand, "party": party, "votes": votes,
                "tlc_match": status, "election_date": election_date,
            })
    if checks:
        problems.append(f"{len(checks)} row(s) where TOTAL does not equal "
                        f"absentee+early+election day, e.g. {checks[:3]}")
    missing = sorted(valid - {r["precinct"] for r in rows})
    if missing:
        problems.append(f"{len(missing)} TLC precinct(s) absent from the "
                        f"report: {missing[:8]}")
    return rows, problems


PARSERS = {"hart": parse, "jasper": parse_jasper, "ew": parse_ew_summary}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("county", choices=sorted(COUNTIES))
    ap.add_argument("--pdf", help="override the downloaded file to read")
    ap.add_argument("--files", default=os.path.expanduser("~/tx-2026-enr/files"))
    ap.add_argument("--dbf", default=DEFAULT_DBF)
    ap.add_argument("--date", default="11/3/2026")
    ap.add_argument("--out", help="default: <county>_precinct_2026.csv here")
    ap.add_argument("--ocr", action="store_true",
                    help="rasterize and OCR the file (for scanned reports)")
    args = ap.parse_args()

    fips, name, pattern, layout = COUNTIES[args.county]
    path = args.pdf
    if not path:
        import glob
        hits = sorted(glob.glob(os.path.join(args.files, pattern)))
        if not hits:
            sys.exit(f"no file matching {pattern} in {args.files}")
        path = hits[-1]
    slug = args.county.replace(" ", "_")
    out = args.out or os.path.join(HERE, f"{slug}_precinct_2026.csv")

    valid = precincts_by_fips(args.dbf).get(fips, set())
    text = ocr_text(path) if args.ocr else pdf_text(path)
    bad = wrong_document(text, name)
    if bad:
        sys.exit(f"refusing {os.path.basename(path)}: {bad}")
    rows, problems = PARSERS[layout](text, fips, name, valid, args.date)

    # An OCR'd report that fails its own arithmetic is not publishable, and
    # writing the CSV anyway invites someone to merge it. Briscoe's scan reads
    # "Greg Abbott: 19" where the columns say 7+8+11, and its precinct totals
    # come out 2-3x off. Refuse rather than hand over numbers that look fine.
    broken = [p for p in problems if "does not equal" in p or " vs " in p]
    if args.ocr and broken:
        for p in broken:
            print(f"  ! {p}")
        sys.exit(f"refusing to write {os.path.basename(out)}: the OCR of "
                 f"{os.path.basename(path)} does not reconcile against the "
                 f"report's own totals")

    fields = ["county", "fips3", "precinct", "pctkey", "race", "candidate",
              "party", "votes", "tlc_match", "election_date"]
    with open(out, "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=fields)
        w.writeheader()
        w.writerows(rows)

    precs = {r["precinct"] for r in rows}
    print(f"{name}: {len(rows)} rows, {len(precs)} precincts "
          f"(TLC has {len(valid)}), from {os.path.basename(path)}")
    for race in sorted({r["race"] for r in rows}):
        sub = [r for r in rows if r["race"] == race]
        print(f"  {race:10s} {len({r['precinct'] for r in sub}):3d} precincts, "
              f"{sum(r['votes'] for r in sub):,} votes")
    if problems:
        print(f"\n{len(problems)} problem(s):")
        for p in sorted(set(problems))[:12]:
            print(f"  - {p}")
    print(f"\n-> {out}")


if __name__ == "__main__":
    main()
