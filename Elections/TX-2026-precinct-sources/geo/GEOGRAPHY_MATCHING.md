# Joining Texas November 3, 2026 precinct results to precinct geography

Research notes, written November 2, 2026 — the day before the election, so **no
November 2026 results exist yet**. Everything below about reported labels comes
either from live Clarity *zero templates* for November 3, 2026 (real precinct
rosters, all vote counts zero), from a prior election's published report, or from
the label formats already recorded in `../README.md`. Each claim is tagged
**verified** or **inferred**.

Tooling note: no `geopandas`, `pyshp`, or `dbfread` on this machine, but
`ogr2ogr`/`ogrinfo` (GDAL 3.11.0) are at `/usr/local/bin`, and that is all this
needed — the work is attributes, not geometry. Nothing was installed.

---

## 1. The join key

### Verified field list

`Precincts26P.shp` (and `Precincts24G.shp` — **identical schema**):

| Field | Type | Example | What it is |
| --- | --- | --- | --- |
| `CNTY` | Integer64 | `29`, `201`, `439` | County FIPS, **no leading zeros** |
| `COLOR` | Integer64 | `1`–`7` | Cartographic fill index. Not an identifier; differs between vintages for the same precinct |
| `PREC` | String | `1001`, `0001`, `001C`, `30A4` | Precinct id, **always exactly 4 characters**, zero-padded, may contain letters |
| `PCTKEY` | String | `291001`, `2010001`, `277001C` | **The join key.** `CNTY` as text + `PREC` |
| `cntykey` | Integer64 | `15` (Bexar), `101` (Harris) | County's alphabetical index, 1–254 |
| `Shape_area` | Real | | |
| `Shape_len` | Real | | |

There is **no county-name field in the shapefile**. Get names from the companion
spreadsheet.

### PCTKEY construction — verified exactly, zero exceptions

```
PCTKEY = str(int(FIPS)) + PREC          # FIPS with leading zeros stripped
                                        # PREC left-padded with '0' to 4 chars
```

Checked against all 9,614 rows of `Precincts26P_Districts.xls`: **0 mismatches.**
So `PCTKEY` is 6 characters for counties with FIPS < 100 and 7 characters
otherwise — `610001` (Cameron) vs `2010001` (Harris). A fixed-width parse of
`PCTKEY` is therefore wrong; split on `len(PREC) == 4` from the right, or just
rebuild it from `CNTY` and `PREC`.

`PCTKEY` is **unique statewide** (9,614 distinct over 9,614 rows in 26P;
9,657/9,657 in 24G).

### Use the spreadsheet, not the shapefile, for key work

`Precincts26P_Districts.xls` is a 1.2 MB exact mirror of the 45 MB shapefile's
identity columns. Verified: the set of `PCTKEY` values in the `.xls` **equals**
the set in the `.shp` (and likewise for 24G). Columns:

```
FIPS      '001'        zero-padded 3-char county FIPS (text, unlike shapefile CNTY)
FENAME    'ANDERSON'   county name
PREC      '0001'       4-char precinct id
PCTKEY    '10001'      the join key
PlanC2333 5            Congressional district, 2026 plan
PlanH2316 8            State House
PlanS2168 3            State Senate
PlanE2106 10           State Board of Education
```

So this file **is** the precinct→district crosswalk, already tabular. Two traps:

- The county-name column is `FENAME` in 26P/24G/24P but **`COUNTY`** in 22P/22G.
- The congressional plan column is **`PlanC2333`** for 2026 and `PlanC2193` for
  2024 — Texas's mid-decade congressional redistricting. House/Senate/SBOE plan
  ids are unchanged (`PlanH2316`, `PlanS2168`, `PlanE2106`). Do not hardcode
  `PlanC*`; match on the `PlanC` prefix.

### Projection

The `.prj` is a **custom** NAD83 Lambert Conformal Conic with no EPSG code:
false origin 31.1667N / 100W, standard parallels 27.4167 and 34.9167,
false easting and northing both 1,000,000 m. These parameters do **not** match
EPSG:3082 (NAD83 / Texas Centric Lambert Conformal, which uses lat_0=18,
parallels 27.5/35, and false origin 1,500,000/5,000,000). Reproject from the
`.prj` itself; do not assume an EPSG for this layer.

---

## 2. Is 2026-primary geography usable for November 2026 results?

**Yes — this is the strongest finding here.** Precinct rosters barely move
between a March primary and the following November general. They move a lot
*between cycles*.

Measured by comparing `PCTKEY` sets per county across TLC vintages:

| Transition | Precincts | Added | Dropped | Counties changed |
| --- | --- | --- | --- | --- |
| **22P → 22G** (primary→general) | 9,584 → 9,586 | 20 | 18 | **5 / 254** |
| **24P → 24G** (primary→general) | 9,652 → 9,657 | 5 | 0 | **1 / 254** (Brazos only) |
| 22G → 24P (cross-cycle) | | 98 | 32 | 19 / 254 |
| **24G → 26P** (cross-cycle) | 9,657 → 9,614 | **703** | **746** | **47 / 254** |

99.95% of 24G precinct keys were already present in 24P; 99.79% for the 2022
pair. Against that, only 92.69% of 26P keys existed in 24G.

**Conclusion.** `Precincts26P.zip` should carry on the order of **99.8%+** of the
precincts that report on November 3, 2026, and it is by far the best available
stand-in. Using `Precincts24G.zip` instead would be a serious mistake — 47
counties and ~1,450 keys of drift. Expect a small unmatched residue in a handful
of counties and reconcile it when `Precincts26G.zip` appears (the 24G equivalent
was posted 2025-01-28, so plan on roughly January 2027).

### Counties that changed most, 24G → 26P

Full table in `churn_24G_to_26P.csv`. The worst:

| County | 24G | 26P | Added | Dropped | % of keys changed |
| --- | --- | --- | --- | --- | --- |
| Tarrant | 844 | 707 | 189 | 326 | 49.9% |
| Dallas | 885 | 791 | 53 | 147 | 21.3% |
| **Smith** | 75 | 66 | 66 | 75 | **100%** |
| Fort Bend | 175 | 201 | 83 | 57 | 54.3% |
| Travis | 287 | 308 | 43 | 22 | 19.7% |
| Brazos | 113 | 77 | 1 | 37 | 33.3% |
| Hays | 87 | 88 | 12 | 11 | 23.2% |
| Red River | 29 | 22 | 7 | 14 | 58.3% |
| Austin | 15 | 10 | 7 | 12 | 86.4% |

Smith is a **complete renumbering**, verified: 24G was `0001`–`0085`; 26P is
`0100, 0103, 0106 … 0454` (commissioner-precinct prefix, stepping by 3). Any
crosswalk built on Smith's 2024 labels is worthless for 2026.

Harris, Bexar, Collin, El Paso and Denton only *added* precincts (0 dropped) —
growth, not reshuffling, so their existing keys stayed stable.

### Caution on precinct counts from other sources

`county57_precinct_counts.csv` compares, for the 57 toolkit counties, the TLC 26P
count against the March 2026 SOS count in `../tx_counties_ranked.csv`. The SOS
figure is **exactly TLC + 1 in 40 of 57 counties** and equal in 4 more — that
regularity means the +1 is a counting artifact, not churn. Do not read it as a
missing precinct. The genuine outliers worth investigating are:

Denton (SOS 155 vs TLC 252), Fort Bend (295 vs 201), Smith (142 vs 66),
Harris (1,166 vs 1,224), Webb (94 vs 78), Guadalupe (90 vs 78),
El Paso (228 vs 236), Hays (94 vs 88).

Smith's and Webb's gaps are consistent with those counties counting **splits**
where TLC counts whole precincts (see §4).

---

## 3. Normalization: reported label → `PREC`

### One rule covers almost everything

```python
import re

def to_prec(label: str) -> str:
    s = label.strip()
    s = re.sub(r'^(PCT|PRECINCT|PRECINCT PART)\s*\.?\s*', '', s, flags=re.I)
    s = s.split(' - ')[0].strip()           # drop any split suffix
    m = re.fullmatch(r'(\d+)([A-Za-z0-9]*)', s)
    if m:
        num, suf = m.groups()
        return num.zfill(max(0, 4 - len(suf))) + suf
    return s

def to_pctkey(fips3: str, label: str) -> str:
    return str(int(fips3)) + to_prec(label)
```

Three things it does, in order: strip a `PCT`/`Pct.`/`Precinct` prefix; discard
everything after a `" - "` separator; left-pad the numeric head with zeros so the
numeric part plus any alphabetic suffix totals 4 characters.

That last step is what makes `1C` → `001C` and `1A3B` → `1A3B` both work.

### Verified against live November 3, 2026 rosters

Six Clarity counties had live `detail.xml` for `ElectionDate 11/3/2026`, fetched
November 2, 2026. Clarity now 403s a bare `curl` behind CloudFront — a browser
`User-Agent` and `Referer` were required.

| County | FIPS | Reported labels | Bare | Split | TLC 26P | Matched raw | Matched after rule |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Bexar | 29 | 806 | 806 | 0 | 806 | 806 | **806 / 806** |
| Fort Bend | 157 | 201 | 201 | 0 | 201 | 201 | **201 / 201** |
| Tarrant | 439 | 2,985 | 707 | 2,278 | 707 | 707 | **707 / 707** |
| Victoria | 469 | 35 | 35 | 0 | 35 | 0 | **35 / 35** |
| Wood | 499 | 26 | 14 | 12 | 14 | 0 | **14 / 14** |
| Lamar | 277 | 25 | 25 | 0 | 26 | 7 | **25 / 25** |

100% of reported whole precincts resolved to a real `PREC` in all six. Note how
badly a raw join does: Victoria and Wood match **nothing** without zero-padding,
and Lamar matches 7 of 25.

Lamar's only residue is TLC `002F`, which is absent from the zero template —
TLC geography has a precinct the county is not reporting, not the reverse.

### Per-county notes

- **Bexar, Fort Bend, Dallas, Tarrant** — labels are already the 4-char `PREC`.
  Pass through. Bexar and Fort Bend verified against the live file; Dallas
  inferred (its Nov 2026 site is live but was not fetched here). Dallas has
  alphanumeric `PREC` such as `30A4`, `32T1`, `31A5`, which the rule leaves alone.
- **Victoria, Wood** — bare unpadded integers (`1`, `11`). Zero-pad to 4.
- **Lamar** — two formats in one county: `1C` needs padding to `001C`, while
  `1A3B`, `2A1A`, `3C7G`, `3H3C`, `4A6E` are already 4 characters and must be
  left alone. A naive "pad the whole string to 4" is wrong here.
- **Webb** — `PCT 401` → `0401`. Verified present in TLC, as are `0402`, `0123`.
- **Ector** — `Pct. 101` → `0101`. Verified present, as are `0110`, `0412`.
- **Cameron, Montgomery, Collin, Smith** — `Precinct 1` / `1` / `0100` all
  resolve. Verified present in TLC.
- **Harris** — `0001 - 1` → base `0001`. Verified present. But see §4: Harris
  needs **aggregation**, not just normalization.

### Dotted precinct labels: TLC drops the dot, it does not drop the precinct

**No `PREC` value anywhere in `Precincts26P` contains a `.`** — checked across
all 9,614 rows. But that does not make a dotted county label meaningless, and
an earlier draft of this section drew the wrong conclusion from it.

**Galveston proves dotted labels are real.** It reports `232.3 - BS13` and
`439.1 - BS18`, and TLC Galveston carries `2301, 2321, 2323, 4191, 4322, 4391,
4801` alongside its 89 ordinary `0137`-style ids. Remove the dot and `232.3`
is TLC's `2323`; `439.1` is `4391`. All 7 of Galveston's odd-looking 4-digit
ids are dot-free fractional precincts. The rule is therefore **strip the dot
first, then pad** — not "treat the decimal as noise."

**Ector is the other case, and the decimal there is a split marker.** Its
November 2026 sample ballots are titled by precinct and carry `110.10`,
`110.7`, `204.3`, `206.5`, `206.6`, `206.8`, `310.1`, `311.7` and `314.2`. None
of those survives dot-stripping — `1107`, `2043`, `3101` and the rest are all
absent — and TLC Ector is 41 whole precincts `0101`–`0412`. So in Ector the dot
separates precinct from split: `110.7` is a split of `0110`. (An earlier draft
called the decimal a title/filename artifact. It is not an artifact; it is a
third notation for splits, after Tarrant's `" - L01"` and Dallas's `-01`.)

So a dot is genuinely ambiguous and must be resolved per county, not per
string: strip it (Galveston) **or** cut at it (Ector). `candidates()` in
`extract_gov_sen.py` offers both forms and lets the county's TLC set pick.

The two cases are told apart by asking TLC, not by inspecting the string: this
is the argument for candidate-matching against the county's actual precinct set
rather than ranking normalization patterns. `extract_gov_sen.py` does exactly
that and resolves every reported label in all 21 counties.

### Ambiguous or unresolved

| County | Problem |
| --- | --- |
| Cameron per-entity report | `Precinct Part 18` — not joinable at all, see §4 |
| Smith split report | Split→whole rule is inferred only, see §4 |
| Denton, Fort Bend, Webb, Guadalupe, Smith, Harris | Count disagreements vs SOS large enough that a 1:1 match should not be assumed before trying it |
| The ~197 counties outside the 57 | Label formats unknown; the rule above is a reasonable default but untested |

---

## 4. The precinct-split problem

This is the real risk, and it is **not one problem but three**, with different
answers. The distinguishing question is: *does the report contain a
whole-precinct row alongside the split rows?*

### Case A — splits only, no whole-precinct row: **must aggregate.** (Harris)

**Verified** by decompressing page streams from Harris's November 2024
`1124/precinct.pdf` (206.8 MB; fetched via HTTP range requests at four offsets,
never in full). Rows are labeled `<PREC> - <splitid>`:

```
0001 - 1        1,324 of 1,661 registered voters = 79.71%
0366 - 215 , 0366 - 216 , 0366 - 217      <- one precinct, three splits
0823 - 97  , 0823 - 420
0825 - 74  , 0825 - 75
```

Confirmed properties:

- There is **no bare `0366` row.** Whole-precinct totals are not published.
- The split id is a **county-sequential** number (ids seen include 51, 74, 97,
  131, 211–217, 284, 420), *not* a within-precinct counter. So you cannot parse
  meaning from it — you can only group by the base.
- Therefore: **group by the 4 characters before `" - "` and sum the votes.** That
  yields Harris's 1,224 TLC precincts.

This aggregates cleanly and loses nothing, because splits nest inside whole
precincts. No split geography is needed.

### Case B — whole-precinct rows *and* split rows: **sum them, do not filter.** (Tarrant, Wood, Parker)

**Verified against live November 3, 2026 vote counts** (this reverses the
provisional rule written from the zero templates — see the note at the end).

Tarrant's `United States Senator` contest carries 2,985 precinct rows: 707 bare
labels plus 2,278 suffixed ones. Suffix frequencies across the file are
`L02` 707, `F99` 707, `L01` 707, `FSS` 98, `FSC` 55, `FSB` 4. Every one of the
707 bases also appears bare (0 bases appear only split). The 707 bare labels
equal TLC's 707 Tarrant precincts exactly.

The arithmetic says the suffixed rows are **additional voters, not a breakdown
of the bare row**. Per candidate in Tarrant's `Governor` contest:

| Candidate | bare rows | split rows | bare + splits | Clarity `Choice/@totalVotes` |
| --- | --- | --- | --- | --- |
| Greg Abbott | 275,720 | 404 | 276,124 | 276,124 |
| Gina Hinojosa | 374,939 | 986 | 375,925 | 375,925 |
| Pat Dixon | 9,138 | 15 | 9,153 | 9,153 |

`bare + splits` reproduces Clarity's own county total for every candidate;
`bare` alone is short. The same test on `Governor` elsewhere:

| County | bare | splits | bare + splits | `totalVotes` | bare alone |
| --- | --- | --- | --- | --- | --- |
| Tarrant | 659,797 | 1,405 | 661,202 | 661,202 | 0.2% short |
| Wood | 15,060 | 3,981 | 19,041 | 19,041 | **21% short** |
| Parker | 74,145 | 2,153 | 76,298 | 76,298 | 2.8% short |
| Bexar, Dallas, Denton, Gregg | — | none | — | matches | n/a |

So the rule for Case B is the same as for Case A: **group by base precinct id
and sum every row, bare and suffixed alike.** Nothing is dropped, and the
county total is reproduced exactly. The suffix codes are consistent with
separately-tabulated ballot types rather than sub-geographies — `L01`/`L02`
limited ballots, `F99` federal-only ballots, Wood's `11 - Joint COQ` style
names for joint-election voters.

**Correction note.** This document previously said "keep bare, drop splits" for
Tarrant and Wood, inferred from zero templates where every count was 0 and the
bare label set matched TLC's precinct count exactly. That inference was wrong.
Applying it would have discarded 21% of Wood's Governor votes. The lesson is
that a matching *label* count says nothing about where the *votes* sit; only
the `bare + splits == totalVotes` test settles it.

### Case C — a split id in a private sequence: **not joinable.** (Cameron per-entity)

Cameron's per-entity reports (e.g. `CSB_City_of_San_Benito_PCTxPCT.pdf`) key rows
as `Precinct Part 18`. That `18` is a county part id in its own sequence; it is
**not** a precinct number. TLC Cameron is 102 precincts, `0001`–`0102`, and
carries no part field — `PREC`/`PCTKEY` describe whole precincts only.

So: `Precinct Part 18` cannot be mapped to geography, and cannot be aggregated,
because nothing published says which precinct part 18 belongs to. The fix is not
geographic, it is to **use Cameron's countywide report instead**, which is keyed
`Precinct 1` at whole-precinct level and joins fine.

TLC does not publish split geography in this dataset, and there is no sign it
plans to. If per-entity splits are genuinely needed, the path is a county-supplied
part→precinct crosswalk via open records, not TLC.

### Smith — inferred, flagged, not verified

Smith publishes an "Official Precinct Split Report". Its TLC 26P precincts are
numbered **in steps of 3**: `0100, 0103, 0106 … 0142, 0200, 0203 … 0454`. Gaps of
exactly 2 between consecutive precincts are a strong hint that splits occupy
`base+1` and `base+2`, so `0101` and `0102` would roll up to `0100`.

**This is inference from a numbering pattern, not a verified rule** — the split
report was not opened (it sits behind a Laserfiche viewer needing a session).
Prefer Smith's whole-precinct report. If the split report must be used, confirm
the roll-up against a contest total before trusting it.

### Summary table

| Pattern | Counties verified | Rule |
| --- | --- | --- |
| Label is already `PREC` | Bexar, Fort Bend, Tarrant (bare), Smith | pass through |
| Needs zero-padding | Victoria, Wood, Lamar, Webb, Ector, Cameron, Montgomery, Collin | pad numeric head to 4 |
| Splits only, no whole row | **Harris** | group by base, **sum** |
| Whole rows + split rows | **Tarrant, Wood, Parker** | group by base, **sum** (bare + splits = county total, verified) |
| Split id in a private sequence | **Cameron** per-entity | not joinable; use countywide report |
| Split rule inferred | Smith | treat with suspicion |

Both split patterns take the same action: **sum every row that shares a base
precinct id.** The Case A / Case B distinction turned out not to change what
you do, only what the row set looks like.

---

## 5. What is genuinely unknowable right now

- **`Precincts26G.zip` does not exist.** The November 2026 precinct shapefile is
  unpublished. Based on 24G appearing 2025-01-28, expect it around January 2027.
  Until then 26P is the stand-in, and §2 says that is a good trade.
- **Exact November 2026 precinct rosters for the 45 counties** whose Clarity sites
  had not been stood up as of today, and for every PDF county.
- **TLC's VTD-level results file** (joinable on `VTDKEY`, a different layer from
  this one) is expected around February–March 2027. TLC warns VTDs are
  *approximations* of voting precincts, so it is a convenience product, not a
  substitute for joining county canvass numbers to `PCTKEY`.

---

## 6. Recommended procedure

1. Join on **`PCTKEY`**, rebuilt as `str(int(FIPS)) + PREC`. Never on `PREC`
   alone (not unique statewide) and never on `COLOR` or `cntykey`.
2. Do key work from `Precincts26P_Districts.xls` (1.2 MB); pull in the shapefile
   only when geometry is needed.
3. Normalize reported labels with `to_prec()` from §3.
4. **Group by base precinct id and sum every row**, whether or not a bare row
   for that base is also present. Then check the result against Clarity's
   `Choice/@totalVotes` per candidate; it should match to the vote. Treat any
   mismatch as a county whose split semantics differ from the eight verified
   here, and stop before publishing its numbers.
5. Reconcile per county: report matched / reported-not-in-TLC /
   TLC-not-reported counts. Expect small residues, and expect them to be real
   boundary changes, not bugs, in the counties listed in §2.
6. Re-run against `Precincts26G.zip` when TLC publishes it.

## Files

- `GEOGRAPHY_MATCHING.md` — this file
- `precinct_key_crosswalk.csv` — prototype crosswalk, 16 rows / 13 counties.
  Every non-null `pctkey` in it was checked to exist in `Precincts26P`.
- `churn_24G_to_26P.csv` — per-county added/dropped/unchanged `PCTKEY` counts
- `county57_precinct_counts.csv` — the 57 toolkit counties: TLC 26P vs TLC 24G vs
  March 2026 SOS precinct counts
- `downloads/` — `precincts26p.zip`, `precincts24g.zip`, the four Districts
  spreadsheets, and the extracted `shp26p/`, `shp24g/`. Treated as untrusted
  data: parsed with `python3 -I` from scripts kept outside the download tree.

---

## 7. What geography we actually hold, and in what projection

**The geography is complete. It is the results that are at half.** This is the
important asymmetry: there is no geographic gap to close.

| | |
| --- | --- |
| File | `geo/downloads/shp26p/Precincts26P.shp` (+ `.dbf .shx .prj .cpg .sbn .sbx .shp.xml`) |
| Size | 69 MB geometry, 5.3 MB attributes |
| Shape type | 5 (polygon) |
| Records | **9,614 polygons, matching the 9,614 attribute rows exactly** |
| Counties | **254 of 254** |
| Fields | `CNTY, COLOR, PREC, PCTKEY, cntykey, Shape_area, Shape_len` |

Also held: the full `Precincts24G` shapefile for churn comparison, and the
`*_districts` spreadsheets for 22P, 22G, 24P, 24G and 26P (the only place county
*names* appear -- the shapefile carries FIPS but no name).

### Projection: EPSG:3082, which is not this project's usual Texas CRS

`Precincts26P.prj` is Lambert Conformal Conic on NAD83, false easting and
northing 1,000,000, central meridian -100, standard parallels 27.41666667 and
34.91666667, latitude of origin 31.16666667, **units meters**. That is
**EPSG:3082, NAD83 / Texas Centric Lambert Conformal** -- a single statewide
projection, which is why one file covers all 254 counties without zone seams.

Its bounding box in those coordinates is x 372,991 .. 1,618,132,
y 412,835 .. 1,594,973.

**Mind the mismatch.** `daily-district/data/config.R` sets `EPSG_STATE` with
`TX=2845`, a state-plane zone, and that table is the cross-repo standard for
per-state projections. TLC ships 3082. Anything moving these precincts into
that pipeline has to reproject; nothing here does it for you, and a silent
mix of 3082 and 2845 will look plausible while being wrong by kilometers.

### Coverage of the geography by results, November 4, 2026

| | polygons | share |
| --- | --- | --- |
| Precinct polygons statewide | 9,614 | 100% |
| ...with a Governor/Senate row attached | 5,023 | **52.2%** |
| ...with at least one vote | 4,736 | **49.3%** |
| Counties fully covered | 25 of 254 | |
| Counties partly covered | 6 | |
| Counties with nothing | 223 | |

Per-county detail is in `geo/coverage_by_county.csv`. Of the 5,029 keys the
results emit, 5,023 land on a polygon and 6 do not -- Nueces's four and
Jefferson's two new precincts, which is 26P-to-26G churn, not a join failure.

The six partly-covered counties are partly covered because the county has not
finished counting (Bexar 746 of 806, Dallas 732 of 791), not because of any
geographic problem. The 223 empty counties are empty because they have not
published precinct results; `Precincts26G.zip`, expected around January 2027,
will refresh the geography itself.
