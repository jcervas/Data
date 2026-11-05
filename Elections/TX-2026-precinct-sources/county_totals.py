#!/usr/bin/env python3
"""Countywide Governor and U.S. Senator totals for every county we can get
them from, however coarse the source.

Precinct data is better and this does not replace it: where a county is in
`gov_senate_precinct_2026.csv` the county total is *derived* by summing those
precincts, and the row is labeled so. Everywhere else it comes from whatever
the county published -- usually a "Cumulative Results Report" or a countywide
"Summary Results Report", which plenty of counties post on election night
while their precinct breakdown waits for the canvass.

That is the point: Harris published a cumulative report with 1,392,280 votes
in it on election night and no precinct file at all. Counting it countywide is
the difference between having Texas's largest county and not.

Layouts handled:

- **Hart / Electionware cumulative** (Harris, Concho, Deaf Smith, Floyd,
  Llano, Brazos, Nacogdoches): a candidate line carries one `number percent%`
  pair per voting method and the **last pair is the total**, so the parser
  takes the last rather than counting columns -- Concho prints four pairs,
  Harris six.
- **Electionware summary, TOTAL first** (Terry, Swisher, Wilson): no
  percentages; the first number is the total.
- **Secretary of State county report** (Blanco): a wide table whose last
  column is "Total Voters".

    ./county_totals.py [--out county_totals_2026.csv]
"""
import argparse, csv, glob, os, re, sys
from collections import defaultdict

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from extract_gov_sen import RACES, split_party
from parse_precinct_pdf import ocr_text, pdf_text, wrong_document

HERE = os.path.dirname(os.path.abspath(__file__))
FILES = os.path.expanduser("~/tx-2026-enr/files")

# county -> (fips3, display name, filename glob)
COUNTYWIDE = {
    "harris": ("201", "Harris", "harris_cumulative.pdf"),
    "concho": ("95", "Concho", "concho_nov2026_*"),
    "deaf smith": ("117", "Deaf Smith", "deaf_smith_nov2026_*"),
    "floyd": ("153", "Floyd", "floyd_nov2026_*"),
    "llano": ("299", "Llano", "llano_nov2026_*"),
    "terry": ("445", "Terry", "terry_nov2026_results.pdf"),
    "blanco": ("31", "Blanco", "blanco_nov2026_*"),
    "brazos": ("41", "Brazos", "brazos_Unofficial-Cumulative-Results-11-3-2026.pdf"),
}

# Countywide reports published as image-only scans. OCR is far more tractable
# here than per precinct -- a handful of rows instead of hundreds -- and the
# report's own "Cast Votes" line checks the result, so a bad read is caught
# rather than published.
SCANNED = {
    "swisher": ("437", "Swisher", "swisher_nov2026_*"),
    "wilson": ("493", "Wilson", "wilson_nov2026_*"),
    "san augustine": ("405", "San Augustine", "san_augustine_nov2026_*"),
    "culberson": ("109", "Culberson", "culberson_nov2026_*"),
    "nacogdoches": ("347", "Nacogdoches", "nacogdoches_nov2026_*"),
    "sterling": ("431", "Sterling", "sterling_nov2026_*"),
}

# 'Governor - Vote for none or one', 'Governor', 'U.S. Senator'
HEADING = re.compile(r"^\s{0,10}([A-Z][^|]{2,60}?)(?:\s+-\s+Vote for.*)?\s*$")
PAIR = re.compile(r"([\d,]+)\s+[\d.]+%")
# name, optional party, then the numbers
CAND = re.compile(r"^\s{0,6}(\S.*?)\s{2,}(REP|DEM|LIB|GRN|IND)?\s*((?:[\d,]+\s+[\d.]+%\s*)+)$")
EW_CAND = re.compile(r"^(?:(REP|DEM|LIB|GRN|IND)\s+)?(\S.*?)\s{2,}([\d,]+)(?:\s+[\d,]+)*\s*$")
# The SOS report fills the office column only on an office's first row, so a
# row can be "GOVERNOR  GREG ABBOTT  ...numbers" or just "GINA HINOJOSA
# ...numbers". Capturing the whole prefix produced a candidate called
# "Governor Greg Abbott" with Blanco's 5,487 votes attached.
# One regex for both row shapes: the office column is filled only on an
# office's first row, so it is an optional capture, and the race carries down
# to the rows beneath. Treating a bare candidate row as an office line instead
# closed the race on every continuation row and left Blanco with one candidate.
SOS_ROW = re.compile(r"^\s*(?:([A-Z][A-Z.\s]{3,40}?)\s{2,})??"
                     r"([A-Z][A-Za-z.'\"\- ]+?)\s{2,}"
                     r"(?:[\d,]+\s+){4}([\d,]+)\s*$")
STOP = ("Cast Votes", "Undervotes", "Overvotes", "Contest Totals",
        "Total Votes Cast", "Choice", "Statistics")


def county_fips():
    """county name -> 3-digit FIPS, from the inventory."""
    out = {}
    with open(os.path.join(HERE, "tx_2026_precinct_sources.csv"), newline="") as fh:
        for r in csv.DictReader(fh):
            out[r["county"]] = str(int(r["fips"][-3:]))
    return out


def html_text(path):
    """Strip a saved results page to text the candidate parser can read."""
    raw = open(path, encoding="utf-8", errors="replace").read()
    raw = re.sub(r"<(script|style)\b.*?</\1>", " ", raw, flags=re.S | re.I)
    raw = re.sub(r"<br\s*/?>|</(tr|div|p|li|h[1-6])>", "\n", raw, flags=re.I)
    raw = re.sub(r"<[^>]+>", " ", raw)
    import html as _html
    raw = _html.unescape(raw)
    return "\n".join(re.sub(r"[ \t]+", " ", l).strip() for l in raw.splitlines())


def discover_countywide(files, skip):
    """{county: (fips, name, path)} for every <county>_nov2026_* we hold."""
    fips = county_fips()
    out = {}
    for county, code in sorted(fips.items()):
        if county in skip:
            continue
        slug = county.lower().replace(" ", "_").replace(".", "")
        hits = sorted(glob.glob(os.path.join(files, f"{slug}_nov2026_*")))
        hits = [h for h in hits
                if re.search(r"\.(pdf|html?)$", h, re.I)]
        if not hits:
            continue
        # Prefer a PDF with a text layer, then HTML, then whatever is left.
        def rank(h):
            if h.lower().endswith(".html"):
                return 1
            return 0
        out[county.lower()] = (code, county, sorted(hits, key=rank)[0])
    return out


def to_int(s):
    return int(str(s).replace(",", ""))


def race_of(text):
    base = re.split(r"\s+-\s+Vote for", text)[0].strip().lower().rstrip(":")
    for race, pattern in RACES:
        if re.search(pattern, base, re.I) and not re.search(r"lieutenant|lt\.", base, re.I):
            return race
    return None


# Who is on the ballot for each race, learned from the counties whose precinct
# data we already have. Matching a row by its candidate rather than by the
# contest heading above it is the only thing that survives OCR: a scan's
# heading line comes through as "Official - 2026 November 3rd Precincts
# Reporting" while "GINA HINOJOSA DEM 382 50.20% ..." reads perfectly.
def candidate_races(precinct_csv):
    out = {}
    with open(precinct_csv, newline="") as fh:
        for r in csv.DictReader(fh):
            key = re.sub(r"[^a-z]", "", r["candidate"].lower())
            if key:
                out[key] = (r["race"], r["party"])
    return out


def parse_by_candidate(text, known):
    """Last resort for a scan: assign each row by the candidate it names.

    Only the party candidates are read from rows. The write-in figure is
    derived from the report's own `Total Votes Cast` line instead, because the
    itemized write-ins underneath it are a *breakdown* of it, not extra votes:
    Wilson prints `Write-In Totals 23` and then Jenn Mack 15, Mike Miller 1,
    Not Certified 7, which sum to the same 23. Adding both double-counted it,
    and the Governor-vs-Senate gap check waved that through at 0.05% because
    the error was small. Deriving the remainder from `Total Votes Cast` makes
    the county reconcile by construction, and a county with no readable total
    is rejected rather than guessed at.
    """
    out = defaultdict(dict)
    cast = {}
    order = []
    for line in text.splitlines():
        stripped = line.strip()
        # "Total Votes Cast 22,072" in a report, "Total votes: 20,755" on a
        # web results page.
        m = re.match(r"Total [Vv]otes(?: Cast)?:?\s+([\d,]+)", stripped)
        if m and order:
            cast.setdefault(order[-1], to_int(m.group(1)))
            continue
        nums = PAIR.findall(line)
        # A web results page writes the count as "81.7% (16,954 votes)", so the
        # percentage comes first and the votes sit in parentheses -- the
        # opposite order from every printed report.
        votes_phrase = re.findall(r"\(?([\d,]+)\s+votes\)?", line)
        head = re.split(r"\d", line, 1)[0]
        key = re.sub(r"[^a-z]", "", head.lower())
        if "writein" in key or "notassigned" in key or "notcertified" in key:
            continue
        hit = None
        for name, (race, party) in known.items():
            if len(name) > 6 and name in key:
                hit = (name, race, party)
                break
        if not hit:
            continue
        name, race, party = hit
        if not party:                       # only the party candidates
            continue
        if votes_phrase:
            total = to_int(votes_phrase[0])
        elif nums:
            total = to_int(nums[-1])
        else:
            bare = re.findall(r"\b[\d,]+\b", line)
            if not bare:
                continue
            total = to_int(bare[0])
        pretty = " ".join(w.capitalize() for w in re.findall(r"[A-Za-z]+", head))
        pretty = re.sub(r"^(Rep|Dem|Lib|Grn|Ind|R)\s+", "", pretty).strip()[:40]
        out[race][pretty or name] = (party, total)
        if race not in order:
            order.append(race)
        elif order[-1] != race:
            order.append(race)

    # Reconcile each race against the printed total; the remainder is write-ins.
    for race in list(out):
        reported = cast.get(race)
        if reported is None:
            del out[race]
            continue
        named = sum(v for _, v in out[race].values())
        remainder = reported - named
        if remainder < 0 or remainder > max(1, reported) * 0.05:
            del out[race]                   # does not reconcile; do not publish
            continue
        if remainder:
            out[race]["Write-in"] = ("", remainder)
    return out


def parse_html_results(text, known):
    """Read a web results page, where a candidate's count is not on their line.

    Hardin's app renders the name, the party and the share as separate
    elements, so after tag-stripping the page reads "Greg Abbott / Republican
    / 81.7% (16,954 votes)" across three lines and no single line carries both
    a name and a number. So this works over the whole text instead of line by
    line: for each candidate on the ballot, take the first "(N votes)" that
    follows their name closely.
    """
    flat = re.sub(r"\s+", " ", text)
    out = defaultdict(dict)
    for key, (race, party) in known.items():
        if len(key) <= 6 or not party:
            continue
        # rebuild a loose pattern from the normalized name
        pat = r"\s*".join(re.escape(ch) for ch in key)
        m = re.search(pat + r".{0,160}?\(?([\d,]+)\s+votes\)?", flat, re.I)
        if not m:
            continue
        pretty = " ".join(w.capitalize() for w in re.findall(r"[a-z]+", key))
        out[race][pretty] = (party, to_int(m.group(1)))
    return {r: c for r, c in out.items() if len(c) >= 2}


def parse_countywide(text):
    """-> ({race: {candidate: (party, votes)}}, notes).

    Each layout is detected and handled explicitly rather than by one
    permissive pass. The permissive version let a contest heading it did not
    recognize leave the previous race open, so Brazos's State Senator rows
    landed in US Senator and doubled it to 159,323 against a true 80,000 --
    the same failure that put 28,226 Governor votes in Hemphill.
    """
    lines = text.splitlines()
    out, notes = defaultdict(dict), []

    def prev_nonblank(i):
        for j in range(i - 1, max(-1, i - 6), -1):
            if lines[j].strip():
                return lines[j].strip()
        return ""

    hart = any(re.match(r"\s*Choice\s+Party\b", l) for l in lines)
    sos = any(re.search(r"Office Name\s+Candidate Name", l) for l in lines)

    if hart:
        race, cast = None, {}
        for i, line in enumerate(lines):
            if race and line.strip().startswith("Cast Votes"):
                pairs = PAIR.findall(line)
                if pairs:
                    cast[race] = to_int(pairs[-1])
            if re.match(r"\s*Choice\s+Party\b", line):
                # The contest name is the line above the column header, and a
                # name we do not recognize closes the previous contest.
                race = race_of(prev_nonblank(i))
                continue
            if line.strip().startswith(STOP):
                race = None
                continue
            if race:
                m = CAND.match(line)
                if m:
                    pairs = PAIR.findall(m.group(3))
                    if pairs:
                        name, party = split_party(m.group(1).strip())
                        out[race][name] = (m.group(2) or party, to_int(pairs[-1]))
        # The report prints its own Cast Votes total per contest; use it.
        for race, reported in cast.items():
            got = sum(v for _, v in out.get(race, {}).values())
            if got != reported:
                notes.append(f"{race}: candidates sum to {got:,} but the "
                             f"report's Cast Votes says {reported:,}")
        return out, notes

    if sos:
        # Split on runs of two or more spaces and work by position, which is
        # what this layout actually is: a wide table whose last five columns
        # are numbers and whose office column is filled only on an office's
        # first row. Trying to express that as one regex produced first a
        # candidate called "Governor Greg Abbott" and then nothing at all.
        race = None
        for line in lines:
            fields = [f for f in re.split(r"\s{2,}", line.strip()) if f]
            if len(fields) < 6:
                continue
            nums = fields[-5:]
            if not all(re.fullmatch(r"[\d,]+", f) for f in nums):
                continue
            cand = fields[-6]
            if len(fields) >= 7:
                race = race_of(fields[-7])
            if not race:
                continue
            name, party = split_party(cand)
            if name and not name.lower().startswith(("office", "candidate", "total")):
                out[race][name] = (party, to_int(nums[-1]))
        return out, notes

    # Electionware summary: contest name, then "Vote For n", then TOTAL first.
    race = None
    for i, line in enumerate(lines):
        head = line.strip()
        if head.startswith("Vote For"):
            race = race_of(prev_nonblank(i))
            continue
        if head.startswith(STOP) or "TOTAL" in head:
            continue
        if race:
            m = EW_CAND.match(line)
            if m:
                name, party = split_party(m.group(2).strip())
                if name:
                    out[race][name] = (m.group(1) or party, to_int(m.group(3)))
    return out, notes


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--precincts", default=os.path.join(HERE, "gov_senate_precinct_2026.csv"))
    ap.add_argument("--files", default=FILES)
    ap.add_argument("--out", default=os.path.join(HERE, "county_totals_2026.csv"))
    ap.add_argument("--date", default="11/3/2026")
    ap.add_argument("--auto", action="store_true",
                    help="also read any <county>_nov2026_* file we hold")
    ap.add_argument("--ocr", action="store_true",
                    help="also read the counties whose report is a scan")
    args = ap.parse_args()

    known_cands = candidate_races(args.precincts)
    registered = {}
    try:
        with open(os.path.join(HERE, "tx_counties_ranked.csv"), newline="") as fh:
            registered = {r["county"]: int(r["registered_voters"])
                          for r in csv.DictReader(fh)}
    except Exception:
        pass
    rows = []
    # 1. derived from precinct data, which is the better source
    have = defaultdict(lambda: defaultdict(int))
    party_of, fips_of = {}, {}
    with open(args.precincts, newline="") as fh:
        for r in csv.DictReader(fh):
            have[(r["county"], r["race"])][r["candidate"]] += int(r["votes"])
            party_of[r["candidate"]] = r["party"]
            fips_of[r["county"]] = r["fips3"]
    for (county, race), by_cand in sorted(have.items()):
        for cand, votes in sorted(by_cand.items()):
            rows.append({"county": county, "fips3": fips_of[county], "race": race,
                         "candidate": cand, "party": party_of.get(cand, ""),
                         "votes": votes, "level": "precinct-derived",
                         "source": os.path.basename(args.precincts)})
    print(f"{len({c for c, _ in have})} counties summed from precinct data")

    # 2. countywide-only counties
    todo = list(COUNTYWIDE.items())
    if args.ocr:
        todo += list(SCANNED.items())
    if args.auto:
        named = {v[1] for v in COUNTYWIDE.values()} | {v[1] for v in SCANNED.values()}
        extra = discover_countywide(args.files, named | {c for c, _ in have})
        todo += [(k, v) for k, v in extra.items()]
    for key, (fips, name, pattern) in sorted(todo):
        if name in {c for c, _ in have}:
            print(f"  {name:13s} skipped: precinct data already held")
            continue
        if os.path.sep in pattern:          # already a resolved path
            path = pattern
        else:
            hits = sorted(glob.glob(os.path.join(args.files, pattern)))
            if not hits:
                print(f"  {name:13s} no file matching {pattern}")
                continue
            path = hits[-1]
        if path.lower().endswith(".html"):
            # A saved results page: no layout to detect, so go straight to
            # matching rows by candidate.
            page = html_text(path)
            found = parse_by_candidate(page, known_cands) or \
                parse_html_results(page, known_cands)
            if not found:
                print(f"  {name:13s} nothing read from {os.path.basename(path)}")
                continue
            for race, by_cand in found.items():
                for cand, (party, votes) in by_cand.items():
                    rows.append({"county": name, "fips3": fips, "race": race,
                                 "candidate": cand, "party": party, "votes": votes,
                                 "level": "countywide",
                                 "source": os.path.basename(path)})
            print(f"  {name:13s} " + "  ".join(
                f"{r}={sum(v for _, v in c.values()):,}" for r, c in sorted(found.items()))
                  + "   [web results page]")
            continue
        # An empty text layer means a scan, not a mislabeled file: running the
        # county-name check on "" refused eleven counties for "not mentioning"
        # themselves when the real answer was "this needs OCR".
        scanned = key in SCANNED or not pdf_text(path).strip()
        if scanned:
            # Cache the OCR: tesseract takes minutes per county and the text
            # does not change between runs of this parser.
            cache = os.path.join(args.files, f".ocr-{os.path.basename(path)}.txt")
            if os.path.exists(cache):
                text = open(cache, encoding="utf-8").read()
            else:
                text = ocr_text(path)
                open(cache, "w", encoding="utf-8").write(text)
        else:
            text = pdf_text(path)
        if not text.strip():
            print(f"  {name:13s} scan with no text layer; needs --ocr")
            continue
        bad = wrong_document(text, name)
        if bad:
            print(f"  {name:13s} refused: {bad}")
            continue
        found, notes = parse_countywide(text)
        by_name = False
        if scanned and not found:
            found = parse_by_candidate(text, known_cands)
            by_name = bool(found)
            notes = ["read by candidate name from OCR, reconciled to the "
                     "report's own Total Votes Cast"] if found else []
        # Refuse on a real reconciliation failure. Deciding this from the text
        # of `notes` was a mistake: rewording the success message to drop the
        # word "provisional" turned it into a refusal and silently dropped
        # Wilson. The flag says what happened; the note only describes it.
        if notes and not by_name:
            print(f"  {name:13s} refused: {'; '.join(notes)}")
            continue
        if not found:
            print(f"  {name:13s} no Governor/Senate block read from "
                  f"{os.path.basename(path)}")
            continue
        # Governor and U.S. Senator are both top of the ballot, so their county
        # totals sit within about a percent of each other: across the 44
        # counties read from a verified source the gap never exceeds 1.53% and
        # averages 0.3%. That makes it a usable check on an OCR read with no
        # Cast Votes line to compare against -- and it rejects three of the
        # five: Nacogdoches came out 98% apart, Culberson 51%, San Augustine
        # 32%, while Swisher (0.17%) and Wilson (0.05%) look like real data.
        totals = {r: sum(v for _, v in c.values()) for r, c in found.items()}
        if scanned and len(totals) == 2:
            lo, hi = sorted(totals.values())
            if hi and (hi - lo) / hi > 0.02:
                print(f"  {name:13s} OCR rejected: governor and senate totals "
                      f"{lo:,} vs {hi:,} differ by "
                      f"{100*(hi-lo)/hi:.0f}%, far beyond the 1.5% seen in "
                      f"verified counties")
                continue
        elif scanned and len(totals) < 2:
            pass
        if scanned and len(totals) == 2:
            # A second, independent guard: implied turnout. The gap check
            # catches a read that went wrong in one race, this catches one
            # that went wrong in both by the same factor. Swisher lands at
            # 44.8% of its 3,834 registered and Wilson at 55.5% of 39,755,
            # which is what a Texas general election looks like.
            rv = registered.get(name, 0)
            turnout = max(totals.values()) / rv if rv else 0
            if rv and not 0.10 <= turnout <= 0.95:
                print(f"  {name:13s} OCR rejected: implies {100*turnout:.0f}% "
                      f"turnout of {rv:,} registered")
                continue
        if False:
            print(f"  {name:13s} OCR rejected: only {len(totals)} of the two "
                  f"races read")
            continue
        for race, by_cand in found.items():
            for cand, (party, votes) in by_cand.items():
                rows.append({"county": name, "fips3": fips, "race": race,
                             "candidate": cand, "party": party, "votes": votes,
                             "level": "countywide", "source": os.path.basename(path)})
        print(f"  {name:13s} " + "  ".join(
            f"{r}={sum(vv for _, vv in c.values()):,}" for r, c in sorted(found.items()))
              + ("   [" + "; ".join(notes) + "]" if notes else ""))

    # Some reports print no party column at all (the Secretary of State's own
    # county report is one), so fill it from the counties that do.
    known = {}
    for r in rows:
        if r["party"]:
            known.setdefault((r["race"], r["candidate"]), r["party"])
    for r in rows:
        if not r["party"]:
            r["party"] = known.get((r["race"], r["candidate"]), "")

    fields = ["county", "fips3", "race", "candidate", "party", "votes", "level", "source"]
    with open(args.out, "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=fields)
        w.writeheader()
        w.writerows(rows)
    counties = {r["county"] for r in rows}
    cw = {r["county"] for r in rows if r["level"] == "countywide"}
    print(f"\n{len(rows)} rows, {len(counties)} counties "
          f"({len(counties) - len(cw)} precinct-derived, {len(cw)} countywide) -> {args.out}")


if __name__ == "__main__":
    main()
