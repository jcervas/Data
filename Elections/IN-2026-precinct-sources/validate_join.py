#!/usr/bin/env python3
"""Join a county's precinct report to the 2026 precinct geography, and report
the match rate honestly.

Why this is a script and not a one-liner: the obvious join is wrong, and it is
wrong in the way that does not announce itself.

Nearly every Indiana county runs the same EMS, which prints a report headed
`Precinct ID: 003 / Precinct Name: Carpenter East`. The crosswalk built from
the state's own geography has `p26county = 00030`. Multiply the printed ID by
ten and you get 00030, and in Jasper County that arithmetic matches 29 of 29
precincts -- so it looks like the join rule. It is not. Crosswalk 00030 is
GILLAM; Carpenter East is 00210. The county's EMS numbers its precincts 1..N in
its own current alphabetical order, while the state's codes were allotted
earlier, in a different order, in steps of ten. The two sequences have the same
length and the same stride, so a sequential join lands on a real precinct every
time and silently attributes every county's votes to the wrong polygons.

The join that actually holds is the precinct NAME, after normalizing the
trailing number: the report says `Keener 1`, the crosswalk says `KEENER 01`.
On Jasper that is 29/29, bijective, with nothing left over on either side.

    ./validate_join.py report.pdf --county Jasper
    ./validate_join.py report.htm --county Delaware --fips3 035

Reads a PDF (via pdftotext, which must be on PATH) or an HTML/text report.
Exits non-zero if any precinct on either side goes unmatched, so it can gate a
harvest rather than just describe one.
"""
import argparse, csv, os, re, subprocess, sys, unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
CROSSWALK = os.path.join(HERE, "geo", "precinct_key_crosswalk.csv")
INVENTORY = os.path.join(HERE, "in_2026_precinct_sources.csv")

# "Precinct ID: 003" then "Precinct Name: Carpenter East". The PDF puts the two
# on separate lines and the HTML export puts them on one, so the separator is
# any whitespace; the name then runs to the end of the line or to the dashed
# rule the report draws above the vote columns.
PAIR = re.compile(r"Precinct\s+ID\s*:\s*(\S+)\s+Precinct\s+Name\s*:\s*"
                  r"(.+?)(?:\s*-\s*-\s*-|\n|$)", re.I)
# Delaware's web export labels the precinct inline instead: "01-PRECINCT 01".
INLINE = re.compile(r"^\s*(\d{1,4})\s*-\s*([A-Za-z0-9][^\n]{0,60})\s*$", re.M)
SUMMARY_ONLY = re.compile(r"Election\s+Summary\s+Report", re.I)
# Counties mark a precinct with no registered voters '(NV)'; the EMS omits it.
NO_VOTERS = re.compile(r"\(\s*NV\s*\)", re.I)
PRECINCT_REPORT = re.compile(r"Precinct\s+Summary\s+Report|Precinct\s+Results\s+Report", re.I)


def norm(s):
    """Uppercase, strip punctuation and accents, pad standalone 1-2 digit
    numbers to two digits. 'Keener 1' and 'KEENER 01' are one precinct."""
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = s.upper().replace(".", " ").replace("#", " ").replace("_", " ")
    s = re.sub(r"[^A-Z0-9 ]+", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return re.sub(r"\b(\d{1,2})\b", lambda m: m.group(1).zfill(2), s)


def text_of(path):
    if path.lower().endswith(".pdf"):
        try:
            out = subprocess.run(["pdftotext", "-layout", path, "-"],
                                 capture_output=True, check=True)
        except FileNotFoundError:
            sys.exit("pdftotext not found; install poppler or pass a text file")
        txt = out.stdout.decode("utf-8", "replace")
        if len(txt.strip()) < 200:
            sys.exit(f"{os.path.basename(path)} has no text layer -- it is a "
                     "photocopier scan. OCR it first. Known so far: Hendricks "
                     "and Marshall (Toshiba e-STUDIO), Wells (Ricoh MP C3004), "
                     "Tipton (PFU ScanSnap iX500) and LaGrange.")
        return txt
    raw = open(path, encoding="utf-8", errors="replace").read()
    if "<" in raw[:4000]:
        raw = re.sub(r"<(script|style)\b.*?</\1>", " ", raw, flags=re.S | re.I)
        raw = re.sub(r"<br\s*/?>|</(p|div|tr|h\d)>", "\n", raw, flags=re.I)
        raw = re.sub(r"<[^>]+>", " ", raw)
    return raw


def precincts_in(txt):
    """(printed id, printed name) pairs, in document order, deduplicated."""
    found = PAIR.findall(txt)
    if not found:
        found = [(m.group(1), m.group(2)) for m in INLINE.finditer(txt)]
    out, seen = [], set()
    for pid, name in found:
        pid, name = pid.strip(), re.sub(r"\s+", " ", name).strip()
        if not name or name.upper().startswith(("VOTE", "TOTAL", "PAGE")):
            continue
        if pid in seen:
            continue
        seen.add(pid)
        out.append((pid, name))
    return out


def fips3_for(county):
    with open(INVENTORY, newline="") as fh:
        for r in csv.DictReader(fh):
            if r["county"].lower() == county.lower():
                return r["fips3"]
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("report", help="county precinct report (.pdf, .htm, .txt)")
    ap.add_argument("--county", required=True)
    ap.add_argument("--fips3", help="override the county FIPS3 lookup")
    ap.add_argument("--crosswalk", default=CROSSWALK)
    args = ap.parse_args()

    fips3 = args.fips3 or fips3_for(args.county)
    if not fips3:
        sys.exit(f"no county named {args.county!r} in the inventory")

    txt = text_of(args.report)
    if SUMMARY_ONLY.search(txt) and not PRECINCT_REPORT.search(txt):
        sys.exit(f"{os.path.basename(args.report)} is an ELECTION Summary "
                 "Report -- countywide totals, no precincts. The per-precinct "
                 "file is the PRECINCT Summary Report; the two differ by one "
                 "word in the header.")

    printed = precincts_in(txt)
    if not printed:
        sys.exit("no 'Precinct ID / Precinct Name' pairs found in the report")

    with open(args.crosswalk, newline="") as fh:
        xw = [r for r in csv.DictReader(fh)
              if r["p26_stfid"].startswith("18" + fips3)]
    if not xw:
        sys.exit(f"no crosswalk rows for 18{fips3}")
    by_name = {}
    for r in xw:
        by_name.setdefault(norm(r["p26"]), r)

    matched, pending = {}, []
    for pid, name in printed:
        row = by_name.get(norm(name))
        if row:
            matched[row["p26_stfid"]] = (pid, name)
        else:
            pending.append((pid, name))

    # Some counties qualify a precinct with its city where the state's name
    # does not, and they do it on either side of the name: Noble reports
    # 'Kendallville-Allen 23' for the geography's 'ALLEN 23', while Kosciusko
    # reports 'Plain 05 City Of Warsaw' for 'PLAIN 05'. Resolving either on an
    # affix is safe only while it stays unambiguous, so the fallback is applied
    # one precinct at a time, skipped whenever two geography rows could absorb
    # the same report row, and reported on its own line instead of folded into
    # the exact count.
    fallback, unmatched = [], []
    for pid, name in pending:
        n = norm(name)
        cands = [r for r in xw if r["p26_stfid"] not in matched
                 and (n.endswith(" " + norm(r["p26"]))
                      or n.startswith(norm(r["p26"]) + " "))]
        if len(cands) == 1:
            matched[cands[0]["p26_stfid"]] = (pid, name)
            fallback.append((pid, name, cands[0]["p26"]))
        else:
            unmatched.append((pid, name))
    leftover = [r for r in xw if r["p26_stfid"] not in matched]
    # A precinct the county marks (NV) has no registered voters, and the EMS
    # leaves it out of the report entirely rather than printing a page of
    # zeros. That is a precinct with no votes, not a precinct we failed to
    # find, so it is listed apart and does not fail the run. Kosciusko has
    # three; they are why its geography has 69 precincts and its report 65.
    novoters = [r for r in leftover if NO_VOTERS.search(r["p26"])]
    leftover = [r for r in leftover if not NO_VOTERS.search(r["p26"])]

    print(f"{args.county} County (18{fips3})")
    print(f"  precincts printed in the report : {len(printed)}")
    print(f"  precincts in the 2026 geography : {len(xw)}")
    print(f"  joined on normalized name       : "
          f"{len(matched) - len(fallback)}/{len(printed)}")
    if fallback:
        print(f"  joined after dropping a city prefix: {len(fallback)}")
        for pid, name, geo in fallback:
            print(f"    {pid} {name!r} -> {geo!r}")
    for pid, name in unmatched:
        print(f"    UNMATCHED in report: {pid} {name!r} -> {norm(name)!r}")
    for r in leftover:
        print(f"    UNMATCHED in geography: {r['p26county']} {r['p26']!r}")
    for r in novoters:
        print(f"    no registered voters, EMS omits it: {r['p26county']} "
              f"{r['p26']!r}")

    # The sequential join is the trap this script exists for. Report whether it
    # would have looked right here, so the warning is concrete.
    seq_ok = sum(1 for pid, _ in printed
                 if pid.isdigit()
                 and str(int(pid) * 10).zfill(5) in {r["p26county"] for r in xw})
    agree = sum(1 for pid, name in printed
                if pid.isdigit() and norm(name) in by_name
                and by_name[norm(name)]["p26county"] == str(int(pid) * 10).zfill(5))
    print(f"\n  for contrast, int(Precinct ID)*10 would 'match' {seq_ok}/{len(printed)}"
          f" codes, but only {agree} of those land on the right precinct")

    if unmatched or leftover:
        sys.exit(1)
    print("\n  clean: every precinct matched, both directions")


if __name__ == "__main__":
    main()
