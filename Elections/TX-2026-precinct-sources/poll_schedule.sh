#!/bin/bash
# Cadence wrapper for fetch_all.py, meant to be fired every 15 minutes by
# launchd (see com.jcervas.tx2026enr.plist). It decides what to do based on the
# date, so one timer covers the whole run-up and election night.
#
#   before Nov 3   : discovery once a day        (catch counties standing up)
#   Nov 3 18:00 on : discovery every 15 min      (timestamped record of returns)
#                    download at most hourly     (no --browser; CVRs aren't up)
#   Nov 4-6        : discovery 2x a day + one --browser --download a day
#   Nov 7-Dec 5    : discovery + download once a day (the canvass window)
#   after Dec 5    : log, unload the timer, stop
#
# It used to stop on Nov 6, which was wrong and would have cost most of the
# state. A county's local canvass is held between the 3rd and 14th day after
# the election (Tex. Elec. Code 67.003), so Nov 6 to Nov 17, and the precinct
# report each county owes the Secretary of State is due within 30 days
# (67.017), so by Dec 3. On Nov 4 not one of the fourteen mid-size counties
# with a resolved results page had posted a November precinct report. The data
# for the long tail of the state arrives during the window this timer was
# about to switch itself off for.
#
# Discovery is cheap and writes only a manifest. Downloads are deliberately rare
# because the files are not: Harris' precinct.pdf alone is 207 MB and Hays' cast
# vote records are 119 MB, so a 15-minute download loop would fill the disk.
#
# Every run passes --scan. A county's own elections.json cannot be trusted to
# say whether its November site exists: on 2026-11-04 Bell's listing stopped at
# May 2026, Comal's at May 2025, Guadalupe's at 2015, and Lubbock's and
# Jefferson's were empty arrays -- yet Bell, Hunt and Kendall all had live
# November sites, found only by probing the id band. Only the pre-election
# discovery used to scan, so after the election the counties most likely to
# stand a site up late were the ones never checked. Cost is bounded by the
# global scan semaphore and by SCAN_RETRY_SECONDS in fetch_clarity.py, which
# stops a county that was just scanned and found absent from being re-probed.
#
# Run it by hand to test:  ./poll_schedule.sh --dry-run [YYYY-MM-DD HHMM]

set -uo pipefail

# Resolve to wherever this copy of the script lives, so it works both from the
# project directory and from the local copy that launchd runs (see install.sh).
PROJECT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PY="${TX_PYTHON:-/Users/cervas/anaconda3/bin/python3}"
# Everything the timer produces stays on local disk. Two reasons: macOS denies a
# launchd agent any access to ~/Library/CloudStorage (Google Drive) without Full
# Disk Access, and these downloads are big enough that Drive should not sync them.
BASE="$HOME/tx-2026-enr"
OUT="$BASE/files"
MANIFESTS="$BASE/manifests"
STAMPS="$BASE/stamps"
LOG="$BASE/poll.log"
LABEL="com.jcervas.tx2026enr"
ELECTION="2026-11-03"
CANVASS_UNTIL="2026-11-06"   # end of the twice-a-day phase
STOP_AFTER="2026-12-05"      # past the 30-day county report deadline
MIN_FREE_GB=5

DRY=0
[ "${1:-}" = "--dry-run" ] && { DRY=1; shift; }
TODAY="${1:-$(date +%Y-%m-%d)}"
NOW="${2:-$(date +%H%M)}"

mkdir -p "$OUT" "$MANIFESTS" "$STAMPS"
log() { printf '%s  %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*" | tee -a "$LOG"; }

# Run $2 at most once per period $1 (a stamp key).
once_per() {
  local key="$1"; shift
  local stamp="$STAMPS/$key"
  [ -e "$stamp" ] && return 1
  [ "$DRY" = 1 ] || : > "$stamp"
  return 0
}

free_gb() { df -g "$HOME" | awk 'NR==2 {print $4}'; }

run() {                      # run <label> <extra fetch_all args...>
  local what="$1"; shift
  local tag; tag="$(date +%Y%m%d-%H%M)"
  local manifest="$MANIFESTS/manifest-$tag"
  log "$what -> manifest-$tag"
  if [ "$DRY" = 1 ]; then
    log "  dry-run: $PY fetch_all.py --manifest $manifest --scan $*"
    log "  dry-run: $PY notify_changes.py"
    return
  fi
  ( cd "$PROJECT" && "$PY" fetch_all.py \
      --date "$ELECTION" --outdir "$OUT" --manifest "$manifest" --scan "$@" ) >>"$LOG" 2>&1
  local rc=$?
  log "  exit=$rc"
  # Diff this manifest against the previous one and alert on what changed.
  # Only called after a run that produced one, so there is always something to
  # compare; the notifier itself is idempotent if that assumption ever breaks.
  local args=()
  [ "$rc" = 0 ] || args=(--run-error "$what exited $rc")
  "$PY" "$PROJECT/notify_changes.py" --manifests "$MANIFESTS" \
      --events "$BASE/events.log" "${args[@]+"${args[@]}"}" >>"$LOG" 2>&1
}

if [[ "$TODAY" > "$STOP_AFTER" ]]; then
  log "past $STOP_AFTER; unloading $LABEL"
  [ "$DRY" = 1 ] || launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null
  exit 0
fi

if [[ "$TODAY" < "$ELECTION" ]]; then
  once_per "discover-$TODAY" && run "daily discovery"
  exit 0
fi

if [[ "$TODAY" == "$ELECTION" ]]; then
  if [ "$NOW" \< "1800" ]; then                     # polls still open
    once_per "discover-$TODAY" && run "election-day discovery (pre-close)"
    exit 0
  fi
  run "returns discovery"                           # every firing from 18:00
  if [ "$(free_gb)" -lt "$MIN_FREE_GB" ]; then
    log "  only $(free_gb)GB free, skipping download"
  elif once_per "download-$TODAY-${NOW:0:2}"; then
    run "hourly download" --download
  fi
  exit 0
fi

if [[ ! "$TODAY" > "$CANVASS_UNTIL" ]]; then
  # Nov 4-6: counties are still finishing election night. Check twice a day.
  once_per "discover-$TODAY-$( [ "$NOW" \< "1200" ] && echo am || echo pm )" \
    && run "post-election discovery"
  if [ "$(free_gb)" -lt "$MIN_FREE_GB" ]; then
    log "only $(free_gb)GB free, skipping canvass download"
  elif once_per "canvass-$TODAY"; then
    run "canvass download (incl. Cloudflare counties)" --download --browser
  fi
  exit 0
fi

# Nov 7 - Dec 5: the canvass window, when the long tail of counties actually
# posts. A county publishes its canvass once, so once a day is enough, but it
# has to keep happening for weeks.
if [ "$(free_gb)" -lt "$MIN_FREE_GB" ]; then
  log "only $(free_gb)GB free, skipping canvass-window download"
  once_per "discover-$TODAY" && run "canvass-window discovery"
elif once_per "canvass-$TODAY"; then
  run "canvass-window download" --download --browser
fi
