---
name: design-graph-ui-grammar
description: >
  Design and implement UI by first building a design graph (screens →
  components → every visually distinct state) and a UI grammar tree
  (named design-system composition, like a call stack for JSX). Use when
  building or refactoring screens, components, design-system UI, toolbars,
  settings panels, or agent-built interfaces; when asked for a design
  graph, UI grammar, state matrix, component permutations, hover/focus/
  disabled/empty/error states; or when UI quality, missing states, or
  DS composition is the task. Do not jump straight to raw markup.
---

# Design Graph + UI Grammar

Do not start from pixels or anonymous markup. First produce a **design graph** and a **UI grammar tree**, then implement against that contract and render a local **state matrix** so every permutation is inspectable.

## Goal

Ship these artifacts in order:

1. **Intent** — the decision the user is making
2. **Design graph** — Screen → Components → visually/behaviorally distinct states
3. **UI grammar tree** — named DS composition (call stack for UI)
4. **State matrix** — production primitives frozen in deterministic states
5. **Implementation** — only after 1–4 exist (same PR is fine)

## Principles

- Compose **named** parts. Every node is a real DS primitive (`PageFrame`, `SettingsRowsCard`, `SettingsDescribedRow`, `ToolbarCluster`, …).
- States are design, not polish. Cover API variants plus rest, hover, focus-visible, pressed, selected, disabled, loading, empty, error, suggestion, and layout context.
- Prefer a small **state machine**, then list only *visually distinct* renderings.
- Disabled / unavailable variants keep the same geometry and hierarchy as the live control.
- Matrix cells use production components + fixture props. No dummy CSS copies.
- If you cannot see the permutation, the graph is unfinished.

## Workflow

### 1. Name the grammar and load the contract

```
Grammar:  <human name of the decision or surface>
Owner:    <path to the screen or root component>
Contract: <design-system kit this composition must obey>
```

Read the existing design system before writing any tree. Use only primitives that exist in the contract. If one is missing, say so and propose it — do not silently fake it.

### 2. Build the design graph

```
Screen
  └─ Component
       ├─ State #1
       ├─ State #2
       └─ State #(n+1)
  └─ Component
       ├─ …
```

Enumerate axes per component:

| Axis | Examples |
|---|---|
| API / content | variant, size, icon, label, count, optional slot on/off |
| Interaction | rest, hover, focus-visible, pressed, selected, dragging |
| Capability | enabled, disabled, read-only, permission-denied |
| Data | loading, empty, populated, error, partial |
| Context | first/middle/last in a cluster, compact vs comfortable, RTL |

Keep a node only if it looks or behaves differently. Collapse equivalent looks and note the collapsed axes.

```md
## Design graph — Markdown editor chrome

### Screen: Editor canvas
- Toolbar (formatting cluster)
  - rest / hover / focus-visible / selected (B|I|S|code|link)
  - unavailable formatting (same geometry, muted)
- Link editor
  - empty field
  - existing link (edit / remove / open cluster)
- Block command menu
  - rest, active-row, empty query
- Mentions
  - mixed entity types in one row grammar
- Block handle
  - grip on first text line, 24px target, reading datum unchanged
```

### 3. Write the UI grammar tree

Named components only. Flags and slots on the node. Optional nodes end with `?`. Repeatable nodes use `×`.

```
PageFrame
└─ PermissionRequestPanel
   └─ AppPermissionRowsCard
      └─ SettingsRowsCard divided={false}
         ├─ SettingsRowsBanner
         │    ├─ state directive
         │    └─ right: “Fixture only”
         ├─ SettingsDescribedRow: request identity
         │    ├─ title
         │    ├─ description
         │    └─ below: SettingsRowDetailArea
         │         └─ SettingsDetailRow × fact
         ├─ SettingsRowDivider
         ├─ SettingsDescribedRow: requested permissions
         ├─ SettingsRowDivider
         ├─ SettingsDescribedRow: current state
         │    └─ below?: blocking fact | receipt fact | fixture limitation
         ├─ SettingsRowDivider?          # only when actions exist
         └─ SettingsCardActions?
              ├─ secondary: outline, default width
              └─ primary: solid, default width
```

Rules:

- Every leaf is a primitive or a named slot, never “some div.”
- Layout-changing props (`divided`, `below`, `right`) are written on the node.
- Mark conditionals with `?` plus a one-line predicate.
- Copy may be placeholder; the slot may not be.
- If you sketch a wireframe, label every box with the same grammar names.

### 4. State machine, then visual matrix

Interactive pieces get states and events first:

```
idle → hover → focus
idle → selected
idle → disabled
idle → editing-link → confirm | cancel
idle → command-menu → highlight-row → commit
```

Then list visually distinct renderings only. That list is the matrix.

Each matrix cell has:

- Title (state name)
- One sentence of intent
- Production primitive frozen in that state
- Geometry / motion / keyboard notes

Example cells:

- Selection formatting — selected marks keep one floating silhouette
- Unavailable formatting — same geometry, muted, readable hierarchy
- Link editing — borderless field; Enter applies, Escape cancels
- Existing link — edit / remove / open as a compact cluster
- Block commands — arrow-key selection restyles the row; menu does not move
- Mentions — heterogeneous suggestions share one row grammar
- Block movement — grip on first text line, stable 24px target

### 5. Implement against the contract

1. Create or reuse the named primitives from the tree.
2. Wire the state machine. No ad-hoc booleans that are not in the graph.
3. Add a local design-graph surface (Storybook, `/dev/graph`, fixture page — whatever the repo uses).
4. Render every matrix cell from production components + fixtures.
5. Only then mount the composition in the real screen.

Checklist:

- [ ] Every grammar node exists in code under that name (or an explicit alias)
- [ ] Every graph state is reachable from fixtures
- [ ] Hover / focus-visible / disabled / empty / error are visible without clicking through the app
- [ ] Named keyboard paths work
- [ ] Disabled variants did not collapse padding or icon size
- [ ] Optional slots (`?`) do not leave orphan dividers or empty action rows
- [ ] Tree shape does not change with string length unless the graph said it would

### 6. Review

1. Can every control be named from the grammar tree?
2. Is any reachable user state missing?
3. Do two cells look identical? Merge them.
4. Is any cell a one-off outside the DS contract?
5. Do focus and selection survive layout (no jump, no clipped rings)?
6. Could another agent rebuild the same UI from only the tree + matrix?

If 6 is no, tighten names and slots before writing more code.

## Output format

Before writing implementation code, respond with:

```md
## Grammar
- Name:
- Owner:
- Contract:

## Intent
<2–4 sentences>

## Design graph
<screen → component → states>

## State machine
<states and events>

## UI grammar tree
<indented named composition>

## Matrix plan
<fixture cells to render>

## Implementation notes
<files, primitives to reuse, DS gaps>
```

Then write code. Do not write code before the tree and matrix plan exist unless the user says “skip the graph.”

## Anti-patterns

- Recreating a screenshot with raw `div`s
- “I’ll add hover later”
- One mega-component with ten booleans instead of a grammar tree
- Matrix pages that restyle dummies instead of production primitives
- Enumerating every boolean combo instead of visually distinct states
- Different layout for enabled vs disabled
- Inventing a card / row / button the contract already has
- Hiding optional chrome but leaving its divider

## Tiny example

**Grammar:** Markdown editor toolbar  
**Contract:** Glass control cluster + menu primitives

**Graph (abridged):**
- `FormatCluster`: rest, selected-mark, unavailable-mark, focus-visible
- `LinkEditor`: empty, populated, existing-link-actions
- `BlockCommandMenu`: rest, active-row
- `MentionList`: person / agent / broadcast in one row grammar
- `BlockHandle`: attached, dragging

**Tree (abridged):**
```
EditorChrome
└─ FormatCluster
     ├─ MarkButton × (bold | italic | strike | code | link)
     └─ LinkPopover?
          ├─ LinkField
          └─ LinkActions?   # edit / remove / open
```

**Matrix:** one page, “Contextual control states,” production primitives, deterministic fixtures.