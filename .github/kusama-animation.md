You are helping me add a Kusama-inspired animated background to my React/Next.js portfolio site at umutykaya.com.

My site's design context:

Framework: React / Next.js (TypeScript)

Styling: Tailwind CSS

The rest of the page layout, content, and components stay exactly as they are — you are only adding a background animation layer

The background must be position: fixed, z-index: 0, and sit behind all existing content without affecting layout
The animation I want is inspired by kusama.network's hero section and includes all of the following:

CRT scanline sweep — a faint horizontal line that slowly sweeps down the full viewport in a loop (@keyframes)

Static noise grain — a subtle SVG feTurbulence filter overlay at very low opacity (~0.04) for a gritty texture feel

Faint grid lines — thin 1px horizontal/vertical lines forming a dark grid across the full background using repeating-linear-gradient, barely visible (~3% opacity)

Ambient glow pulse — one or two large, soft radial gradient blobs in #ff0066 (pink) and #00ffff (cyan) at very low opacity (~0.04–0.06) that slowly pulse in size using @keyframes and animation: pulse
Constraints:

Deliver a single self-contained React component: AnimatedBackground.tsx

Use only Tailwind utility classes + minimal inline styles where Tailwind cannot cover it

Include a @keyframes block inside a <style> tag injected via a useEffect or inside a globals.css comment block — clearly labeled

Respect prefers-reduced-motion: if the user has this set, disable all animations (static version only)

No canvas, no Three.js, no external libraries — pure CSS + React

The component is dropped into the layout as <AnimatedBackground /> once, wrapping nothing, and all other page content renders above it via normal stacking context
Color palette of my site (match these, do not introduce new colors):

Background: #000000 or near-black

Accent 1: #ff0066 (hot pink — primary glow)

Accent 2: #00ffff (cyan — secondary glow)

All overlays must be extremely subtle — the background should feel atmospheric, not distracting
Output the complete AnimatedBackground.tsx component and the corresponding CSS additions for globals.css. Add brief inline comments explaining each layer.