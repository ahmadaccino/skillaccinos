---
name: apps-ui-cheatsheet
description: Apply the Apps design UI cheatsheet for SaaS product interfaces—settings, integrations, connected apps, stores, permissions, and sidebar dashboards. Use when designing or implementing app settings screens, integration detail pages, connected-account UIs, admin sidebars, data-sync tables, or when the user mentions this cheatsheet, Ace Studio / Ace Design style, Inter-based product UI, or "strong states make settings easier to scan."
---

# Apps Design UI Cheatsheet

Source: @_heyrico — “Apps design UI Cheatsheet”. Apply these tokens and patterns exactly unless the user overrides them.

Core principle: **strong states make settings easier to scan.** Status, selection, connection, and permission should be readable in one glance—badges, checks, selected rows, and contrast—not hidden in weak gray-on-gray.

## Typography

Font family: **Inter**.

| Role | Size / line-height | Weight |
|---|---|---|
| Titles | 16 / 20px | Medium |
| Labels | 13 / 16px | Medium |
| Body | 14px | Regular |

Do not invent extra type styles. Hierarchy comes from size + weight + color, not extra families.

## Color

| Token | Value | Use |
|---|---|---|
| Text default | `#333333` | Titles, primary labels, values |
| Text subtle | `#777777` | Descriptions, secondary copy, section headers in sidebar |
| Badge fill | `#CAFACE` | Connected / success / positive state |
| Badge text | `#15B042` | Text inside success badge |
| Switch track (on) | `#0077E6` | Active toggle |
| Link | blue, underlined or default link blue | Store domains, external IDs |
| Canvas | white | Main content |
| Sidebar | very light gray | Navigation column |
| Selected nav | slightly darker gray pill | Current section |

Keep the surface quiet. Color is for state (connected, selected, upgrade), not decoration.

## Components

### Buttons

- Height: **32px**
- Radius: **10px**
- Primary destructive/upgrade style in the reference: solid black fill, white label, compact padding
- Secondary / ghost: light gray fill or hairline border, same height and radius

### Rows

- Data rows (metrics, sync counts): **40px**
- Store / account rows: **44px**
- Align icon + label left, value or URL right
- Hairline dividers between rows; outer container has large radius and a light border

### Badge

- Height: **20px**
- Radius: **6px**
- Fill: `#CAFACE`
- Text: `#15B042`, small Medium label (use the 13/16 label scale, optically fitted to 20px)
- Place immediately after the entity title (e.g. `Shopify  Connected`)
- One word when possible: Connected, Active, Synced

### Switch

- Track: **24 × 14px**
- Thumb: **10px**
- On track: `#0077E6`
- Keep switches for binary settings only; do not replace explicit permission rows with switches when a check + helper text is clearer

### Text

- Default copy: `#333333`
- Subtle / helper / meta: `#777777`
- Do not use pure black for body. Do not use mid-gray for titles.

## Layout pattern (settings / connected app)

Use this information architecture when the screen is an integration or app detail:

1. **Left sidebar**
   - Workspace mark + name + chevron
   - Quick actions search with keyboard hint (`K`)
   - Primary nav (Home, Analytics, Plan, Apps…)
   - Selected item is a full-width gray pill, not a colored bar
   - Grouped sections with quiet caps / small subtle labels: Tools, Pinned, Chat
   - Colored app/tool icons, 1 mark per row
   - Footer: progress (“Getting started 1 of 5”), trial chip, Upgrade button
2. **Main column**
   - Breadcrumb: `Apps / {App name}`
   - App icon (rounded square)
   - Title (16/20 Medium) + status badge on the same line
   - One-line subtle description (14 Regular, `#777777`)
   - Optional soft banner / contextual prompt card
   - **Data sync** card: 40px rows, icon + label left, numeric value right
   - **Stores / accounts** list: 44px rows, mark + name + link
   - Nested **permissions** card inside the selected store: title, then permission rows with a green check and a one-line helper in subtle text

Whitespace is generous. Cards are rounded. No heavy shadows—border + light fill only.

## Interaction and state rules

- Selected nav, connected badge, permission checks, and numeric sync values are the scan anchors.
- Permission rows: short title in default text + helper sentence in subtle text + trailing check. Do not bury status in a tooltip.
- Links to external properties (shop URLs) stay blue and distinct from body text.
- Truncate long sidebar labels with ellipsis; do not wrap nav items to two lines.
- Trial / upgrade sits pinned to the sidebar footer, high contrast, not in the main canvas.

## Do / don’t

**Do**
- Use Inter only
- Use the exact sizes above
- Put status next to the name
- Make connected / allowed / synced visually loud (`#CAFACE` / `#15B042` / checks)
- Keep row heights consistent (40 data / 44 stores)

**Don’t**
- Mix typefaces or add a display font
- Use oversized page titles (no 24–32px H1 on these settings screens)
- Use weak gray badges for success
- Use 8px or 16px button radii (it is 10px)
- Pack settings into a dense table with no grouping
- Hide connection state behind a menu

## Implementation sketch

When writing CSS or a design spec, start from:

```css
:root {
  --font: Inter, system-ui, sans-serif;
  --title: 500 16px/20px var(--font);
  --label: 500 13px/16px var(--font);
  --body: 400 14px/1.4 var(--font);
  --text: #333333;
  --subtle: #777777;
  --badge-bg: #CAFACE;
  --badge-fg: #15B042;
  --switch-on: #0077E6;
  --btn-h: 32px;
  --btn-r: 10px;
  --row-data: 40px;
  --row-store: 44px;
  --badge-h: 20px;
  --badge-r: 6px;
  --switch-w: 24px;
  --switch-h: 14px;
  --switch-thumb: 10px;
}
```