# FiveThirtyEight Data Archive

Complete archive of the datasets indexed at https://data.fivethirtyeight.com,
captured **2026-08-18**.

FiveThirtyEight (ABC News) published the data behind its articles and graphics
under [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/) (data) and
[MIT](http://opensource.org/licenses/MIT) (code). Attribution: FiveThirtyEight.

## Contents

- `datasets.json` — the site's own index of all 164 datasets (name, article
  links, file URLs). This is the map for everything below.
- `data/` — snapshot of the main [fivethirtyeight/data](https://github.com/fivethirtyeight/data)
  repository (master branch), which holds most datasets, one folder each with
  its own README.
- One folder per satellite repository, snapshots of the default branch:
  `checking-our-work-data`, `covid-19-polls`, `nfl-elo-game`,
  `negro-leagues-player-ratings`, `police-settlements`, `superbowl-ads`,
  `election-results`, `WNBA-stats`, `nba-player-advanced-metrics`,
  `candidate-emails`, `twitter-overlap`, `actblue-analysis`,
  `russian-troll-tweets`, `redistricting-atlas-data`, `uber-tlc-foil-response`.
- `projects.fivethirtyeight.com/` — the 82 CSVs that the site served directly
  from projects.fivethirtyeight.com and that are **not** in any GitHub repo
  (poll averages, Elo game logs, 2018/2020/2022 forecast toplines, SPI soccer
  ratings, Trump approval, generic ballot, etc.), with their URL paths
  preserved. E.g. `projects.fivethirtyeight.com/polls-page/data/president_polls.csv`
  mirrors https://projects.fivethirtyeight.com/polls-page/data/president_polls.csv.

  As of the capture date these URLs no longer serve data (ABC returns an HTML
  page), so each file here is the **last good Wayback Machine capture**
  (mostly March 2025 snapshots, via `web.archive.org/web/<timestamp>id_/<url>`,
  which returns the original bytes).

Repository snapshots are working-tree only (no `.git` history).

Two files in the main repo are stored upstream in Git LFS and exceed GitHub's
100 MB file limit, so they are archived here gzipped (full original content):
`data/scrabble-games/scrabble_games.csv.gz` (164 MB uncompressed) and
`data/science-giving/science_federal_giving.csv.gz` (121 MB uncompressed).
