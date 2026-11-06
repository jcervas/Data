# November 3, 2026 files held but not yet parsed — layout survey

27 counties, one section each. Vocabulary follows `parse_precinct_pdf.py` and
`county_totals.py`: **hart** = Hart/ES&S "Precinct Results Report" or
"Cumulative Results Report" (`Choice Party Absentee Voting Early Voting
Election Day Voting Total`, last pair is the total, `Cast Votes:` checksum);
**jasper** = Collin's JasperReports precinct summary; **ew** = Electionware
"Summary Results Report" with TOTAL first and no percentages; **sos** = the
Texas Secretary of State "Election Unofficial Results Report" whose last
column is `Total Voters`.

Everything below was read with `pdftotext -layout` where a text layer exists,
and otherwise with `pdftoppm -r 400 -gray -png` + `tesseract`. Where the
candidate numbers mattered and OCR was shaky I cropped the block with
`pdftoppm -x -y -W -H` and read the image directly; those are marked
"image-verified".

Totals quoted as "Gov total / Sen total" are the report's own per-contest
total line where it prints one, and the sum of the printed candidate rows
otherwise.

---

## Andrews — `andrews_nov2026_110326-Unofficial-Results.pdf`

Genuine November 3, 2026 results. Countywide only (4 pages, "Election Summary
- 11/03/2026 8:27 PM 1 of 4"; no precinct section). Image-only scan, zero text
layer. Layout **ew**, already a known shape: `TOTAL Absentee Early Voting
Election Day`, total first, no percentages. No per-contest total line at all —
the contest ends on the last write-in row, so there is **no checksum**; the
only cross-check is TOTAL == Absentee + Early + Election Day, which holds for
all four candidates.

Abbott 3,024 · Hinojosa 1,060 · Paxton 2,913 · Talarico 1,105.
Gov 4,180 / Sen 4,156 — 0.58% apart.

## Brewster — `brewster_nov2026_20261103_EV_ED_General_Election_Total_Voters_by_Pct_1.pdf` and `..._2.pdf`

**Not results.** These are turnout sheets: ballots cast per precinct per day
of early voting, with no candidate anywhere in either file. Text layer, one
page each, precinct rows and city-ward rows. File 1 is dated 10/27/26 and file
2 is dated 10/31/26, and in both the whole Election Day block is zero, so they
also predate election day. New layout only in the sense that nothing here can
ever be parsed into a candidate row.

```
                                       Early Voting in Person                                    Election Day
      Mon       Tues      Wed       Thur      Fri       Sat       Sun      Mon  ... EV by Total EV  Reg   Percent   In   Prov  ED    Total  Percent
Pct 10/19/26 10/20/26 10/21/26 10/22/26 10/23/26 10/24/26 10/25/26 10/26/26 ... Mail Voting Voters Ely Voting Person FPCA Total Vote Total Vote
 1       144      111       85       68       66       31        5       41  ...        804  2253    35.69%                       0    804    35.69%
 2        96       79       71       48       44       19        3       32  ...        566  1585    35.71%                       0    566    35.71%
```

## Briscoe — `briscoe_nov2026_11-03-2026_Unofficial_Results_by_precinct.pdf`

Genuine results, **precinct-level** (40 pages, footer "Precinct Summary -
11/03/2026 8:19 PM n of 40"; precincts 1, 2, 3, 4, 6). Image-only scan.
Layout **ew** exactly as `parse_precinct_pdf.py` already describes it: a bare
`Precinct 1` heading, a `Statistics` block under it, TOTAL first, and both a
`Total Votes Cast` line and a `Contest Totals` line per contest — so the
checksum is available twice over.

County sums from the per-precinct Governor and U.S. Senator blocks:
Abbott 504 · Hinojosa 87 · Paxton 498 · Talarico 83.
Gov 601 / Sen ~600. Caution: the 300 dpi OCR reads precinct 4's Paxton as
"180" where the column arithmetic and that contest's own `Total Votes Cast`
(173) both require 150; the 150 is the right number.

## Cochran — `cochran_nov2026_2026_NOVEMBER_3RD_GENERAL-SPECIAL_ELECTION_-_UNOFFICIAL_RESULTS.pdf`

Genuine results, **precinct-level**, image-only scan. **New layout.** This is
not an election-system export at all — it is a hand-built word-processor grid
the county typed up. There is one column per voting channel and per box, and
the last column is the total:

```
2026 NOVEMBER 3RD GENERAL/SPECIAL ELECTION
ELECTION DAY
UNOFFICIAL RESULTS

Candidates:        EV  |BBM |BOX 101 |BOX 202 |BOX 303 |BOX 306 |BOX 404 |TOTAL
Number Voting:    405|  41|      52|     109|      18|      52|      37|   714
Ken Paxton        271|  30|      25|      76|      16|      30|      16|   464
James Talarico    115|  11|      24|      30|       2|      16|      16|   214
Ted Brown          11|   0|       0|       2|       0|       0|       3|    16
Greg Abbott       276|  29|      30|      80|      16|      32|      19|   482
Gina Hinojosa     109|  10|      19|      27|       2|      19|      13|   199
Pat Dixon          12|   1|       1|       2|       0|       0|       4|    20
```

Where the total sits: **last column**, eighth of eight. There are **no
percentages**. There is **no per-contest total line** — no `Total Votes Cast`,
no `Cast Votes` — so the only checksum is the row itself (TOTAL == the seven
preceding cells, which holds for every candidate I checked) plus the
`Number Voting:` row at the top of each page (405+41+52+109+18+52+37 = 714).
Note the first two columns are county-level pools (EV = early voting in
person, BBM = ballot by mail) and are *not* allocated to the five boxes, so a
precinct-level parse recovers only the five BOX columns. The "ELECTION DAY"
banner is a page title, not a scope limit: EV and BBM are in the same grid.
This is the file `parse_precinct_pdf.py` already warns about ("Cochran's
hand-ruled grid fails that badly") — the reason is structural, not scan
quality: there is no four-number TOTAL/Absentee/Early/ElectionDay shape for
`EW_CAND_OCR` to match.

Abbott 482 · Hinojosa 199 · Paxton 464 · Talarico 214.
Gov 701 / Sen 694 — 1.00% apart.

## Collingsworth — `collingsworth_nov2026_Nov_3_2026_General_Election_Results.pdf`

Genuine results, countywide only, image-only scan. Layout **sos** (the same
Secretary of State report Blanco publishes), but with two wrinkles worth
recording: the pages are **rotated 90°** in the scan, and `tesseract --psm 6`
on the upright image drops most data rows. What works is
`sips -r 270` on the rendered page, then `tesseract --psm 4`.

Abbott 807 · Hinojosa 142 · Paxton 775 · Talarico 142.
Gov 966 / Sen 952 — 1.45% apart, under the 1.53% bar but the closest call
among the text-readable counties.

## Crane — `crane_nov2026_2026-11-03_Unofficial_Results.pdf`

Genuine results, countywide only (5 pages, "Election Summary-11/03/2026 9:22
PM 1 of 5"; Statistics block says 4 of 4 precincts). Layout **ew**.

**This one needs a warning.** `pdftotext -layout` returns 16 KB of text, so the
file looks like a clean text-layer PDF — but that text layer is itself a bad
OCR someone baked into the scan. It mangles both names and digits:

```
   US Senator
   Vote Fo, 1
                                                TOTAL     Absentee    Early   Election
                                                                     Voting        Day
REP Ken Paxton                                   697          15     453        229
DEM James Talarico                               29U           8     18D         107
...
   Governor
                                                TOTAL     Ahsentee    Early   Election
REP Greq Abbott                                  733          15     476        242
OEM Gina Hinojosa                                270           7     166          07
```

`29U` is 290 and `18D` is 180. A parser that trusts the text layer will not
error — `EW_CAND` simply fails to match the Talarico row and drops it
silently, and there is no `Total Votes Cast` line in this report to catch the
loss. Crane must be re-OCR'd from the image (400 dpi, psm 4 is clean) rather
than read with `pdftotext`.

Abbott 733 · Hinojosa 270 · Paxton 697 · Talarico 290.
Gov 1,014 / Sen 1,014 — identical.

## Crockett — `crockett_nov2026_electionunofficialresultsreport110326.pdf`

Genuine results, countywide only, image-only scan. Layout **sos**. Needs
`tesseract --psm 4`; at psm 6 the Governor and U.S. Senator rows vanish
entirely while the lower offices survive, which is the failure mode to watch
for on all five SOS scans.

Abbott 660 · Hinojosa 321 · Paxton 624 · Talarico 335.
Gov 1,000 / Sen 988 — 1.20% apart.

## Culberson — `culberson_nov2026_11.3.26_General_Election_Results.pdf`

Genuine results, countywide only, image-only scan. Byte-identical to
`culberson_nov2026_results.pdf`. Layout **hart** cumulative: `Choice Party
Absentee Voting Early Voting Election Day Voting Total`, uppercase candidate
names, total last, percentages present, and a `Cast Votes:` line per contest
as checksum. Header says "Official Results" rather than unofficial.

Abbott 363 · Hinojosa 506 · Paxton 321 · Talarico 513.
Gov 891 / Sen 867 — **2.70% apart, over the 1.53% bar.** Both readings pass
the report's own arithmetic (Abbott 3+258+102 = 363; Paxton 1+227+93 = 321;
each contest's candidate rows sum to its printed `Cast Votes:`), and the
report itself prints the difference as undervotes, 104 on Governor against 126
on Senator. So this is a real divergence in the source, not a misread —
but it should be looked at before the county is published.

Two other Culberson files in `~/tx-2026-enr/files` are **not results**:
`culberson_nov2026_APPLICATIONS_FOR_BALLOT_BY_MAIL.pdf` is a bilingual notice
of where to mail an ABBM, and `culberson_nov2026_Election_Days_and_Hours.pdf`
is a polling-hours notice.

## Frio — `frio_nov2026_DOC110326-004.pdf`

Genuine results, countywide only, image-only scan. Layout **sos**, psm 4
again.

Abbott 1,792 · Hinojosa 1,981 · Paxton 1,631 · Talarico 2,060.
Gov 3,843 / Sen 3,798 — 1.18% apart. (Frio is one of the Democratic-leaning
counties here; the Hinojosa > Abbott ordering is correct.)

## Hill — `hill_nov2026_Early_Vote_and_ABBM_Unoffical_Totals_11.3.26_General_Election.pdf`

Genuine November 3, 2026 results, but **early voting and ABBM only** — the
whole Election Day column is 0.00% and the header says "Precincts Reporting
0 of 16 = 0.00%", run time 7:03 PM. Countywide only. Real text layer, the only
file in this track with a clean one. Layout **hart** cumulative, with
`Cast Votes:` per contest.

Abbott 6,573 · Hinojosa 2,320 · Paxton 6,388 · Talarico 2,399.
Gov 9,015 / Sen 8,998 — 0.19% apart. These numbers are a partial count and
will be superseded; they should not be published as the county total.

## Hockley — `hockley_nov2026_20261103_225715.pdf`

Genuine results, countywide only (6 pages, "Election Summary - 11/03/2026
09:56PM Page 1 of 6"). Image-only scan. Layout **ew**, with a small variant:
the column header is on one line, `TOTAL Absentee Early Voting Election Day`,
and the report prints `Contest Totals` but **no** `Total Votes Cast`. Contest
Totals is ballots (6,510 in every contest, equal to Ballots Cast - Total), not
votes, so it is a turnout check rather than a vote checksum.

Abbott 4,698 · Hinojosa 1,656 · Paxton 4,627 · Talarico 1,670 (image-verified;
OCR could not resolve the Talarico row at any dpi).
Gov 6,454+ / Sen 6,452 — effectively identical.

## Hutchinson — `hutchinson_nov2026_in-person-voters-close-of-nov-03-2026.pdf` and `hutchinson_nov2026_returned-ballot-by-mail-as-of-nov-3-2026.pdf`

**Not results.** Both are voter rosters: name-by-name lists of who voted. The
first is 135 pages of `Voter_ID / Voter_Name / Precinct` for in-person voters;
the second is `ABBM/FPCA Type / VUID / Name / Precinct` for returned mail
ballots. Text layer, no candidates. The single "abbott" match in the big file
is a voter surname.

## Kimble — `kimble_nov2026_Unofficial_Totals_11.3.26.pdf`

Genuine results, countywide only, image-only scan. Layout **sos**, and like
Collingsworth the scan is **rotated 90°** — `sips -r 270` then
`tesseract --psm 4`.

Abbott 1,639 · Hinojosa 300 · Paxton 1,577 · Talarico 330.
Gov 1,976 / Sen 1,971 — 0.25% apart.

## Lamb — `lamb_nov2026_Preliminary_Ele_Rec_Unofficial_Results_11.3.26.pdf`

**Not results.** This is the Secretary of State's prescribed form 12-1,
"Preliminary Election Reconciliation — Unofficial Totals" (Sec. 127.131(f)),
filled in by hand and scanned. It holds ballot counts and a presiding judge's
attestation, no contests and no candidates. It does have a thin text layer
(3.6 KB) but all of it is form boilerplate plus OCR noise from the
handwriting.

## Lampasas — `lampasas_nov2026_November_03_2026_Unofficial_Results.pdf`

Genuine results, countywide only (7 pages, "Election Summary - 11/03/2026
9:16PM 1of7"). Image-only scan. Layout **ew**; no `Total Votes Cast`, only
`Overvotes` / `Undervotes`, so no checksum beyond the column sum.

Abbott 6,806 · Hinojosa 2,244 · Paxton 6,447 · Talarico 2,432.
Gov 9,220 / Sen 9,193 — 0.29% apart.

## Madison — `madison_nov2026_unofficial_results_Nov_3_2026.pdf`

Genuine results, countywide only (9 pages, Cumulative Results Report).
Image-only scan. Layout **hart** cumulative, uppercase candidate names,
percentages, `Cast Votes:` checksum.

Abbott 3,221 · Hinojosa 1,007 · Paxton 3,113 · Talarico 1,083.
Gov 4,298 / Sen 4,298 — identical.

## Maverick — `maverick_nov2026_elections.html`

Genuine results, countywide only. **Not a PDF at all** — this is the county's
own results web page, saved as HTML, and `parse_precinct_pdf.py`'s
`maverick_nov2026_*` glob will pick it up and hand it to `pdftotext`. **New
layout.** Stripped of tags the body reads:

```
Unofficial results
Overall results (all ballots)
13,889 voters: 190 by mail, 9,587 early voting and 4,112 on Election Day.
Federal 3 races U.S. Senator
Ken Paxton REP 3,470 24.98%
James Talarico DEM 8,631 62.14%
Ted Brown LIB 450 3.24%
Write-in 42 0.30%
U.S. Rep. District 23
Brandon Herrera REP 3,120 26.49%
Katy Padilla Stout DEM 6,714 57.00%
Ben Mendoza IND 501 4.25%
State 22 races Governor
Greg Abbott REP 4,111 29.60%
Gina Hinojosa DEM 8,651 62.29%
Pat Dixon LIB 172 1.24%
Write-in 23 0.17%
```

Where the total sits: there is only one vote column, and it is the total
across all three channels — the page offers separate Overall / Early Voting /
Ballots by Mail / Election Day tables, and the block above is the Overall one.
Percentages **are** present, as a share of the contest. There is **no**
`Total Votes Cast` or `Cast Votes` line, so **no checksum**; the only
cross-check available is the 13,889-voter headline. Write-ins are collapsed to
one `Write-in` row. The page carries no precinct breakdown — the only
precinct-looking strings in it are commissioner and JP district names. Two
early-voting images (`Nov_3_2026_Early_Voting_Official_1.webp` and `_2.webp`)
are linked from the page and may hold more, but they are .webp, not fetched.

Abbott 4,111 · Hinojosa 8,651 · Paxton 3,470 · Talarico 8,631.
Gov 12,957 / Sen 12,593 — **2.81% apart, over the 1.53% bar.** Read straight
off the page, so it is not a parse error; it is either a real undervote gap
the page does not print or a page that was updated mid-count. Worth a second
look against the county's own PDF when one appears.

## McMullen — `mcmullen_nov2026_2026-unofficial-results.pdf`

Genuine results, countywide only (13 pages, "Election Summary - 11/03/2026
08:30PM Page 2 of 13"). Image-only scan. **New layout — "ew-pct".** It is
Electionware, but a `VOTE %` column sits between TOTAL and Absentee, which
breaks both `EW_CAND` and `EW_CAND_OCR` (the latter demands a name followed by
exactly four integers; here it is one integer, a percentage, then three
integers):

```
Summary Results Report                                   UNOFFICIAL RESULTS
TX McMullen County 2601103 General 6300 Zero Report
November 3, 2026                                          McMullen County

US Senator
Vote For 1
                              TOTAL    VOTE %   Absentee  Early Voting  Election Day
REP Ken Paxton                  315    84.91%          5           209           101
DEM James Talarico               47    12.67%          1            28            18
LIB Ted Brown                     9     2.43%          0             4             5
Write-In: AVERY AYERS             0     0.00%          0             0             0
Total Votes Cast                371   100.00%          6           241           124

Governor
Vote For 1
                              TOTAL    VOTE %   Absentee  Early Voting  Election Day
REP Greg Abbott                 324    85.04%          5           210           109
DEM Gina Hinojosa                54    14.17%          2            ..            ..
LIB Pat Dixon                     3     0.79%          0             3             0
Total Votes Cast                381   100.00%          7           247           127
```

Where the total sits: **first** numeric column, as in plain `ew` — the new
thing is the percentage immediately after it. Percentages **are** present.
The report **does** print `Total Votes Cast` per contest, so a checksum is
available (and TOTAL == Absentee + Early + Election Day also holds).
Candidate rows are image-verified. Note the election definition is named
"...General 6300 **Zero Report**" in the header; the numbers are plainly not
zeros, so this looks like a definition name the county never renamed rather
than a pre-election zero tape, but it is worth not reading past.

Abbott 324 · Hinojosa 54 · Paxton 315 · Talarico 47.
Gov 381 / Sen 371 — **2.63% apart, over the 1.53% bar.** Both are the report's
own `Total Votes Cast` lines and both candidate sets sum to them exactly, so
the reading is right; with 381 ballots a 10-vote undervote gap is 2.6% by
arithmetic alone. This is the case where the percentage rule should not be
treated as a failure.

## Nacogdoches — `nacogdoches_nov2026_2026-November-3rd---Unofficial-Early-Voting-Results.pdf`

Genuine November 3, 2026 results, but **early voting only** — every Election
Day Voting cell is 0.00% and the header says "Precincts Reporting 0 of 20 =
0.00%", run time 7:01 PM. Countywide only (7 pages). Image-only scan;
byte-near-identical to `nacogdoches_nov2026_results.pdf`. Layout **hart**
cumulative with `Cast Votes:`. Tesseract at psm 6 shreds this one into
interleaved column fragments; psm 4 reads it cleanly.

Abbott 8,487 (367 absentee + 8,120 early) · Hinojosa 7,035 (382 + 6,653) ·
Paxton 8,149 (332 + 7,817) · Talarico 7,237 (422 + 6,815).
Gov 15,741 / Sen 15,697 — 0.28% apart. Partial count; will be superseded.

## Ochiltree — `ochiltree_nov2026_Summary_Results_Report11.3.26.pdf`

Genuine results, and the only file in this track that carries **both** a
countywide section and a precinct section: pages 1–7 are the countywide
"Election Summary" (1 of 7 … 7 of 7), pages 8–31 are "Precinct Summary"
(1 of 24 … 24 of 24) broken out by `Precinct 1` … etc. Image-only scan.

Layout is Electionware, but the precinct section is a **new variant** of `ew`
that `parse_precinct_pdf.py` cannot currently find a precinct in. Two things
differ: the precinct heading is **not** followed by a `Statistics` block (the
report goes straight from `Precinct 1` into the first contest), and there is
**no per-contest total line of any kind** — not `Total Votes Cast`, not
`Contest Totals`, only `Overvotes` and `Undervotes`:

```
Summary Results Report                                   UNOFFICIAL RESULTS
TX Ochiltree 110326 General Election
November 03, 2026                                        Ochiltree County
Precinct 1
Lieutenant Governor
Vote For 1
                                     TOTAL   Absentee     Early   Election
                                                         Voting        Day
REP Dan Patrick                        234         13       142         79
DEM Vikki Goodwin                       81          2        40         39
LIB Anthony Cristo                       7          0         2          5
Write-In Totals                          0          0         0          0
Not Assigned                             0          0         0          0
Overvotes                                3          0         3          0
Undervotes                               3          0         1          2
Precinct Summary - 11/03/2026 9:07 PM                            2 of 24
```

Where the total sits: **first** column, as in plain `ew`. **No percentages.**
**No checksum** — the absence of the total line is the point; the only
available check is TOTAL == Absentee + Early + Election Day per row, which
does hold. `EW_HEAD` keys on a `Statistics` block following the heading, so
every one of these 24 pages currently reads as "no precinct".

Countywide figures (image-verified): Abbott 1,790 · Hinojosa 515 ·
Paxton 1,763 · Talarico 515.
Gov 2,343 / Sen 2,335 — 0.34% apart.

## Oldham — `oldham_nov2026_11.03.2026JOINTGENWILDISDUNOFFICIALRESULTS.pdf`

Genuine results, countywide only (10 pages, "Election Summary - 11/03/2026
9:31 PM 1 of 10"). Image-only scan. Layout **ew**, with both
`Total Votes Cast` and `Contest Totals` per contest, so the checksum is
available. Header reads "JOINT GENERAL & WILDORADO ISD ELECTIONS" — the state
races are in the same report as the ISD race, which is only a naming quirk.

Abbott 640 · Hinojosa 90 · Paxton 628 · Talarico 97 (image-verified).
Gov 750 / Sen 746, both matching their printed `Total Votes Cast` — 0.53%
apart.

## San Augustine — `san_augustine_nov2026_Unofficial_November_2026.pdf`

Genuine results, countywide only (11 pages, Cumulative Results Report).
Image-only scan. Layout **hart** cumulative with `Cast Votes:`.

Abbott 2,208 · Hinojosa 845 · Paxton 2,111 · Talarico 873.
Gov 3,098 / Sen 3,079 — 0.61% apart.

## Sherman — `sherman_nov2026_Bart_Thoreson_8th_Day_before_Nov_3_2026.pdf`

**Not results.** This is a Texas Ethics Commission **Form C/OH campaign
finance report** ("CANDIDATE / OFFICEHOLDER … CAMPAIGN FINANCE REPORT COVER
SHEET") filed by a candidate named Bart Thoreson for the 8th-day-before-
election period. Two pages, scanned, handwritten. No contest, no candidate
vote anywhere. The filename's "8th Day before Nov 3 2026" is the TEC reporting
period, not an early-voting tally.

## Sterling — `sterling_nov2026_11.03.2026_General_Election_Unofficial_Results.pdf`

Genuine results, countywide only, image-only scan. Byte-identical to
`sterling_nov2026_results.pdf`. Layout **sos**, psm 4.

Abbott 365 · Hinojosa 64 · Paxton 369 · Talarico 64.
Gov 451 / Sen 449 — 0.45% apart. (Paxton slightly ahead of Abbott here; the
column arithmetic checks on both, 14+248+103 = 365 and 14+254+101 = 369.)

## Swisher — `swisher_nov2026_Unofficial_Results_11.03.2026.pdf`

Genuine results, countywide only (6 pages, "Election Summary - 11/04/2026
12:09 AM 2 of 6"; Statistics says 7 of 7 precincts). Image-only scan. Layout
**ew**, no total line, no percentages — checksum is the column sum only.

Abbott 1,256 · Hinojosa 420 · Paxton 1,212 · Talarico 449.
Gov 1,721 / Sen 1,719 — 0.12% apart.

## Wharton — `wharton_nov2026_Unofficial_Election_Day_Results_11.03.2026.pdf`

Genuine results despite the filename: the report carries Absentee, Early
Voting **and** Election Day columns, so it is the full count, not an
election-day-only slice. Countywide only (10 pages, "Election Summary -
11/03/2026 9:07 PM 1 of 10"). Image-only scan. **New layout — "ew-pct"**, the
same shape as McMullen:

```
Summary Results Report                                    UNOFFICIAL RESULTS
TX Wharton 261103 General 6110
November 3, 2026                                                     Wharton

US Senator
Vote For 1
                                TOTAL   VOTE %   Absentee   Early   Election
                                                            Voting       Day
REP Ken Paxton                  8,375   66.47%        221   6,760     1,394
DEM James Talarico              4,006   31.79%        210   3,144       652
LIB Ted Brown                     206    1.63%          4     138        64
Write-In Totals                    13    0.10%          1      10         2
Total Votes Cast               12,600  100.00%        436  10,052     2,112

Governor
Vote For 1
                                TOTAL   VOTE %   Absentee   Early   Election
                                                            Voting       Day
REP Greg Abbott                 8,607   68.07%        238   6,919     1,450
DEM Gina Hinojosa               3,907   30.90%        199   3,074       634
LIB Pat Dixon                     121    0.96%          4      82        35
Total Votes Cast               12,644  100.00%        442  10,082     2,120
Contest Totals                 12,734              453  10,137     2,141
```

Where the total sits: **first** numeric column; the `VOTE %` column second is
what is new. Percentages **are** present. The report prints **both**
`Total Votes Cast` (votes) and `Contest Totals` (ballots, i.e. votes +
over/undervotes), so there is a real checksum. Candidate rows image-verified.
Minor trap: one page header OCRs as "September 11, 2026 Wharton", but the
election definition line reads `TX Wharton 261103 General 6110` — 261103 is
2026-11-03, and page 1 is dated November 3, 2026.

Abbott 8,607 · Hinojosa 3,907 · Paxton 8,375 · Talarico 4,006.
Gov 12,644 / Sen 12,600 — 0.35% apart.

## Wilson — `wilson_nov2026_img20261104_01303429.pdf`

Genuine results, countywide only (8 pages, "Election Summary - 11/04/2026
1:15AM 1 of 8"; Statistics says 13 of 13 precincts). Image-only scan. Layout
**ew** with `Total Votes Cast` per contest — checksum available.

Abbott 15,294 · Hinojosa 6,423 · Paxton 14,666 · Talarico 6,847.
Gov 22,072 / Sen 22,022 (both the report's own `Total Votes Cast`) — 0.23%
apart.

---

# Distinct new layouts found, and who shares each

**1. `ew-pct` — Electionware summary with a `VOTE %` column between TOTAL and
Absentee.** Total is still the first numeric column; percentages present;
`Total Votes Cast` present, so it carries its own checksum. Breaks `EW_CAND`
and `EW_CAND_OCR`, both of which expect the name to be followed by plain
integers only.
→ **Wharton, McMullen.**

**2. `cochran-grid` — a hand-built word-processor table, not an election-system
export.** Columns are `EV | BBM | BOX 101 | BOX 202 | … | TOTAL`; total is the
**last** column; no percentages; no per-contest total line, only a
`Number Voting:` row per page. Precinct-level for the BOX columns only — EV
and BBM are county pools that are never allocated to a box.
→ **Cochran.**

**3. `ew-precinct-nostats` — Electionware "Precinct Summary" pages whose
precinct heading has no `Statistics` block under it and whose contests print
no total line at all.** Total first, no percentages, no checksum. `EW_HEAD`
identifies a precinct by the `Statistics` block that follows it, so this
variant currently yields zero precincts.
→ **Ochiltree** (which also carries a normal countywide `ew` section in the
same file, pages 1–7).

**4. `maverick-html` — a county results web page saved as HTML, matched by a
`*_nov2026_*` PDF glob.** One vote column (already the all-ballots total),
percentages present, write-ins collapsed to one row, no checksum line,
countywide only.
→ **Maverick.**

**5. `brewster-turnout` — a turnout-by-precinct and by-day grid with no
candidates in it.** Listed as a layout only because it is filed under a
results-like name and will otherwise keep being re-examined.
→ **Brewster** (both files).

Three further shapes are not new report families but need new *handling*, and
are the likeliest source of silent wrong answers:

- **`sos` scans needing `--psm 4`.** At psm 6 tesseract drops the Governor and
  U.S. Senator rows out of the SOS report while keeping the down-ballot ones,
  which looks like "the county didn't report those races" rather than like an
  OCR failure. → Crockett, Frio, Sterling, Collingsworth, Kimble.
- **`sos` scans rotated 90°,** needing `sips -r 270` before OCR. →
  Collingsworth, Kimble.
- **A baked-in bad OCR text layer that makes a scan look like a text PDF.**
  `pdftotext -layout` succeeds, returns garbled digits (`29U` for 290), and the
  candidate row is silently dropped by the regex with no total line to catch
  it. → Crane.

And three non-results document types that will keep turning up under
results-like filenames:

- **Voter roster** (name-by-name list of who voted) → Hutchinson, both files.
- **SOS form 12-1 "Preliminary Election Reconciliation"**, hand-filled →
  Lamb.
- **Texas Ethics Commission Form C/OH campaign finance report** → Sherman.
- (plus Culberson's ABBM mailing notice and polling-hours notice, alongside its
  genuine results file.)

# Governor vs. U.S. Senator divergence

Three counties exceed the 1.53% bar. None of them is a misread:

| County | Gov total | Sen total | Diff | Why |
| --- | --- | --- | --- | --- |
| Maverick | 12,957 | 12,593 | 2.81% | read directly off the HTML page; no undervote figures published |
| Culberson | 891 | 867 | 2.70% | both are the report's own `Cast Votes:`; undervotes 104 vs 126 |
| McMullen | 381 | 371 | 2.63% | both are the report's own `Total Votes Cast`; 10 votes on a 381-ballot county |

Collingsworth at 1.45% is the closest of the rest. Every other county in this
track is under 1.2%.
