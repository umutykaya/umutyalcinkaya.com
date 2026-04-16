#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v amplify >/dev/null 2>&1; then
  echo "amplify CLI is required but was not found in PATH." >&2
  exit 1
fi

if ! command -v aws >/dev/null 2>&1; then
  echo "aws CLI is required but was not found in PATH." >&2
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "node is required but was not found in PATH." >&2
  exit 1
fi

META_FILE="${AMPLIFY_META_FILE:-$ROOT_DIR/amplify/backend/amplify-meta.json}"
INVALIDATE_PATHS="${INVALIDATE_PATHS:-/*}"

if [[ ! -f "$META_FILE" ]]; then
  echo "Amplify metadata file not found: $META_FILE" >&2
  exit 1
fi

echo "Publishing Amplify hosting..."
amplify publish --yes "$@"

read_cloudfront_field() {
  local field="$1"

  node -e '
const fs = require("fs");
const [metaFile, field] = process.argv.slice(1);
const meta = JSON.parse(fs.readFileSync(metaFile, "utf8"));
const output = meta?.hosting?.S3AndCloudFront?.output;

if (!output || !output[field]) {
  process.exit(1);
}

process.stdout.write(String(output[field]));
' "$META_FILE" "$field"
}

DISTRIBUTION_ID="$(read_cloudfront_field CloudFrontDistributionID)"
CLOUDFRONT_URL="$(read_cloudfront_field CloudFrontSecureURL)"

echo "Creating CloudFront invalidation for $DISTRIBUTION_ID..."
INVALIDATION_ID="$(aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "$INVALIDATE_PATHS" \
  --query 'Invalidation.Id' \
  --output text)"

echo "Waiting for invalidation $INVALIDATION_ID to complete..."
aws cloudfront wait invalidation-completed \
  --distribution-id "$DISTRIBUTION_ID" \
  --id "$INVALIDATION_ID"

echo "Deployment complete. CloudFront cache refreshed at $CLOUDFRONT_URL"