#!/usr/bin/env python3
"""Rebuild the published coverage page from the current data.

Keeps the page honest about the distinction that matters: a county we hold at
precinct level versus one where all we have is a countywide total.
"""
import csv, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SCRATCH = ("/private/tmp/claude-501/-Users-cervas-Library-CloudStorage-"
           "GoogleDrive-jcervas-andrew-cmu-edu-My-Drive-GitHub/"
           "2472a111-a5ac-4a3f-8bae-7923f36d6dba/scratchpad")


def main():
    ranked = {r["county"]: int(r["registered_voters"])
              for r in csv.DictReader(open(os.path.join(HERE, "tx_counties_ranked.csv")))}
    statewide = ranked["Statewide Total"]
    cov = {r["county"]: r for r in
           csv.DictReader(open(os.path.join(HERE, "geo/coverage_by_county.csv")))
           if r["county"]}
    level, votes = {}, {}
    with open(os.path.join(HERE, "county_totals_2026.csv"), newline="") as fh:
        for r in csv.DictReader(fh):
            level[r["county"]] = r["level"]
            votes[r["county"]] = votes.get(r["county"], 0) + int(r["votes"])

    prec = sorted((c for c, l in level.items() if l == "precinct-derived" and votes[c]),
                  key=lambda c: -ranked.get(c, 0))
    cw = sorted((c for c, l in level.items() if l == "countywide" and votes[c]),
                key=lambda c: -ranked.get(c, 0))
    rv = lambda cs: sum(ranked.get(c, 0) for c in cs)

    def row(c, kind):
        g = cov.get(c, {})
        has = int(g.get("with_votes") or 0)
        tot = int(g.get("tlc_precincts") or 0)
        detail = (f'{has:,} of {tot:,}' if kind == "prec" and tot
                  else '<span class="cw">county total</span>')
        return (f'      <tr><td>{c}</td><td class="n">{ranked.get(c, 0):,}</td>'
                f'<td class="n">{detail}</td></tr>')

    body = "\n".join([row(c, "prec") for c in prec] + [row(c, "cw") for c in cw])
    page = open(os.path.join(SCRATCH, "coverage_page.html")).read()

    g = re.search(r"(<g stroke=.*?</g>)",
                  open(os.path.join(SCRATCH, "map_web.svg")).read(), re.S).group(1)
    page = re.sub(r"<g stroke=.*?</g>", lambda m: g, page, count=1, flags=re.S)
    page = re.sub(r"<tbody>\n.*?\n        </tbody>",
                  "<tbody>\n" + body + "\n        </tbody>", page, count=1, flags=re.S)
    page = re.sub(r'<li><b>[\d,]+</b><span>with votes[^<]*</span></li>',
                  f'<li><b>{len(prec) + len(cw)}</b><span>counties with totals '
                  f'&mdash; {100*rv(prec + cw)/statewide:.0f}% of voters</span></li>',
                  page, count=1)
    page = re.sub(r'<li><b>\d+</b><span>counties reporting</span></li>',
                  f'<li><b>{len(prec)}</b><span>at precinct level</span></li>',
                  page, count=1)
    page = re.sub(r'<li><b>\d+</b><span>counties yet to publish</span></li>',
                  f'<li><b>{len(cw)}</b><span>countywide total only</span></li>',
                  page, count=1)
    page = page.replace("<th scope=\"col\" class=\"n\">With votes</th>\n        "
                        "<th scope=\"col\" class=\"n\">Precincts</th>"
                        "<th scope=\"col\" class=\"n\">Share</th>",
                        "<th scope=\"col\" class=\"n\">Registered</th>"
                        "<th scope=\"col\" class=\"n\">Precincts held</th>")
    if ".cw{" not in page:
        page = page.replace("td.n { text-align: right;",
                            ".cw { color: #b4791f; font-style: italic; }\n"
                            "td.n { text-align: right;")
    open(os.path.join(SCRATCH, "coverage_page.html"), "w").write(page)
    print(f"{len(prec)} precinct-level + {len(cw)} countywide = "
          f"{len(prec)+len(cw)} counties, {100*rv(prec+cw)/statewide:.1f}% of voters")


if __name__ == "__main__":
    main()
