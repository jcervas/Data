# Indiana 2026 precinct-level results: where to get them

Inventory of where precinct-level returns for the **November 3, 2026 Indiana
general election** will actually be published, built and verified on
November 5, 2026 — two days after the election. A second pass the same day took
coverage from 44 counties to 56; a third on November 6 took it to 64, and was
mostly a matter of working out what each county's website is actually called.

Indiana is the mirror image of Texas. In Texas the geography was the hard part.
Here the state hands you a clean statewide precinct layer and it is the
**results** that have no statewide publisher at all.

## Headline

**Geography: solved, in one request.** IndianaMap publishes
`Voting_District_Boundaries_2026` — 5,121 precincts statewide, compiled from the
Indiana General Assembly and the Election Division in June 2026, refreshed
annually. Every polygon already carries its congressional, state senate and state
house district, so district rollups need no spatial join.

**Results: nothing statewide, and that is structural, not a delay.**

- The state election-night feed (`enr.indianavoters.in.gov`) bottoms out at the
  county. Fetching all 92 of its `JurR_<fips>` files shows **92 of 92 counties
  exposing exactly one reporting region — the county itself**. The only
  precinct-shaped number anywhere in the app is a `TOTAL_ALLPRECINCTSREPORTING`
  counter.
- Precinct results never reach the state. What circuit court clerks transmit by
  **noon November 16, 2026** (forms CEB-11/12/13/25, over SVRS) is the
  county-aggregated statement of votes cast by office. Precinct detail stays in
  the county canvass.
- The state's **historical** archive (`indianavoters.in.gov/ENRHistorical`) is a
  separate application from the election-night feed, and it is county-level too.
  Its record schema has no precinct field at all — the finest geography is
  `District`, which holds a county or jurisdiction name. For 2026 it currently
  carries only `PRIMARY` and `REFERENDUMS`; the general loads after
  certification. Useful anyway: it is the certified county total to check a
  county's precinct file against.
- The Secretary of State's own "Precinct-Level Election Results" page is a dead
  archive of scattered 2006 county PDFs.
- **There is no Clarity tier.** All 20 of the largest counties 404 under
  `results.enr.clarityelections.com/IN/`, against a TX/Denton control that
  returns 200. The one uniform machine-readable shortcut that covered a third of
  Texas does not exist here.
- RDH and VEST stop at 2024. On the 2024 cycle's timing, expect matched 2026
  files sometime in 2027.

So all 5,121 precincts come from 92 county sites, one at a time.

## Files

| File | What it is |
| --- | --- |
| `in_2026_precinct_sources.csv` | One row per county (92), ranked by registered voters |
| `fetch_geo.py` | **Run first.** Pulls the 2026 state precinct layer, writes the crosswalk |
| `fetch_enr.py` | Pulls the state feed: county turnout, election-office contacts, and the proof that the feed stops at the county |
| `build_tracker.py` | Assembles the inventory from the geo + feed outputs plus hand-verified rows |
| `discover_county_sites.py` | Finds a county's site, elections page and results page by convention |
| `sweep_unresolved.py` | Second pass: breadth-first search of a county's own site, ranked candidates rather than one pick |
| `resolve_hosts.py` | Third pass: works out which of a county's plausible hostnames is real, and classifies the rest as parked, lapsed, off-domain or a shared shell |
| `host_resolution.csv` | Every candidate host tried per county, with its verdict |
| `county_sites_resolved.csv` | The winners only, in the shape `sweep_unresolved.py --sites` wants |
| `sweep_pass3.csv`, `sweep_pass4.csv` | Candidate links from the third-pass sweeps, run against the resolved hosts |
| `verify_and_merge.py` | Fetches what the crawl found, throws out the junk, merges survivors at an honest grade |
| `validate_join.py` | Joins a county's precinct report to the geography and refuses to guess — see "the join that looks right" |
| `sweep_candidates.csv` | Ranked candidate links per unresolved county, with the pages-crawled count |
| `county_sites.csv` | Raw output of the discovery crawl, failures included |
| `site_verification.csv` | Per-county grade, HTTP status, content type, and why a hit was rejected |
| `enr_county_turnout_2026.csv` | 92 rows: registered voters, ballots cast, in-person/absentee |
| `county_election_offices.csv` | 92 rows: election office name, address, phone, reporting regions |
| `enr_snapshot.json` | `settings.json` as fetched, for the audit trail |
| `geo/precinct_key_crosswalk.csv` | 5,121 precincts: county FIPS, name, STFID, CD/SD/HD |
| `geo/county_precinct_counts.csv` | Precinct count and CDs touched, per county |
| `geo/downloads/in_2026_vtd.geojson` | The polygons as served, EPSG:4326, 48.8 MB |

Pipeline order: `fetch_geo.py` → `fetch_enr.py` → `build_tracker.py` →
`discover_county_sites.py --all` → `resolve_hosts.py` → `sweep_unresolved.py`
(`--sites` the hosts it found) → `verify_and_merge.py`.
The crawlers are re-runnable; `build_tracker.py` rebuilds **from seeds only**,
so it drops every crawl-merged row and `verify_and_merge.py` must be run after
it, not merged twice onto the same file.
`validate_join.py` is a per-county check you run on a downloaded report, not
part of the chain.

### Join key

`p26_stfid` is `18` + 3-digit county FIPS + 5-digit county precinct code, and it
is unique across all 5,121 rows. One defect to normalize: **Wayne County's
`CENTER 03` carries a 4-character code** (`0050`), making its STFID 9 characters
instead of 10. Zero-pad `p26county` to 5 before joining and all 5,121 keys are
unique and uniform.

### CSV columns

`fips`, `fips3`, `county`, `rank_by_rv`, `registered_voters`, `ballots_cast`,
`absentee_pct`, `reports_turnout`, `precincts`, `platform`, `results_url`,
`precinct_data_url`, `format_notes`, `verification`, `office_phone`.

`verification` means what it means in the Texas file: `verified` = the artifact
was fetched, `verified-pattern` = the equivalent file was fetched for a prior
election and the 2026 path exists, `partial` = the results page is identified but
the report type is not, `not verified` = unresolved.

`rank_by_rv` is 0 where the county has filed no turnout — see below.

## Coverage

- **64 of 92 counties have an identified results source, covering 4,295 of
  5,121 precincts (84%)**
- 9 `verified`, 16 `verified-pattern`, 34 `partial`, 33 `not verified`
- 826 precincts in 28 counties still unresolved

**413 precincts of 2026 general results are already on the web, per precinct,
and every one of these was fetched and read to confirm it:**

| County | Precincts | Artifact |
| --- | --- | --- |
| Delaware | 78 | `delawarecountyelectionday.com`, one `Delaware_PrecSumm_<NN>.htm` per precinct |
| Howard | 78 | `unofficial-precinct-summary-G26.pdf` |
| Kosciusko | 69 | eGov document `id=4300`, `INKOSG26`, 242 pages, 65 of 65 precincts |
| Warrick | 53 | public Google Drive folder, one PDF per precinct, named for the precinct |
| Huntington | 37 | `huntington.in.us/election_results/2026General/`, live app, 36 named precincts |
| Jasper | 29 | `2026-general-election-precinct-by-precinct-report` (PDF), `INJASG26` |
| Noble | 29 | EMS report rendered inline as HTML on its `in.gov` county page |
| Wells | 22 | `Precinct-Summary-Report-2.pdf`, `INWELG26`, 78 pages — **a scan, needs OCR** |
| Fulton | 18 | `2026-Unofficial-General-Election-Precinct-Results` (PDF) |

A further 1,056 precincts in 16 counties are `verified-pattern` — the county has
posted the 2026 *primary* by precinct, or published the per-precinct files for a
prior general at a path that still exists. Largest: Allen (278), Vanderburgh
(139), Porter (124), Elkhart (117), LaPorte (92), Wayne (59), Gibson (32).

Largest still unresolved: Monroe (83), Clark (74), Bartholomew (66),
Hancock (50), Morgan (46), Lawrence (40), Shelby (40), Clinton (39).

Two of those are vote-center counties (Bartholomew, and Clark in part), where
per-precinct reporting may not exist at all rather than merely not be posted.
Huntington shows it *can* exist in a vote-center county, so this is a question
to settle per county, not an assumption.

### Finding the county at all

The third pass was mostly about hostnames, not elections. The counties that
survived two crawls were not the ones that publish nothing; they were the ones
whose obvious hostname is wrong — and it is wrong in three ways that all answer
HTTP 200, so a crawler cannot tell them from a county site with no election
page. `resolve_hosts.py` classifies rather than just reaching, and found a live
host for **35 of the 36**:

| Failure | Looks like | Actually |
| --- | --- | --- |
| **parked** | `kosciuskocounty.com`, `hancockcounty.org`, `monroecounty.org` — 200 OK | 114 bytes of JavaScript redirecting to `/lander`, a domain-parking page |
| **lapsed** | `wellscounty.us` — 200 OK | redirects off-domain to a gambling site; the county is at `wellscounty.org` |
| **shell** | `gov.<county>.in.datapitstop.us` — 200 OK, says "County Government" | an 8 KB directory stub listing only Auditor/Treasurer/Council. Useful anyway: **it names the county's real website** |

Hostname conventions that actually occur, none predictable from the others:
`<slug>county.in.gov`, `in.gov/counties/<slug>/`, `co.<slug>.in.us`,
`<slug>county.org`, `<slug>county.gov` (Warrick), `<slug>county-in.gov` with a
hyphen (Gibson, Brown), `<slug>.in.gov` (Starke, Kosciusko), `<slug>.org`
(Daviess), `<slug>gov.com` (Tipton), and the datapitstop alias
`<slug>county<N>.us` where **N is the county's position in the alphabetical
list of Indiana's 92 counties** — Orange is the 59th, hence
`orangecounty59.us`.

## The join that looks right and is not

Nearly every Indiana county runs the same EMS. Its precinct report prints

    Precinct ID: 003
    Precinct Name: Carpenter East

and the crosswalk built from the state geography has `p26county = 00030`.
Multiply the printed ID by ten, zero-pad to five, and in Jasper County that
matches **29 of 29** precincts. It looks like the join rule.

It is not. Crosswalk `00030` is GILLAM. Carpenter East is `00210`. The county's
EMS numbers its precincts 1..N in its own current alphabetical order, while the
state allotted its codes earlier, in a different order, in steps of ten. Two
sequences, same length, same stride — so the arithmetic lands on a real
precinct every time and silently attributes the votes to the wrong polygons. On
Jasper it puts 27 of 29 precincts in the wrong place; on Noble, all 29.

**Join on the precinct name**, uppercased, punctuation stripped, with standalone
one- and two-digit numbers zero-padded to two (`Keener 1` = `KEENER 01`). That
is 29/29 and bijective on Jasper, and 29/29 on Noble once two precincts the
county prefixes with their city (`Kendallville-Allen 23` for `ALLEN 23`) are
resolved on an unambiguous suffix. `validate_join.py` does this, reports the
affix cases separately rather than folding them into the exact count, and exits
non-zero if anything is unmatched in either direction:

    ./validate_join.py jasper.pdf --county Jasper

Validated on four counties now, 169 printed precincts, every one placed:

| County | Printed | Placed | `int(ID)*10` would "match" | …of which land right |
| --- | --- | --- | --- | --- |
| Jasper | 29 | 29 exact | 29/29 | **2** |
| Noble | 29 | 27 exact + 2 affix | 29/29 | **0** |
| Kosciusko | 65 | 64 exact + 1 affix | 65/65 | **36** |
| Warrick | 53 | 53 exact (on *filenames*) | n/a | n/a |

Kosciusko is the clearest statement of the trap: the arithmetic matches every
single code and puts 29 precincts in the wrong place.

Two refinements Kosciusko forced, both in `validate_join.py`:

- **The city affix goes on either side.** Noble writes `Kendallville-Allen 23`
  for `ALLEN 23`; Kosciusko writes `Plain 05 City Of Warsaw` for `PLAIN 05`.
  The fallback now tries prefix and suffix, still one precinct at a time and
  still skipped whenever two geography rows could absorb the same report row.
- **`(NV)` means no registered voters.** The EMS omits such a precinct rather
  than printing a page of zeros, so it is a precinct with no votes, not a
  precinct the join failed to find. Kosciusko has three, which is most of why
  its geography holds 69 precincts and its report 65. They are now listed
  apart and do not fail the run; the fourth, `PRAIRIE 02 - WARSAW`, is a
  genuine gap and still does.

## Traps worth writing down

**1. "Election Summary Report" and "Precinct Summary Report" are different
documents.** The first is countywide, the second is per precinct, and the EMS
gives both the same three header lines — `<County> County, Indiana`,
`2026 General Election`, `IN<CCC>G26`. A crawler keying on the election name
grabs the wrong one about half the time. **Five counties so far have posted only
the countywide summary** — LaPorte, Hendricks, Marshall, Tipton and LaGrange —
which is why they are `partial` and not `verified` despite having a live 2026
general results file. `validate_join.py` refuses a summary report by name rather
than returning zero precincts.

LaGrange is the trap at its worst. Its document center lists **two** entries,
both labeled `November 3rd 2026 Election Results`, ids 2284 and 2285 — which
looks exactly like the summary/precinct pair every other county posts. Both ids
return byte-identical 321,149-byte files, and it is the summary. Kosciusko is
the same shape with a happy ending: `id=4299` is "2026 General Election Summary
Results" and `id=4300` is "2026 General Election Results by Precinct". The
labels differ by one word and the ids by one digit.

**2. The state feed's version suffix is a letter, not a timestamp.** Filenames
are `<name>_<VersionType>.json` — currently `statewideTurnout_A.json`. The
obvious candidate, `VersionCode` (`20261105_163044`), 404s on everything.

**3. 26 of 92 counties had filed nothing to the state turnout feed two days
after the election** — all zeros, not absent rows, so a naive read scores them
as zero-turnout counties. Marion, Lake, Porter, Tippecanoe, Vanderburgh,
Elkhart, Monroe, Vigo, LaPorte, Howard, Clark and Floyd are among them, so the
feed's statewide total (1,027,513 ballots) is missing the two largest counties
in the state. `reports_turnout` flags these, and they get `rank_by_rv = 0` rather
than a fabricated rank.

**4. The host conventions fail on exactly the counties that matter.** Five of
the biggest gaps were not missing data but a wrong hostname:

| County | Convention says | Actually |
| --- | --- | --- |
| LaPorte | `laportecounty.in.gov` (auth gate) | `laporteco.in.gov` |
| Delaware | `co.delaware.in.us` (403) | `delawarecountyelectionday.com` on election night |
| Elkhart | `elkhartcounty.com` (403) | `clerk.elkhartcounty.com`, also 403 — browser only |
| Huntington | a county domain | the **city** site, `huntington.in.us` |
| Vanderburgh | `vanderburghgov.org` (lapsed) | `evansvillegov.org/county` |

Allen, Delaware and Elkhart 403 every scripted client, document paths included,
with or without full browser headers; they were resolved in a real browser.

**5. Five counties publish their results as photocopies.** Hendricks and
Marshall post Toshiba e-STUDIO scans; Wells a Ricoh MP C3004 scan; Tipton a PFU
ScanSnap iX500 scan; LaGrange another. `pdftotext` returns 5 to 78 bytes from
files of 300 KB to 2 MB, so the failure looks like an empty document rather than
an image. Check `pdfinfo` for a copier in the `Creator` field and render a page
to grade it honestly. **Wells is the one that hurts**: it is the *right* report
— `Precinct Summary Report / INWELG26`, 78 pages, 22 of 22 precincts — and
unusable without OCR. Append `&dt=f` to an eGov `center.egov?view=item&id=N` URL
to get the file rather than the viewer.

**6. A county document center will lie to a status-code probe.** CivicPlus
answers `200 OK` with an HTML error page for `/DocumentCenter/View/<n>` ids that
hold nothing, so sweeping a numeric range reports dozens of hits that are all
the same page. Check `Content-Type`, not the status. The eGov equivalent is more
helpful than harmful: `center.egov?view=all` lists every document a county
holds, which is the fastest way into an eGov site and is how Kosciusko's
precinct file turned up after two crawls had missed it.

**7. Google Drive hides the tail of a folder.** Warrick publishes its 53
precinct PDFs in a public Drive folder. The folder page is virtualized and stops
at 50 rows, so Owen, Pigeon and Skelton simply are not there — and nothing says
so. `drive.google.com/embeddedfolderview?id=<folder>` returns all 53 as plain
HTML with no JavaScript. Fetch a file with
`drive.google.com/uc?export=download&id=<id>`; its `Content-Disposition` carries
the precinct name, which for Warrick *is* the join key.

**False leads worth recording so nobody re-finds them:**

- Searching for Monroe County's clerk returns `mococlerk.com`, which is Monroe
  County **Illinois** — consolidated elections, a 618 area code,
  `monroecountyil.gov`. The same decoy has a second face:
  `platinumelectionresults.com/history/raceprecincts/...` serves precinct-level
  results for "Monroe County" that are Illinois too, with Regional
  Superintendent of Schools races and Consolidated elections on the ballot.
  Indiana's Monroe County is still unresolved.
- Pulaski County's crawl hit was `elections.virginia.gov` — Pulaski County
  **Virginia**. Cross-state county-name collisions are the single most common
  false positive in this survey.
- Orange County's "General Summary" at `gov.orangecounty59.us/cgi.exe?
  CALL_PROGRAM=LOGREPORTS&SHOWREPORT=GENERAL.HTML` is a **web-server log
  analyzer** — Analog and Report Magic — reporting page hits, not votes. It
  scores well on every keyword a results crawler looks for.

## What to expect after November 16

Noon November 16 is when certified precinct files start appearing. Marion County
states it outright: "Certified 2026 General Election Results by Precinct,"
downloadable after noon 11/16/2026. Then noon November 24, the Election Division
tabulates and the Secretary of State certifies.

Two joining headaches to plan for:

- **Vote centers.** Allen, Tippecanoe, Elkhart, Rush and others run vote-center
  plans, so returns may be keyed to the center a ballot was cast at rather than
  the voter's home precinct. The state layer has no vote-center geography to
  join to. Not fatal on its own, though: Huntington runs six vote centers and
  still reports all 36 precincts separately, so check the county's actual report
  before writing one off.
- **Countywide batches.** Statewide absentee share is 45.6% of ballots cast
  among reporting counties, and some counties report absentee and early votes in
  county-level rows no precinct can hold. `absentee_pct` per county is the
  advance warning. This is the same failure mode that puts 31.2% of North
  Carolina's statewide vote in non-precinct rows.
