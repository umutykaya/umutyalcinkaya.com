#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "==> Installing dependencies..."
bun install --frozen-lockfile

echo "==> Linting..."
bun run lint

echo "==> Running tests..."
bun run test

echo "==> Building for production..."
bun run build

echo "==> Build output:"
ls -lh "$ROOT_DIR/dist/"

echo ""
echo "Local build complete. dist/ is ready."
echo ""
echo "To preview locally:  bun run preview"
echo "To publish to AWS:   ./scripts/amplify-publish-invalidate.sh"
