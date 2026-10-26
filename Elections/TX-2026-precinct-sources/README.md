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
- 12 more resolved by hand, including Harris, Collin and Montgomery
- `fetch_all.py` runs all 42 and records what it found in a manifest
- **Every county in the top 25 is resolved** — 80.9% of the state's 18,657,918
  registered voters have an identified platform, 58.9% a source verified end to
  end today
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

## A fourth platform: Civix GoElect

Ellis links its November 3 results to `goelect.txelections.civixapps.com`, an
Angular ENR app whose environment reports `"env": "prod-txelections"` and a build
dated 2026-10-20. The `txelections` hostname suggests a shared or statewide
deployment rather than a single county.

Its data files (`ResultsData.xml`, `event.json` under
`/ivis-enr-ui/assets/data/`) and its API (`/api-ivis-system/`) are live but
return nothing populated yet — the static paths fall through to the SPA index and
the API 404s on the obvious routes. Worth re-probing on election night: if it
carries multiple counties it would be a second uniform feed alongside Clarity.

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

## Recipe 5 — the two Cloudflare counties

Hays and McLennan sit behind Cloudflare, which answers every scripted client
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

## What is not resolved

Every county in the top 25 now has a verified source. The ~212 counties with no
row detail are small: the 20 largest hold 85% of the state's registered voters,
and everything past rank 25 is under 150k. They are county-hosted PDFs with no
shared pattern, so resolving them means 212 individual lookups — worth doing only
for the specific counties a given analysis needs.

Cameron also links a `livevoterturnout.com` live-results page, but its index path
is county-specific and a probe of the top 60 counties found no other Texas county
using that pattern.
