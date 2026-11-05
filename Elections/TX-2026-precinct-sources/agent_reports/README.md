# Agent working area

Four agents were given disjoint tracks on 2026-11-04. Each writes only into
this directory, plus downloads into `~/tx-2026-enr/files` named
`<county_slug>_nov2026_<something>`. None of them edits the shared parsers
(`parse_precinct_pdf.py`, `county_totals.py`, `extract_gov_sen.py`) or the
shared outputs (`gov_senate_precinct_2026.csv`, `county_totals_2026.csv`,
`county_sites.csv`), so their work cannot collide with each other's or with
the main thread's.

| Track | Scope | Output |
| --- | --- | --- |
| layouts | the 28 November files already held but not yet parsed | `layouts.md`, `layouts.csv` |
| track-b | the 132 counties whose results page showed no November document | `found_b.csv` |
| track-c | the 33 counties with no results URL at all | `found_c.csv` |
| big | the 12 large counties that have published nothing precinct-level | `big_counties.md` |
