#!/usr/bin/env python3
"""Draw the statewide precinct map, shaded by whether we hold results.

Answers "what is the geographic coverage" by looking at it: all 9,614 TLC
precinct polygons, filled green where a Governor/Senate row is attached and
grey where nothing is published yet.

Reads the shapefile directly -- no GDAL, no shapely. The .shp is 69 MB of
polygon rings in EPSG:3082 (meters), which is already an equal-ish-area
statewide projection, so the drawing needs nothing but a linear scale.

    ./coverage_map.py [--out coverage_map.svg] [--width 1600]
"""
import argparse, csv, os, struct, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from tlc_precincts import read_dbf, DEFAULT_DBF

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_SHP = os.path.join(HERE, "geo", "downloads", "shp26p", "Precincts26P.shp")


def shapes(path):
    """Yield one list-of-rings per record, in file order, matching the .dbf."""
    with open(path, "rb") as f:
        f.seek(100)
        while True:
            head = f.read(8)
            if len(head) < 8:
                return
            _, words = struct.unpack(">ii", head)
            body = f.read(words * 2)
            shptype, = struct.unpack("<i", body[:4])
            if shptype != 5:            # null shape; keep the slot aligned
                yield []
                continue
            nparts, npoints = struct.unpack("<ii", body[36:44])
            starts = struct.unpack(f"<{nparts}i", body[44:44 + 4 * nparts])
            off = 44 + 4 * nparts
            xy = struct.unpack(f"<{2 * npoints}d", body[off:off + 16 * npoints])
            rings = []
            for i, s in enumerate(starts):
                e = starts[i + 1] if i + 1 < nparts else npoints
                rings.append([(xy[2 * j], xy[2 * j + 1]) for j in range(s, e)])
            yield rings


def simplify(ring, step):
    """Keep every `step`-th vertex, always closing the ring."""
    if step <= 1 or len(ring) <= 8:
        return ring
    out = ring[::step]
    if out[-1] != ring[-1]:
        out.append(ring[-1])
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--shp", default=DEFAULT_SHP)
    ap.add_argument("--dbf", default=DEFAULT_DBF)
    ap.add_argument("--results", default=os.path.join(HERE, "gov_senate_precinct_2026.csv"))
    ap.add_argument("--county-totals",
                    default=os.path.join(HERE, "county_totals_2026.csv"),
                    help="counties we hold only a countywide total for are "
                         "shaded whole, in their own colour")
    ap.add_argument("--out", default=os.path.join(HERE, "geo", "coverage_map.svg"))
    ap.add_argument("--width", type=int, default=1600)
    ap.add_argument("--step", type=int, default=10,
                    help="keep every Nth vertex; 3 gives a 20 MB SVG, 10 gives 6 MB")
    ap.add_argument("--precision", type=int, default=1,
                    help="decimal places on coordinates; 0 halves the file size "
                         "and is invisible at 1 px ~ 0.8 km")
    args = ap.parse_args()

    recs_dbf = list(read_dbf(args.dbf))
    keys = [r["PCTKEY"] for r in recs_dbf]
    cnty_of = {r["PCTKEY"]: r["CNTY"] for r in recs_dbf}
    # Counties where all we have is a countywide figure: shade the whole
    # county, so the map answers "which counties do we have" and not only
    # "which precincts".
    countywide = set()
    try:
        with open(args.county_totals, newline="") as fh:
            for r in csv.DictReader(fh):
                if r["level"] == "countywide" and int(r["votes"]):
                    countywide.add(r["fips3"])
    except FileNotFoundError:
        pass
    with open(args.results, newline="") as fh:
        voted = {r["pctkey"] for r in csv.DictReader(fh)
                 if r["pctkey"] and int(r["votes"])}
    have = {r["pctkey"] for r in csv.DictReader(open(args.results, newline=""))
            if r["pctkey"]}

    recs = list(zip(keys, shapes(args.shp)))
    if len(recs) != len(keys):
        sys.exit(f"shape/attribute mismatch: {len(recs)} vs {len(keys)}")

    xs = [p[0] for _, rings in recs for r in rings for p in r]
    ys = [p[1] for _, rings in recs for r in rings for p in r]
    xmin, xmax, ymin, ymax = min(xs), max(xs), min(ys), max(ys)
    scale = args.width / (xmax - xmin)
    height = int((ymax - ymin) * scale)

    FILL = {"votes": "#2e7d32", "staged": "#9ccc65",
            "countywide": "#e0a33c", "none": "#e8e8e8"}
    n = {"votes": 0, "staged": 0, "countywide": 0, "none": 0}
    parts = []
    for key, rings in recs:
        if not rings:
            continue
        if key in voted:
            kind = "votes"
        elif key in have:
            kind = "staged"
        elif cnty_of.get(key) in countywide:
            kind = "countywide"
        else:
            kind = "none"
        n[kind] += 1
        d = []
        for ring in rings:
            pts = simplify(ring, args.step)
            pr = args.precision
            d.append("M" + " ".join(
                f"{(x - xmin) * scale:.{pr}f} {(ymax - y) * scale:.{pr}f}"
                for x, y in pts) + "Z")
        parts.append(f'<path d="{" ".join(d)}" fill="{FILL[kind]}"/>')

    total = sum(n.values())
    legend = (f'Texas precincts, November 3 2026 &#8212; '
              f'{n["votes"]:,} of {total:,} with results '
              f'({100*n["votes"]/total:.1f}%)')
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{args.width}" '
           f'height="{height + 46}" viewBox="0 0 {args.width} {height + 46}">'
           f'<rect width="100%" height="100%" fill="white"/>'
           f'<g stroke="#ffffff" stroke-width="0.25">{"".join(parts)}</g>'
           f'<g font-family="Helvetica,Arial,sans-serif" font-size="16" fill="#222">'
           f'<rect x="12" y="{height + 12}" width="14" height="14" fill="{FILL["votes"]}"/>'
           f'<text x="32" y="{height + 24}">results</text>'
           f'<rect x="104" y="{height + 12}" width="14" height="14" fill="{FILL["staged"]}"/>'
           f'<text x="124" y="{height + 24}">staged, no votes</text>'
           f'<rect x="268" y="{height + 12}" width="14" height="14" fill="{FILL["countywide"]}"/>'
           f'<text x="288" y="{height + 24}">countywide total only</text>'
           f'<rect x="452" y="{height + 12}" width="14" height="14" fill="{FILL["none"]}"/>'
           f'<text x="472" y="{height + 24}">nothing published</text>'
           f'<text x="640" y="{height + 24}">{legend}</text></g></svg>')
    with open(args.out, "w") as fh:
        fh.write(svg)
    print(f"{total:,} polygons drawn: {n['votes']:,} with precinct results, "
          f"{n['staged']:,} staged-but-empty, {n['countywide']:,} in "
          f"countywide-only counties, {n['none']:,} nothing")
    print(f"-> {args.out}  ({os.path.getsize(args.out)/1e6:.1f} MB, "
          f"{args.width}x{height + 46})")


if __name__ == "__main__":
    main()
