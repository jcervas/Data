#!/bin/bash
# Install the polling timer that runs fetch_all.py until election night.
#
#   ./install_schedule.sh            # install (or refresh) the launchd agent
#   ./install_schedule.sh --uninstall
#
# Why it copies the toolkit instead of running it in place: macOS denies a
# launchd agent any access to ~/Library/CloudStorage, so a timer pointed at the
# Google Drive copy dies with "Operation not permitted" (exit 126). Terminal has
# that access, this installer does not need it at run time, so the install step
# copies the scripts to ~/tx-2026-enr/bin and the agent runs from there.
#
# Re-run this after editing any of the scripts, to refresh the copy.

set -euo pipefail

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE="$HOME/tx-2026-enr"
BIN="$BASE/bin"
LABEL="com.jcervas.tx2026enr"
PYBIN="$(dirname "${TX_PYTHON:-/Users/cervas/anaconda3/bin/python3}")"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
DOMAIN="gui/$(id -u)"

if [ "${1:-}" = "--uninstall" ]; then
  launchctl bootout "$DOMAIN/$LABEL" 2>/dev/null || true
  rm -f "$PLIST"
  echo "removed $LABEL; $BASE left in place (delete it yourself if you want)"
  exit 0
fi

mkdir -p "$BIN" "$BASE/manifests" "$BASE/files" "$BASE/stamps"
for f in poll_schedule.sh notify_changes.py fetch_all.py fetch_clarity.py \
         fetch_non_clarity.py browser_fetch.mjs tx_2026_precinct_sources.csv; do
  cp "$SRC/$f" "$BIN/$f"
done
chmod +x "$BIN/poll_schedule.sh" "$BIN"/*.py "$BIN/browser_fetch.mjs"

cat > "$PLIST" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>              <string>$LABEL</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>$BIN/poll_schedule.sh</string>
  </array>
  <!-- Fires every 15 min; poll_schedule.sh decides whether this firing acts,
       so the cadence lives in one place and the timer never changes. -->
  <key>StartInterval</key>      <integer>900</integer>
  <key>RunAtLoad</key>          <true/>
  <key>StandardOutPath</key>    <string>$BASE/launchd.out.log</string>
  <key>StandardErrorPath</key>  <string>$BASE/launchd.err.log</string>
  <key>ProcessType</key>        <string>Background</string>
  <key>LowPriorityIO</key>      <true/>
  <key>EnvironmentVariables</key>
  <dict>
    <!-- The interpreter's own bin first: its curl is OpenSSL-linked, which some
         county WAFs accept where Apple's SecureTransport curl is refused. -->
    <key>PATH</key> <string>$PYBIN:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin</string>
  </dict>
</dict>
</plist>
PLIST

plutil -lint "$PLIST" >/dev/null
launchctl bootout "$DOMAIN/$LABEL" 2>/dev/null || true
launchctl bootstrap "$DOMAIN" "$PLIST"

echo "installed $LABEL"
echo "  runs     $BIN/poll_schedule.sh every 15 min"
echo "  output   $BASE/manifests (manifests), $BASE/files (downloads)"
echo "  log      $BASE/poll.log, events in $BASE/events.log"
echo "  alerts   macOS banner when a county comes online or a run errors"
echo "  stops    by itself after 2026-11-06"
echo "  remove   $SRC/install_schedule.sh --uninstall"
