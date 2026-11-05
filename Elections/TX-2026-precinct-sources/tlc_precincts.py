#!/usr/bin/env python3
"""Read PREC/PCTKEY out of the TLC precinct shapefile's .dbf with no deps.

The .dbf is the cheap half of the shapefile: field values only, no geometry,
so it answers "is this a real precinct id in this county?" in a few ms.
"""
import os, struct

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_DBF = os.path.join(HERE, "geo", "downloads", "shp26p", "Precincts26P.dbf")


def read_dbf(path):
    """Yield one dict per live record."""
    with open(path, "rb") as fh:
        nrec, hlen, rlen = struct.unpack("<I H H", fh.read(32)[4:12])
        fields = []
        while True:
            raw = fh.read(32)
            if raw[:1] in (b"\r", b""):
                break
            fields.append((raw[:11].rstrip(b"\x00").decode(), raw[16]))
        fh.seek(hlen)
        for _ in range(nrec):
            rec = fh.read(rlen)
            if len(rec) < rlen or rec[:1] == b"*":      # deleted record
                continue
            off, row = 1, {}
            for name, width in fields:
                row[name] = rec[off:off + width].decode("latin-1").strip()
                off += width
            yield row


def precincts_by_fips(path=DEFAULT_DBF):
    """{'113': {'1004', '1006', ...}, ...} keyed by the 3-digit county FIPS."""
    out = {}
    for row in read_dbf(path):
        out.setdefault(row["CNTY"], set()).add(row["PREC"])
    return out


if __name__ == "__main__":
    import sys
    by = precincts_by_fips(sys.argv[1] if len(sys.argv) > 1 else DEFAULT_DBF)
    print(f"{len(by)} counties, {sum(len(v) for v in by.values())} precincts")
    for fips in sys.argv[2:]:
        v = sorted(by.get(fips, ()))
        print(f"{fips}: {len(v)} {v[:12]}")
