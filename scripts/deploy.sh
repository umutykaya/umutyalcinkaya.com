#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

# Build the project
echo "==> Building for production..."
bun run build

# Get S3 bucket and CloudFront distribution ID from amplify-meta.json
BUCKET_NAME=$(jq -r '.hosting.S3AndCloudFront.output.HostingBucketName' amplify/backend/amplify-meta.json)
DISTRIBUTION_ID=$(jq -r '.hosting.S3AndCloudFront.output.CloudFrontDistributionID' amplify/backend/amplify-meta.json)

if [[ -z "$BUCKET_NAME" || "$BUCKET_NAME" == "null" ]]; then
  echo "Error: Could not find bucket name in amplify-meta.json"
  exit 1
fi

if [[ -z "$DISTRIBUTION_ID" || "$DISTRIBUTION_ID" == "null" ]]; then
  echo "Error: Could not find CloudFront distribution ID in amplify-meta.json"
  exit 1
fi

echo "==> Publishing to S3 bucket: $BUCKET_NAME"
aws s3 sync "$ROOT_DIR/dist/" "s3://$BUCKET_NAME" --delete --region eu-west-2

echo "==> Invalidating CloudFront distribution: $DISTRIBUTION_ID"
aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths "/*" --region eu-west-2

echo ""
echo "✓ Build and deployment complete!"
echo "  S3 Bucket: $BUCKET_NAME"
echo "  CloudFront Distribution: $DISTRIBUTION_ID"
echo "  URL: https://$(jq -r '.hosting.S3AndCloudFront.output.CloudFrontDomainName' amplify/backend/amplify-meta.json)"
