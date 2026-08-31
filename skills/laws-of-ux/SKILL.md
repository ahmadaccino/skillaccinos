---
name: laws-of-ux
description: "Jon Yablonski's Laws of UX — 30 evidence-based principles from psychology, usability, behavior, and Gestalt perception — translated into build directives and code-level audit checks for coding agents. Use when designing or building any interface (web, mobile, dashboard, form, onboarding, landing page, settings), when asked to review or improve UX, when deciding between design options (how many options to show, where to put a button, how to group elements), or when the user mentions cognitive load, decision fatigue, Fitts's law, Hick's law, Jakob's law, Gestalt, choice overload, chunking, peak-end, paradox of choice, or 'make this easier to use'. Trigger even on implicit requests like 'this form feels overwhelming', 'too many options', or 'reduce friction'."
---

# Laws of UX

The 30 principles from [lawsofux.com](https://lawsofux.com/) by Jon Yablonski, made
operative for a coding agent. Each law has the things agents actually need:

- **Build it** — what to do while implementing.
- **Audit it** — what to look for in code when reviewing (a violation is a
  finding, not a theory).

These are evidence-based heuristics, not laws of physics. Read all four
categories before making decisions — several laws *conflict* (Von Restorff's
"make it stand out" vs. the aesthetic-usability/restraint cluster, Hick's
"fewer choices" vs. feature depth). Resolve conflicts by the user's goal in
that moment: what is this screen for, and what must the user do next?

## How to use this skill

1. **Build mode** — before writing markup/components, skim the category that
   matches what you're building (forms → cognition; dashboards → cognition +
   perception; landing pages → psychology + behavior; checkout/flows →
   behavior + usability). Apply the *Build it* rules inline.
2. **Review mode** — run the audit workflow at the bottom: one pass per
   category over the relevant files, and emit findings as `file:line [LAW] description`.
3. **Decide mode** — when asked "should we show 12 options or 3?" or "where
   does the button go?", cite the governing law and the tradeoff explicitly.

## Psychology in Design

### Aesthetic-Usability Effect
*Aesthetically pleasing design is perceived as more usable — and users tolerate
minor usability issues in it.*

- **Build it**: Never ship a functional UI that is also ugly — polish is a
  usability feature, not decoration. Keep visual quality high on the screens
  users see first and last (also see Peak-End). Treat one ugly screen as a
  bug with the same priority as one broken one.
- **Audit it**: Unstyled or half-styled screens, inconsistent spacing/radii,
  mismatched fonts, default browser styles visible, broken alignment. These
  are findings regardless of "it works fine".

### Cognitive Bias
*Users make decisions via mental shortcuts that systematically deviate from
rational choice — and can't switch it off.*

- **Build it**: Don't design for a rational user. Defaults are decisions made
  for the user (pre-check the safe/common option, never the costly one).
  Present options neutrally; order, framing, and count change the choice.
  Watch for anchoring (first number seen sets the reference) and loss
  aversion (frame costs as what they keep, upsells for what they gain).
- **Audit it**: Sneaky defaults (unsubscribing requires opt-out), framing that
  tricks (dark patterns count as findings), prices/limits presented without
  context that will anchor wrongly.

### Cognitive Load
*The total mental resources needed to understand and interact with an
interface. Split into intrinsic load (needed to do the task) and extraneous
load (waste: distracting decoration, unexplained labels).*

- **Build it**: Remove extraneous load first — every non-functional adornment,
  redundant label, or unexplained icon taxes the user. Keep the user's goal
  on screen: don't hide the cart while checking out, don't bury the save
  button under unrelated settings. One task per screen/step where possible.
- **Audit it**: Cluttered headers, icon-only buttons without tooltips/labels,
  unexplained jargon, decorative elements competing with content, wizard
  steps that ask for information already collected.

### Choice Overload (Paradox of Choice)
*Too many options overwhelm and reduce decision quality and satisfaction.*

- **Build it**: When a decision is required, cut the option set: curate
  (featured/recommended), provide search/filter *up front*, and collapse
  rarely-chosen options behind "More". When comparison is required (pricing
  tiers, plans), enable actual side-by-side comparison — a table beats a list.
- **Audit it**: Unfiltered long lists as the primary UI, plan/pricing sections
  without comparison, dropdowns with dozens of near-identical items,
  filterable content with no filters. Flag any place a user must compare >7
  alternatives by scrolling.

### Chunking
*Grouping individual pieces of information into meaningful wholes makes them
faster to scan and understand.*

- **Build it**: Group related content into cards, sections, and modules with a
  clear hierarchy. Chunk long forms into logical groups with visible
  boundaries (section headings, spacing), chunk long numbers/lists for scan-
  ability, and repeat the chunk's label pattern consistently.
- **Audit it**: Walls of indistinguishable list items, forms with no grouping
  or headers, data dumps without hierarchy, an 18-item flat settings page
  with no sections (see also Serial Position, Miller).

### Working Memory
*Holds ~4–7 chunks for ~20–30 seconds. Recognition beats recall; the system
should carry the memory, not the user.*

- **Build it**: Support recognition: visited links, breadcrumbs, persisted
  form state, "you already chose X" cues. Carry critical values across
  screens (comparison tables, checkout summary, review states). Never make
  the user hold information in their head between steps.
- **Audit it**: Steps that require remembering an earlier value, data that
  disappears on navigation (unsaved form fields, collapsed filters),
  redacted links (no visited state), no breadcrumbs on multi-level flows.

### Flow
*Full immersion happens when challenge matches skill, feedback is constant,
and friction is removed.*

- **Build it**: Give immediate, unambiguous feedback for every action (see
  Doherty Threshold). Remove friction between the user's intent and the
  outcome (no dead-end states, no reloads for one field, keyboard support).
  Match difficulty to the user: progressive disclosure for novices, shortcuts
  for experts (both, not either).
- **Audit it**: Actions that succeed silently, dead ends after an action,
  blocking modals mid-task, no keyboard/`Enter` handling, difficulty that
  assumes expertise (jargon) or insults it (redundant hand-holding).

### Selective Attention
*Users filter out most stimuli and attend only to what serves their current
goal — design must guide attention, not compete for it.*

- **Build it**: Give every view one clear visual priority and direct the eye
  with hierarchy (size, space, contrast, position) — don't scatter equally
  loud elements. Don't style content to look like ads or place content in
  ad-shaped zones (banner blindness). When making a significant change,
  pair it with a strong cue — a lone subtle animation among identical panels
  will be missed (change blindness), and competing simultaneous changes
  cancel each other out.
- **Audit it**: Multiple equally-prominent CTAs or alerts per view, content
  in banner-shaped slots with ad-like styling, important changes announced
  only by subtle style shifts, transitions that fire in parallel so no
  single change registers.

### Mental Model
*Users carry a compressed model of how systems work and apply it to anything
that looks similar.*

- **Build it**: Follow platform conventions precisely — a cart is top-right,
  a close is top-right/esc, a save is explicit, a link is underlined/colored,
  a switch looks like a switch. Match the user's model of the *domain* too:
  checkout mirrors the physical purchase order; filters behave like other
  filters on the web.
- **Audit it**: Inverted or invented conventions, a control whose behavior
  surprises (a save on hover, an input that doesn't accept paste, a "delete"
  that only archives without saying so), icons used against their platform
  meaning.

## Usability

### Doherty Threshold
*Under ~400ms of response, both parties are "interacting"; beyond it the user
is waiting and productivity drops.*

- **Build it**: Every action responds in <400ms. If work takes longer, show a
  working state immediately (optimistic UI, skeleton, spinner on the element
  itself, not a blocking overlay for quick ops). Use perceived performance:
  render layout instantly, stream content, animate transitions instead of
  freezing. A progress bar makes waits tolerable regardless of accuracy.
  Occasional *purposeful* delay can raise perceived value — but never add it
  to core actions.
- **Audit it**: Synchronous blocking loads, no loading states, delays between
  click and any visual change, progress bars that lie about completion,
  buttons that double-submit, wait spinners >1s for local operations.

### Fitts's Law
*Time to acquire a target grows with distance and shrinks with target size.*

- **Build it**: Make interactive targets large enough (≥44px touch, ≥32px
  desktop click), separate destructive from critical actions, keep primary
  actions close to where attention/task lives (bottom-right for "continue"
  in flows, in the editor toolbar, not split across corners). Edges and
  corners are cheap to acquire — good places for persistent critical actions.
- **Audit it**: Tiny links/buttons, adjacent targets with no spacing
  (mis-clicks), primary CTA far from the task, two competing primary buttons
  next to each other, right-side danger buttons next to safe ones.

### Hick's Law
*Decision time grows with the number and complexity of choices.*

- **Build it**: When speed matters, minimize choices in view (not by hiding —
  by removing or deferring). Break complex decisions into steps. Highlight
  the recommended option. Hide rarely-used features (progressive
  disclosure). Don't simplify to abstraction — the law doesn't justify
  crypticness or empty minimalism.
- **Audit it**: Feature soup toolbars, nav with 15 top-level items, first-run
  screens asking for commitment before value, settings pages that present all
  decisions at once, no differentiation between primary/secondary actions.

### Jakob's Law
*Users spend most of their time on other sites and expect yours to work like
them.*

- **Build it**: Deliberately copy the conventions of the category leader in
  your space. Navigation, search placement, checkout, login, and error
  handling should match what users already know. When redesigning, offer the
  old experience for a limited time or ease in changes.
- **Audit it**: Novel patterns where a standard exists (custom scrollbars,
  invented checkout order, non-standard gesture), renaming familiar concepts
  ("Trip" for "Cart"), breaking conventions without a reason visible to the
  user.

### Miller's Law
*~7±2 items in working memory — a heuristic, not a hard cap, and not a license
to cram to 9.*

- **Build it**: Chunk content into ~5–7 groups (see Chunking) rather than
  counting items. Use it to justify *grouping*, never to justify limitation
  or to maximize to 9. Adjust for audience: experts hold more chunks than
  novices.
- **Audit it**: Flat lists of 10+ items that could be grouped, 8+ ungrouped
  nav items, ignoring the "don't use the magical number seven as an excuse"
  caution (fewer than 5 is often better).

### Occam's Razor
*When two designs achieve the same result, the one with fewer elements wins.*

- **Build it**: Remove elements until removing more breaks function — then
  stop. One component doing double duty (label + input + help in one control)
  beats three separate ones. Add elements only with evidence, not "might be
  nice".
- **Audit it**: Duplicate paths to the same action, decorative elements that
  add no information, redundant labels (an icon *and* "Settings" and a
  tooltip all saying the same thing), dead buttons, marketing copy in
  tooling.

### Paradox of the Active User
*Users start using software immediately and never read the manual.*

- **Build it**: Expect zero documentation consumption. Path of least
  resistance must be the correct path (safe defaults, obvious primary
  action, forgiving undos). Plant guidance *in context*: tooltips on first
  touch, inline hints in placeholder/empty states, examples in inputs — not
  in a "Getting Started" doc nobody reads.
- **Audit it**: Empty states dead-ending with no next step, jargon a first-
  time user can't decode, features that depend on reading docs, no undo for
  destructive actions clicked "by accident" (which active users *will* do).

### Pareto Principle
*~80% of effects come from ~20% of causes — for most products, a few features
carry most of the use.*

- **Build it**: Spend design budget on the 20% of features 80% of users touch
  (search, create, share, checkout — whatever your telemetry says). Polish
  the happy path relentlessly; keep the long tail functional but plain.
  When in doubt about what to cut, cut from the tail.
- **Audit it**: Elaborate design on rare flows while the primary flow is
  rough, equal visual weight for a feature 2% of users hit and one 90% hit,
  onboarding that teaches the tail before the core loop.

### Parkinson's Law
*Tasks inflate to fill available time — the longer a task *can* take, the more
it will be perceived as taking.*

- **Build it**: Match task duration to user expectation — defaults, autofill,
  and prefilled data shrink forms (address autocomplete, saved payment, smart
  defaults). If a task can complete instantly, don't add three confirmation
  steps. Compress multi-screen tasks into one screen when the user expects
  fast (quick booking, instant checkout).
- **Audit it**: Mandatory multi-step flows for quick actions, forms that ask
  for data already known, confirmation dialogs on non-destructive actions,
  checkout longer than the product page demands.

### Peak-End Rule
*People judge an experience by its most intense moment and its ending — not
the average.*

- **Build it**: Identify the emotional peak of each flow and design it to
  delight; identify the likely negative peak (waiting, errors, payment) and
  design it to defuse — humor, progress, honesty, fast recovery. Spend
  disproportionate care on the *end*: confirmation screens, success states,
  final summary ("receipt moments") get brand character, not a text modal.
  End flows with the next action offered, so the memory is a launchpad not a
  period.
- **Audit it**: Success states that are generic modals, error states that
  blame the user, endings that dead-end, negative peaks (wait, friction)
  left unmitigated while mid-flow polish abounds.

### Postel's Law
*Be liberal in what you accept, conservative in what you send.*

- **Build it**: Accept messy input: trim whitespace, case-insensitive matching,
  flexible formats (phone/date/paste), tolerate synonyms. Parse and coerce,
  don't reject. Acknowledge *any* input immediately (see Doherty). Be
  conservative in output: emit clean, consistent, standards-compliant data
  and copy. Design for the unexpected — empty states, long words, offline,
  screen readers, zoom.
- **Audit it**: Inputs that reject valid-but-messy data, error messages for
  edge cases that could have been handled, content that breaks at unusual
  lengths, no handling of failed network/timeouts, assuming the exact happy
  path.

### Tesler's Law (Conservation of Complexity)
*Every process has an irreducible core of complexity — someone must absorb it;
prefer the system to absorb it.*

- **Build it**: Move unavoidable complexity into the system: smart defaults,
  remembering preferences, one-click retries, sensible inference. It's
  worth a week of engineering to save millions of minutes (Tesler's own
  argument). Don't hide complexity by deleting *function* — move it to the
  system's side. Remember users aren't rational (see Cognitive Bias).
- **Audit it**: Complexity pushed onto the user (manual steps the system
  could do), setup requiring user configuration the product could infer,
  advanced features hidden so deep the "simple" UI secretly lacks function.

### Zeigarnik Effect
*Unfinished tasks stick in memory better than finished ones.*

- **Build it**: Use incompleteness deliberately: clear progress state on
  multi-step flows (a "1 of 4" that shows what remains), save-drafts so an
  unfinished task can be returned to, on-hold states that invite resumption.
  Signal *more content exists* (see also Goal-Gradient) without being
  manipulative.
- **Audit it**: Multi-step flows with no progress indication, drafts that
  silently vanish, no affordance to resume where you left off, completion
  that looks unfinished (no terminal state).

## Influencing Behavior

### Goal-Gradient Effect
*People accelerate as they approach a goal.*

- **Build it**: Show progress everywhere it exists — onboarding, checkout,
  profile completion, reward bars. Make the end visible from the start
  ("3 quick steps" before step 1). Artificial progress (a loyalty card that
  starts pre-stamped) measurably increases completion — use it honestly
  (show real progress, don't fake it).
- **Audit it**: Long flows with no visible progress, no indication of total
  steps, progress that resets, completion bars absent where a goal exists.

### Serial Position Effect
*People remember the first and last items in a series best.*

- **Build it**: Place high-priority actions at the start and end of nav bars,
  lists, and menus (home at the start, account at the end — which also
  matches convention). Put the least important items in the middle. In
  checklists and settings, critical items lead; anchoring details (see
  Cognitive Bias) belong at the ends too.
- **Audit it**: Critical actions buried mid-list, nav that violates expected
  first/last placement (cart mid-list, search not at an end), longest lists
  with no grouping to break the middle.

### Von Restorff Effect (Isolation Effect)
*The item that differs from its neighbors is the one remembered.*

- **Build it**: Make exactly one thing stand out per view — the primary CTA
  gets the accent color; everything else stays quiet. Use restraint:
  competing highlights cancel out (and get mistaken for ads). Don't rely on
  color alone (add icon/shape/weight for color-vision users); don't use
  motion alone (motion sensitivity); don't rely on size to extreme.
- **Audit it**: Multiple red/accent CTAs per screen, whole sections using the
  brand accent, importance communicated only by hue, blinking/pulsing
  elements, "the accent color is everywhere so the CTA is not the accent
  color".

## Gestalt Principles

### Law of Proximity
*Objects near each other are perceived as a group.*

- **Build it**: Space *implies* relationship — group related items with tight
  spacing, separate unrelated groups with visibly larger gaps. The
  spacing scale is part of the design system; check that gap between groups /
  within groups differ clearly. Keep related text (label above its input,
  title above its card) closer than competing neighbors.
- **Audit it**: Labels, inputs, and buttons with equal gaps to unrelated
  elements; card titles as close to the previous card's content as to their
  own; equal whitespace everywhere so nothing reads grouped.

### Law of Similarity
*Visually similar elements are perceived as related and as belonging
together.*

- **Build it**: Use a consistent visual vocabulary: same color = same
  function, same style = same interactive affordance system-wide. Make sure
  interactive elements (links, buttons, chips) share *one* recognizable style
  family that is clearly distinct from static text.
- **Audit it**: Every card a different style, buttons in N colors across one
  page, links that look like body text, interactive vs. static elements that
  are visually interchangeable, icons with inconsistent stroke weights.

### Law of Common Region
*Elements inside a shared, bounded area are perceived as a group.*

- **Build it**: Use borders, background fills, and card containers to bind
  related items into regions — the strongest grouping cue. Put related
  controls inside the same surface (a filter bar panel); put the primary
  action inside the region it acts on, not floating ambiguously. Cards are
  the workhorse: one card = one concept.
- **Audit it**: Toolbars whose actions float unbound from the content they
  affect, related elements split across surfaces, borders used where the
  background alone should group (or absent where a region is needed).

### Law of Prägnanz (Good Figure)
*Ambiguous or complex shapes are perceived as the simplest possible form.*

- **Build it**: Keep figures simple and whole: align to a visible grid,
  use whole/consistent shapes, avoid visual noise that obscures the simple
  reading of an element. Content that resolves to a clean, obvious shape
  (a clear card, a clean table) is processed as "understood" — compound
  shapes and messy stacks read as chaos. Simplify the *form*, not the
  function.
- **Audit it**: Jagged/overlapping layouts, shapes that fight the grid,
  noisy backgrounds behind content, visual elements that don't resolve to a
  clean figure, composition that requires effort to parse.

### Law of Uniform Connectedness
*Elements connected by a line, arrow, or shared frame are seen as related —
the strongest Gestalt cue.*

- **Build it**: Use explicit connectors where relationship matters more than
  weak proximity can convey: step indicators with connecting lines, related
  diagram nodes, a line running from label to its control, containers
  binding sets of options. Prefer connectedness for grouping that must not
  be misread.
- **Audit it**: Related-but-disconnected elements (a label nowhere near its
  option group), flows with broken step connectors, associations that rely
  on color matching instead of a shared frame or line.

## Priority by task type

When time is short, apply the tiers in order — Tier 1 pays for itself in
every build:

| Task | Laws that matter most |
| --- | --- |
| Forms & inputs | Hick's, Cognitive Load, Chunking, Fitts's, Parkinson's, Postel's, Proximity |
| Navigation & IA | Hick's, Miller's, Jakob's, Serial Position, Similarity, Common Region |
| Dashboards & data | Cognitive Load, Chunking, Working Memory, Prägnanz, Common Region |
| Checkout & flows | Doherty, Parkinsons, Goal-Gradient, Zeigarnik, Peak-End, Tesler's |
| Onboarding | Paradox of Active User, Hick's, Goal-Gradient, Tesler's, Jakob's |
| Landing & marketing | Aesthetic-Usability, Von Restorff, Peak-End, Selective Attention, Pareto |
| Error & empty states | Postel's, Paradox of Active User, Cognitive Load, Peak-End, Feedback (Doherty) |

## Audit workflow

Run this when asked to review UI/UX, and when finishing any build ("final
pass"). Scope it to the files being shipped.

1. **Quick pass — the four questions.** (a) Can the user accomplish the primary
   goal in one obvious path with no dead ends? (b) Is any decision point
   asking the user to compare more than ~7 alternatives without tooling?
   (c) Does any interaction exceed 400ms without a working state? (d) Is the
   visual system consistent (spacing, color role, target sizes)?
2. **Category passes.** Walk each of the four categories above and check every
   *Audit it* bullet against the actual code. Group findings by law.
3. **Emotional pass.** Walk the *primary user journey* end to end: find the
   peak moment and the ending; check they're designed (Peak-End), progress is
   visible (Goal-Gradient/Zeigarnik), and the ending offers the next action.
4. **Emit findings** in terse format, tagged by law so the awkward→law→fix
   mapping is reviewable:

```
components/onboarding/Steps.tsx:12 [HICK] 8 options shown at once with no recommendation highlighted
components/onboarding/Steps.tsx:47 [GOAL-GRADIENT] no step indicator — user can't see the end
lib/checkout/Form.tsx:38 [PARKINSON] asks for address already collected in step 1
components/Settings.tsx:91 [PROXIMITY] save button equidistant from two unrelated groups
```

Then fix the Tier-1 law violations first (see priority table), and only then
the perception-level refinements. When two laws conflict in a fix, say which
one you chose and why — the user's in-the-moment goal is the tiebreaker.