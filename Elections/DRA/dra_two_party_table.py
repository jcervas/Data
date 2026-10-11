"""Build the district x statewide-election two-party Democratic share table.

Input: a long-format CSV with columns
    district, election, dem, rep
where dem/rep are vote counts (or vote shares) for that district in that
statewide election, as reported by DRA2020. Optional second CSV with columns
    election, statewide_d, turnout_bias
holds the figures DRA prints in the Advanced tab legends (in percent). If it is
omitted, statewide D is computed from the summed district votes and turnout
bias as statewide D minus the average district share.

Usage: python dra_two_party_table.py districts.csv [advanced.csv] -o out.csv
"""
import argparse
import csv
import statistics

ELECTIONS = ["President 2024", "President 2020", "President 2016",
             "Senator 2024", "Senator 2020", "Senator 2018",
             "Governor 2022", "Governor 2018"]


def main():
    p = argparse.ArgumentParser()
    p.add_argument("districts")
    p.add_argument("advanced", nargs="?")
    p.add_argument("-o", "--out", required=True)
    a = p.parse_args()

    votes = {}
    with open(a.districts, newline="") as f:
        for r in csv.DictReader(f):
            votes[(int(r["district"]), r["election"].strip())] = (float(r["dem"]), float(r["rep"]))
    districts = sorted({d for d, _ in votes})

    adv = {}
    if a.advanced:
        with open(a.advanced, newline="") as f:
            for r in csv.DictReader(f):
                adv[r["election"].strip()] = (float(r["statewide_d"]), float(r["turnout_bias"]))

    rows = {d: [] for d in districts}
    avg, statewide, bias = [], [], []
    for e in ELECTIONS:
        shares = []
        for d in districts:
            dem, rep = votes[(d, e)]
            shares.append(100 * dem / (dem + rep))
            rows[d].append(shares[-1])
        mean_share = statistics.mean(shares)
        if e in adv:
            sw, tb = adv[e]
        else:
            dem_tot = sum(votes[(d, e)][0] for d in districts)
            rep_tot = sum(votes[(d, e)][1] for d in districts)
            sw = 100 * dem_tot / (dem_tot + rep_tot)
            tb = sw - mean_share
        avg.append(mean_share)
        statewide.append(sw)
        bias.append(tb)

    labeled = [(str(d), rows[d]) for d in districts]
    labeled += [("Average of districts", avg), ("Statewide D (DRA)", statewide),
                ("Turnout bias", bias)]
    with open(a.out, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["Row", "District"] + ELECTIONS + ["Mean", "SD"])
        for i, (label, vals) in enumerate(labeled, 1):
            w.writerow([i, label] + [f"{v:.2f}" for v in vals]
                       + [f"{statistics.mean(vals):.2f}", f"{statistics.stdev(vals):.2f}"])


if __name__ == "__main__":
    main()
