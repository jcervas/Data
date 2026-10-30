#!/usr/bin/env python3
"""Emit the URLs to hit for live precinct results, newest manifest as input.

    python3 live_urls.py                  # table to stdout
    python3 live_urls.py --csv live_urls.csv

For Clarity counties the machine feed needs the current version, which changes
every time the county pushes an update, so the row gives the two-step: read
current_ver.txt, then substitute it. Everything else is a direct URL or the page
that carries the links.
"""

import argparse
import csv
import glob
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
CLARITY = "https://results.enr.clarityelections.com/TX"

# Counties not on Clarity: the page a human opens, and the machine target.
MANUAL = {
    "Harris": ("https://www.harrisvotes.com/Election-Results/Live-Results",
               "https://appfiles.harrisvotes.com/harrisvotes/prd/Data/1126/precinct.pdf",
               "PDF precinct report; cumulative.pdf is the summary"),
    "Collin": ("https://www.collincountytx.gov/elections/election-results",
               "https://www.collincountytx.gov/elections/election-results",
               "scrape the page: Precinct Results Report (PDF) + Export (CSV)"),
    "Montgomery": ("https://elections.mctx.org/ElectionResults.asp",
                   "https://elections.mctx.org/results/2026_November_Precinct_Report.pdf",
                   "filename pattern is stable back to 1992"),
    "Brazoria": ("https://www.brazoriacountyclerktx.gov/departments/elections/election-results",
                 "https://www.brazoriacountyclerktx.gov/departments/elections/election-results",
                 "scrape: links labelled Precinct; needs an OpenSSL curl"),
    "Cameron": ("https://www.cameroncountytx.gov/elections/results/",
                "https://www.cameroncountytx.gov/elections/results/",
                "scrape: uploads/2026/11/*_PCTxPCT.pdf and *Precinct-Result*.pdf"),
    "Hays": ("https://www.hayscountytx.gov/Archive.aspx?AMID=53",
             "https://www.hayscountytx.gov/Archive.aspx?AMID=53",
             "Cloudflare: browser_fetch.mjs. Canvass PDF + CVRExport ZIP"),
    "Smith": ("https://www.smith-county.com/236/Current-Election-Results",
              "https://www.smith-county.com/236/Current-Election-Results",
              "reports sit in a Laserfiche viewer; needs a browser"),
    "McLennan": ("https://www.mclennan.gov/Archive.aspx?lngArchiveMasterID=66",
                 "https://www.mclennan.gov/Archive.aspx?lngArchiveMasterID=66",
                 "Cloudflare: browser_fetch.mjs. Precinct + Canvass PDFs"),
    "Ellis": ("https://www.elliscountytx.gov/1402/November-3-2026-General-and-Special-Elec",
              "https://www.elliscountytx.gov/1355/2026-Election-Results",
              "page promises Precinct by Race Results (PDF)"),
    "Webb": ("https://www.webbcountytx.gov/425/Precinct-By-Precinct-Results",
             "https://www.webbcountytx.gov/425/Precinct-By-Precinct-Results",
             "three DocumentCenter PDFs: Combined / Early Voting / Election Day"),
}


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--manifest", default="")
    p.add_argument("--csv", default="")
    a = p.parse_args()

    path = a.manifest or (sorted(glob.glob(os.path.expanduser(
        "~/tx-2026-enr/manifests/manifest-*.json")) +
        glob.glob(os.path.join(HERE, "manifests", "manifest-*.json"))) or [None])[-1]
    if not path:
        sys.exit("no manifest found; run fetch_all.py first")
    m = json.load(open(path))

    rows = []
    for c in sorted(m["counties"], key=lambda c: (c["rank_by_rv"] is None,
                                                  c["rank_by_rv"] or 0)):
        name, kind, status = c["county"], c["path_kind"], c["status"]
        if kind == "clarity":
            slug = name.replace(" ", "_")
            eid = c.get("election_id")
            page = f"{CLARITY}/{slug}/{eid}/" if eid else f"{CLARITY}/{slug}/"
            feed = (f"{CLARITY}/{slug}/{eid}/$(curl -s {CLARITY}/{slug}/{eid}/"
                    f"current_ver.txt)/reports/detailxml.zip") if eid else ""
            note = ("per-precinct XML" if eid else
                    "no November id yet; poll elections.json or --scan")
        else:
            # manifests title-case the slug, so "mclennan" arrives as "Mclennan"
            key = {k.lower(): k for k in MANUAL}.get(name.lower())
            page, feed, note = MANUAL.get(key, ("", "", ""))
        rows.append({"rank": c["rank_by_rv"], "county": name,
                     "registered_voters": c["registered_voters"],
                     "platform": kind, "status": status,
                     "live_page": page, "machine_feed": feed, "note": note})

    if a.csv:
        with open(a.csv, "w", newline="") as f:
            w = csv.DictWriter(f, fieldnames=list(rows[0]))
            w.writeheader()
            w.writerows(rows)
        print(f"wrote {a.csv} ({len(rows)} rows) from {os.path.basename(path)}")
        return

    print(f"from {os.path.basename(path)}\n")
    for r in rows:
        flag = "live" if r["status"] == "ok" else "    "
        print(f"{str(r['rank'] or ''):>3} {flag} {r['county']:<12}"
              f"{r['registered_voters']:>9,}  {r['live_page'] or r['status']}")


if __name__ == "__main__":
    sys.exit(main())
