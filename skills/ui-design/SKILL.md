---
name: ui-design
description: "Use whenever you build, edit, restyle, implement, or review any user interface: websites, web apps, mobile apps, native screens, landing pages, dashboards, marketing pages, forms, settings, onboarding, empty states, components, typography, color, layout, spacing, CSS, design systems, motion, or visual polish. Covers principles, layout and spacing, typography, color, components, motion, accessibility, responsive behavior, anti-slop checks, and a pre-ship review. Not for backend-only or non-UI work."
---

# UI design

A consolidated implementation and review bar for product UI, marketing surfaces, and components. Load this skill before writing or changing interface code, styles, or CSS, and again before calling the work done.

The local design system wins. If the project has a `DESIGN.md`, tokens, components, or a named visual world, honor them even when they conflict with a pattern warning below. Refinement keeps the incumbent identity. Redesign keeps product truth and constraints, but treats the old look as evidence, not something to polish halfway.

## How to work

1. Read the brief, existing UI, tokens, `DESIGN.md`, and any references before choosing a direction.
2. Name the surface mode, the primary user job, the one visual thesis, and the one primary action.
3. Design at the sizes the work will actually be seen. A layout that only works at the desktop canvas is not done.
4. Inspect the rendered result, not only the source. Walk the real path with real (or realistically worst-case) content.
5. Subtract before adding. If a layer, label, effect, or container has no job, remove it.
6. Run the anti-slop catalog and the pre-ship checklist before handing off. A clean automated scan is a floor, not proof of quality.

Write like a design engineer who will be judged on the shipped screen. Finish the job. Do not leave placeholder copy, dead controls, or missing states on a path you touched.

## Principles

- **The brief wins.** Honor pinned aesthetics, typography, materials, and palettes. Redirecting a clear brief toward a generic "cleaner" look is failure.
- **One idea per surface.** Typography, color, material, imagery, and motion should support the same thesis. One strong authored moment beats many unrelated effects.
- **Relationships before decoration.** Use proximity before containers, hierarchy before labels, and depth only when there is a real layering model.
- **Make it specific to this product.** If the copy, imagery, and layout could be pasted into an unrelated product unchanged, it is not done.
- **Unseen details compound.** Press states, focus rings, selection color, caret, tabular numbers, empty states, and optical alignment are the work. Users may not name them, but they feel their absence.
- **Taste is trained, then written down.** When a reviewer or user corrects a visual choice, record the rule and its reason in `DESIGN.md` so the next pass does not repeat it. Only record taste the user actually expressed.
- **Beauty is leverage, used with restraint.** On task surfaces, beauty shows up as precision. On marketing and experiential surfaces, it may carry more of the voice, still with a cause for every effect.

## Surface modes

Choose the mode from the requested surface, not from the product as a whole. A tool's landing page is still Persuade. A fashion house's documentation is still Read.

| Mode | Visitor success | Design emphasis |
| --- | --- | --- |
| **Persuade** | Decide and act (landing, campaign, pricing) | Earn attention and action. Distinct voice. Real imagery when the brief needs it. |
| **Operate** | Complete a task (app UI, dashboards, editors, settings) | Scanability, consistency, familiar patterns, the real usage scene. Brand lives in precise details. |
| **Read** | Understand something (docs, articles, help, changelogs) | Structure for comprehension, then make the reading experience worth staying in. |
| **Experience** | Be inside the work (portfolios, galleries, showcases) | Let the artifact lead from the first viewport. The interface recedes. |

Ambition scales with the mode. Persuade and Experience get a clear point of view. Operate and Read get precision and restraint; patterns the visitor already knows earn their place.

## Layout and spacing

- Apply the squint test: with detail blurred, the primary element, the secondary element, and the major groups should still be identifiable in order.
- Group by meaning. Related items sit closer than unrelated items. Do not add a card or a border to compensate for weak proximity.
- Create rhythm through contrast between tight and generous intervals. More space above a heading than below it. One spacing value repeated until everything has equal weight is monotonous, not calm.
- Use a documented spacing scale. A 4-unit base usually provides the useful middle steps that an 8-only scale misses. Prefer `gap` for sibling rhythm when it expresses the relationship more directly than child margins.
- Let hierarchy follow product priority, not a framework default. Repeated cards, columns, or sections should be genuinely equivalent, not a convenient template.
- Density should match use frequency and decision complexity. Task UIs may be dense. Marketing UIs need air around the thing that matters.
- Make responsive behavior structural: reorder, collapse, reflow, or reveal based on what remains important. Container-aware components when the same part appears in different contexts.
- Keep touch targets usable even when the visible mark is small (44px is a reliable mobile floor).
- Use depth only when it clarifies state or hierarchy. Shadows should carry an offset and a soft blur. A zero-offset colored halo is decoration.
- Judge optical alignment on the rendered result, not only on the grid. Centered caps are not a centered word.
- Line length for prose: about 45 to 75 characters. Longer measures need more leading, or a narrower column.

## Typography

- Typography carries information, hierarchy, and voice. Use the fewest families and roles that make heading, body, label, metadata, and data unmistakable.
- Combine size, weight, space, and tone. Do not ask size alone to do all the work. Adjacent roles that are too close in size or weight will not read as different jobs.
- Ordinary web body text starts around 1rem / 16px unless a dense role, platform convention, or user setting justifies otherwise. Keep secondary text comfortably readable too. Tiny interface text (around 10px and under) is a defect.
- Tune line height to the face, measure, language, and contrast, not a universal ratio. Wider lines generally need more leading. Start body leading around 1.5, then adjust. On dark surfaces, slightly more line height, a touch more tracking, and one step more weight often help.
- Keep repeated roles consistent across screens and states. Use tabular numbers, lining or oldstyle figures, and monospace only when the content benefits (code, data, measurement). Monospace as a costume for "technical" is slop.
- Set `text-wrap: balance` on headings and short centered blocks, and `text-wrap: pretty` on body copy. Both are progressive. Break a heading by hand only between phrases, and check that break at every width.
- Tracking: keep body text near the font's default spacing. Save wider tracking for short labels. Crushed tracking (tighter than about -0.04em) and wide letter-spacing on paragraphs both hurt reading. All-caps belongs on short labels, never on body copy.
- Load only used weights and faces. Provide metric-compatible fallbacks. Preserve browser zoom, user font settings, and platform text scaling (Dynamic Type on Apple platforms).
- Do not add a kicker, eyebrow, or tiny numbered label above a heading on new work. The heading should carry its own weight. Preserve eyebrows only when they already exist in an established system the user asked to keep.
- Display type may carry the voice on Persuade and Experience surfaces. On Operate and Read, stability and scanability come first. An unexamined default face (Inter as a reflex, a system display face as the marketing voice) is not a typographic point of view. If the project's system already specifies a family, including Inter, honor it.

## Color

- Build roles, not a bag of swatches: canvas and elevated surfaces; primary and secondary text; action, focus, and selection; borders and separators; success, warning, error, and information; data categories when needed.
- Name the temperature, the dominant relationship, and the color dosage before editing. Let the strongest color own a deliberate region or role instead of scattering tiny accents.
- Keep the primary action easy to find. Do not spend its color on decoration.
- On colored surfaces, derive secondary text from that hue or the foreground. Never drop generic gray onto a tinted field.
- Prefer a predictable color space such as OKLCH for new palettes, so lightness and chroma can be adjusted independently. Reduce chroma near white and black. Prefer explicit colors over chains of translucent overlays when alpha would make contrast context-dependent.
- Contrast, WCAG AA: body and UI text 4.5:1, large text 3:1, controls, icons, and focus indicators 3:1. Check interactive states, overlays, text on images, placeholders, and both themes. Color is never the only code for meaning; add text, shape, iconography, or position.
- Design dark and light themes as compositions, not mechanical inversions. In dark mode, design surface elevation and contrast explicitly. Avoid glowing accents on dark grounds unless the world is actually neon.
- Neutral gray is valid. Tint neutrals only when the brand hue genuinely creates cohesion.
- Pick light or dark from the use scene (who, where, under what ambient light), not from a category habit.

**Optional material language.** When the brief asks for a solid-but-glass system (especially agent or AI-app UI), prefer a language like Solid Glass: the finish lives at the edge, the pane feels heavy rather than airy, depth comes from thickness and soft shadow, and only an outline of the background comes through. That is not permission to frost every card. Decorative glass, blur, and refraction that fight the text remain slop.

## Components, states, and interaction

- Prefer the project's shared components over one-off restyles. Same-role controls should look and behave the same.
- Every control needs the states the path can actually hit: default, hover (on fine pointers only), focus, active or pressed, disabled, loading, error, success, empty, and permission-denied when relevant.
- Buttons and other pressable elements need immediate press feedback (a subtle scale around 0.95 to 0.98, or an equivalent change in the system's language). Feedback belongs on pointer-down or `:active`, not only on `click`.
- Popovers, menus, and tooltips should originate from their trigger. Modals stay centered in the viewport. Anchored UI sits where the product would put it, not in a decorative orbit.
- Tooltips may delay on first open; once one is open, adjacent tooltips should appear instantly.
- Cards are a container for a repeated, self-contained unit, not the default wrapper for every block. Nested cards are almost always wrong. Flatten shells and use spacing or a single divider to group.
- Do not put a task that needs neither interruption nor protected focus into a modal. Give it a page or a panel.
- Controls name their action. Errors name the problem and the recovery. Use the product's own language.
- Theme the browser surfaces you did not draw: text selection, caret, focus rings, scrollbar, underline offset, and tabular numerals. Unthemed defaults are a tell that the page was assembled, not designed.
- Icons come from one consistent family or authored SVG, in one stroke and weight. Unicode glyphs and emoji are not an icon system. Oversized icon tiles must not outrank the feature they introduce.
- Imagery should be art-directed to the subject, with reserved space (no layout shift), useful alt text, and no invented customers, metrics, logos, or testimonials presented as proof.

## Motion

Every motion needs a cause: spatial continuity, state change, explanation, feedback, or preventing a jarring jump. If the purpose is "it looks cool" and people will see it often, do not animate it.

**Decide in this order:** should it animate, why, which properties, which curve and duration (or a spring), how it interrupts, how it exits, and how it behaves with reduced motion.

- Frequency is the first filter. Actions used hundreds of times a day (keyboard shortcuts, command palettes) should not animate. Occasional surfaces (modals, drawers, toasts) may. Rare first-time moments may add delight.
- Never animate keyboard-initiated actions.
- Prefer `transform` and `opacity` so motion can stay on the compositor. Other properties (blur, clip-path, mask, shadow, height) only when they are the point of the effect and stay smooth. Do not animate `padding`, `margin`, or `width` as a first choice. Never use `transition: all`.
- Easing: enter and UI feedback use a strong ease-out (`cubic-bezier(0.23, 1, 0.32, 1)` is a solid default). Movement already on screen uses a strong ease-in-out. Hover and color changes may use `ease`. Constant motion (progress) is linear. Never use `ease-in` for UI; it feels late at the moment the user is watching.
- Duration: press feedback 100 to 160ms; tooltips and small popovers 125 to 200ms; dropdowns 150 to 250ms; ordinary UI under 300ms. Modals, drawers, and sheets may go up to 500ms. Match motion to the mood of the product, but do not confuse elegance with sluggishness.
- Nothing appears from `scale(0)`. Start from about `scale(0.95)` plus opacity. A button whose label changes should change on itself, with neighbors moving with it, not swap in a second element.
- Animate the relationship, not only the object: a new row carries the rows below it; a resizing surface does not stretch its text. Overlap beats, stagger groups lightly (30 to 80ms), and do not block input while a stagger plays.
- Springs belong on gestures, interruptible surfaces, and playful settle, not on every fade. Keep bounce subtle (about 0.1 to 0.3) and off ordinary UI. No bounce or elastic easing as a decorative default.
- Enter and exit can be asymmetric: slower where the user is deciding, fast where the system is responding. Use interruptible transitions for rapidly toggled UI; keyframes restart from zero.
- One authored moment per view beats a fade-in on every section. Do not auto-scroll marquees, pulse status dots, or blink decorative cursors unless the status is actually changing.
- `prefers-reduced-motion: reduce` means fewer and gentler animations, not a broken UI. Keep brief opacity or color transitions that aid comprehension. Remove movement and position changes. The static (poster) state must still tell the story.
- Gate hover motion with `@media (hover: hover) and (pointer: fine)`. Test gesture and scroll motion on real hardware, and in slow motion when timing feels off.

## Accessibility

- Visible, high-contrast focus for keyboard users. Tab order and reading order must agree with the visual order.
- Every control has an accessible name, role, and state. Icon-only controls need an accessible label. Errors are associated with the fields they describe.
- Heading levels match the document structure. Do not skip levels.
- Do not rely on color alone. Do not put essential information in hover-only tooltips.
- Hit targets stay usable. Do not disable zoom (`user-scalable=no` or `maximum-scale=1`). If a focused input zooms on iOS, the font size is under 16px; fix that instead.
- Respect reduced motion, text scaling, and zoom at 200%. Tight line boxes must not clip diacritics or tall scripts. Reserve a safe text area when imagery or overlays compete with type.
- Sticky layers, drawers, and popovers must not trap or hide focus, and must not clip their contents off-screen.
- Images need useful alternative text, or are marked decorative on purpose. Functional graphics need a text equivalent.

## Responsive and mobile behavior

- Design the narrow, intermediate, and wide layouts as compositions, not as a squeezed desktop. Check localized (longer) copy, zoomed text, and empty or overflowing content at each.
- Web app shells and bottom-pinned UI should use `dvh`, not `100vh`. Marketing heroes that must not jump when browser chrome hides should use `svh`.
- On phones: `viewport-fit=cover` plus `env(safe-area-inset-*)` so content clears the notch and the home indicator. A bottom bar that sits under the home indicator is a defect.
- Kill the default tap highlight and give designed press feedback instead. Do not let long-press select button labels (`user-select: none` on controls only, never on body text).
- `touch-action: manipulation` on buttons and links reduces tap delay. Gesture surfaces should declare the pan direction they need so a carousel does not steal vertical scroll.
- Input, textarea, and select font size should be at least 16px on the web to avoid focus zoom. Theme `theme-color` per color scheme.
- Touch and mouse are not exclusive. Gate by capability (`hover`, `pointer`), never by user agent or screen width alone.
- Device emulation is not a phone. Sticky hover, rubber-banding, safe areas, the software keyboard, and tap delay need real hardware before you call mobile work done.

## Copy

- Use the product's own language. Controls name the action. Headings carry meaning without a decorative label restating them.
- Cut redundant helper text, empty superlatives, and generic claims ("unlock your potential", "the operating system for modern teams") unless they are actually the product's voice and are backed by something real.
- Do not invent proof: metrics, logos, customers, awards, activity, or screenshots presented as evidence.
- Do not lean on em-dashes in UI copy or marketing sentences. They are a familiar generated-writing habit. Use a comma, a period, or a shorter sentence.
- Ask before changing factual claims or legal wording.

## Anti-patterns

Treat a choice as suspect when it could be pasted into an unrelated product, repeats a familiar generated pattern, conflicts with the local system, communicates no meaning, or makes the interface harder to use. Do not guess whether AI made the artifact. Judge the visible result.

A technique is not slop in isolation. A gradient, a serif, a dark theme, glass, a card, or a single-font system can be intentional. The failure is reaching for it without a product reason, repeating it until everything has the same emphasis, or stacking effects that tell different stories.

Run the catalog in [references/anti-slop.md](references/anti-slop.md). Fix the root cause once. High-signal clusters:

- **Generic AI SaaS:** eyebrow, oversized sentence headline, purple or cyan gradient, radial lights, glass cards, icon tiles, interchangeable feature grid, vague copy.
- **Card apocalypse:** section card around feature cards, pill labels, redundant borders, independent shadows, extreme radii.
- **Motion theater:** hidden-at-rest content, identical section reveals, marquee, pulsing status, scale-on-hover everywhere, no reduced-motion path.
- **Fake sophistication:** monospaced micro-labels, decorative grids, fake dashboards, invented metrics, browser chrome as ornament.
- **Reference mismatch:** an imported section that brings the wrong font, radii, accents, or density into an existing system.
- **Polish before truth:** beautiful effects covering unclear product copy, weak actions, missing states, or unverified proof.

Default to subtraction. If removing the element improves clarity and the job still gets done, delete it. Replace only when deletion creates a real loss, and inherit the existing system rather than introducing a new visual concept.

## Stress-test the content

Demo data is chosen to make a layout look good. Before shipping a component or a dense screen, feed it plausible worst-case content: long names, unbreakable emails, one-letter names, missing optional fields, huge counts, a single item, an empty list, non-Latin text, emoji, and extreme but realistic numbers. See [references/edge-cases.md](references/edge-cases.md).

Check the real container width, a 320px viewport, the widest supported layout, 200% zoom, dark mode, and RTL when the product supports them. Report what broke, then fix wrapping, shrinking, pluralization, and overflow at the layout level. Do not hand-edit markup just to hide a break.

## Marketing and demo stills

This section applies when the work is a faux product shot, a feature-card illustration, a hero demo, a bento tile, or a cursor walkthrough, not when you are implementing the real product UI.

The one idea: it should read as a real product, simplified to what the viewer needs, framed with intent, and every motion should have a cause.

Five ways those shots fail:

1. **Too much.** Real text in every row, numbers everywhere, everything packed. More detail makes it look generated.
2. **Too little / wireframe.** Two gray blobs and a button, or a screen stripped of what made the product recognizable.
3. **Boxed.** A whole window shrunk into a card with even margins: a screenshot pasted in, not a product shot. Crop with intent, run the device off an edge, and keep real words and controls whole.
4. **Flat.** Every object the same weight in the same bordered card. The eye has nowhere to land.
5. **Bland.** A generic gray window, whatever the brief asked for. Take the brief's look and energy and build it to the same craft rules.

Simplify the words, not the context. Real words only where the story is; placeholder bars for the rest, and not where the eye lands. Count the real strings (usually a handful). Design at the size it will be seen, and ship a redesigned compact layout for a phone column rather than squeezing the desktop frame. Open on a finished still that already tells the story (the poster frame). Loops should reset with a visible cause; data should not rewind in view. Between a richer story and a calmer frame, choose the frame.

Do not apply these cropping and filler-bar rules to a production application screen. Real product UI needs real content, complete states, and layouts that hold at every size, not a cropped illustration.

## Polish checklist

Work the whole path, not one corner. Fix in this order: broken or blocked tasks and inaccessible paths; missing states; flow, hierarchy, responsive, and system drift; visual and motion inconsistencies; leftover code and assets.

- The squint test still reveals the primary, secondary, and major groups.
- Same-role type, color, radius, icon, and spacing stay consistent with the system.
- Optical alignment, wrapping, and localization expansion hold at every supported size.
- Imagery does not shift the layout. Icons share one family and optical size.
- Hover, focus, active, disabled, loading, empty, and error states are present where the path needs them.
- Motion is coherent, interruptible, performant, and optional under reduced motion.
- Copy is consistent and honest. No debug output, dead code, or unused styles shipped.
- Theme both color schemes when the product has them.

If the concept itself is wrong, say so and recommend a redesign. Do not smuggle a new identity into a polish pass.

## Pre-ship review

Do not ship (or hand back) UI until you can answer these from the rendered result. Quote a viewport, state, or frame, not an intention.

**Job and hierarchy**
- [ ] The surface has one clear job and one primary action. A new visitor can find both in seconds.
- [ ] The squint test works at the shipping sizes, including a phone width.
- [ ] The result is specific to this product. It would not pass for a generic stand-in with the logo swapped.

**System and craft**
- [ ] Type, color, space, radius, and icons come from the established system, or a compact system was defined first if none existed.
- [ ] Contrast meets AA in all checked states and themes. Color is not the only cue.
- [ ] No nested cards, kickers added as decoration, gradient text, side-stripe cards, or unthemed browser chrome unless the brief explicitly asked for that world.

**States and content**
- [ ] Default, hover (fine pointer), focus, press, disabled, loading, empty, error, and success are handled where needed.
- [ ] Realistic long, short, missing, empty, and localized content does not overflow, clip, overlap, or leave orphaned punctuation.
- [ ] Copy names actions and recoveries. No invented proof.

**Motion, access, and responsive**
- [ ] Every animation has a cause, a sensible duration, and a reduced-motion path. Keyboard actions are not animated.
- [ ] Keyboard focus, reading order, names, and zoom are usable. Zoom is not disabled.
- [ ] Narrow, mid, and wide layouts are composed. Safe areas, `dvh`/`svh`, and 16px inputs are correct on mobile web. Hover is gated.

**Honesty**
- [ ] You looked at the rendered UI, not only the source. What you could not verify (for example, a real phone) is stated, not assumed.

Review findings in this order: framing and hierarchy, then density and states, then motion, then polish. Rank by how much of the scene it spoils, not by how easy it is to fix.

## Conflicts between sources

These rules were merged from several public skills. Where they disagreed, this skill uses the following resolutions.

- **Production UI vs faux UI.** Shan Holmberg's post frames Stageshow as production-grade taste. Benji Taylor's own skill is for authored marketing stills and cursor demos, not for shipping application chrome. Production work follows the product-UI rules above. Stageshow framing, filler bars, and crop rules apply only to the Marketing and demo stills section.
- **Eyebrows and kickers.** Impeccable bans them. Other sources treat them as often-useless labels. This skill bans adding them on new work, and preserves them only when they are already part of a system the user asked to keep.
- **Inter and system fonts.** "Inter everywhere" is slop when it is an unexamined default on a surface that needs a voice. If the project's design system specifies Inter or a platform font, honor that system.
- **What to animate.** Prefer compositor-friendly `transform` and `opacity` (Emil Kowalski). Other properties are allowed when they are essential to the effect and stay smooth (Impeccable). Default to the stricter performance rule.
- **Bounce.** No elastic or bounce easing on ordinary UI (Impeccable). Subtle bounce is allowed on gesture settle and on a clearly playful brief (Kowalski).
- **Body measure.** Use 45 to 75 characters, not a tighter 65 to 75-only window.
- **Glass.** Decorative glassmorphism is slop. A deliberate, readable solid-glass material is allowed when the brief asks for it (Solid Glass).
- **The brief and the local system always outrank a catalog warning.**

## Credits

Synthesized from skills and catalogs shared or quoted in:

- Shan Holmberg, breakdown of Stageshow: https://x.com/shannholmberg/status/2116957574008590445
- Meng To, list of UI design skills: https://x.com/MengTo/status/2122984275566076395
- Benji Taylor, Stageshow (skill and references): https://github.com/benjitaylor/skills, https://benji.org/stageshow, launch post https://x.com/benjitaylor/status/2116593247854453244
- Impeccable, including the anti-slop catalog and craft floor: https://impeccable.style, https://impeccable.style/slop/, https://github.com/pbakaus/impeccable
- Emil Kowalski, AI skills for UI (design engineering, motion, gestures, mobile-native, break-ui, learn-taste): https://aiforui.dev/skills, https://github.com/emilkowalski/skills
- Meng To, skills for UI and web design (`no-ai-design-slop`, `audit-ai-design-slop`, `design-first-ui-prompting`): https://github.com/MengTo/Skills
- Solid Glass, material language between flat UI and liquid glass: https://github.com/deeplethe/solid-glass
- Open Design is a local-first AI design studio that bundles some of the same upstream skills; it was reviewed and is not a separate source of unique implementation rules: https://github.com/nexu-io/open-design

Ideas are attributed in this credits list rather than inlined on every bullet. Helper catalogs in `references/` compress the Impeccable slop catalog, Meng To's pattern library, and Kowalski's edge-case signatures. Tool-specific installers, detectors, hooks, telemetry, and kit code were left out on purpose so this skill stays tool-agnostic.
