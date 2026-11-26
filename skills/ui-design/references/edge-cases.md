# Edge-case signatures

Use plausible or schema-backed values, never random nonsense strings. Mix failures across rows. Include empty, one, and realistically huge collections, not only long text.

Check at the component's real container width, at 320px, at the widest supported layout, at 200% zoom, and in dark mode and RTL when the product supports them.

| What you see | Likely cause | Fix |
| --- | --- | --- |
| Avatar or icon squished into an oval | Flex child shrinking | `flex-shrink: 0` on fixed-size boxes |
| Text overflows its box | Flex or grid child has `min-width: auto` | `min-width: 0` on the text column (`minmax(0, 1fr)` in grid) |
| Email or URL runs past the edge | No break opportunities | `overflow-wrap: anywhere` on that element |
| Trailing action pushed off-screen | Middle content took all the space | `min-width: 0` on the middle, `flex-shrink: 0` on the action |
| Badge wraps onto two lines | Badge allowed to shrink | `white-space: nowrap; flex-shrink: 0`, and decide what yields |
| Avatar adrift next to a wrapped name | `align-items: center` on a tall row | `align-items: flex-start` once text can wrap |
| Last row cut mid-glyph | Fixed height with no scroll or fade | Intended overflow, a visible scrollbar, or a fade mask |
| Heading breaks mid-word | `word-break: break-all` | `overflow-wrap: anywhere` |
| Wrong initials or a replacement character | Naive `split(" ")[0][0]` | Grapheme-aware initials, skip suffixes, fallback icon |
| Orphaned dash or empty line | Placeholder for a missing optional field | Omit the line, or reserve its height on purpose |
| "1 members" / "0 member" | Hardcoded plural | `Intl.PluralRules` or per-count strings |
| Numbers jitter or columns misalign | Proportional figures | `font-variant-numeric: tabular-nums` |
| Raw `1284`, `NaN`, or `undefined` | Unformatted or unguarded number | `Intl.NumberFormat` and a null guard |
| Translated button label overflows | Fixed width | Width from content with a `min-width` |
| Diacritics or tall scripts clipped | Tight line-height plus overflow hidden | Looser line-height; do not clip text boxes |
| Broken-image icon in an avatar | No error fallback | Fall back to initials; `object-fit: cover` |
| Truncated text with no way to read it | Ellipsis and nothing else | Tooltip or title, and the full value in a detail view |
| A long list stutters | Every row rendered | Virtualize or paginate |
| User HTML or markdown rendered raw | Wrong escaping | Escape at render; never inject unsanitized user HTML |

Also cover: one-letter names, unbreakable emails, emoji-first names, missing avatars, counts of exactly 0 and 1, empty lists, and the longest value the schema actually allows.
