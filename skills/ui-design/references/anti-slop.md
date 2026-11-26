# Anti-slop catalog

A heuristic inventory, not a blacklist. Mark each item as observed, absent, or unknown. Report or fix a pattern only when the artifact shows evidence and the pattern causes defaultness, incoherence, repetition, or harm.

If a `DESIGN.md` or token system exists, also flag fonts, colors, type sizes, and radii that fall outside it, unless the addition is intentional and should be added to the system.

## Visual details

- Decorative grid-line background on a page that is not a canvas, map, or measuring tool
- Hard offset shadow (`4px 4px 0` and similar) outside a world that is actually neobrutalist
- One-sided bar or accent stripe on a rounded card
- Glass, blur, neon edges, or glow used as default decoration
- Hairline border paired with a wide soft shadow that fights itself
- Repeating-gradient stripes with no structural role
- Extreme border-radius on large cards
- Rough or generic SVG illustrations standing in for product imagery
- Unicode or emoji used as the icon system

## Typography

- Kicker, eyebrow, or badge sitting above the main headline
- Tiny interface or body text that fails a readability check
- A heading or paragraph that leaves one stranded word, unless that break is deliberate
- Flat type hierarchy: roles too close in size or weight to tell apart
- Icon tile stacked above a heading as the default section pattern
- Italic serif display headline used as a generated "editorial" tell, unless that is the world's voice
- Oversized hero headline that crowds out the actual product
- Crushed letter-spacing, or wide tracking on body copy
- An unexamined default face (often Inter) used for everything on a surface that needed a voice
- All-caps body text

## Color and contrast

- Purple-to-blue (or equivalently fashionable) gradients competing across buttons, type, and backgrounds
- Radial-gradient halo or soft spotlight behind content
- A generic "AI" palette or cream / beige editorial wash used as a reflex
- Dark mode with glowing accents that are not part of the world
- Gradient text used for emphasis
- Gray text on a colored or tinted background
- Low-contrast body, labels, placeholders, or overlays
- Color as the only way to tell states apart

## Layout and space

- Tiny numbered section labels (`01 / 02 / 03`) where the sequence carries no information
- Cards flush against the scroller or viewport edge
- Text covered, clipped, or overflowing its container
- Clipped menus, popovers, or toasts
- Unbalanced opening columns that leave a large dead gap
- A heading closer to the previous section than to its own content
- The hero-metric template: big number, small label, supporting stats, accent, used as the page idea
- Identical card grids with interchangeable content
- Monotonous spacing (one gap everywhere)
- Nested cards
- Line length too long for comfortable reading
- Body text touching the page edge, or cramped padding
- Modal used for a large or multi-step task that should be a page

## Motion

- Pulsing status dot that does not reflect live status
- Decorative blinking cursor
- Auto-scrolling marquee
- Bounce or elastic easing on ordinary UI
- The same entrance animation on every section
- Motion that delays access, moves the target, or ignores reduced-motion preferences

## Copy, imagery, and quality

- The same text repeated inside one container
- Em-dash overuse and generic marketing claims
- Forced contrast in the writing ("it is not X, it is Y") as a stylistic reflex
- Calling ordinary UI "theater" or similar inflated language
- Placeholder-style illustrations, broken images, or images hidden under overlays
- Invented metrics, customers, logos, awards, or activity presented as proof
- JavaScript errors on load, or content stuck hidden because an animation never started
- Heading levels that skip
- Essential information available only on hover

## Removal test

1. Name the element precisely.
2. State the job it performs (state, action, hierarchy, meaning, or brand).
3. If removing it keeps the job and improves clarity, delete it.
4. If deletion creates a real loss, make the smallest correction in the existing system.
5. Do not compensate with a new effect.
