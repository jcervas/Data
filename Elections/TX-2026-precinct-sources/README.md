# Texas 2026 precinct-level results: where to get them

Inventory of where precinct-level returns for the **November 3, 2026 Texas general
election** will actually be published, built and verified on October 23, 2026.

Headline: the Secretary of State will **not** publish precinct results.
`electionresults.sos.state.tx.us/results.html` is a single static HTML page of
statewide race totals — no county drill-down, no precinct breakdown, no CSV/XML.
Precinct data comes from the 254 county election offices, and the only uniform,
machine-readable slice of it is the ~32 counties running Clarity.

## Files

| File | What it is |
| --- | --- |
| `tx_2026_precinct_sources.csv` | One row per county (254), ranked by registered voters |
| `tx_counties_ranked.csv` | Registered voters + precinct counts, March 2026 SOS figures |
| `fetch_all.py` | **Start here.** One driver for all 42 counties; writes the manifest |
| `fetch_clarity.py` | Pulls per-precinct XML for every Clarity county |
| `fetch_non_clarity.py` | Finds/downloads precinct reports for the 10 top-25 counties not on Clarity |
| `browser_fetch.mjs` | Drives real Chrome for the two counties behind Cloudflare |
| `install_schedule.sh` | Installs/removes the launchd timer that polls until election night |
| `poll_schedule.sh` | The cadence logic the timer runs |
| `notify_changes.py` | Diffs consecutive manifests and alerts on what changed |
| `extract_gov_sen.py` | Pulls Governor + U.S. Senator precinct results out of the Clarity XML and keys them to `PCTKEY` |
| `parse_precinct_pdf.py` | Parses a county precinct-results PDF into the same rows: Hart layout (Brazoria) and Electionware/Jasper layout (Collin) |
| `parse_lvt_enr.py` | Reads precinct results straight off a livevoterturnout.com ENR page (Ellis) |
| `discover_county_sites.py` | Finds a county's site, elections page and results page by convention |
| `merge_discovered_sites.py` | Folds those findings into the inventory without touching verified rows |
| `county_sites.csv` | Output of the discovery crawl: one row per county, failures included |
| `county_totals.py` | Countywide Governor/Senate totals, derived from precincts where we have them |
| `county_totals_2026.csv` | One row per county/race/candidate, labeled `precinct-derived` or `countywide` |
| `tlc_precincts.py` | Dependency-free `.dbf` reader for the TLC precinct shapefile |
| `gov_senate_precinct_2026.csv` | Output of `extract_gov_sen.py` — the joined results table |

### CSV columns

`fips`, `county`, `rank_by_rv`, `registered_voters`, `precincts`, `platform`,
`results_url`, `precinct_data_url`, `format_notes`, `nov2026_staged`,
`nov2026_eid`, `verification`.

`verification` is the honest part: `verified` means I fetched the thing,
`verified-pattern` means I fetched the equivalent file for a prior election and
the 2026 folder already exists, `partial` means the results page is identified
but the report types are not, and `not verified` means I did not resolve it.

## Coverage

- 32 counties on **Clarity / Scytl** — uniform per-precinct XML, one recipe
- 25 more resolved by hand, including Harris, Collin and Montgomery
- **57 counties total, 16,297,918 registered voters, 87.4% of the state**
- `fetch_all.py` runs all 42 and records what it found in a manifest
- Every county in the top 25 is resolved, plus the next tier down to ~50k
  registered voters — 87.4% of the state's 18,657,918 voters have an identified
  source
- The other ~216 counties are county-hosted PDFs with no shared pattern

## Recipe 1 — Clarity counties (the good one)

Three requests per county. No scraping, no PDF parsing.

```
1. GET https://results.enr.clarityelections.com/TX/<Slug>/elections.json
      -> find the entry whose Date is 11/3/2026, take its EID
2. GET https://results.enr.clarityelections.com/TX/<Slug>/<EID>/current_ver.txt
      -> a version number, e.g. 379718
3. GET https://results.enr.clarityelections.com/TX/<Slug>/<EID>/<VER>/reports/detailxml.zip
      -> detail.xml: <Contest> / <Choice> / <VoteType> / <Precinct name=... votes=...>
```

**Send a browser User-Agent.** As of 2026-11-02 the CloudFront layer in front of
Clarity answers a bare `curl` with 403; the same request with a Chrome UA gets
200. The scripts here already send full browser headers, but a hand-rolled
`curl -s` against these URLs will fail unless you add `-A`.

`detailtxt.zip` is the same data as fixed-width text. `detailxls.zip` 404s on the
Texas sites — do not rely on it.

Two gotchas, both hit during the build:

- `elections.json` is an **archive** list and is unreliable for the current
  event. Fort Bend's November 2026 site (EID 127480) is live but absent from its
  own `elections.json`, and Bexar's returns an empty array. Fall back to the
  county's own elections page for the EID, or scan the EID band — every November
  2026 id found so far sits in `127291`–`127485`.
- Send `Accept-Encoding` and decompress. `curl` without `--compressed` truncates
  `detailxml.zip` into an unreadable archive.

Slugs are the county name with spaces as **underscores** (`El_Paso`,
`Fort_Bend`), not removed. A no-space probe misses both.

### Already staged for November 3, 2026

Denton came online between October 23 and 25, which is the argument for running
`fetch_all.py` on a schedule rather than trusting any snapshot of this table.

Verified live today, returning `ElectionDate 11/3/2026` with all-zero precinct
rows that fill on election night:

| County | EID | Contests | Precinct nodes in detail.xml |
| --- | --- | --- | --- |
| Tarrant | 127297 | 118 | 702,994 |
| Denton | 127398 | 89 | 89,776 |
| Bexar | 127291 | 183 | 335,490 |
| Dallas | 127396 | 83 | 267,071 |
| Fort Bend | 127480 | 67 | 78,780 |
| El Paso | 127348 | 86 | 70,523 |
| Galveston | 127478 | 68 | 32,246 |
| Parker | 127479 | 41 | 11,833 |
| Kaufman | 127485 | 77 | 11,281 |
| Victoria | 127359 | 38 | 8,818 |
| Lamar | 127484 | 37 | 7,151 |
| Wood | 127355 | 42 | 7,109 |

Dallas, Tarrant, Parker and Victoria were found only by scanning the EID band —
all four are absent from their own `elections.json`. Treat `elections.json` as a
hint, not the source of truth.

When scanning the band, **confirm `<ElectionDate>` in `detail.xml`**. A live
`current_ver.txt` only proves some election exists at that id: the scan turned up
Williamson 127277, which is its May 26 runoff, not the general.

The remaining 21 Clarity counties — Travis, Denton, Williamson, Hidalgo, Bell,
Nueces, Lubbock, Comal, Jefferson and the smaller ones — had nothing in the band
as of October 23. Poll `elections.json` and re-scan closer to the election.

## Recipe 2 — the three big non-Clarity counties

**Harris** (2.70M RV, the largest county in the state, and not on Clarity):

```
https://appfiles.harrisvotes.com/harrisvotes/prd/Data/<MMYY>/precinct.pdf
```

`MMYY` is the election month, so `1126` for November 2026. Verified:
`1124/precinct.pdf` (2.9 MB, Nov 2024) and `0526/precinct.pdf` (May 2026 runoff)
both exist, and `1126/cumulative.pdf` is already live as a zero template.
`cumulative.pdf` is the summary; `precinct.pdf` is the precinct-level one — a
"Precinct Results Report" broken out by precinct (`0001 - 1`, with registered
voters and turnout per precinct) and by vote mode: Ballot by Mail, Early Voting,
Election Day, EV Provisional, ED Provisional. **The November 2024 file is 207 MB** —
plan for that. (A `curl --compressed` size readout shows ~11 MB, which is the
gzipped transfer, not the file.)

One Harris trap: its "Precincts Reporting" denominator counts vote centers, not
precincts — 1,584 in November 2024 and 3,021 in the November 2026 zero template,
against 1,166 actual county election precincts in the March 2026 SOS figures. Do
not use that denominator as a precinct count.

**Collin** — the only county found publishing precinct results as CSV:

- Precinct Results Report (PDF) and **Precinct Results Export (CSV)**, both from
  https://www.collincountytx.gov/elections/election-results
- Election night: early voting at 7 p.m., then updates every 30 minutes

**Montgomery** — the most stable naming convention in the state, back to 1992:

```
https://elections.mctx.org/results/<YEAR>_<Month>_Precinct_Report.pdf
```

So `2026_November_Precinct_Report.pdf`. The `pdf/GEN110326/` folder is already
live with daily early-voting reports.

## Recipe 3 — CivicPlus counties

Six of the mid-size counties run CivicPlus (CivicEngage), and all of them refuse
plain `curl`. Full browser headers get you in on four; McLennan needs a real
browser. Each stores precinct reports differently, so there is no shared file
pattern — but the page URLs are stable.

| County | Results page | Where the precinct report lives |
| --- | --- | --- |
| Webb | `/425/Precinct-By-Precinct-Results` | DocumentCenter PDFs: Combined `/View/2687`, Early Voting `/View/2688`, Election Day `/View/2689` |
| Smith | `/236/Current-Election-Results` | Laserfiche portal, repo `r-927d42fb`, named `<YYYY-MM> Official Precinct Report` |
| McLennan | `Archive.aspx?lngArchiveMasterID=66` | One `Archive.aspx?ADID=<n>` page per election with Cumulative + Canvass + **Precinct** PDFs |
| Ellis | `/1355/2026-Election-Results` | Per-election page; the Nov 3 page `/1402` is live and lists "Precinct by Race Results (PDF)" |
| Hays | `Archive.aspx?AMID=53` | One `Archive.aspx?ADID=<n>` page per election — see below, it is the richest in the state |

Webb's is the only one verified by opening the file: `/View/2687` is a genuine
"UNOFFICIAL RESULTS PCT by PCT" report with per-precinct registered voters,
ballots cast by party and turnout, broken out as `PCT 401`, `PCT 402` and so on.

Smith also publishes an **Official Precinct Split Report**, which is more
granular than the precinct report — useful where precincts split across
districts.

### Hays publishes cast vote records

Hays is the deepest source found anywhere in the state. Each election's archive
page carries Canvass Results and Cumulative Results as PDFs, a Results Reports
ZIP, and a **`CVRExport` ZIP — the cast vote records**, i.e. ballot-level data,
strictly richer than any precinct report. March 3, 2026 is `ADID=206`:

```
/DocumentCenter/View/1639/CVRExport-March-3-2026---Democratic-Party-ZIP
/DocumentCenter/View/1638/CVRExport-March-3-2026---Republican-Party-ZIP
/DocumentCenter/View/1640/Results-Reports---Democratic-Party---Official-ZIP
/DocumentCenter/View/1634/Canvass-Results---Democratic-Party---Official-PDF
```

Caveat: Hays' WAF returns 403 to `curl` **even on DocumentCenter**, full browser
headers included, so I could not open the ZIPs to confirm their contents. Scrape
this county with a headless browser or download by hand.

## Recipe 4 — Cameron

A WordPress site, so files sit at predictable paths under
`/elections/wp-content/uploads/<YYYY>/<MM>/`. Two flavors, both verified by
opening them:

- **Countywide**, e.g. `Democrat-Party-Precinct-Result-031126.pdf` (4.5 MB) — a
  true precinct report, "Precinct 1 Statistics" onward, split TOTAL / Mail / EV /
  ED per candidate.
- **Per entity**, e.g. `CSB_City_of_San_Benito_PCTxPCT.pdf` — a "Precinct Summary
  Report" at *precinct-part* level, so finer than whole precincts.

The results page already has its "2026 November 3 General and Special Elections"
section, updated 10-22-2026, with headings per entity but no files posted yet.

## A fourth platform: Civix GoElect -- it is the state's, and it is empty

Resolved on 2026-11-04. The link Ellis labels "State of Texas Results website"
points at the bare `goelect.txelections.civixapps.com/ivis-enr-ui/races`, with
no county or election parameter. Loading it in a browser, the Angular app boots,
fetches only its i18n bundle, and renders an empty "Home - Election Night
Results"; the site root redirects to `ems-system-ui`, an Okta-gated management
app. So GoElect is the Secretary of State's own deployment, it carries no
county data, and it is not a second uniform feed. Nothing further to probe.

## A fifth platform: livevoterturnout.com -- four counties, one useful

Probed all 254 county slugs as `<county>txenr` (one request each). **Four
answer: Cameron, Ellis, Hays and Williamson** -- so the earlier note here, that
a probe of the top 60 found no county other than Cameron, was wrong.

Only Ellis is worth anything, and it is worth a lot:

| County | Status |
| --- | --- |
| **Ellis** | `ellistxenr` index **11**, 5.4 MB, **2,088 precinct blocks**. Parsed. |
| Hays | indices stop at 13, newest May 2022 -- Hays has moved off this vendor |
| Cameron | indices run past 40 (through 2025) but **no page has a single precinct block**; countywide only |
| Williamson | already covered by Clarity |

### Ellis is the easiest source in the whole toolkit

One static page carries the entire county: every precinct, every contest,
already in the markup behind `display: none`. No API, no pagination, no PDF --
a single GET, and `parse_lvt_enr.py` does the rest. The precinct rows are
`<div class="list-item-precinct-race">` blocks whose `race-title` reads
`1001-501 - Governor`, with `<td dc>` for the candidate and `<td dv>` for the
votes. Precinct labels are `1001-501`, which the existing label normalizer
already reduces to TLC's `1001` by stripping the trailing `-NNN`.

It checks itself: the same page prints countywide totals, and the precinct rows
sum to them **to the vote** -- 88,839 Governor and 88,732 Senate across 60 of
TLC's 61 precincts (1023 did not report). The parser does that comparison on
every run and reports any gap.

One trap worth naming. The candidate cell holds the name **twice**, once
visible and once in an `sr-only` span for screen readers. Stripping tags
naively yields `Greg Abbott REP Greg Abbott`, which merges with nothing and
silently forks the candidate -- Ellis's 88,839 Governor votes landed in the
combined table under names of their own, leaving every statewide total
unchanged while the row count grew. Reading only the first span fixes it, and
the distinct-candidate count is what catches it: 9 per race, not 11.

Ellis also publishes `DocumentCenter/View/24376`, a "Whole Precinct by Race
Totals Report" PDF for the same data. That one is a JasperReports cross-tab
with **vertically rotated column headers**, which `pdftotext -layout` renders
as one character per line; parsing it would mean reconstructing columns from
`-bbox` coordinates. The ENR page makes that unnecessary.

## Running everything at once

```bash
python3 fetch_all.py                      # all 42 counties, write the manifest
python3 fetch_all.py --download --browser # save every file, Cloudflare included
python3 fetch_all.py --only dallas,harris
python3 fetch_all.py --date 2024-11-05    # a past election
```

`fetch_all.py` drives the three access paths below and writes two files:

- **`manifest.json`** — nested per county: the access path used, the Clarity
  election id and version, every file with its URL, byte count, contest and
  precinct-node counts, local path and SHA-256, plus a run summary (counties
  attempted, counties with data, total bytes, share of statewide registered
  voters covered).
- **`manifest.csv`** — one row per file, carrying FIPS, rank and registered
  voters, so it joins straight onto `tx_2026_precinct_sources.csv`.

Discovery changes nothing on disk, so it is safe to run on a loop as the
election approaches; `--download` overwrites. Clarity and the county sites fan
out across threads (`--workers`, default 6); the two Cloudflare counties run last
and serially, since each drives its own Chrome.

Run on October 25, 2026 it reported **19 of 42 counties live, 53 files, 73 MB,
covering 59.6% of the state's registered voters** — the rest being Clarity
counties that have not stood up their November site yet. Adding `--browser`
brings in Hays (19 documents) and McLennan (108 across 8 elections).

One inconsistency to expect in a discovery-only manifest: the HTTP paths report
byte counts from a `HEAD`, but the browser counties report `bytes: null` until
you pass `--download`, because the size is only known once the in-page fetch has
run. Their `status` is still recorded.

### Every run band-scans now, on a budget

A county's own `elections.json` cannot be trusted to say whether its November
site exists. On 2026-11-04 Bell's listing stopped at May 2026, Comal's at May
2025, Guadalupe's at 2015, and Lubbock's and Jefferson's were empty arrays --
while Bell, Hunt, Kendall, Lubbock and Jefferson all had live November sites.
`find_eid` used to scan the id band only when the listing *errored*, so a
listing that parsed and simply omitted November was believed. It now scans
whenever the date is missing for any reason, and the no-scan message reports the
listing's newest entry instead of asserting the county is unstaged.

`poll_schedule.sh` passes `--scan` on every run, not just the pre-election
discovery -- the counties most likely to stand a site up late were exactly the
ones that stopped being scanned once the election started.

Clarity pushes back on that, so three limits keep it sustainable, all
overridable by environment variable:

| Knob | Default | Why |
| --- | --- | --- |
| `TX_SCAN_GATE` | 4 | 8 earned HTTP 405 on a 9-county sweep |
| `TX_SCAN_BUDGET` | 3 counties/process | caps a run at ~1,200 ids, not ~2,400 |
| `TX_SCAN_RETRY` | 900s | a county probed this recently is skipped |

`scan_attempts.json` records when each county's band was last probed, hit, miss
or refusal. The budget plus that file rotate the work: each run spends its
budget on whichever counties have gone longest unprobed, and the next run moves
on to the others, so every county is still scanned regularly and none is
hammered. A refused scan is reported as a refusal -- `band scan refused 369
time(s)` -- and never as absence, the same distinction `find_eid` already draws
between "no entry" and "could not tell."

### Two different kinds of empty

Both look like a county with no votes and neither is usable, but they fail
differently and only one trips a reconciliation check:

- **Lubbock** stages a clean zero template: `precinctsReported=0`, every
  `totalVotes` 0, every precinct 0. The sums agree perfectly, so nothing looks
  wrong -- which is the danger.
- **Hood** reports `precinctsReported=29` and real county totals (Abbott
  23,380) with every per-precinct value the literal string `N/A`.

`extract_gov_sen.py` flags both with `STAGED BUT EMPTY`, so a county of zeros
cannot be mistaken for a county that voted.

## Polling until election night

```bash
./install_schedule.sh              # install the timer
./install_schedule.sh --uninstall  # remove it
```

A launchd agent (`com.jcervas.tx2026enr`) fires every 15 minutes;
`poll_schedule.sh` decides whether that firing does anything, so the cadence
lives in one place and the timer never changes:

| When | What runs |
| --- | --- |
| before Nov 3 | discovery once a day — catches counties standing up their site |
| Nov 3, polls open | discovery once |
| Nov 3 from 18:00 | discovery every 15 min; download at most hourly, no `--browser` |
| Nov 4–6 | discovery twice a day; one `--download --browser` run a day for canvass docs |
| after Nov 6 | logs, unloads itself, stops |

Downloads are deliberately rare because the files are not. Harris' `precinct.pdf`
was 207 MB in 2024 and Hays' cast vote records are 119 MB, against 13 GB free on
this machine — so a 15-minute download loop would fill the disk. Discovery is
cheap and writes only a manifest, which is what you want anyway: a timestamped
record of exactly when each county posted what. There is also a disk guard that
skips downloads below 5 GB free.

Everything the timer produces lands in `~/tx-2026-enr/`:

```
~/tx-2026-enr/manifests/manifest-YYYYMMDD-HHMM.{json,csv}
~/tx-2026-enr/files/            downloads
~/tx-2026-enr/poll.log          one line per decision and run
~/tx-2026-enr/bin/              the copy of the toolkit the agent runs
```

**Why it runs from a copy.** macOS denies a launchd agent any access to
`~/Library/CloudStorage`, so an agent pointed at the Google Drive copy of these
scripts dies with `Operation not permitted` (exit 126) — which is exactly how the
first install failed. `install_schedule.sh` therefore copies the toolkit to
`~/tx-2026-enr/bin` and points the agent there. **Re-run the installer after
editing any script**, or the timer keeps running the old copy. The Drive copy
stays the source of truth; `poll_schedule.sh` resolves paths relative to itself,
so it behaves the same in both places.

Output stays on local disk for the same reason, and because Drive would try to
sync every 200 MB PDF.

### Alerts

After every run that produces a manifest, `poll_schedule.sh` calls
`notify_changes.py`, which diffs it against the previous one and raises a macOS
banner plus a JSON line in `~/tx-2026-enr/events.log` for three things:

| Event | Meaning |
| --- | --- |
| `online` | a county that had nothing now has data — a Clarity site went up |
| `offline` | a county that had data now does not |
| `error` | a hard failure, new since the last run |
| `run_error` | `fetch_all.py` itself exited non-zero |

It stays quiet otherwise, which is the whole point: on election night the timer
fires every 15 minutes, and a county's vote totals changing is not a status
change. Three states never alert — `no site staged yet` (the normal pre-election
condition), `rate-limited (403)`, and `skipped (pass --browser)`.

The notifier is idempotent via a `notify.seen` marker: each manifest is diffed
once, so anything that calls it twice for the same run cannot re-raise every
alert. `--force` overrides that, `--quiet` logs without a banner.

Banners go through `osascript`, so whether one actually appears depends on your
Notification Centre settings for Script Editor; `events.log` is the reliable
record either way.

### Brazoria needs an OpenSSL-linked curl

Brazoria's WAF fingerprints the TLS handshake. In the same second, with
identical headers, it serves conda's OpenSSL-linked curl a **200** and refuses
both Apple's SecureTransport `/usr/bin/curl` and Python's `urllib` with **403**.
Nothing about the request matters — only which TLS stack makes it.

So `_curl` does not take the first `curl` on `PATH`; it tries candidates in
order, OpenSSL builds first (the interpreter's own `bin`, then Homebrew, then
`/usr/local`, then whatever `PATH` gives, then `/usr/bin/curl`), and returns the
first that is accepted. `CURL_BIN` overrides the order. `install_schedule.sh`
also puts the interpreter's `bin` at the front of the agent's `PATH`.

This cost two wrong diagnoses worth recording. The first scheduled run came back
18 of 42 counties instead of 19, and the launchd environment looked like the
culprit; then a head-to-head curl test happened to land in a blip where both
builds failed, which made it look like simple rate limiting. It is neither — it
is reproducible, and it is the TLS stack.

## Running the scrapers individually

```bash
python3 fetch_clarity.py                       # 32 Clarity counties -> detail.xml
python3 fetch_non_clarity.py                   # the other 10 in the top 25
python3 fetch_non_clarity.py --download        # actually fetch the files
python3 fetch_non_clarity.py harris collin     # a subset
python3 fetch_non_clarity.py --date 2024-11-05 # a past election
python3 fetch_non_clarity.py --browser         # include Hays + McLennan
node browser_fetch.mjs hays --download         # or call the helper directly
node browser_fetch.mjs --url "https://..."     # any Cloudflare-blocked page
```

Both are stdlib-only. `fetch_non_clarity.py` discovers by default and prints a
status line per candidate file; `--download` saves them. Every handler was run
against the live sites on October 23, 2026:

| County | Status today | Notes |
| --- | --- | --- |
| Harris | works | `1126/cumulative.pdf` live; `precinct.pdf` 404s until election night |
| Collin | works | finds both the precinct PDF and the all-races CSV |
| Montgomery | works | predicts `<YEAR>_<Month>_Precinct_Report.pdf` and lists what is posted |
| Brazoria | works | needs the curl fallback |
| Cameron | works | ranks `uploads/<YYYY>/<MM>/` hits by the target month |
| Hays | needs `--browser` | Cloudflare; 19 docs incl. a 119 MB CVR export |
| Brazos | needs `--browser` | Cloudflare; 13 docs on one flat page |
| Smith | listing only | Laserfiche viewer needs a session; URLs are reported |
| McLennan | needs `--browser` | Cloudflare; ~50 docs across 8 elections |
| Ellis | works | walks per-election pages, finds the PctbyRace PDFs |
| Webb | works | the three vote-mode PDFs |

Three HTTP quirks cost real time and are worth knowing before you write your own:

- **TLS fingerprinting.** Brazoria's WAF refuses Python's `urllib` with 403 while
  `curl` with identical headers gets 200. The script falls back to `curl` on any
  urllib failure.
- **Never trust a `HEAD`.** CivicPlus answers `HEAD /DocumentCenter/View/<id>`
  with 404 on documents that redirect to a slug URL, and a plain GET then
  returns 200. Treat 403/404/405 on HEAD as "ask again with GET."
- **Ranged GETs.** Some DocumentCenter endpoints 404 a `Range: bytes=0-0`
  request that they would serve in full, so that shortcut needs its own fallback.

## Recipe 6 — the second tier (counties 26–50)

Fifteen more counties, everything down to about 50,000 registered voters, added
2026-10-30. They take 6.4% of the state from "no resolved source" to a named
page, and eleven of them to an actual precinct-level report.

No two share a file naming convention, but all of them put the report behind a
link whose text says what it is, so these need one line each in
`fetch_non_clarity.py`'s `SIMPLE` table — a page plus a label pattern — rather
than a bespoke handler:

| County | RV | What the precinct report is called |
| --- | --- | --- |
| Grayson | 100,887 | `Official_<Party>_Party_Pct_Summ_Results_Report_<YYYY>.pdf` |
| Randall | 100,698 | DocumentCenter canvass reports |
| Ector | 85,664 | **not results** — the "Pct. 101, 102, 103, …" PDFs are sample ballots, see below |
| Taylor | 85,075 | "OFFICIAL Taylor County Precinct Results" |
| Tom Green | 72,329 | "Official Precinct Results (PDF)" |
| Bowie | 60,472 | "Official Results Pct X Pct (PDF)" |
| Henderson | 60,148 | "Final Results for Canvassing Authority (PDF)" |
| Potter | 57,952 | Wix `_files/ugd`: "Democratic / Republican Pct. x Pct." |
| Wise | 57,826 | "Precinct Results Report" |
| Liberty | 57,715 | "Final Results by Precincts (Official)" |
| Brazos | 138,990 | per-election PDFs — **browser only**, see below |

Four are resolved only as far as a results page, and are listed in `PAGE_ONLY`
so they appear in every manifest instead of silently erroring: **Johnson**
(132,109 — results page exists, nothing precinct-labelled yet), **Angelina**
(55,445 — PDFs under `files/pdf/elections/`, none precinct-labelled), **Orange**
(56,206 — the elections page carries no results links at all) and **Wichita**
(77,505 — the site 403s every scripted client, so it needs the browser path).

Two bugs this tier shook out, both of which would have bitten on election night:

- **Hrefs with spaces.** Liberty and Angelina link PDFs whose filenames contain
  spaces, and `urllib` rejects those outright with "URL can't contain control
  characters". `links()` now percent-encodes every href it extracts. Liberty went
  from a hard error to eight files.
- **A DNS blip looks like a dead county.** Brazos and Grayson both failed one run
  with "Could not resolve host" while being perfectly reachable a minute later —
  the retry's 3s/15s backoff sat inside the same blip. Worth knowing before you
  read a single run as truth.

## Recipe 5 — the Cloudflare counties

Hays, McLennan and Brazos sit behind Cloudflare, which answers every scripted client
with "Attention Required" — `curl`, `urllib`, HTTP/1.1 or /2, cookie jar,
referer, real user agent, all 403. **Plain headless Chrome is blocked too.**

What gets through is headless Chrome launched with
`--disable-blink-features=AutomationControlled` and a real user-agent string.
`browser_fetch.mjs` does exactly that: it drives system Chrome over the DevTools
Protocol using the WebSocket built into Node 22, so there is nothing to install —
no Playwright, no Selenium, no npm.

How it gets the bytes out: the archive pages are HTML, so the links come from
`Runtime.evaluate`. The documents are then fetched by `fetch()` **inside the
page**, where Cloudflare's clearance cookies apply, and returned as base64. Two
wrinkles that matter if you adapt this:

- **Same-origin only.** McLennan's archive lives on `mclennan.gov` but serves its
  documents from `tx-mclennancounty.civicplus.com`. The script hops to the file's
  own origin before fetching, or the in-page `fetch` dies on CORS.
- **The bare archive index is empty.** `Archive.aspx?lngArchiveMasterID=66`
  renders no list for McLennan; the search form's own URL (with
  `ysnExecuteSearch=1` and a date range) does. The script tries that first and
  falls back.

Verified on October 23, 2026: Hays returns 6 election pages and 19 documents
(the March 3, 2026 Democratic CVR export alone is **119 MB**), McLennan 8
election pages and roughly 50 documents, each with Canvass and Precinct PDFs,
including the ones it runs for Falls and Limestone counties.

Naming is deliberate rather than mechanical. CivicPlus URLs carry no file
extension and the type is only in the link label ("... (ZIP)"), so the script
takes the extension from the label and verifies it against the magic bytes — a
cast vote record saved as `.pdf` would quietly poison anything that later reads
the directory. And because McLennan labels every link just "Canvass (.pdf)", it
names files from the descriptive URL slug instead, qualifying with the election
and a counter so nothing overwrites.

## Joining results to precinct geography

See `geo/GEOGRAPHY_MATCHING.md`. The short version, independently re-verified
against `Precincts26P.dbf` (9,614 rows, zero mismatches):

- The join key is **`PCTKEY`** = `str(int(FIPS)) + PREC.rjust(4,"0")`. The FIPS
  part is *unpadded*, so the key is 6 characters below FIPS 100 and 7 above
  (`610001` Cameron, `2010001` Harris) — never parse it fixed-width.
- Reported labels need normalizing first: strip `PCT`/`Pct.`/`Precinct`, drop
  everything after `" - "` or a trailing `-NN`, remove any `.`, then left-pad
  the numeric head so numeric+alpha is 4 characters. Wood joins **0 of 26**
  labels raw and **26 of 26** normalized.
- **A dot means opposite things in different counties.** Galveston's `232.3` is
  TLC's `2323`; Ector's `110.7` is a split of `0110` and no `1107` exists. Offer
  both readings and let the county's TLC set decide — and offer the faithful one
  first, or Galveston's `230 - BS12` and `230.1 - BS12` collapse onto one
  precinct and the county silently loses a row.
- **Don't rank those patterns — test them.** Counties write the same precinct
  at least six ways (`01` Gregg, `1004-01` Dallas, `137 - BS1` Galveston,
  `232.3` for TLC's `2323` Galveston, `Bald Prairie 4` Robertson, `1A3B` Lamar,
  which is a merged precinct that is a real TLC id and must not be padded).
  Generate candidate forms and accept the first one that exists in TLC's set
  for that county; list anything that matches nothing. That is what
  `extract_gov_sen.py` does, and it resolves every label in all 21 counties.
- Use the **2026 primary** shapefile as the stand-in, not 2024 general. Churn
  across the cycle was large (703 precincts added, 746 dropped, 47 counties
  changed between 24G and 26P) while primary→general churn was negligible
  (1 county in 2024, 5 in 2022). `Precincts26G.zip` is expected around
  January 2027.
- Split rows are **additive everywhere checked**: group by base precinct id and
  sum every row, bare and suffixed alike. Harris emits only split rows
  (`0366 - 215`, no bare `0366`); Tarrant, Wood and Parker emit bare rows *and*
  suffixed ones, and there `bare + splits` reproduces Clarity's own
  `Choice/@totalVotes` per candidate to the vote while `bare` alone falls short
  — by 21% in Wood's Governor race. The suffixes are separately-tabulated ballot
  types (`L01`/`L02` limited, `F99` federal-only, Wood's `Joint COQ`), not
  sub-geographies. Always reconcile the summed county figure against
  `Choice/@totalVotes`; a mismatch means that county's semantics differ and its
  numbers are not ready to publish. (An earlier draft of this note said to drop
  the splits for Tarrant and Wood, inferred from zero templates. That was
  wrong.)

### Extracting the two statewide races

`extract_gov_sen.py` reads every `*_detail.xml` the poller has downloaded,
pulls the Governor and U.S. Senator contests, sums split rows by base precinct,
resolves labels against `Precincts26P.dbf`, and writes one row per
county/precinct/race/candidate with the `PCTKEY` attached:

```bash
python3 -I parse_precinct_pdf.py brazoria         # county PDF -> brazoria_precinct_2026.csv
python3 -I parse_precinct_pdf.py collin
python3 -I extract_gov_sen.py --also brazoria_precinct_2026.csv \
                              --also collin_precinct_2026.csv
python3 -I extract_gov_sen.py --date ''           # include files from other elections
python3 -I tlc_precincts.py geo/downloads/shp26p/Precincts26P.dbf 167   # list a county's TLC ids
```

`--also` folds a CSV that `parse_precinct_pdf.py` already produced into the
same table, re-running the candidate-name normalization over it so a county
PDF's spelling merges with Clarity's. That matters more than it sounds: the
counties agree on `Greg Abbott` but not on `Bradford "Brad" Hall`, which
Hidalgo prints as `Brad Hall`. Case and party prefixes are handled by rule;
genuine name disagreements go in `ALIASES`, deliberately as an explicit list,
because a nickname-collapsing heuristic would quietly merge different people.

It reconciles each county's summed votes against Clarity's
`Choice/@totalVotes` and prints a per-county line with the precinct count, the
count with votes, TLC's count, and any problem. A `total off by {...}` note
means that county's numbers are **not** safe to use — Hood, for example, stages
a November site whose per-precinct vote values are all the string `N/A`, so its
countywide totals are real and its precinct breakdown is empty.

## Statewide fallbacks

**Within 30 days (by ~December 3, 2026).** Tex. Elec. Code 67.017 requires each
county clerk to deliver a report of votes **by county election precinct** —
statewide offices, U.S. Rep, state senator, state rep, and district/county/
precinct offices — to the Secretary of State in an electronic format the SOS
prescribes. The SOS does not publish these, but they exist in machine-readable
form and are obtainable by open-records request. This is the cleanest path to
all 254 counties without scraping any of them.

**Roughly February–March 2027.** The Texas Legislative Council publishes a
statewide VTD-level results file on the Capitol Data Portal, joinable to its VTD
shapefile on `VTDKEY`. Timing anchor: the 2024 general VTD results were posted
**2025-02-25**, about 3.7 months after Election Day, in one annual batch with
that cycle's primaries. The 2026 general precinct shapefile was not up as of
October 23, 2026 (the 2024 equivalent appeared 2025-01-28), so expect
`Precincts26G.zip` around January 2027 and results a month or so later.

Caveat: TLC VTDs are *approximations* of voting precincts and TLC warns its
numbers may differ slightly from official returns. For exact official numbers,
use the county canvass.

## The Clarity list is complete: 32 counties, and that is all of them

Probed all 254 county slugs against `/<slug>/elections.json`, one request each,
on 2026-11-04. **221 return 404** -- the path does not exist, so those counties
are not Clarity customers at all. The 33 that answer are, every one, already in
`SLUGS`; the set difference is empty in that direction.

So the Clarity avenue is exhausted, and the 197 counties this toolkit does not
cover are **all county-hosted PDFs**. That is worth knowing before anyone
spends time looking for a cheaper route into them: there isn't one.

Two wrinkles in the probe worth recording, both of which say the same thing
this toolkit keeps learning about Clarity:

- `Clay` and `Robertson` returned 404 on `elections.json` in that sweep, yet
  Robertson has a working November site (EID 127573, cached). A 404 on the
  listing says nothing about whether a site exists.
- `Liberty`, `Potter` and `Wise` returned 403. All three are county-site
  counties here, so the 403 is a generic edge block, not evidence of Clarity
  membership.

## What is not resolved

Every county in the top 25 now has a verified source. The ~212 counties with no
row detail are small: the 20 largest hold 85% of the state's registered voters,
and everything past rank 25 is under 150k. They are county-hosted PDFs with no
shared pattern, so resolving them means 212 individual lookups — worth doing only
for the specific counties a given analysis needs.

Cameron also links a `livevoterturnout.com` live-results page, but its index path
is county-specific and a probe of the top 60 counties found no other Texas county
using that pattern.

### Ector's per-precinct PDFs are sample ballots, not results

Caught on 2026-11-04 by reading page 1 of every downloaded PDF instead of
trusting the link text. All eight `ector_Pct-*.pdf` files open with
"Sample Ballot ... General and The City of Odessa Election", so the handler has
been resolving the right precincts off the wrong documents. Ector's actual
precinct results are not among the files this toolkit has.

They were still worth reading. Their titles carry `110.10`, `110.7`, `204.3`,
`206.5`, `206.6`, `206.8`, `310.1`, `311.7` and `314.2`, none of which exists in
TLC even dot-stripped, while TLC Ector is 41 whole precincts `0101`-`0412`. So
in Ector a dot separates precinct from split (`110.7` is a split of `0110`) --
a third split notation after Tarrant's `" - L01"` and Dallas's `-01`, and the
opposite of Galveston, where the dot lives inside the precinct id. See
`geo/GEOGRAPHY_MATCHING.md`.

### Parsing a county "Precinct Results Report"

`parse_precinct_pdf.py` reads the Hart/ES&S report layout via
`pdftotext -layout`. Brazoria's November 3, 2026 file is the first one to
appear: 1,163 pages, **83 precincts** (TLC has 84), both statewide races,
138,802 Governor votes, and every precinct/race sums exactly to the report's
own `Cast Votes` line. Two details the layout forces:

- The precinct heading repeats on every page, so the parser re-declares the
  precinct instead of carrying it across page breaks.
- That heading ends in `= 45.16%`, the same shape as the page header's
  `142625 of 262259 = 54.38%`, so it has to be claimed before the
  header-noise filter runs or every precinct id is swallowed.

Only the final `Total` column is kept; absentee / early / election-day splits
are in the PDF if they are ever wanted.

### Collin: readable after all, from a 99.3% download

The earlier conclusion here -- that Collin's November report was unusable --
was wrong, and wrong in an instructive way. Only the report's **front matter**
is rasterized. A 3 MB sample from the middle of the file holds 30 image
XObjects against 107 text operators, so the body pages carry text. Judging a
657 MB PDF by its first 3 MB was the mistake.

What it actually is: a JasperReports/Electionware **"Precinct Summary"**,
3,424+ pages, one block per reporting unit per contest, `PCT 139` headings and
`REP Greg Abbott  312  24.47%` rows. `parse_precinct_pdf.py collin` reads it:
**267 precincts and 20 limited-ballot boards, 454,327 Governor votes**, every
block reconciling to its own `Total Votes Cast` line.

Three things in that layout each silently cost precincts or votes:

- **Two kinds of reporting unit.** 267 `PCT nnn` precincts and 20 `LB nn`
  limited-ballot boards. Matching only `PCT` leaves every LB block attributed
  to whichever precinct came last, which put 2,531 stray votes into precinct
  0271 -- a precinct that cast 618. LB votes are real and in the county total
  but belong to no precinct, so they are kept under their own id with
  `tlc_match=ballot_board` and no `PCTKEY`.
- **A unit that cast nothing has no percentage column.** `REP Greg Abbott  0`
  with no `0.00%`. A regex that requires the percent drops those blocks
  entirely; three precincts vanished that way.
- **A watermark bleeds into the text.** "Collin County Seal", "Watermark Seal
  for Collin County." and "Collin County Government" appear mid-table, so a
  parser cannot assume the lines after a column header are all candidates.

**The last 4.7 MB cannot be downloaded.** The file is 688,796,823 bytes; 684,109,824
of them arrive fine, and then the CDN delivers exactly 4,096 bytes of any range
in the tail and stalls -- the same with and without compression, in 256 KB
chunks, and on resume. Poppler reconstructs the xref and reads the truncated
file anyway, so this is not fatal, but seven precincts (`0001`, `0002`, `0202`,
`0269`, `0270`, `0272`, `0273`) are missing with it. Measured against Collin's
own countywide summary report, the parse is short **4,476 Governor votes of
458,803 (0.98%)** and 4,468 Senate votes of 458,325. Re-fetch when the CDN
heals; the archived copy is `collin_precinct_nov2026_partial.pdf`, named for
what it is.

### Harris's November report is published but not machine-readable

`november-3-2026---joint-general-and-special-election---precinct-results-report---unofficial-totals.pdf`
exists and returns 200, but `Content-Length` is **688,796,823 bytes** and the
file is raster-only: the first 3 MB alone holds 10,840 `/Subtype/Image` XObjects
of 50x5 pixels each and **zero text objects**, so `pdftotext` returns nothing.
Collin's results page offers no CSV or XLS, and its other November 3 artifacts
(summary, reconciliation, early-voting summary, write-in summary) are all
countywide. So county #6 (752,502 voters) has no usable precinct feed until
either the canvass is posted in a different form or someone OCRs 689 MB of
tiles. Brazoria is the contrast that shows this is a per-county export setting
and not a format limit: same report, same vendor layout, 6.7 MB with a clean
text layer, and `parse_precinct_pdf.py` reads all 83 precincts out of it.
Harris is a third variant -- its `cumulative.pdf` is posted and parses, but it
is countywide at 0 of 3,021 precincts and `precinct.pdf` still 404s.

### A manifest "ok" used to mean the server offered the file

Fixed in `fetch_all.py`. `do_county_site` set `status: "ok"` when any candidate
file returned HTTP 200, regardless of whether the download then succeeded.
Collin and Ellis both had `status: 200` with an `error: "The read operation
timed out"`, no `path` and no `sha256`, and the run still reported them as
online -- which inflated one coverage line to "41/57 counties, 78.7% of Texas"
when neither county's file was on disk. `ok` now requires a written path with
no error (a discovery run with no `--download` still counts a reachable 200),
a failed save reports `download failed: <reason>`, and the advertised size moves
to `content_length` so the manifest's `bytes` only ever counts bytes held.

### Where each missing large county stood on November 4, 2026

Checked by hand that afternoon, after the day's automated sweeps, so these are
the reasons a county is absent rather than a guess at them.

| County | Voters | Status |
| --- | --- | --- |
| Harris | 2,702,952 | Its "Live Results" page is empty post-election, with no iframe or feed, and no API answers (`results.`/`electionresults.harrisvotes.com` do not resolve; `/api/results` 404s). `cumulative.pdf` only, countywide, 1,392,280 counted. `precinct.pdf` 404s, and probing `Data/1126/` for 63 name/extension combinations found nothing else. No prior-election directory (`Data/1124/` etc.) exists to learn the eventual filename from. |
| Collin | 752,502 | **Resolved** -- parsed from the 657 MB precinct report, 267 precincts, 0.98% short because the file's last 4.7 MB will not download. See above. |
| Montgomery | 469,174 | Nothing for November. Four predicted filenames under `results/` all 404, and the results page's newest links are the May 2026 runoff. |
| Hays | 193,013 | Archive's newest election is the May 26, 2026 primary runoff. November not posted. |
| McLennan | 158,055 | Same: newest is May 26, 2026. It posted November 4, 2025 about nine days after that election, so expect mid-November. |
| Brazos | 138,990 | Has a November 3, 2026 report, but it is the Cumulative (countywide) one, already downloaded. No precinct report yet. |
| Smith | 160,066 | Laserfiche portal's newest document is the 2026-06 precinct report. Five download endpoints tried (`DocumentProxy.aspx`, `api/Document/{id}/Download`, `Download.aspx`, two REST paths); all 302 to a landing page or 404. Moot for now -- there is no November document to fetch. |
| Johnson | 132,109 | Precinct-by-precinct archive found (see `PAGE_ONLY`); newest is May 2026. |
| Wichita | 77,505 | Live November 3 numbers, countywide only. Not a precinct source. |
| Orange | 56,206 | Publishes one countywide Summary Results Report per election. Does not appear to publish precinct results at all. |
| Angelina | 55,445 | November 3 folder exists with public-test and early-voting PDFs; no results file in it yet. |
| Comal, Guadalupe, Montague, Clay | 211,075 | No Clarity site; band-scanned cleanly. |
| The other 197 counties | 2,360,000 | None is on Clarity (see above). The largest is Harrison at 47,042, and sampling the top six found no November precinct results posted -- the "precinct" hits on San Patricio's and Hardin's pages are polling-place maps. TLC's statewide VTD results file, expected around February 2027, covers all of them for free. |

### "counties_with_data" in the manifest is not November coverage

The 2026-11-04 12:02 manifest says `counties_with_data=45`, and 14 of those 45
are counties whose only held files are from earlier elections -- Montgomery's
newest is the May 2026 runoff, Ector's eight files are November 2026 *sample
ballots*, Wise's is November 2024. A county counts as `ok` when we hold a file
it offered, which is the right meaning for "is this scraper working" and the
wrong one for "do we have this election".

Harris is the clearest case: `ok`, two files, and neither is precinct-level.

**The authoritative November number is the one `extract_gov_sen.py` prints**,
because it reads `ElectionDate` out of each file and skips anything that is not
the target election. On 2026-11-04 that is 31 counties staged, 29 usable, and
4,941 precincts. Do not quote the manifest's county count as coverage.

## Geographic coverage

Short version: **the geography is complete and the results are at half.** There
is no geographic gap to close -- `Precincts26P.shp` holds all 9,614 precinct
polygons for all 254 counties, in EPSG:3082 (NAD83 / Texas Centric Lambert
Conformal, metres). Note that this project's cross-repo `EPSG_STATE` table uses
`TX=2845`, a state-plane zone, so these polygons need reprojecting before they
go into that pipeline.

| | polygons | share |
| --- | --- | --- |
| Precinct polygons statewide | 9,614 | 100% |
| ...with a Governor/Senate row | 5,023 | 52.2% |
| ...with at least one vote | 4,736 | 49.3% |

`geo/coverage_by_county.csv` has the per-county breakdown and
`coverage_map.py` draws `geo/coverage_map.svg` from the shapefile directly, no
GDAL. Full detail, including the verification that the drawing is oriented
correctly, is in `geo/GEOGRAPHY_MATCHING.md` section 7.

## Locating the other 212 counties

`discover_county_sites.py` walks three stages per county, each stopping as soon
as it succeeds: guess the hostname by convention, follow the homepage link that
looks like an elections department, then take the link on that page that looks
like election results.

Four things it learned the hard way, all now in the code:

- **A county hostname can be someone else's.** `co.harrison.tx.us` has lapsed
  and 302s to a campaign-tracker domain. Following a county name wherever it
  points means scraping, and recording, whoever bought the expired name. The
  final host now has to still look like the county's -- a `.tx.us`/`.tx.gov`/
  `.gov` host, or one containing the county name -- and Harrison then resolves
  correctly to `harrisoncounty.org`.
- **The first elections-ish link is usually the wrong one.** Coryell lists
  "County Clerk" above "Elections", and the clerk's site carries no results.
  Candidates are ranked (an `elections` match in the link text beats one in the
  href, which beats "voter"/"clerk") and up to three are tried.
- **A site's own search page matches "results".** Hardin resolved to
  `page/search.results` before that was excluded; with the filter it resolves
  to `hcelectioncenter.hardincountytx.gov/results/`.
- **Some counties publish nothing and link to the state.** Kerr's elections
  page pointed at `electionresults.sos.state.tx.us`. That is a fact about the
  county, not its results page, so it is recorded as a note instead.

**One more trap, and the worst of them: a county name does not identify a
county.** The crawl found `knoxcounty.org` for Knox County and downloaded a
perfectly well-formed "Precinct Results Report" for **Knox County, Tennessee**
-- Marsha Blackburn for Governor. It parsed without a single error and would
have put Tennessee votes into a Texas table silently. `parse_precinct_pdf.py`
now refuses a document that names another state, deliberately narrowly: plenty
of genuine Texas reports never print the state at all (Brazoria's header is
just "Brazoria County"), so the test rejects a file that names a *different*
state rather than one that names none.

Two of the crawler's own bugs are worth recording, because both destroyed work
rather than merely failing:

- **`--only` was filtered by the inventory.** Naming eight counties explicitly
  still ran them through the "counties with no results_url" filter, which by
  then was empty, so the run processed nothing -- and wrote its empty result
  over the finished 212-county crawl, leaving `county_sites.csv` as a header
  alone. It was rebuilt from the inventory, which had already absorbed the
  findings. `--only` now bypasses the filter, and the script refuses to write
  its output file when it has no rows.
- **Four counties failed on a space.** `page/Elections 2026` and
  `upload/page/9613/Bond Election.pdf` raised `InvalidURL` because nothing was
  percent-encoding the path. Nine more answered 403 to a bare `User-Agent`;
  they accept a fuller set of browser headers.

The output is candidates, not verified sources: a row says where a county's
results page appears to be, and nothing yet confirms a precinct-level file sits
behind it. `merge_discovered_sites.py` fills `results_url` for counties that had
none and leaves the 42 hand-verified rows untouched.

## Countywide totals as a floor under the precinct data

Precinct data is the goal, but plenty of counties post a countywide
"Cumulative Results Report" on election night and hold the precinct breakdown
until the canvass. Refusing to read those leaves the table emptier than the
published record actually is -- **Harris published 1,383,460 Governor votes on
election night and no precinct file at all.**

`county_totals.py` writes one row per county/race/candidate with a `level`
column:

- `precinct-derived` -- the county total obtained by summing
  `gov_senate_precinct_2026.csv`. Better data; this is where a county lands as
  soon as its precinct report appears.
- `countywide` -- read from the county's own countywide report.

A county is upgraded automatically: the precinct sum takes precedence, so when
Harris posts `precinct.pdf` its row simply changes level on the next run.

**Coverage, November 4 evening:** 44 counties, **13,430,021 of 18,657,918
registered voters = 72.0%** — 36 counties precinct-level (56.5%) plus 8
countywide-only (15.5%: Harris, Brazos, Blanco, Concho, Deaf Smith, Floyd,
Llano, Terry).

### Three countywide layouts, and the same bug in each

Every one of these parsers first shipped with a race left open across a
contest boundary, and each time the symptom was a wildly inflated total:

- **Hart/Electionware cumulative** (Harris, Concho, Deaf Smith, Floyd, Llano,
  Brazos): a candidate line carries one `number percent%` pair per voting
  method, and the **last pair is the total** -- Concho prints four pairs,
  Harris six, so counting columns does not work. Taking the contest name from
  the line above each `Choice  Party` header is what bounds a contest; without
  it Brazos's State Senator rows landed in U.S. Senator and doubled it to
  **159,323 against a true 80,000**.
- **Electionware summary, TOTAL first** (Terry): no percentages at all, so the
  first number is the total, and the contest is bounded by its `Vote For n`.
- **Secretary of State county report** (Blanco): a wide table whose office
  column is filled only on an office's first row. Two regex attempts produced
  first a candidate called "Governor Greg Abbott" holding the county's 5,487
  votes, then nothing at all. Splitting on runs of two or more spaces and
  working by position -- last five fields numeric, candidate before them,
  office before that when present -- is what the layout actually is.

Each Hart-layout county is checked against the `Cast Votes` line the report
prints for itself. All eight reconcile exactly.

## Why coverage is at half, and when it stops being

Stated plainly, because the percentages above can mislead in both directions.

**The gap is precincts, not voters, and it is not the small counties.** 225
counties have no results. They hold **4,686 of 9,614 precincts (48.7%)** but
**5,818,651 of 18,657,918 registered voters (31.2%)**. Within that gap:

| | precincts | share of state |
| --- | --- | --- |
| Harris alone | 1,224 | 12.7% |
| The next 11 missing counties | 906 | 9.4% |
| The remaining ~213 counties | 2,556 | 26.6% |

So Harris is an eighth of every precinct in Texas by itself, a dozen counties
are another fifth, and the long tail averages 21 precincts each.

**Correction, same day: discovery *was* part of the bottleneck.** The paragraph
below was written before `discover_county_sites.py` ran, and the crawl
disproved it. It located results pages for **156 of the 212 counties that had
none**, and 25 of those counties had *already published* November 3, 2026
results -- several explicitly by precinct (Briscoe "Unofficial Results By
Precinct", Brooks "Precinct Results-11-3-2026.pdf", Hemphill "UNOFFICIAL
RESULTS BY PRECINCT", Jim Hogg, Lipscomb, Matagorda, Dawson, Fayette). The
earlier conclusion rested on a six-county sample in which four of the URLs were
guesses that never resolved. Small counties publish on election night as
readily as large ones; nobody had found their pages. Six of the 25 are the same
Hart layout Brazoria uses and parsed immediately.

What survives of the paragraph below is the part about the *mid-size* counties,
which is still true and still the reason coverage is near half: Harris,
Montgomery, Hays, McLennan, Smith and the rest have not posted.

**For the mid-size counties, publication is the bottleneck.** `tx_2026_precinct_sources.csv`
has a `results_url` for only 42 of 254 counties, which looks like the thing to
fix -- but the 14 mid-size counties whose pages *are* resolved tell the real
story. On 2026-11-04, every one of Bowie, Henderson, Potter, Randall, Tom
Green, Liberty, Wise, Taylor, Grayson, Ector, Montgomery, Cameron, Webb and
Brazos had **no November precinct report posted**. Ector's November files are
sample ballots; Brazos's is the countywide cumulative. Fourteen for fourteen.
Finding 212 more county pages would currently find 212 more pages with nothing
November on them.

**The dates that actually govern this.** A county's local canvass is held
between the 3rd and 14th day after the election (Tex. Elec. Code 67.003), so
**November 6-17**, and the precinct-level report each county owes the Secretary
of State is due within 30 days (67.017), so **by December 3**. That window, not
any amount of scraping, is when the rest of the state appears.

**Which is why the timer no longer stops on November 6.** It did, and that was
a real mistake: it would have switched itself off before the first canvass was
even due. `STOP_AFTER` is now 2026-12-05, with a daily discovery-and-download
phase from November 7 through December 5. A county posts its canvass once, so
daily is enough, but it has to keep happening for a month.

### The 25 November documents, sorted out

| Outcome | Counties |
| --- | --- |
| **Parsed, Hart layout** | Brooks 5/5, Dawson 9/9, Jim Hogg 5/5, Lipscomb 7/7, Matagorda 18/18 |
| **Parsed, Electionware layout** | Fayette 12/12, Hemphill 7/7 |
| Countywide only, no precinct breakdown | Blanco (it is the Secretary of State's own county report), Concho, Deaf Smith, Floyd, Llano, San Augustine, Swisher, Wilson |
| Image-only scan, OCR does not reconcile | Briscoe, Cochran, Collingsworth, Hockley, Lampasas, Madison, Maverick, McMullen, Pecos |

All seven parsed counties match TLC's precinct count exactly.

### A third report layout: Electionware summary by precinct

Fayette and Hemphill publish the same report family as Collin, but with TOTAL
first and then Absentee / Early / Election Day and **no percentage column**, so
a candidate line carries four numbers and the first is the total. Two things
about it cost real work:

- **The precinct heading has no fixed form.** Fayette writes "Precinct 101
  North", Hemphill a bare "101". What identifies either is the `Statistics`
  block underneath -- and in Fayette that sits below the column header, not
  directly beneath, so the check has to look a few non-blank lines ahead.
- **Hemphill prints no `Total Votes Cast` line at all.** A parser that only
  closes a contest on a terminator keeps the previous one open and piles every
  later contest into it: Governor came out at **28,226 votes in a county of
  3,000**. Contests are now bounded by their own headings, each of which is
  followed by "Vote For n", so no terminator need exist.

### OCR: built, gated, and currently refusing everything

`--ocr` rasterizes with `pdftoppm` and reads with `tesseract`. It exists because
this layout carries its own checksum -- every row prints TOTAL beside Absentee,
Early and Election Day -- so the OCR can be checked rather than trusted.

It is checked, and it fails. Swisher's scan reads cleanly, but Swisher's report
is countywide anyway. Briscoe's is genuinely per-precinct and its OCR gives
`Greg Abbott: 19` where the columns say `7+8+11`, `Ken Paxton: 180` against
`6+114+30`, precinct totals 2-3x off, and only 1 of 5 precincts detected at all.
Cochran's hand-ruled grid is worse: `rgaboor———«|=—276| 29]`.

So the parser **refuses to write a CSV** when an OCR run fails its own
arithmetic, rather than producing a file that looks publishable. Nine counties
sit behind that gate. They need either a text-layer republication from the
county or a human reading the scans -- not a better regex.

### Second pass: more URLs, no more precincts

Re-ran the 56 counties the first pass could not resolve, with a deeper crawl:
results links recognized by year, month, "unofficial", "canvass", "returns" or
"precinct" rather than only the word "results"; one extra level followed through
archive and document-center pages; URLs percent-encoded; fuller browser headers;
four more host conventions including `<county>county.texas.gov`.

**It resolved 24 of the 56, and added zero precincts.** The inventory now has a
`results_url` for 248 of 254 counties:

| | counties |
| --- | --- |
| Verified by hand against real files | 42 |
| First pass, looks like a results page | 156 |
| Second pass, lower confidence | 24 |
| Elections page located, no results link found | 26 |
| Nothing reachable | 6 |

**Precision falls off at this depth and the column says so.** Of the 24, about
a third are genuine results destinations; the rest are precinct *maps*
(Chambers, Duval, La Salle), justice-of-the-peace pages (Dallam, Hale, Scurry),
a meeting notice (Calhoun), a treasurer's report (Irion), a city council page
(Uvalde) and the county tax office's web vendor (Coryell). Those are recorded
with `LOW CONFIDENCE` in `format_notes` rather than dropped, since a human can
sort them in seconds and a crawl cannot.

The eight genuine leads were all chased to the document:

| County | What it actually is |
| --- | --- |
| Terry | November Summary Results Report -- **countywide**, no precinct sections |
| Marion | `Cumulative-Results-11-3-2026` -- countywide (and the link 404s) |
| Culberson | "Cumulative Unofficial Results" -- countywide |
| Nacogdoches | Cumulative Results Report, 20 of 20 precincts reporting but **no breakdown**; scan, no text layer |
| Sterling | November results PDF, image-only scan |
| Comanche | the "Precinct N" links are sample ballots |
| Val Verde | only the March primary so far |
| Polk | `Precinct Results-3-3-2026` -- the March primary |

So the gap that remains is not a discovery gap any more. It is counties that
publish only countywide totals, counties that publish images, and the dozen
mid-size counties that have not published at all.

### Reading a scanned countywide report, and the three checks that make it safe

`county_totals.py --ocr` rasterizes and OCRs the countywide reports that are
image-only. Countywide OCR is far more tractable than per-precinct -- a handful
of rows instead of hundreds -- but it still reads digits wrong, so it is gated.

**Structure does not survive a scan; candidate names do.** Nacogdoches's
contest heading comes through as `Official - 2026 November 3rd Precincts
Reporting` while the row beneath it reads `GINA HINOJOSA DEM 382 50.20% 6,653
44.41% 1,750 29.96% 8785 40.70%` perfectly. So rows are assigned by the
candidate they name, using the ballot learned from the counties whose precinct
data we already hold, and the contest heading is ignored entirely.

Three checks, each catching what the others miss:

1. **The two races must agree.** Governor and U.S. Senator are both top of the
   ballot, and across the 44 counties read from verified sources their county
   totals never differ by more than **1.53%**, averaging 0.295%. That rejected
   Nacogdoches (98% apart), Culberson (51%) and San Augustine (32%).
2. **Implied turnout must be plausible** (10-95% of registered). This catches a
   read that went wrong in both races by the same factor, which check 1 cannot.
3. **The report's own `Total Votes Cast` is authoritative.** Only the party
   candidates are read from rows; the write-in figure is the remainder. This
   matters because the itemized write-ins are a *breakdown* of the write-in
   total, not extra votes -- Wilson prints `Write-In Totals 23` then Jenn Mack
   15, Mike Miller 1, Not Certified 7, summing to the same 23. Adding both
   double-counted it, and **check 1 waved that through at 0.05%** because the
   error was small. A county with no readable total is rejected, which is why
   Swisher is out: its report prints no total line at all.

Wilson passes all three and reconciles to its printed 22,072 exactly.
Culberson, Nacogdoches, San Augustine, Sterling and Swisher are rejected with
the reason recorded.

**One design mistake worth keeping in view.** The refusal gate originally read
the text of its own `notes` list, checking for the word "provisional". Rewording
the success message to something more accurate turned it into a refusal and
silently dropped Wilson. Control flow now follows an explicit flag, and the
note only describes what happened.
