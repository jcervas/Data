#!/usr/bin/env python3
"""Assemble `in_2026_precinct_sources.csv` -- one row per Indiana county --
from the three things already measured, plus a seed of hand-verified rows.

Inputs, all produced by the other scripts here:
  geo/county_precinct_counts.csv    precinct counts, from the 2026 state layer
  enr_county_turnout_2026.csv       RV / ballots / absentee, from the state feed
  county_election_offices.csv       office name, address, phone, from the feed

Counties are ranked by registered voters, as in the Texas inventory, so the two
can be read the same way. The rank is computed only over counties that have
filed turnout -- 26 had filed nothing two days after the election, Marion and
Lake among them -- and those rows carry rank 0 and `reports_turnout=no` rather
than a fabricated position.

`verification` means the same thing it does in the Texas file: `verified` = the
artifact was fetched, `verified-pattern` = the equivalent file was fetched for a
prior election and the 2026 path exists, `partial` = page identified but not the
report, `not verified` = unresolved.

    ./build_tracker.py [--out in_2026_precinct_sources.csv]
"""
import argparse, csv, os, sys, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")
CENSUS = ("https://www2.census.gov/geo/docs/reference/codes2020/"
          "national_county2020.txt")

COLUMNS = ["fips", "fips3", "county", "rank_by_rv", "registered_voters",
           "ballots_cast", "absentee_pct", "reports_turnout", "precincts",
           "platform", "results_url", "precinct_data_url", "format_notes",
           "verification", "office_phone"]

# Hand-verified rows. Everything else starts empty on purpose: an unverified
# guess in a source inventory is worse than a blank, because the blank is
# honest about needing a lookup.
SEED = {
    "Marion": dict(
        platform="county-hosted (indy.gov workflow page)",
        results_url="https://www.indy.gov/workflow/election-results",
        precinct_data_url="",
        format_notes=("page states certified precinct results download opens "
                      "after noon 11/16/2026: 'Certified 2026 General Election "
                      "Results by Precinct'; unofficial posted 11/4"),
        verification="partial"),
    "St. Joseph": dict(
        platform="county-hosted (sjcindiana.gov)",
        results_url="https://www.sjcindiana.gov/2392/Election-Results",
        precinct_data_url="",
        format_notes=("standing filename pattern OfficialResultsByPrecinct_"
                      "Election_Summary; 2026 primary by precinct already posted"),
        verification="partial"),
    "Tippecanoe": dict(
        platform="county-hosted (tippecanoe.in.gov)",
        results_url="https://www.tippecanoe.in.gov/451/Election-Results",
        precinct_data_url="",
        format_notes=("2026 primary posted as summary + precinct PDFs; general "
                      "not yet posted. Vote-center county -- returns may be by "
                      "center, not by home precinct"),
        verification="partial"),
    # The next three refuse scripted clients outright (403 to curl and to the
    # crawler, with or without full browser headers), so they were resolved in
    # a real browser instead. Same situation as the two Cloudflare counties in
    # the Texas inventory.
    "Allen": dict(
        platform="county-hosted (CivicEngage, allencounty.in.gov)",
        results_url="https://www.allencounty.in.gov/1241/2026-Results",
        precinct_data_url=("https://www.allencounty.in.gov/DocumentCenter/View/"
                           "15334/2026-General-Unofficial-Election-Night-Results-PDF"),
        format_notes=("2026 General Unofficial Election Night Results (PDF) is "
                      "up; the precinct-by-precinct file follows at certification "
                      "-- cf. '2018 General Precinct by Precinct Results' at "
                      "/documentcenter/view/9403. Vote-center county. Host 403s "
                      "scripted clients; needs a browser fetch"),
        verification="verified-pattern"),
    "Vanderburgh": dict(
        platform="county-hosted (eGov, evansvillegov.org/county -- consolidated "
                 "with Evansville; the co.vanderburgh name has lapsed)",
        results_url=("https://www.evansvillegov.org/county/topic/index.php"
                     "?topicid=1209&structureid=329"),
        precinct_data_url=("https://www.evansvillegov.org/egov/documents/"
                           "1778764383_58888.pdf"),
        format_notes=("'Election Result Reports' carries an official precinct "
                      "report for every election back to 2018, 2026 primary "
                      "included; the 2026 general report lands in the same list"),
        verification="verified-pattern"),
    "Delaware": dict(
        platform="county-hosted (co.delaware.in.us)",
        results_url="", precinct_data_url="",
        format_notes="host 403s every scripted client; needs a browser fetch",
        verification="not verified"),
    "Elkhart": dict(
        platform="county-hosted (elkhartcounty.com)",
        results_url="", precinct_data_url="",
        format_notes="host 403s every scripted client; needs a browser fetch",
        verification="not verified"),
    "LaPorte": dict(
        platform="county-hosted (laportecounty.in.gov)",
        results_url="", precinct_data_url="",
        format_notes=("homepage redirects to login_up.php -- site is behind an "
                      "auth gate; needs a browser fetch"),
        verification="not verified"),

    # --- Second pass, November 5, 2026 -----------------------------------
    # EMS (the vendor nearly every Indiana county runs) emits two reports
    # whose headers differ by one word: "Election Summary Report" is
    # countywide, "Precinct Summary Report" is per-precinct. Both carry
    # "<County> County, Indiana / 2026 General Election / IN<CCC>G26", so a
    # crawler keying on the election name grabs the wrong one about half the
    # time. Every row below records which one the county has actually posted.
    "Delaware": dict(
        platform="county election-night site (delawarecountyelectionday.com)",
        results_url="https://www.delawarecountyelectionday.com/",
        precinct_data_url=("https://www.delawarecountyelectionday.com/"
                           "Delaware_PrecSumm_<NN>.htm"),
        format_notes=("LIVE 2026 general, per precinct. Classic EMS web export: "
                      "a frameset whose menu.htm lists one Delaware_PrecSumm_<NN>"
                      ".htm per precinct plus Delaware_ElecSumm_All.htm. Checked "
                      "PrecSumm_01 = '01-PRECINCT 01', 482 ballots of 1418 "
                      "registered, E/A/W split, party-tagged. Numbers are real "
                      "precinct codes and are NOT contiguous (01-04, 06-15, "
                      "18-20, 22-23, 25-29, 33-36, 38-67...), so enumerate the "
                      "menu rather than counting up. co.delaware.in.us 403s "
                      "scripted clients and redirects to delawarecounty.in.gov; "
                      "the election-night host serves fine in a browser"),
        verification="verified"),
    "Jasper": dict(
        platform="county-hosted (jaspercountyin.gov)",
        results_url=("https://www.jaspercountyin.gov/government/forms/"
                     "department-documents/county-clerk/voting-elections/"
                     "election-results/2026"),
        precinct_data_url=("https://www.jaspercountyin.gov/government/forms/"
                           "department-documents/county-clerk/voting-elections/"
                           "election-results/2026/988-2026-general-election-"
                           "precinct-by-precinct-report/file"),
        format_notes=("LIVE 2026 general, per precinct. EMS Precinct Summary "
                      "Report, INJASG26, 92 pages, 29 of 29 precincts reported. "
                      "This is the county the precinct join was validated on: "
                      "all 29 match the crosswalk on normalized name"),
        verification="verified"),
    "Noble": dict(
        platform="state-hosted county site (in.gov/counties/noble)",
        results_url="https://www.in.gov/counties/noble/election-info/",
        precinct_data_url=("https://www.in.gov/counties/noble/election-info/"
                           "historical-election-info/2026-general-election-by-"
                           "precinct/"),
        format_notes=("LIVE 2026 general, per precinct. EMS Precinct Summary "
                      "Report rendered inline as HTML rather than linked as a "
                      "PDF, INNOBG26, 29 of 29 precincts. The first crawl "
                      "rejected Noble on its precinct MAP pdf; the results page "
                      "is a separate branch of the same menu"),
        verification="verified"),
    "Huntington": dict(
        platform="city-hosted live results app (huntington.in.us)",
        results_url="https://www.huntington.in.us/election_results/2026General/",
        precinct_data_url="https://www.huntington.in.us/election_results/2026General/",
        format_notes=("LIVE 2026 general, per precinct. Not an EMS export but a "
                      "self-refreshing web app with an 'Individual Precinct "
                      "Results' section listing 36 named precincts (Clear Creek "
                      "1 ... Wayne). Vote-center county -- 6 centers -- yet it "
                      "still reports by precinct. Hosted by the CITY of "
                      "Huntington, which is why no county-domain convention "
                      "finds it; reachable from the county document center"),
        verification="verified"),
    "LaPorte": dict(
        platform="county-hosted (laporteco.in.gov)",
        results_url="https://laporteco.in.gov/residents/election-results/",
        precinct_data_url=("https://laporteco.in.gov/Elections/ElectionResults/"
                           "2024General/Laporte_PrecSumm_<NN>-<NAME>.htm"
                           " (2024 pattern; 2026 directory not up yet)"),
        format_notes=("2026 general posted so far is the countywide ELECTION "
                      "Summary only (INLAPG26, 92 precincts, 0 reported at "
                      "print), not the precinct report. The per-precinct files "
                      "exist for 2024 under /Elections/ElectionResults/"
                      "2024General/ and 2024GeneralU/, same EMS web export as "
                      "Delaware, so the 2026 path is predictable. Note the host "
                      "is laporteco.in.gov -- laportecounty.in.gov is a "
                      "different site behind login_up.php, which is what "
                      "stalled the first crawl"),
        verification="verified-pattern"),
    "Elkhart": dict(
        platform="clerk subdomain (clerk.elkhartcounty.com)",
        results_url="https://clerk.elkhartcounty.com/en/",
        precinct_data_url=("https://clerk.elkhartcounty.com/documents/13690/"
                           "2026-official-primary-results.pdf"),
        format_notes=("2026 OFFICIAL PRIMARY results are posted under "
                      "/documents/<id>/<slug>.pdf; the general follows at the "
                      "same path. Largest unresolved county until now -- the "
                      "crawler never saw it because the clerk is on its own "
                      "subdomain and both elkhartcounty.com and "
                      "clerk.elkhartcounty.com 403 every scripted client, "
                      "document paths included. Browser fetch required. "
                      "Vote-center county"),
        verification="verified-pattern"),
    "Hendricks": dict(
        platform="county-hosted (eGov, co.hendricks.in.us)",
        results_url=("https://www.co.hendricks.in.us/egov/apps/document/"
                     "center.egov?view=item&id=13101"),
        precinct_data_url="",
        format_notes=("countywide only so far: EMS ELECTION Summary Report, "
                      "INHENG26, 8 pages, 105 of 105 precincts reported but no "
                      "per-precinct breakdown. Worse, it is a SCAN (Toshiba "
                      "e-STUDIO, no text layer), so whatever Hendricks posts "
                      "will need OCR. Append &dt=f to the eGov item URL to get "
                      "the file instead of the viewer"),
        verification="partial"),
    "Marshall": dict(
        platform="county-hosted (eGov, co.marshall.in.us)",
        results_url=("https://www.co.marshall.in.us/egov/apps/document/"
                     "center.egov?view=item&id=1755"),
        precinct_data_url="",
        format_notes=("countywide only so far: EMS ELECTION Summary Report, "
                      "INMARG26, 7 pages, 29 of 29 precincts reported, no "
                      "per-precinct breakdown. Also a Toshiba scan with no text "
                      "layer. id=1754 is the early-voting companion"),
        verification="partial"),
    # Four small counties that posted the 2026 PRIMARY by precinct. That is the
    # same report the general produces, from the same machine, so the general
    # is expected at a matching path -- but it is a prediction, not a sighting.
    "Wabash": dict(
        platform="state-hosted county site (in.gov/counties/wabash)",
        results_url="https://www.in.gov/counties/wabash/departments/",
        precinct_data_url=("https://www.in.gov/counties/wabash/files/"
                           "legal-notices/2026-Primary-Precinct-Summary-Report.pdf"),
        format_notes="2026 primary Precinct Summary Report posted, INWABP26, 26 precincts",
        verification="verified-pattern"),
    "Clay": dict(
        platform="state-hosted county site (in.gov/counties/clay)",
        results_url="https://www.in.gov/counties/clay/county-offices/county-clerk/",
        precinct_data_url=("https://www.in.gov/counties/clay/files/"
                           "2026PRIPrecinctSummaryReportAFTERProv.pdf"),
        format_notes=("2026 primary Precinct Summary Report posted, INCLAP26, "
                      "23 precincts; filename marks it as the post-provisional run"),
        verification="verified-pattern"),
    "Blackford": dict(
        platform="county-hosted (CivicPlus, blackfordcounty.com)",
        results_url="https://www.blackfordcounty.com/DocumentCenter/",
        precinct_data_url=("https://www.blackfordcounty.com/DocumentCenter/View/"
                           "370/2026-Primary-Election-Precinct-Summary"),
        format_notes="2026 primary Precinct Summary Report posted, INBLAP26, 12 precincts",
        verification="verified-pattern"),
    "Fountain": dict(
        platform="county-hosted (CivicPlus, in-fountaincounty.civicplus.com)",
        results_url="https://in-fountaincounty.civicplus.com/1221/Elections",
        precinct_data_url=("https://in-fountaincounty.civicplus.com/DocumentCenter/"
                           "View/315/Final-Precinct-Results-2026-Primary-Election-PDF"),
        format_notes=("2026 primary Precinct Results Report posted, 22 of 22 "
                      "precincts; a different vendor's layout from the EMS one "
                      "-- columns are Absentee / Early / Election Day / Total"),
        verification="verified-pattern"),

    # --- Third pass, November 6, 2026 ------------------------------------
    # This pass was mostly about hostnames rather than about elections. The
    # counties left over were not the counties that publish nothing; they were
    # the counties whose obvious hostname is wrong, and `resolve_hosts.py`
    # exists to say which of several plausible hosts is real. Three ways it is
    # wrong, all of which answer HTTP 200: the name is PARKED (kosciuskocounty
    # .com and hancockcounty.org both serve 114 bytes redirecting to /lander,
    # while the counties are at kosciusko.in.gov and on datapitstop), the name
    # is LAPSED (wellscounty.us redirects off-domain; the county is at
    # wellscounty.org), or the county is on a shared platform under a name
    # nobody would guess. Thirty-five of the thirty-six got a live host.
    "Warrick": dict(
        platform="county-hosted (Duda, warrickcounty.gov) + Google Drive",
        results_url="https://www.warrickcounty.gov/2026-midterm-election-results",
        precinct_data_url=("https://drive.google.com/drive/folders/"
                           "1rrZObpzUTZnpfyEp-cByP5lnfNOnHLVc"),
        format_notes=("LIVE 2026 general, per precinct. One PDF per precinct in "
                      "a public Drive folder, each named for the precinct it "
                      "reports -- Anderson.pdf, Boon 03.pdf, Ohio 19.pdf. All "
                      "53 filenames match a 2026 geography precinct exactly on "
                      "the normalized name, bijectively, with nothing left over "
                      "on either side; the join key is the filename itself. "
                      "Checked Anderson.pdf: 'Precinct Summary Report / "
                      "INWARG26', precinct 0101-ANDERSON, 388 ballots of 905 "
                      "registered, E/A/W split. Drive's own folder page is "
                      "virtualized and stops at 50 rows, which silently hides "
                      "Owen, Pigeon and Skelton; list it through "
                      "drive.google.com/embeddedfolderview?id=<folder> instead, "
                      "which returns all 53 as plain HTML. Fetch a file with "
                      "drive.google.com/uc?export=download&id=<id>, whose "
                      "Content-Disposition carries the precinct name. The "
                      "countywide file linked beside the folder is an ELECTION "
                      "Summary Report -- the other half of the usual trap"),
        verification="verified"),
    "Kosciusko": dict(
        platform="county-hosted (eGov, kosciusko.in.gov)",
        results_url=("https://www.kosciusko.in.gov/egov/apps/document/"
                     "center.egov?view=all"),
        precinct_data_url=("https://www.kosciusko.in.gov/egov/apps/document/"
                           "center.egov?view=item&id=4300"),
        format_notes=("LIVE 2026 general, per precinct. 'Precinct Summary "
                      "Report / INKOSG26', 242 pages, real text layer, 65 of 65 "
                      "precincts reported. Sitting next to it as id=4299 is "
                      "'2026 General Election Summary Results', the countywide "
                      "report -- the labels differ by one word, so take 4300. "
                      "validate_join.py places all 65 printed precincts (64 "
                      "exact, 1 after dropping a city suffix: 'Plain 05 City Of "
                      "Warsaw' -> 'PLAIN 05'). The geography has 69: three are "
                      "marked (NV), no registered voters, which the EMS omits "
                      "rather than printing zeros, and PRAIRIE 02 - WARSAW is a "
                      "genuine unexplained gap. int(Precinct ID)*10 would "
                      "'match' all 65 codes and put 29 of them on the wrong "
                      "precinct. Found via the eGov document center's "
                      "`center.egov?view=all`, which lists every document a "
                      "county holds and is the fastest way into an eGov site"),
        verification="verified"),
    "Wells": dict(
        platform="county-hosted (WordPress, wellscounty.org)",
        results_url="https://wellscounty.org/",
        precinct_data_url=("https://wellscounty.org/wp-content/uploads/2026/11/"
                           "Precinct-Summary-Report-2.pdf"),
        format_notes=("LIVE 2026 general, per precinct, but SCANNED. 'Precinct "
                      "Summary Report / Wells County, Indiana / 2026 General "
                      "Election / INWELG26', 78 pages, 22 of 22 precincts, "
                      "timestamped 11/3/2026 8:20 PM -- read off a rendered "
                      "page, because the file is a RICOH MP C3004 scan with no "
                      "text layer and pdftotext returns 78 bytes. The right "
                      "report, in the wrong format: needs OCR before the join "
                      "can be validated. Note the host -- the conventional "
                      "wellscounty.us is a lapsed name that now redirects "
                      "off-domain to a gambling site"),
        verification="verified"),
    "Gibson": dict(
        platform="county-hosted (WordPress, gibsoncounty-in.gov)",
        results_url="https://gibsoncounty-in.gov/clerk/electionresults/",
        precinct_data_url=("https://gibsoncounty-in.gov/wp-content/uploads/"
                           "<yyyy>/<mm>/2026-General-Election-Official-"
                           "Precinct-Results.pdf"),
        format_notes=("2026 general not posted yet; the precinct habit is as "
                      "well established as it gets. The clerk keeps every "
                      "election back to 2018 as a canvass / cumulative / "
                      "PRECINCT trio, and the precinct leg is present for 2018, "
                      "2019, 2020, 2022, 2023 and 2024 general and primary "
                      "alike. 2026 primary is up as canvass and cumulative, so "
                      "the general's precinct file should follow the "
                      "'<year>-General-Election-Official-Precinct-Results.pdf' "
                      "name. Mind the hyphen in the hostname"),
        verification="verified-pattern"),
    "Starke": dict(
        platform="county-hosted (WordPress, starke.in.gov)",
        results_url="https://starke.in.gov/homepage/departments/election/election-results/",
        precinct_data_url=("https://starke.in.gov/wp-content/uploads/2026/11/"
                           "2026-General-Election-<Precinct>.pdf"),
        format_notes=("2026 general not posted yet. Starke splits results the "
                      "way Warrick does -- one PDF per precinct, named for the "
                      "precinct -- and the 2026 PRIMARY set is up in full under "
                      "/wp-content/uploads/2026/05/ as "
                      "'2026-Primary-Election-<Precinct>.pdf' (Wayne 04, "
                      "Railroad, North Bend, Oregon 03 ...) plus a separate "
                      "'2026-Primary-Election-Summary-Report.pdf'. So the "
                      "general should land as 2026-General-Election-<Precinct>"
                      ".pdf; probed, not there yet. 21 precincts. The county is "
                      "at starke.in.gov, which no hostname convention predicts"),
        verification="verified-pattern"),
    "Daviess": dict(
        platform="county-hosted (CivicPlus, daviess.org)",
        results_url="https://daviess.org/185/Election-Results",
        precinct_data_url=("https://daviess.org/DocumentCenter/View/2826/"
                           "2026-Primary-Precinct-Summary-Report"),
        format_notes=("2026 PRIMARY precinct report confirmed at that URL; the "
                      "general is not up yet and CivicPlus gives the new file a "
                      "fresh numeric id, so it has to be read off the Election "
                      "Results page rather than guessed. Do not probe "
                      "DocumentCenter ids by status code: CivicPlus answers 200 "
                      "with an HTML page for ids that hold nothing, so a sweep "
                      "of /DocumentCenter/View/<n> reports dozens of hits that "
                      "are all the same error page. Check Content-Type"),
        verification="verified-pattern"),
    "Tipton": dict(
        platform="county-hosted (eGov, tiptongov.com)",
        results_url="https://www.tiptongov.com/",
        precinct_data_url="",
        format_notes=("LIVE 2026 general but COUNTYWIDE ONLY. The homepage link "
                      "'Election Results - Summary Report' (egov document "
                      "id=3387) serves a 5-page 'ELECTION Summary Report / "
                      "INTIPG26' showing 15 of 15 precincts reported and no "
                      "per-precinct breakdown -- and it is a PFU ScanSnap scan "
                      "with no text layer, so it was read off a rendered page. "
                      "No precinct file published as of November 6"),
        verification="partial"),
    "LaGrange": dict(
        platform="county-hosted (eGov, lagrangecounty.org)",
        results_url=("https://www.lagrangecounty.org/egov/apps/document/"
                     "center.egov?view=all"),
        precinct_data_url="",
        format_notes=("LIVE 2026 general but COUNTYWIDE ONLY. The document "
                      "center lists TWO entries both labeled 'November 3rd 2026 "
                      "Election Results', ids 2284 and 2285 -- which looks like "
                      "the summary/precinct pair every other county posts, and "
                      "is not: both ids return byte-identical 321,149-byte "
                      "files. It is a 7-page 'ELECTION Summary Report / "
                      "INLAGG26', 16 of 16 precincts reported, scanned with no "
                      "text layer. No precinct file published as of November 6"),
        verification="partial"),
}


def census_counties():
    req = urllib.request.Request(CENSUS, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        lines = r.read().decode("utf-8", "replace").splitlines()
    out = []
    for ln in lines:
        p = ln.split("|")
        if len(p) > 4 and p[0] == "IN":
            out.append((p[1] + p[2], p[2], p[4].replace(" County", "")))
    return sorted(out)


def read_csv(path, key):
    if not os.path.exists(path):
        print(f"missing {path}", file=sys.stderr)
        return {}
    with open(path, newline="") as f:
        return {r[key]: r for r in csv.DictReader(f)}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=os.path.join(HERE,
                                                  "in_2026_precinct_sources.csv"))
    a = ap.parse_args()

    counties = census_counties()
    pre = read_csv(os.path.join(HERE, "geo", "county_precinct_counts.csv"),
                   "county_fips3")
    turn = read_csv(os.path.join(HERE, "enr_county_turnout_2026.csv"), "county")
    off = read_csv(os.path.join(HERE, "county_election_offices.csv"), "county")

    # Rank only the counties that actually filed, so rank means something.
    filed = sorted(((r["county"], int(r["registered_voters"] or 0))
                    for r in turn.values() if r.get("reports_turnout") == "yes"),
                   key=lambda x: -x[1])
    rank = {name: i + 1 for i, (name, _) in enumerate(filed)}

    rows = []
    for f5, f3, name in counties:
        t = turn.get(name, {})
        seed = SEED.get(name, {})
        rows.append({
            "fips": f5, "fips3": f3, "county": name,
            "rank_by_rv": rank.get(name, 0),
            "registered_voters": t.get("registered_voters", ""),
            "ballots_cast": t.get("ballots_cast", ""),
            "absentee_pct": t.get("absentee_pct", ""),
            "reports_turnout": t.get("reports_turnout", ""),
            "precincts": (pre.get(f3) or {}).get("precincts", ""),
            "platform": seed.get("platform", ""),
            "results_url": seed.get("results_url", ""),
            "precinct_data_url": seed.get("precinct_data_url", ""),
            "format_notes": seed.get("format_notes", ""),
            "verification": seed.get("verification", "not verified"),
            "office_phone": (off.get(name) or {}).get("phone", "")})

    # Biggest first where known, then alphabetical for the unranked tail.
    rows.sort(key=lambda r: (r["rank_by_rv"] or 10**6, r["county"]))
    with open(a.out, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=COLUMNS)
        w.writeheader()
        w.writerows(rows)

    tot_pre = sum(int(r["precincts"] or 0) for r in rows)
    missing_pre = [r["county"] for r in rows if not r["precincts"]]
    print(f"wrote {a.out} ({len(rows)} counties, {tot_pre} precincts)")
    if missing_pre:
        print(f"  no precinct count for: {', '.join(missing_pre)}")
    print(f"  {sum(1 for r in rows if r['results_url'])} with a results_url, "
          f"{sum(1 for r in rows if r['reports_turnout'] == 'no')} not yet "
          f"reporting to the state feed")


if __name__ == "__main__":
    main()
