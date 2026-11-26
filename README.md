# skillaccinos

[![skills.sh](https://skills.sh/b/ahmadaccino/skillaccinos)](https://skills.sh/ahmadaccino/skillaccinos)

The agent skills and system prompt I actually use every day: adversarial code review, language-specific quality bars, PR babysitting, review-comment writing, review-comment triage, and pixel-perfect site recreation — plus the global pi system prompt that keeps all of it terse and honest.

## Skills

| Skill | What it does |
| --- | --- |
| [`pi-review`](skills/pi-review/SKILL.md) | Runs independent, adversarial multi-reviewer code review with [pi-subagents](https://github.com/nicobailon/pi-subagents), validates findings, and applies the real fixes as sole writer. |
| [`babysit-pr`](skills/babysit-pr/SKILL.md) | Watches an open PR until it merges: polls CI, workflow runs, review comments, and mergeability; retries flakes; fixes and pushes what it safely can. |
| [`create-pr-comment`](skills/create-pr-comment/SKILL.md) | Writes PR review comments and self-PR replies in my voice — short, blunt, lowercase, anchored to the line, never templated. |
| [`address-pr-comments`](skills/address-pr-comments/SKILL.md) | Audits which review comments are resolved, fixes the rest, then replies to each thread and resolves it. |
| [`typescript-review`](skills/typescript-review/SKILL.md) | The TS/React quality bar: single source of truth, derived state, no type escape hatches, deep modules, React 19 / TanStack / Tailwind conventions. |
| [`rust-review`](skills/rust-review/SKILL.md) | The Rust quality bar: borrow over clone, `Result` over panic, unrepresentable bad states, async/Tokio discipline, clippy-clean verification. |
| [`ui-design`](skills/ui-design/SKILL.md) | The implementation and review bar for any UI: principles, layout, type, color, components, motion, accessibility, responsive behavior, anti-slop checks, and a pre-ship review. Load it whenever you build, edit, or review interface work. |
| [`design-with-ai`](skills/design-with-ai/SKILL.md) | The de-slop design process for engineers who are not designers: constraints before pixels, no wackamole spot-fixes, remove agent litter, iterate 3–4 variants in a design tool, components + a `/showcase` page, preview deploys with real data, steal references, and thresh your taste. |
| [`design-graph-ui-grammar`](skills/design-graph-ui-grammar/SKILL.md) | Build UI from a design graph (screen → components → every visually distinct state) and a UI grammar tree of named design-system primitives, then render a local state matrix before wiring the real screen. No raw-`div` screenshots, no states added later. |
| [`apps-ui-cheatsheet`](skills/apps-ui-cheatsheet/SKILL.md) | The Apps design UI cheatsheet, Apple design style — exact tokens for settings, integrations, connected apps, stores, permissions, and sidebar dashboards: Inter-only type, strong status states (`#CAFACE` / `#15B042` badges, `#0077E6` switches), 40px data rows / 44px store rows, 32px-height 10px-radius buttons. Strong states make settings easier to scan. |
| [`laws-of-ux`](skills/laws-of-ux/SKILL.md) | Jon Yablonski's 30 Laws of UX (lawsofux.com) translated into build directives and code-level audit checks: what to do while implementing (Build it) and what to flag when reviewing (Audit it), grouped by psychology, usability, influencing behavior, and Gestalt — with a priority-by-task table and a `file:line [LAW]` audit workflow. |
| [`recreate-site`](skills/recreate-site/SKILL.md) | Pixel-perfect clone of a live URL: dump computed styles/boxes, steal fonts and motion from source CSS/JS, screenshot-diff at a matched viewport, rebuild, then fix numeric deltas — not vibes. |

`typescript-review` and `rust-review` share the same language-agnostic core (sections 1–8), so a mixed-language repo gets one consistent bar, then each diverges into what is genuinely language-specific.

`ui-design`, `design-with-ai`, `design-graph-ui-grammar`, `apps-ui-cheatsheet`, and `laws-of-ux` are the design stack: the implementation and anti-slop review bar for any UI, the process, the construction method, the Apple-style tokens, and the evidence-based UX review bar.

`recreate-site` is the clone pipeline: the live page is the spec; computed numbers and screenshot diffs are the acceptance test.

## System prompt

[`prompt/SYSTEM.md`](prompt/SYSTEM.md) is my global pi system prompt: critical rules, communication style, minimal diffs, a hard line against comment slop, bug-class thinking, and no phased handoffs.

Install it as your pi global prompt:

```bash
curl -fsSL https://raw.githubusercontent.com/ahmadaccino/skillaccinos/main/prompt/SYSTEM.md \
  -o ~/.pi/agent/SYSTEM.md
```

It is plain Markdown, so it drops into other agents (Claude Code, Codex, Cursor) as an instructions file too.

## Install

All skills:

```bash
npx skills add ahmadaccino/skillaccinos
```

One skill:

```bash
npx skills add ahmadaccino/skillaccinos --skill pi-review
```

Or copy a skill directory into your user skills directory manually:

```bash
cp -R skills/babysit-pr ~/.agents/skills/babysit-pr
```

Restart your agent if needed, then just ask for the work:

```text
review my changes before I open a PR
babysit PR 412 until it merges
address the comments on my PR
refactor this module to our rust standards
recreate https://example.com pixel-perfect
```

## Requirements

- pi (or any agent that reads `SKILL.md` skills)
- `gh` authenticated, for the PR skills
- [pi-subagents](https://github.com/nicobailon/pi-subagents) and an executable read-only `reviewer` subagent, for `pi-review`
- Python 3, for `babysit-pr`'s polling script

## Design

Reviewers get the change but not the author's reasoning, stay read-only, and are decorrelated by scan order — the parent agent owns synthesis and edits, so there is never more than one writer. The PR skills treat GitHub as the source of truth, poll instead of assuming, and never resolve a thread they did not actually fix. The prompt exists to keep all of that output short and the diffs small.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
