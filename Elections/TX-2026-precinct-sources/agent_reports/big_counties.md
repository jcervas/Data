# Track "big": the 12 large counties with nothing precinct-level as of the
# November 4, 2026 afternoon baseline

Re-checked 2026-11-04, ~21:40-22:00 CST. Baseline is the README table
"Where each missing large county stood on November 4, 2026".

**Two counties broke open: Harris and Smith.** Harris now serves complete,
reconciling precinct-level JSON. Smith's Laserfiche download problem is solved
(the working endpoint is recorded below), though what it holds for November is
still countywide only. Webb and Cameron posted countywide November reports.
The other eight are unchanged.

---

## Harris — CHANGED, and this is the big one

Checked `https://www.harrisvotes.com/Election-Results/Live-Results`, which the
baseline recorded as empty with no iframe or feed. It now carries
`<iframe src="https://app.harrisvotes.com/electionresults/electionday">`. That
page is an AngularJS app whose controller reads three static JSON files out of
the same `Data/1126/` directory the baseline probed:

```
https://appfiles.harrisvotes.com/harrisvotes/prd/Data/1126/resultsbyballot.json
https://appfiles.harrisvotes.com/harrisvotes/prd/Data/1126/pr.json
https://appfiles.harrisvotes.com/harrisvotes/prd/Data/1126/pv-<contestId>.json
```

The 63-name probe missed these because `pv-*.json` is keyed by contest id, not
by a guessable report name; the ids come from `resultsbyballot.json`.

`resultsbyballot.json` is the countywide summary: 231 contests, "General and
Special Elections", November 03, 2026, `o=0` (unofficial), vote centers 623 of
623, last updated `2026-11-04T14:39:00Z`. Each `pv-<id>.json` is precinct-level:
parallel arrays of 1,224 precinct ids with per-candidate votes split into
Absentee / Early / Election Day, plus registered voters and ballots cast per
precinct.

Reconciliation, run on the four statewide contests:

| Contest | id | Precincts | Precinct sums vs. summary | AB+EV+ED == total |
| --- | --- | --- | --- | --- |
| United States Senator | 9189 | 1,224 (1,224 unique) | exact | all 1,224 rows |
| Governor | 9190 | 1,224 | exact | all 1,224 rows |
| Lieutenant Governor | 9191 | 1,224 | exact | all 1,224 rows |
| Attorney General | 9192 | 1,224 | exact | all 1,224 rows |

`pr.json` gives countywide RV 2,761,770, ballots cast 1,392,280, turnout 50.41%
— the same 1,392,280 as `cumulative.pdf`, so the JSON and the PDF agree.

`cumulative.pdf` is still there and still the only PDF: 658,707 bytes,
`Last-Modified: Wed, 04 Nov 2026 15:08:58 GMT`, byte-identical in size to the
copy already held as `harris_cumulative.pdf`. `precinct.pdf` still 404s and
should be considered abandoned — the JSON feed supersedes it.

**Verdict: Harris now publishes complete precinct-level results, 1,224
precincts, via JSON. Countywide also available.** Downloaded the index, `pr`,
the four statewide contests, and a gzipped archive of all 231 `pv-*.json`.

## Collin — unchanged

Checked `https://www.collincountytx.gov/elections/election-results`. The same
five November 3 items as the baseline, no official version, no CSV export: the
precinct report is still
`...precinct-results-report---unofficial-totals2.pdf` (HTTP 200, 6,855,164
bytes — identical to the held `collin_precinct_nov2026_v2.pdf`). Nothing to
re-download.

## Montgomery — unchanged

Checked `https://elections.mctx.org/ElectionResults.asp`: the 2026 section
still stops at the May 26 runoff. Probed
`results/2026_November_Precinct_Report.pdf`, `2026_Nov_Precinct_Report.pdf`,
`2026_November_Cumulative_Report.pdf` and `2026_November_Canvass_Report.pdf` —
all 404. Directory listing on `results/` and `pdf/GEN110326/` is 403.
**Nothing for November, precinct or countywide.**

## Hays — unchanged

Ran `browser_fetch.mjs hays` (real Chrome through Cloudflare): 6 election pages,
newest still "2026 May 26 Primary Runoff". Also walked
`https://www.hayscountytx.gov/185/Election-Results` and `/179/Elections-Office`
through Chrome in case November was posted outside the Archive Center — no
results documents on either. **Nothing for November.**

## McLennan — unchanged

Ran `browser_fetch.mjs mclennan`: 8 election pages, newest still "May 26, 2026
Joint Primary Runoff Election". Also checked `https://www.mclennan.gov/180/Elections`
and `/1014/Election-Results` through Chrome — no November documents.
**Nothing for November.** (It posted November 4, 2025 about nine days out, so
mid-November remains the expectation.)

## Smith — CHANGED (countywide only), and the download block is solved

`https://www.smith-county.com/236/Current-Election-Results` now has a
"November 3, 2026 General Elections" tab linking a new Laserfiche folder,
`Browse.aspx?id=11584&repo=r-927d42fb` ("November General 2026 Results"). It
holds seven documents, all created 11/4/2026:

| Entry id | Pages | Name |
| --- | --- | --- |
| 12178 | 11 | 2026-11 Early and Absentee Report |
| 12211 | 11 | 2026-11 Second Report of the Night |
| 12212 | 11 | 2026-11 Third Report of the Night |
| 12213 | 11 | 2026-11 Fourth Report of the Night |
| 12214 | 11 | 2026-11 Fifth Report of the Night |
| 12215 | 11 | 2026-11 Final Report of the Night |
| 12216 | 1 | 2026-11 Unofficial Reconciliation Report |

Two endpoints that the baseline's five misses did not cover, both working:

- Listing (POST JSON, needs a cookie jar so `portal_impl=always` is set):
  `POST https://portal.laserfiche.com/Portal/FolderListingService.aspx/GetFolderListing2`
  with `{"repoName":"r-927d42fb","folderId":11584,"getNewListing":true,"start":0,"end":500,"sortColumn":"","sortAscending":true}`
- Download: `https://portal.laserfiche.com/Portal/ElectronicFile.aspx?docid=<entryId>&repo=r-927d42fb`

Downloaded entry 12215 and rendered page 1: it is a **Summary Results Report,
countywide** — 168,079 registered, 89,785 ballots cast, 53.42% turnout, no
precinct breakdown. Smith's precinct-level document is the separate "Official
Precinct Report", which it publishes after canvass (the 2026-06 one is still the
newest).

**Verdict: countywide yes, precinct no — but Smith is now fetchable, so the
precinct report can be pulled the moment it lands.**

## Webb — CHANGED (countywide only)

The Precinct-By-Precinct page (`/425/`) still links only the old
DocumentCenter ids 2687/2688/2689 (prior election). But
`https://www.webbcountytx.gov/698/Unofficial-Results-2026` carries a new id:

```
https://www.webbcountytx.gov/DocumentCenter/View/12238/unofficial-final-results
```

626,894 bytes, 16 pages, scanned (no text layer). Rendered page 1: "Election
Summary Results Report / 2026 Joint General and Special Election / November 3,
2026 / Webb County, Texas", 78 of 78 Election Day precincts reporting, 60,127
ballots cast. **Countywide summary, not precinct.** The companion
`/DocumentCenter/View/2698` ("Unofficial EV Results") is still a prior-election
id. `/867/Official-Results-2026` has no November document yet.

## Guadalupe — unchanged

No Clarity site. Ran `fetch_clarity.scan_band("Guadalupe", "11/3/2026")` over the
127250–127650 band: no hit, **0 refusals** — a clean miss, not a throttle. A
positive control on the same band in the same session returned Hood's known
127400, so the scan was working. `elections.json` remains stale (newest 2015) and
proves nothing either way. **Nothing for November.**

## Comal — unchanged

Same procedure: band scan over 127250–127650, no hit, **0 refusals**, same
positive control. `elections.json` newest entry is still May 2025.
**Nothing for November.**

## Cameron — CHANGED (countywide only)

`https://www.cameroncountytx.gov/elections/results/` now has two files under
`wp-content/uploads/2026/11/`:

```
https://www.cameroncountytx.gov/elections/wp-content/uploads/2026/11/1145pm-RPT11-04-2026-060050.pdf
https://www.cameroncountytx.gov/elections/wp-content/uploads/2026/11/GN26-reconcilation-electionnight-126am.pdf
```

The first (2,956,768 bytes, 18 pages, scanned) is labeled on the page as
"Election Night Results - Early Voting, Mail, and Election Day Location", but
pages 2 and 18 both read "Cameron County Summary Results / General & Special
Election / November 3, 2026" with one block per contest broken out by
MAIL / EV / ED only — **countywide, no precinct or location rows anywhere in the
18 pages**. Governor: Abbott 33,101, Hinojosa 68,613, 102,771 cast. The second
is the handwritten Preliminary Election Reconciliation form.

Cameron's precinct products are the separate "Precinct by Precinct" and
`<CODE>_<Entity>_PCTxPCT.pdf` files; its newest of those is still June 2026.

## Lubbock — unchanged

Clarity EID 127477, `current_ver.txt` 382590, `detail.xml` ElectionDate
11/3/2026. Still the clean zero template the README describes:
`precinctsReported=0`, 31,416 precinct nodes, **every one `votes="0"`**, all
`totalVotes` summing to 0. **Staged but empty.**

## Hood — unchanged

Clarity EID 127400, `current_ver.txt` 385195, ElectionDate 11/3/2026. Byte-for-
byte the same content as the `Hood_detail.xml` already held from 20:53, same
internal `Timestamp` 11/3/2026 10:55:58 PM CST: 12,207 precinct nodes, 10,295 of
them the literal string `N/A`, and the 1,912 numeric ones are implausibly small
against the county totals (Governor precinct 101 = 2 votes). **Still unusable.**
Note for the record: the README's "every per-precinct value is N/A" is a slight
over-statement — 1,912 are numeric — but nothing has moved since the baseline.

## Collin's 689 MB original — dead, not healed

One attempt, as instructed. A range request for bytes 684109824- of
`...precinct-results-report---unofficial-totals.pdf?sfvrsn=323e6d11_3` now
returns **HTTP 404** in 0.39 s. The county removed the rasterized original when
it posted the clean 6.9 MB export, so the stalled tail is not recoverable and no
longer matters.

---

| county | precinct_file_now_available | countywide_available | changed_since_baseline |
| --- | --- | --- | --- |
| Harris | yes | yes | yes |
| Collin | yes | yes | no |
| Montgomery | no | no | no |
| Hays | no | no | no |
| McLennan | no | no | no |
| Smith | no | yes | yes |
| Webb | no | yes | yes |
| Guadalupe | no | no | no |
| Comal | no | no | no |
| Cameron | no | yes | yes |
| Lubbock | no | no | no |
| Hood | no | no | no |

Files downloaded to `~/tx-2026-enr/files` this pass:

```
harris_nov2026_resultsbyballot.json          92,467
harris_nov2026_pr.json                       58,699
harris_nov2026_pv-9189.json                 135,985   US Senator
harris_nov2026_pv-9190.json                 135,881   Governor
harris_nov2026_pv-9191.json                 127,650   Lt. Governor
harris_nov2026_pv-9192.json                  97,299   Attorney General
harris_nov2026_pv_all_contests.tar.gz     3,279,976   all 231 pv-*.json
webb_nov2026_unofficial-final-results.pdf   626,894   countywide, scanned
cameron_nov2026_1145pm-RPT11-04-2026-060050.pdf  2,956,768   countywide, scanned
cameron_nov2026_GN26-reconcilation-electionnight-126am.pdf  1,069,687
smith_nov2026_2026-11_Final_Report_of_the_Night.pdf  345,052   countywide
```
