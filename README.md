# umutyalcinkaya.com

Personal site built with React, TypeScript, Vite, Tailwind CSS, and Bun. The production build is served from this repository's `dist/` directory on a Mac mini through a Cloudflare Tunnel.

## Getting Started

```bash
bun install
bun run dev
```

The local Vite development server runs on port `8080`. `bun run dev` includes draft posts for local preview.

## Scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Start the local Vite server, including draft posts |
| `bun run build` | Generate feeds, build the site, and prerender the blog |
| `bun run preview` | Serve `dist/` locally on port `4173` |
| `bun run test` | Run the Vitest suite |
| `bun run lint` | Run ESLint |
| `bun run serve:screen` | Build and start the preview server and tunnel in `screen` |

## Writing a blog post

Create `src/content/posts/<slug>.mdx`. The file name becomes the URL slug:

```mdx
---
title: "A useful title"
date: "2026-11-02"
summary: "A short description for the post list and search previews."
tags:
  - engineering
  - notes
draft: true
lang: en
---

Write Markdown here. MDX supports GitHub-flavored Markdown, syntax-highlighted
code fences, and images with alt text.

<Callout type="tip" title="A callout">
  Callouts render as a semantic `aside`; choose `note`, `tip`, or `warning`.
</Callout>
```

`title`, `date` (`YYYY-MM-DD`), `summary`, and `tags` are required. `draft` defaults to `false`; `lang` defaults to `en`. The blog list shows newest posts first, calculates reading time at 200 words per minute, and supports tag links such as `/blog?tag=engineering`.

To preview drafts, leave `draft: true` and run `bun run dev`; the development pre-script includes drafts in the generated index. To publish, set `draft: false` or remove the field, then run `./dev-screen.sh restart`. Production feed generation excludes drafts from the published index, RSS feed, sitemap, and prerendered pages.

## Deployment: Mac mini and Cloudflare Tunnel

There is one build and one deployment flow; the tunnel forwards requests to `vite preview` on port `4173`. `cloudflared/config.yml` maps the public hostnames to that local origin and ends with a 404 catch-all. Vite preview serves static files from `dist/`, including prerendered blog routes, with the SPA fallback for other client routes. Do not expose the Vite development server, `.env` files, tunnel credentials, or origin certificates.

Start and manage the detached services:

```bash
bun run serve:screen              # build, then start preview and tunnel
./dev-screen.sh restart           # stop, regenerate feeds, rebuild, and restart
screen -r umutyalcinkaya          # attach; Ctrl-a d detaches
screen -S umutyalcinkaya -X quit  # stop the session
```

`bun run build` runs the `prebuild` hook to refresh `public/rss.xml`, `public/sitemap.xml`, and the generated post index before Vite builds and prerenders `/blog` and `/blog/<slug>/index.html`. The prerendered directories let crawlers and social previews receive full HTML. Deep links are also handled by Vite preview's SPA fallback.

For an external uptime monitor, request `https://umutyalcinkaya.com/healthz.txt`; a healthy origin returns `200 OK` with `ok`.

### Cloudflare caching

Vite preview serves HTML with `Cache-Control: no-cache`, so browsers and intermediaries revalidate it. The preview middleware marks other non-hashed paths `no-cache, max-age=0, must-revalidate`; hashed files under `/assets/` receive `public, max-age=31536000, immutable`. In Cloudflare, configure cache rules to respect these origin headers rather than overriding the HTML revalidation policy.

After publishing changed content, use **Cloudflare Dashboard → Caching → Purge Cache → Custom Purge** and purge:

- `https://umutyalcinkaya.com/rss.xml`
- `https://umutyalcinkaya.com/sitemap.xml`
- Each changed page, for example `https://umutyalcinkaya.com/blog/my-first-post` (and its trailing-slash URL if Cloudflare caches both forms)

The cache purge is also useful if a Cloudflare rule has cached HTML beyond its revalidation policy.

### Optional `launchd` alternative

For automatic recovery after a reboot, a pair of user LaunchAgents could run `bun run preview` and `cloudflared tunnel --config cloudflared/config.yml run` with `RunAtLoad`, `KeepAlive`, the repository as `WorkingDirectory`, and logs under `~/Library/Logs`. No plist is installed; confirm before creating or loading one.
