---
name: recreate-site
description: Pixel-perfect recreation of a live website. Measure computed styles and boxes, extract fonts/assets/motion from source CSS/JS, screenshot-diff at a matched viewport, then rebuild. Use when the user asks to recreate, clone, copy, remake, or pixel-match a site, landing page, or URL (e.g. "recreate this site", "pixel-perfect clone of https://…", "copy this landing page"). Use when the user runs /recreate-site.
---

# Recreate a live site

Do not eyeball. Do not invent spacing, type, easing, or assets. The source page is the spec.

Default viewport: **1440×900** unless the user names another, or the source is clearly mobile-first. Match `devicePixelRatio` when screenshot-diffing.

## Tools

Prefer in this order:

1. **Aside REPL** (`aside repl` / Aside MCP `repl`) — Playwright `page`, `snapshot()`, `page.screenshot()`, `page.evaluate()`. Persistent scope: never redeclare `const` names across calls.
2. **agent-browser** — `open`, `eval --stdin`, `screenshot`, `wait --load networkidle`.
3. **curl / fetch** of HTML, CSS, JS modules, font/image/video URLs.

Load the aside-browser and agent-browser skills before driving those CLIs.

## Loop

```
measure → extract source → screenshot at known scrolls → build → screenshot-diff → fix the delta
```

Stop only when computed numbers on the clone match the source at the same viewport (type, boxes, scroll-linked stacking), not when it "looks close."

## 1. Measure

Open the URL. Wait for fonts and lazy media (`document.fonts.ready` + network idle + a short settle). Then dump:

Run `references/dump-page.js` inside `page.evaluate` (Aside REPL or `agent-browser eval --stdin`). Save the JSON.

From the dump, record:

- Root `html` / `body` font-size (px, not `%` or `rem` — those lie once a later rule overrides them)
- Font-face URLs + family/weight/style actually used
- Palette (only colors that appear)
- Grid: column count, track sizes, gap, padding
- Named layers (`data-framer-name`, `data-name`, section ids): position, z-index, mix-blend, filter, sticky/fixed
- Text blocks (parent boxes, not per-letter spans): size, weight, line-height, letter-spacing, color
- Media: src, natural + displayed size, object-fit
- Motion tells: `transition`, `animation`, inline `will-change`, `opacity: 0` that later becomes 1

If the dump is letter-split (Framer/GSAP SplitText), group by the parent `h1`/`p` box. Per-glyph rows are noise.

## 2. Extract source

Download the HTML. Pull:

- `<link rel="stylesheet">` and inline `<style>`
- Script `src` (especially hashed bundles: Framer `*.mjs`, Next `/_next/static`, Vite `/assets`)
- `@font-face` URLs — download woff2, don't hope a Google Fonts substitute matches
- Image/video/SVG URLs actually used at this breakpoint

Grep the JS for motion, not comments:

- `cubic-bezier`, `spring`, `stiffness`, `damping`, `duration`, `lerp`, `easing`
- `mix-blend-mode`, `clip-path`, `filter: blur`
- `IntersectionObserver`, `scrollY`, `sticky`, Lenis/GSAP/Motion config
- Component names that sound like custom effects (bouncer, cursor, gallery, split)

Platform fingerprints:

| Signal | What to steal |
| --- | --- |
| `<!-- Made in Framer -->`, `framerusercontent.com` | Named layers, `html { font-size: N% }`, code-component mjs |
| `cdn.prod.website-files.com` | Webflow class CSS; still prefer computed px |
| `/_next/static` | Next CSS modules + next/font files |
| `squarespace` / `shopify` | Computed styles win; don't clone their runtime |

## 3. Screenshot protocol

Same viewport as the dump. Capture:

- `scrollY = 0`
- Each major section (hero end, first dark/light flip, mid-page, footer)
- One hover of the primary CTA and one hover of a dense list/card
- Mobile (`390×844`) if the user asked for responsive or the source has a distinct mobile layout

Name files by scroll (`source-0.png`, `source-900.png`). Repeat on the clone with the same names.

## 4. Rebuild

- Stack: Vite + React unless the user specifies otherwise, or the source is a short static page (then HTML/CSS/JS is fine).
- Tokens from the dump: CSS variables for color, type, gap, radius. Use **px at the measured viewport**; `rem` only after `html { font-size: <computed html px> }` is locked and **never** restated as `html { font-size: 1rem }` later (that resets to the browser default).
- Self-host the source fonts. Hotlink source CDN images/videos only when they are public and stable; otherwise download into `public/`.
- Recreate motion from extracted numbers (duration, bezier, spring). Don't substitute "ease" or a random spring.
- Sticky/fixed stacking: if the source keeps a hero in place while later sections slide over it, that is z-index + document order, not a transform. A short wrapper around a sticky hero will *push* it (you see the bottom of the hero instead of the header). Keep the sticky hero a sibling of the rest of the page.
- Overlays (cursors, bouncing images): `position: fixed`. Give the *active graphic* `pointer-events: auto` and the full-viewport shell `pointer-events: none`, or the clone will eat clicks the source still receives.

## 5. Diff

At the same viewport and `scrollY`:

1. Screenshot clone vs source.
2. Re-run the dump on the clone. Diff `fontSize`, `width`/`height` of the same named boxes, `html` font-size, section `y`.
3. Fix the largest numeric miss first (root type, then grid, then a single section).
4. Re-screenshot that scroll. Don't move on while that section's dump still disagrees.

Typical deltas:

| Symptom | Usual cause |
| --- | --- |
| Everything 33% too big; headings wrap extra lines | `html` computed 16px instead of 12px — a later `html { font-size: 1rem }` |
| Hero header gone, wordmark filling the top at mid-scroll | Sticky hero trapped in a 150vh wrapper |
| Overlay inverts through type | Missing `mix-blend-mode` (often `exclusion` / `difference`) + SVG fill color |
| Intro wraps a name the source keeps on one line | Source used `white-space: nowrap` on a split-text line |
| Can't click projects / links | Full-viewport overlay capturing pointer events |
| Fade/slide feels off | Guessed easing; grep the source JS |

## 6. Scope

- Landing page only unless the user asked for inner routes. Stub `/work`-style links so they don't 404.
- Match breakpoints the source actually uses (`max-width` in its CSS), not a generic 768/1024 set.
- Do not "improve" the design. If the source is ugly at a breakpoint, so is the clone.
