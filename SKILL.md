---
name: pi-review
description: Run an adversarial, multi-reviewer code review of a diff using pi subagents, then apply the valid fixes yourself. Use whenever the user asks to review code or a change — "review this PR", "review our/the code", "review your work so far", "double check the code", "check my work", "look over this", "any bugs in this?", "sanity check this" — or when finalizing a non-trivial change. Requires pi-subagents.
---

# pi-review

Spawn independent read-only reviewers in parallel, each in fresh context, each told the code is wrong and given only the change rather than the author's reasoning. The parent agent collects both reports, validates the findings, and applies the fixes. Repeat until reviewers surface no real defects.

The parent orchestrator owns the flow. Reviewers never edit; the parent is the sole writer.

## When to use

- The user asks to review code or a change.
- Finalizing a non-trivial change, creating a pull request, or preparing to ship.
- Any write, review, and fix loop on real code.
- Skip trivial typo-only changes.

## Procedure

### 1. Resolve the diff

Run the diff command with `bash` and write the output to a temporary file. Reviewers read the file directly, keeping a large diff out of their task prompts. Pick the base that captures the whole change:

- Feature branch off a base: `git diff $(git merge-base HEAD main)`.
- Committing on the base branch: `git diff @{upstream}` or `git diff origin/main`.
- Only uncommitted edits: `git diff HEAD`.
- No Git repository: concatenate the relevant files into the temporary file.

```bash
git diff "$(git merge-base HEAD main)" > /tmp/review-change.diff
wc -c /tmp/review-change.diff
```

An empty file means the base is wrong; widen the diff and retry. For a diff larger than roughly 400 KB, split it into relevant subsets and review them in separate passes.

### 2. Launch independent reviewers

Default to two reviewers. Use fresh context and a different scan order for each so they do not converge on identical findings.

```typescript
subagent({
  context: "fresh",
  concurrency: 2,
  tasks: [
    {
      agent: "reviewer",
      task: REVIEWER_TASK({ position: "1 of 2", order: "top to bottom" }),
    },
    {
      agent: "reviewer",
      task: REVIEWER_TASK({ position: "2 of 2", order: "from the last change backward" }),
    },
  ],
})
```

Use an asynchronous run when useful, but collect every report before fixing the change.

### 3. Give each reviewer this contract

Include the temporary file path, adversarial mindset, panel position, scan order, read-only constraint, and output shape. Add the change's goal or focus areas when useful.

```text
You are an adversarial code reviewer and reviewer <position> on an independent
panel. Review on your own; do not assume another reviewer catches what you skip.
You did not write this code and do not share the author's reasoning.

Read the change at /tmp/review-change.diff (a unified diff, or raw files for an
unversioned project). Read it <order>.

Assume the code is wrong until you prove otherwise. The author wants it
accepted; you want every reason it should not be. Finding nothing is acceptable
only after a genuine attempt to break it.

First identify the language, framework, and runtime from the diff, then apply
only the checks that fit the stack:
- Universal: behavior that misses the goal or breaks callers; swallowed or
  incorrect errors; ignored returns; boundary, overflow, and rounding errors;
  null dereferences; empty, zero, negative, huge, duplicate, Unicode, and
  timezone edge cases; injection, path traversal, unsafe deserialization,
  secret leakage, missing authorization or validation; tests that do not verify
  their claim.
- Systems and manual memory: use-after-free, double-free, leaks, cleanup on
  error paths, ownership and lifetime, buffer overruns, uninitialized memory,
  alignment, and endianness.
- Concurrent and backend: races, deadlocks, lock ordering, missing
  synchronization, thread, file descriptor, and connection leaks, cancellation
  propagation, and ordering assumptions.
- JavaScript, TypeScript, and frontend: unsound casts, any, non-null assertions,
  missing await, unhandled rejections, incorrect Promise concurrency, stale
  React closures, dependency arrays, state mutation, misplaced effects,
  hydration mismatches, XSS, and listener leaks.
- Managed languages: mutable default arguments, iterator invalidation, resource
  leaks on exceptions, equality and hashing, float comparison, and encoding.
- Data, configuration, SQL, and infrastructure: migration reversibility,
  nullability and default mismatches, N+1 queries, missing indexes, unsafe
  interpolation, and breaking contract changes.

Use read-only tools to inspect surrounding code, search for callers, and verify
library behavior. Do not edit, build, or run anything. Report findings only.

Return a concise, prioritized list of concrete findings. For each, give the
file and location, what is wrong, the exact trigger, and a suggested fix. If you
find nothing, say so and state what you checked. Do not summarize the change.

Goal of the change: <goal>
Focus especially on: <focus>
```

### 4. Validate and fix

The parent agent decides which findings are real:

- Apply valid fixes directly; reviewers only report.
- Discard false positives already handled by the diff or surrounding code.
- Fix the whole bug class rather than only the reported line.

### 5. Repeat until clean

After substantial fixes, regenerate the diff and rerun the review. Stop when reviewers find no blockers or only optional polish, or after three rounds. Do not loop for cosmetic issues.

## Notes

- Add reviewers only with distinct positions and review framings.
- If every reviewer fails, surface the first error rather than silently passing.
- Use a read-only reviewer agent. Never grant reviewers a writer role or let them edit the worktree.
