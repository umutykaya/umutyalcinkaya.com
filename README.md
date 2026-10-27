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

### Cloudflare Tunnel

The site can also be served from this machine through the `umutyalcinkaya-com` Cloudflare Tunnel (config in `cloudflared/config.yml`). The tunnel credentials live in `~/.cloudflared/` and are not committed.

It runs in a detached screen session (one window for the build + `vite preview` on :4173, one for the tunnel), so it keeps running after you close the terminal:

```bash
bun run serve:screen          # start
./dev-screen.sh restart       # rebuild and restart after changes
screen -r umutyalcinkaya      # attach (Ctrl-a n / p to switch windows, Ctrl-a d to detach)
screen -S umutyalcinkaya -X quit   # stop
```

DNS: `umutyalcinkaya.com` and `www` are proxied CNAMEs to `dc2f1284-01d6-473b-9518-ffc729b09a7f.cfargotunnel.com`.

The default `~/.cloudflared/cert.pem` belongs to another zone, so route DNS with the umutyalcinkaya.com origin cert and the project config:

```bash
cloudflared tunnel --config cloudflared/config.yml --origincert ~/.cloudflared/cert-umutyalcinkaya.pem route dns umutyalcinkaya-com <hostname>
```

### Custom Domain Setup

Custom domain association is managed outside this repo in Amplify Hosting or the AWS console. For an existing Gen 1 app, keep the current backend resources and update the attached custom domain instead of trying to rename generated stack or bucket names in the repository.
