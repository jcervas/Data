#!/bin/bash
# Cadence wrapper for fetch_all.py, meant to be fired every 15 minutes by
# launchd (see com.jcervas.tx2026enr.plist). It decides what to do based on the
# date, so one timer covers the whole run-up and election night.
#
#   before Nov 3   : discovery once a day        (catch counties standing up)
#   Nov 3 18:00 on : discovery every 15 min      (timestamped record of returns)
#                    download at most hourly     (no --browser; CVRs aren't up)
#   Nov 4-6        : discovery 2x a day + one --browser --download a day (canvass)
#   after Nov 6    : log, unload the timer, stop
#
# Discovery is cheap and writes only a manifest. Downloads are deliberately rare
# because the files are not: Harris' precinct.pdf alone is 207 MB and Hays' cast
# vote records are 119 MB, so a 15-minute download loop would fill the disk.
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
STOP_AFTER="2026-11-06"
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
    log "  dry-run: $PY fetch_all.py --manifest $manifest $*"
    log "  dry-run: $PY notify_changes.py"
    return
  fi
  ( cd "$PROJECT" && "$PY" fetch_all.py \
      --date "$ELECTION" --outdir "$OUT" --manifest "$manifest" "$@" ) >>"$LOG" 2>&1
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

# Nov 4-6: canvass window.
once_per "discover-$TODAY-$( [ "$NOW" \< "1200" ] && echo am || echo pm )" \
  && run "post-election discovery"
if [ "$(free_gb)" -lt "$MIN_FREE_GB" ]; then
  log "only $(free_gb)GB free, skipping canvass download"
elif once_per "canvass-$TODAY"; then
  run "canvass download (incl. Cloudflare counties)" --download --browser
fi
