# umutykaya.com

Personal website built with React, TypeScript, Vite, and Tailwind CSS. Hosted on AWS Amplify.

## Getting Started

```bash
bun install
bun run dev
```

## Scripts

### `bun run dev`
Start the local development server.

### `bun run build`
Build for production.

### `bun run test`
Run tests with Vitest.

### `bun run lint`
Lint with ESLint.

## Deployment

The site is hosted on AWS Amplify with S3 + CloudFront.

### Custom Domain Setup

A script is provided to automate domain association, SSL provisioning, and CloudFront invalidation:

```bash
# Uses defaults (APP_ID=d39aeyu68qob2l, DOMAIN=umutykaya.com, BRANCH=main)
./scripts/amplify-domain-setup.sh

# Or override with environment variables
APP_ID=<id> DOMAIN=<domain> BRANCH=<branch> ./scripts/amplify-domain-setup.sh
```

The script performs:
1. Domain association with Amplify (AMPLIFY_MANAGED SSL certificate)
2. Certificate verification and ARN retrieval
3. Route 53 DNS record verification (auto-managed for same-account hosted zones)
4. Polling until domain is AVAILABLE, then CloudFront cache invalidation

**Required IAM permissions:** `amplify:*`, `acm:*`, `cloudfront:ListDistributions`, `cloudfront:CreateInvalidation`, `route53:ChangeResourceRecordSets`
