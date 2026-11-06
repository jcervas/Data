#!/usr/bin/env python3
"""Diff the two newest manifests and alert on what changed.

    python3 notify_changes.py                      # after a poll run
    python3 notify_changes.py --run-error "exit 1"  # the run itself failed
    python3 notify_changes.py --quiet               # log only, no banner

Alerts on three things and stays quiet otherwise, which is the point: on
election night the timer fires every 15 minutes, and a county's returns updating
is not a status change. Only these are:

  online   a county that had nothing now has data (a Clarity site went up)
  offline  a county that had data now does not
  error    a hard failure, new since the last run

Soft states are never alerted: "no site staged yet" is the normal pre-election
condition, "rate-limited (403)" is Brazoria throttling and self-heals, and
"skipped (pass --browser)" is a deliberate choice. Every event is appended to
events.log as JSON whether or not it raises a banner.
"""

import argparse
import datetime as dt
import glob
import json
import os
import subprocess
import sys

SOFT = ("no site staged", "rate-limited", "skipped")


def is_soft(status):
    return any(s in (status or "") for s in SOFT)


def load(path):
    with open(path) as f:
        m = json.load(f)
    return {c["county"]: c for c in m["counties"]}, m


def detail(c):
    """One short clause saying what this county now has."""
    files = c.get("files") or []
    if c.get("path_kind") == "clarity" and files:
        f = files[0]
        return (f"eid {c.get('election_id')}, {f.get('contests')} contests, "
                f"{f.get('precinct_nodes'):,} precinct nodes")
    live = [f for f in files if f.get("status") in (200, "200")]
    return f"{len(live) or len(files)} file(s)"


def notify(title, body, quiet):
    if quiet:
        return
    script = (f'display notification {json.dumps(body)} '
              f'with title {json.dumps(title)}')
    try:
        subprocess.run(["/usr/bin/osascript", "-e", script],
                       capture_output=True, timeout=20)
    except Exception:
        pass            # a missing banner must never fail the run


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--manifests", default=os.path.expanduser("~/tx-2026-enr/manifests"))
    p.add_argument("--events", default=os.path.expanduser("~/tx-2026-enr/events.log"))
    p.add_argument("--run-error", default="")
    p.add_argument("--quiet", action="store_true")
    p.add_argument("--force", action="store_true",
                   help="re-diff even if this manifest was already processed")
    a = p.parse_args()
    seen_file = os.path.join(os.path.dirname(a.events), "notify.seen")

    stamp = dt.datetime.now().isoformat(timespec="seconds")
    events = []

    if a.run_error:
        events.append({"kind": "run_error", "detail": a.run_error[:300]})

    files = sorted(glob.glob(os.path.join(a.manifests, "manifest-*.json")))
    # Idempotent: a manifest is diffed once. Without this, anything that calls
    # the notifier twice for the same run re-raises every alert.
    if files and not a.force:
        newest = os.path.basename(files[-1])
        try:
            if open(seen_file).read().strip() == newest:
                return 0
        except OSError:
            pass
        os.makedirs(os.path.dirname(seen_file), exist_ok=True)
        with open(seen_file, "w") as f:
            f.write(newest)

    cur_counties = {}
    if files:
        cur_counties, cur = load(files[-1])
        if len(files) == 1:
            events.append({"kind": "baseline", "county": None,
                           "detail": f"{cur['counties_with_data']}/"
                                     f"{cur['counties_attempted']} counties live"})
        else:
            prev_counties, _ = load(files[-2])
            for name, c in cur_counties.items():
                was, now = prev_counties.get(name), c
                ok_now = now["status"] == "ok"
                ok_was = bool(was) and was["status"] == "ok"
                if ok_now and not ok_was:
                    events.append({"kind": "online", "county": name,
                                   "rank": c.get("rank_by_rv"),
                                   "registered_voters": c.get("registered_voters"),
                                   "detail": detail(c)})
                elif ok_was and not ok_now:
                    # Alert even when the new state reads "soft". A county that
                    # was live and now reports "no site staged" has regressed,
                    # and staying quiet about it is how Denton's disappearance
                    # went unnoticed for three days.
                    events.append({"kind": "offline", "county": name,
                                   "detail": now["status"][:160]})
                elif (not ok_now and not is_soft(now["status"])
                      and (not was or was["status"] != now["status"])):
                    events.append({"kind": "error", "county": name,
                                   "detail": now["status"][:160]})

    if not events:
        return 0

    os.makedirs(os.path.dirname(a.events), exist_ok=True)
    with open(a.events, "a") as f:
        for e in events:
            f.write(json.dumps({"at": stamp, **e}) + "\n")
    for e in events:
        print(f"{e['kind']:<10}{(e.get('county') or ''):<12}{e.get('detail', '')}")

    online = [e for e in events if e["kind"] == "online"]
    bad = [e for e in events if e["kind"] in ("error", "offline", "run_error")]
    live = sum(1 for c in cur_counties.values() if c["status"] == "ok")
    total = len(cur_counties) or len(cur_counties)

    if online:
        names = ", ".join(e["county"] for e in online[:4])
        more = f" +{len(online) - 4} more" if len(online) > 4 else ""
        notify("TX 2026 precinct results",
               f"{names}{more} now live ({live}/{total} counties)", a.quiet)
    if bad:
        first = bad[0]
        notify("TX 2026 precinct results — problem",
               f"{first.get('county') or 'run'}: {first.get('detail', '')[:120]}"
               + (f" (+{len(bad) - 1} more)" if len(bad) > 1 else ""), a.quiet)
    return 0


if __name__ == "__main__":
    sys.exit(main())
