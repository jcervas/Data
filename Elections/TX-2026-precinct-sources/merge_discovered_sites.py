#!/usr/bin/env python3
"""Fold `county_sites.csv` (from discover_county_sites.py) into the inventory.

Fills `results_url` and `format_notes` for counties that had neither, and never
overwrites a row that was verified by hand -- the 42 counties with an existing
`results_url` were checked against the actual files, and a heuristic crawl is
not evidence enough to replace that.

    ./merge_discovered_sites.py [--dry-run]
"""
import argparse, csv, os, shutil, sys

HERE = os.path.dirname(os.path.abspath(__file__))
INV = os.path.join(HERE, "tx_2026_precinct_sources.csv")
SITES = os.path.join(HERE, "county_sites.csv")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--inventory", default=INV)
    ap.add_argument("--sites", default=SITES)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    with open(args.sites, newline="") as fh:
        found = {r["county"]: r for r in csv.DictReader(fh)}
    with open(args.inventory, newline="") as fh:
        reader = csv.DictReader(fh)
        fields = list(reader.fieldnames)
        rows = list(reader)

    filled = skipped = page_only = 0
    for row in rows:
        hit = found.get(row["county"])
        if not hit:
            continue
        existing = (row.get("results_url") or "").strip()
        notes = row.get("format_notes") or ""
        # A row the first merge filled with the county's *elections* page is
        # not a results page, so a later pass that finds a real one must be
        # allowed to replace it. Only hand-verified rows are untouchable.
        placeholder = notes.startswith("auto-discovered, no results link")
        if existing and not placeholder:
            skipped += 1
            continue
        if hit["results_url"]:
            row["results_url"] = hit["results_url"]
            label = hit["results_label"] or "results page"
            conf = hit["note"] if "LOW CONFIDENCE" in hit["note"] else ""
            row["format_notes"] = (f"auto-discovered {label}; not yet verified"
                                   + (f"; {conf}" if conf else "")).strip()
            filled += 1
        elif hit["site"]:
            # Worth keeping: knowing the county's site and that its elections
            # page carries no results link is most of the lookup done.
            row["results_url"] = hit["elections_url"] or hit["site"]
            row["format_notes"] = f"auto-discovered, no results link: {hit['note']}"
            page_only += 1

    print(f"{filled} results pages filled, {page_only} elections/site pages only, "
          f"{skipped} verified rows left alone")
    if args.dry_run:
        return
    shutil.copy2(args.inventory, args.inventory + ".bak")
    with open(args.inventory, "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=fields)
        w.writeheader()
        w.writerows(rows)
    print(f"wrote {args.inventory} (previous copy at .bak)")


if __name__ == "__main__":
    main()
