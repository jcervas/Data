# 2026 precinct-level results: where to get them, for the other eight states

Built and verified October 25, 2026, for the nine mid-decade redistricting
states. Texas was surveyed separately and in more depth; see
`../TX-2026-precinct-sources/`.

The purpose is a **counterfactual**: 2026 votes reaggregated onto the 2024
district lines, to isolate what each redraw did. That works because the precinct
crosswalk in `wapo-redistricting-2026` is keyed on RDH's `PRECINCTID`, which is
county-plus-county-precinct — the same namespace a county or state election feed
reports in. Verified end to end on Denton County, TX: a county feed pushed
through the crosswalk reproduced RDH's block-built district totals to the vote.

## The answer per state

| State | Election-night precinct source | Exact counterfactual available |
|---|---|---|
| **NC** | **statewide, machine-readable, live** | partially on election night; fully at canvass |
| **TX** | 32 Clarity counties (no state source) | election night, for Clarity counties |
| **OH** | Hamilton County on Clarity; rest unresolved | after certification |
| **FL** | not established | after counties submit (2024 files: July 2025) |
| **AL** | none found | after certification, **and partly modeled even then** |
| **TN** | none found | after certification |
| **LA** | unresolved (portal is a JS app) | unknown |
| **UT** | unresolved (portal is a JS app) | unknown |
| **CA** | none — 58 counties individually | months later, via Statewide Database |

Nothing here is on statewide Clarity. Alabama, Florida and Ohio have Clarity
sites for many counties, but in Alabama and Florida the latest staged elections
are from 2006–2017: archives, not a live path. Only Ohio's Hamilton County has
November 3, 2026 staged (EID 127473).

One caveat on that: Clarity's `elections.json` is an archive list and omits the
current event for some counties, which is why `../TX-2026-precinct-sources/fetch_clarity.py`
carries hand-verified EIDs. So a county with no 2026 entry is *suggestive* of
absence, not proof. The Alabama and Florida readings are strong because their
archives stop a decade or more back.

## North Carolina is the good case

NCSBE publishes two statewide files, both fetched and parsed here.

**Election night** — `https://s3.amazonaws.com/dl.ncsbe.gov/ENRS/<YYYY_MM_DD>/results_pct_<YYYYMMDD>.zip`
(3.7 MB for 2024; 233,510 rows). Tab-separated, with a header. Columns:
`County`, `Election Date`, `Precinct`, `Contest Group ID`, `Contest Type`,
`Contest Name`, `Choice`, `Choice Party`, `Vote For`, `Election Day`,
`Early Voting`, `Absentee by Mail`, `Provisional`, `Total Votes`,
`Real Precinct`.

**After canvass** — `.../results_precinct_sort/<NAME>_PRECINCT_SORT.txt`, which
places every ballot in the voter's own precinct. `<NAME>` is a county, or
**`STATEWIDE`** for all 100 at once (412 MB uncompressed for 2024, so one fetch
rather than a hundred). Nineteen columns including `precinct_code` and
`voting_method_lbl` (`V` election day, `EV` early, `M` mail, `P` provisional,
`T` transfer). NUL bytes are used as the empty-field marker, so a plain CSV
reader fails with "line contains NUL" — strip `\x00` first. The 2024 files are
dated December 3, 2024.

The join is `<COUNTY>-:-<precinct_code>`, which matches **2,657 of our 2,658** NC
crosswalk precincts. The single miss is `WAKE-:-01-07 & WAKE-:-01-07A`, a merged
label on RDH's side.

Validated against the full statewide file, not a sample: of the 2,657 matched
precincts, **2,655 are vote-identical** to our crosswalk. The two exceptions are
both Wake and both explained by that merged label — the feed reports `01-07` and
`01-07A` separately, so our `01-07` is short by the 189 votes RDH folded into
the merged row, and `16-09` differs by one vote. Residual vote in labels we
cannot place: **2,375 of 5,612,736, or 0.042%**, spread over 55 labels such as
`HALIFAX-:-EV SCOTLAND NECK` — ballots the county itself could not return to a
precinct. In other words, after canvass North Carolina is exact for practical
purposes, and it is the file RDH built from.

### Why election night is only partly usable in NC

In 37 of 100 counties the election-night file reports early, absentee and
provisional votes as county-level pseudo-precincts (`Real Precinct = N`), named
`EARLY VOTING`, `ABSENTEE BY MAIL`, `TRANSFER`. That is **31.2% of the
statewide vote** with no precinct attached. The other 63 counties, Alamance
among them, allocate every method to real precincts on the night.

Eleven NC counties straddle an old district line, and four of them are
affected: Wake (79% of its vote in buckets), Guilford (81%), Cabarrus (75%),
Mecklenburg (7%).

Spreading those buckets across each county's precincts is tempting and wrong.
Measured against the precinct-sorted truth, the error on **full district**
two-party share:

| | worst | CD-02 | CD-13 | CD-09 | CD-05 |
|---|---|---|---|---|---|
| spread by election-day vote | 3.25% | −3.25% | +2.59% | +1.89% | −1.82% |
| spread by 2020 population | 3.22% | −3.22% | +2.19% | +1.70% | −1.62% |

For scale, NC's redraw moved CD-01 from 48.4% to 44.1% — a 4.3-point change.
A 2–3 point apportionment error would swamp the thing being measured. The cause
is not subtle: where 75–81% of a county's vote is in the bucket, spreading it by
election-day geography assumes early and election-day voters live in the same
places, and in North Carolina in 2024 they did not.

**But five of fourteen NC districts have no affected county at all** — CD-01,
03, 07, 10 and 11 are exact on election night. That is what the `coverage`
column in `wapo-redistricting-2026/scripts/counterfactual.py` is for: publish
the districts that are clean, blank the ones that are not, and fill them in at
canvass.

## Florida

`https://dos.fl.gov/media/708761/2024-gen-outputofficial1.zip` — 4.9 MB, 67
county files named `<ABB>_PctResults20241105.txt`. Tab-separated, **no header
row**, 19 columns; the ones that matter are `[1]` county name, `[5]` precinct,
`[11]` contest, `[14]` candidate, `[15]` party (`DEM`/`REP`), `[18]` votes.
Field definitions are published separately as
`/media/709209/final-precinct-level-elections-data-definitions-and-field-codes_20250624.pdf`.

The statewide presidential two-party total is **10,793,164, matching the
official certified result exactly**. The join is `<County>-:-<Precinct>`, giving
5,357 of 5,712 feed precincts directly. The remainder are mechanical: zero
padding (`Desoto-:-01` vs our `Desoto-:-1`, `Bay-:-4A` vs `Bay-:-011A`) and
pseudo-precincts (`BROWARD-:-NP`, `Brevard-:-999`).

One thing to know before trusting precinct-level FL comparisons: **1,536 of the
5,357 matched precincts have different totals** in the official file than in our
RDH-derived crosswalk, by up to 746 votes. In aggregate the two differ by only
1,989 votes out of 10.06 million (0.02%), so these are reallocations between
precincts, not missing votes — RDH did its own precinct processing. It does not
break the counterfactual, which uses the feed's votes with our weights, but it
does mean Florida cannot be validated end-to-end the way Denton was.

Florida's 2022 primary file is named `enightprecinctfiles2022_pri.zip`, which
suggests an election-night precinct product exists. I did not find a 2024 or
2026 equivalent, so treat election-night Florida as unestablished.

## Alabama needs a warning label

RDH's own readme for Alabama says the Secretary of State reports some votes **at
the county level** (and by Judicial Division in Jefferson County), and that RDH
**allocated them to precincts in proportion to each precinct's share of
election-day votes for each candidate.**

That is the same method measured above at 2–3 points of district error in North
Carolina. So Alabama's precinct-level numbers — including the ones already in
our 2024 counterfactual and on the published map — are partly modeled rather
than measured. Six Alabama counties straddle an old district line, holding 28.5%
of the state's vote, and that is where the error lands. Worth quantifying before
leaning on Alabama's district figures, and worth a footnote either way.

## The unresolved three

**Louisiana.** RDH used `https://voterportal.sos.la.gov/static/2024-11-05`,
which is a JavaScript application; the underlying data endpoint was not
resolved. The static dated path is a good sign for automation once the endpoint
is known. No Clarity parishes found.

**Utah.** `https://electionresults.utah.gov/` is an Angular single-page app and
the JS bundle path advertised in its HTML returned nothing, so its API was not
resolved. No Clarity counties found. Utah is also the one state of the nine with
**no statewide partisan race in 2026** — no Senate seat up (classes 1 and 3,
2024 and 2028) and the governor elected in 2024 — so a Utah counterfactual has
to run on House votes, with the candidate-contamination caveat that implies.

**California.** No statewide precinct feed, on election night or otherwise. RDH
and our own crosswalk both come from the
[Statewide Database](https://statewidedatabase.org/), which processes each
county's Statement of Vote months after certification. Fifty-eight counties
publish individually on the night. California is the largest state in the
project and the least tractable for a fast counterfactual.

## What was actually fetched

Verified by retrieval and parsing: the NC election-night zip, the NC
`STATEWIDE` precinct-sort file (412 MB) plus Alamance and the ten counties that
straddle an old district line, the FL 2024 official zip and all 67 county files
inside it, the Clarity probes for AL (67 counties), OH, FL, TN, UT, CA and
LA, and the RDH readmes for AL, FL, LA, OH, TN and CA.

Not fetched: any Alabama, Ohio, Tennessee, Louisiana or Utah results file. Those
rows in `sources.csv` are marked `partial` or `not verified` and should be
treated as leads.

## Files

| File | What it is |
| --- | --- |
| `sources.csv` | One row per source, 11 columns, with a `verification` column that does not flatter itself |
| `fetch_nc.py` | Pulls either NC file for a given election date; `--kind sort` defaults to the single `STATEWIDE` file |
| `clarity_probe.py` | Probes a state's counties for live Clarity sites and a staged election |
