#!/usr/bin/env bash
# Builds the site and runs `vite preview` plus the Cloudflare tunnel in a
# detached screen session, one window each, so they keep running after you
# close the terminal.
#
#   ./dev-screen.sh           start (or: bun run serve:screen)
#   ./dev-screen.sh restart   stop the running session first, then rebuild and start
#
# Attach with `screen -r umutyalcinkaya`; switch windows with Ctrl-a n / Ctrl-a p,
# detach with Ctrl-a d. Stop everything with `screen -S umutyalcinkaya -X quit`.
set -euo pipefail

SESSION="umutyalcinkaya"
PROJECT_DIR="${PROJECT_DIR:-$(cd "$(dirname "$0")" && pwd)}"

# screen -ls exits non-zero on macOS even when it finds sessions, so capture
# its output first.
session_exists() {
  local sessions
  sessions=$(screen -ls 2>/dev/null || true)
  grep -q "\.${SESSION}[[:space:]]" <<<"$sessions"
}

# PIDs of every process below $1, deepest first.
descendants() {
  local child
  for child in $(pgrep -P "$1"); do
    descendants "$child"
    echo "$child"
  done
}

if [[ "${1:-}" == "restart" ]] && session_exists; then
  # Quitting the session alone leaves bun and cloudflared running (they
  # survive the hangup), so stop the session's whole process tree first.
  SCREEN_PID=$( (screen -ls || true) | grep -o "[0-9]*\.${SESSION}[[:space:]]" | cut -d. -f1)
  PIDS=$(descendants "$SCREEN_PID")
  kill $PIDS 2>/dev/null || true
  # The session may already have ended with its processes.
  screen -S "$SESSION" -X quit >/dev/null 2>&1 || true
  # cloudflared drains connections for up to 30s; vite preview must release
  # its port (strictPort 4173) before the new one starts.
  while session_exists || ps -p "$(echo $PIDS | tr ' ' ,)" >/dev/null 2>&1; do sleep 0.5; done
fi

# Don't start a second session with the same name.
if session_exists; then
  echo "Session '$SESSION' already exists. Attach with: screen -r $SESSION"
  echo "Rebuild and restart with: ./dev-screen.sh restart"
  exit 1
fi

DIR=$(printf %q "$PROJECT_DIR")
TUNNEL_CMD="cd $DIR && bun run tunnel; exec bash"

# Window 0 builds the site. Only when that succeeds does it open window 1 for
# the tunnel ($STY makes screen -X target this session) and then serve the
# build. 'exec bash' keeps each window open after its command ends, so errors
# stay readable.
screen -dmS "$SESSION" -t web bash -c "cd $DIR && bun run build && screen -X screen -t tunnel bash -c $(printf %q "$TUNNEL_CMD") && bun run preview; exec bash"

echo "Started. Attach with: screen -r $SESSION"
echo "Site URL: https://umutyalcinkaya.com"
