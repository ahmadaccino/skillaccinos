# Contributing

1. Fork the repository and create a focused branch.
2. Edit the relevant `skills/<name>/SKILL.md` (or `prompt/SYSTEM.md`) and document behavior changes in `README.md`.
3. Test the skill for real: `pi-review` on a real diff with at least two independent reviewers, the PR skills against a real open PR.
4. For `babysit-pr` script changes, run `python3 skills/babysit-pr/scripts/test_gh_pr_watch.py`.
5. Open a pull request describing the scenario tested and the observed result.

Keep changes narrowly scoped. Reviewers must remain read-only, the parent agent must remain the sole writer, and no skill may resolve a review thread it did not actually fix.
