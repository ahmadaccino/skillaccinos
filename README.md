# skillaccinos

[![skills.sh](https://skills.sh/b/ahmadaccino/skillaccinos)](https://skills.sh/ahmadaccino/skillaccinos)

The agent skills and system prompt I actually use every day: adversarial code review, PR babysitting, review-comment writing, and review-comment triage — plus the global pi system prompt that keeps all of it terse and honest.

## Skills

| Skill | What it does |
| --- | --- |
| [`pi-review`](skills/pi-review/SKILL.md) | Runs independent, adversarial multi-reviewer code review with [pi-subagents](https://github.com/nicobailon/pi-subagents), validates findings, and applies the real fixes as sole writer. |
| [`babysit-pr`](skills/babysit-pr/SKILL.md) | Watches an open PR until it merges: polls CI, workflow runs, review comments, and mergeability; retries flakes; fixes and pushes what it safely can. |
| [`create-pr-comment`](skills/create-pr-comment/SKILL.md) | Writes PR review comments and self-PR replies in my voice — short, blunt, lowercase, anchored to the line, never templated. |
| [`address-pr-comments`](skills/address-pr-comments/SKILL.md) | Audits which review comments are resolved, fixes the rest, then replies to each thread and resolves it. |

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
