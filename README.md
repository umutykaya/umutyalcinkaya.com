# umutyalcinkaya.com

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

The repo and local project folder can be renamed safely, but the generated Amplify stack, bucket, and role names may continue to use the original project slug. That is expected for an existing Gen 1 environment and should not be hand-edited in generated files unless you plan a full backend migration.

`amplify publish` updates the files behind the existing CloudFront distribution. It does not create a new CloudFront URL, and cached `index.html` responses can make a deployment look stale.

Use the publish helper to deploy and invalidate CloudFront in one step:

```bash
./scripts/amplify-publish-invalidate.sh
```

Optional:

```bash
INVALIDATE_PATHS='/index.html' ./scripts/amplify-publish-invalidate.sh
```

### Custom Domain Setup

Custom domain association is managed outside this repo in Amplify Hosting or the AWS console. For an existing Gen 1 app, keep the current backend resources and update the attached custom domain instead of trying to rename generated stack or bucket names in the repository.
