# pi-review

[![skills.sh](https://skills.sh/b/ahmadaccino/pi-review)](https://skills.sh/ahmadaccino/pi-review)

An agent skill for running independent, adversarial code reviews with [pi-subagents](https://github.com/nicobailon/pi-subagents). It sends the same change to multiple read-only reviewers with decorrelated prompts, validates their findings, fixes real defects, and repeats until the change is clean.

## Requirements

- pi
- [pi-subagents](https://github.com/nicobailon/pi-subagents)
- An executable read-only `reviewer` subagent

## Install

Install it with the skills CLI:

```bash
npx skills add ahmadaccino/pi-review
```

Or copy `SKILL.md` into your user skills directory manually:

```bash
mkdir -p ~/.agents/skills/pi-review
cp SKILL.md ~/.agents/skills/pi-review/SKILL.md
```

Restart your agent if needed, then ask it to review a change:

```text
review my changes before I open a PR
```

The skill automatically:

1. captures the complete diff;
2. launches independent reviewers in fresh contexts;
3. checks each reported defect against the codebase;
4. applies valid fixes as the sole writer; and
5. repeats the review for substantial fixes.

## Design

Reviewers receive the change but not the author's reasoning. Each scans in a different order and is explicitly tasked with trying to break the change. They remain read-only, while the parent agent owns synthesis and edits. This avoids correlated reviews and competing writers.

## Contributing

Issues and pull requests are welcome. Keep reviewer roles read-only, prompts stack-aware, and changes compatible with the current pi-subagents API.

## License

MIT
