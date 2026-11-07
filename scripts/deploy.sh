#!/usr/bin/env bash
# Builds the site and publishes dist/ to the directory that `vite preview`
# serves on the Mac mini (tunnelled to umutyalcinkaya.com via Cloudflare).
#
# SERVE_DIR defaults to the dist/ of the long-lived checkout where
# `./dev-screen.sh` runs `vite preview`.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SERVE_DIR="${SERVE_DIR:-$HOME/projects/umutyalcinkaya.com/dist}"
cd "$ROOT_DIR"

echo "==> Building for production..."
bun run build

if [[ "$ROOT_DIR/dist" == "$SERVE_DIR" ]]; then
  echo "==> Build output is already the served directory"
else
  echo "==> Publishing to $SERVE_DIR"
  mkdir -p "$SERVE_DIR"
  rsync -a --delete "$ROOT_DIR/dist/" "$SERVE_DIR/"
fi

echo ""
echo "✓ Build and deployment complete!"
echo "  URL: https://umutyalcinkaya.com"
