You are a senior full-stack developer helping me remove all Lovable branding from my exported boilerplate project. I have already exported the project from Lovable to GitHub and cloned it locally. My project is a React/Vite app (TSX).

Your task is to guide me — or directly write the changes — to fully remove all Lovable watermarks, badges, and branding traces from the codebase. Here is exactly what needs to be done:

**Step 1 — Search for all Lovable references**
Scan the entire codebase for any of the following strings:
- "lovable"
- "Lovable"
- "gpt-engineer"
- "Edit with Lovable"
- "Built with Lovable"
- "lovable-tagger"
- "lovable-badge"
- "@lovable"
- "lovable.dev"

Report every file and line number where these appear.

**Step 2 — Remove badge/watermark UI components**
For each file found:
- If it is a JSX/TSX component that renders a badge, button, link, or div referencing Lovable, remove the entire element safely without breaking surrounding layout.
- If it is a conditional render like `{isDevelopment && <LovableBadge />}`, remove the entire conditional block.
- If it is a footer link like `<a href="https://lovable.dev">`, remove it along with its parent wrapper if it becomes empty.

**Step 3 — Clean up imports**
- Find and remove any import statements that import Lovable-specific components, e.g.:
  `import { LovableBadge, LovableProvider } from '@lovable/react';`
- If a Lovable package provides both branding AND functional utilities, only remove the branding component imports — do NOT blindly uninstall the whole package without checking.

**Step 4 — Clean package.json and vite.config**
- Remove `lovable-tagger` from `devDependencies` in `package.json`.
- In `vite.config.ts` (or `vite.config.js`), find and remove the `componentTagger()` plugin import and usage.
- After editing, run: `npm uninstall lovable-tagger`

**Step 5 — Clean index.html, public assets, and add CSS safety net**
- In `public/index.html` or `index.html`, remove any `<script>` tags pointing to Lovable services.
- Replace the default Lovable favicon (`favicon.ico` or `favicon.png`) with my own — ask me to provide my logo file if not yet given.
- Update any `<meta>` og:image and og:title tags if they reference Lovable.
- In the project's global CSS file (e.g., `src/index.css` or `src/App.css`), add the following as a permanent CSS safety net at the very bottom to suppress any dynamically injected Lovable UI that survives the steps above:

  ```css
  /* Lovable branding removal — safety net */
  a[href*="lovable.dev"],
  iframe[src*="lovable.dev"],
  div[style*="Edit with Lovable"],
  .lovable-badge {
    display: none !important;
    opacity: 0 !important;
    visibility: hidden !important;
    pointer-events: none !important;
  }
  ```

**Step 6 — Verify**
After all edits, confirm:
- No remaining "lovable" strings exist in the codebase (case-insensitive), except inside comments or the CSS safety net above.
- The app builds cleanly with `npm run build` — no missing imports or broken references.
- The app renders without the badge in both dev and production modes.

Always show me the exact diff or code block for each change before applying. Ask me clarifying questions if a file has ambiguous dependencies. Do not remove any functional code — only branding/UI references.