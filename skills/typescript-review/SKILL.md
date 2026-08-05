---
name: typescript-review
description: TypeScript and React code quality rules — single source of truth, derived state, type safety without escape hatches, deep modules, minimal diffs, and React 19 / TanStack / Tailwind conventions. Use when writing, reviewing, or refactoring TypeScript, TSX, React, or Next.js code, i.e. load this on basically any TS work unless told not to.
---

# TypeScript Review

The quality bar for TypeScript and React code. Sections 1–8 are language-agnostic and mirror `rust-review`; sections 9+ are TypeScript- and React-specific.

Apply these while writing, not only while reviewing. When reviewing, cite the rule and the file:line.

## 1. Single source of truth

Every value, type, and config has exactly one canonical home.

- Derive types from schemas and from functions — never hand-maintain a parallel declaration.
- Generate indexes, summaries, and manifests from source data.
- If a shared package already exports it, import it. Check before writing.

## 2. Extract at two, not at one

Used in 2+ places → move it to a shared module. Used once → inline it.

- Before writing a helper, search the repo: shared packages, `lib/`, `utils/`, sibling files.
- A one-line wrapper, a function called once that forwards its args, or a rename of an existing call is not an abstraction. Inline it.
- Duplication reveals the right abstraction later; guessing it upfront does not.

## 3. Deep modules, small interfaces

A module's interface is everything a caller must know: signature, invariants, ordering, error modes, config, performance. Keep that small and put a lot of behaviour behind it.

- **Deletion test.** Imagine deleting the module. If complexity vanishes, it was a pass-through — remove it. If complexity reappears across N callers, it earns its keep.
- One adapter means a hypothetical seam; two adapters mean a real one. Don't add a seam until something varies across it.
- The interface is the test surface. Needing to test past it means the module is the wrong shape.
- Accept dependencies, don't construct them. Return results instead of mutating inputs.

## 4. Small files, single responsibility

- One exported unit per file; unexported, tightly-coupled helpers may sit beside it.
- Split past ~200–300 lines of logic. A "wall of hooks" or a file edited for several unrelated reasons wants splitting.
- Each step of a multi-step flow is its own file.

## 5. Delete aggressively

- Dead code, dead exports, dead props, and debug logging go in the same change that made them dead.
- Never comment code out — git has history.
- We rarely need backwards compatibility; don't keep dead surface for it.
- If you can't explain why a piece of code exists, it shouldn't. "It was generated" is not a reason.

## 6. Errors: loud and bounded

- Fail fast on missing config, at startup, not at first use.
- Never silently return `null`, `""`, or a default on failure. Log whenever you swallow.
- Map upstream status codes faithfully (401→401, 403→403), never catch-all 500.
- Decide explicitly which errors reach users and which stay internal.

## 7. Naming and magic values

- Names state what the thing is or does; rename when the domain language shifts.
- Hoist magic strings/numbers to a named constant or design token — except obvious unit arithmetic (`60 * 60 * 1000`).
- Don't extract a constant used exactly once. Inline it.

## 8. Fragility

Flag code that breaks silently when a neighbour changes.

- String matching for dispatch (`provider.includes("bedrock")`) → put a discriminant on the type.
- Positional assumptions (array index, insertion order, message position) → explicit keys/ids.
- Implicit coupling between files with no import relationship → introduce a shared type or contract.
- Prop/param threading through 3+ layers to add one feature → composition or context.
- Business logic baked into inline regexes, URLs, or keys → typed config.

## 9. Type safety without escape hatches

- No `as`, `unknown` casts, `any`, or `@ts-expect-error` on type errors when the type can be fixed instead.
- Validate at the edge with a schema and `.parse()`; infer the type from the schema, don't write it twice.
- Pull types from the source rather than redeclaring them:

  ```ts
  type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "className"> & { label?: string };
  type CreateBody = Parameters<typeof createApplication>[0];
  type PayResult = ReturnType<typeof payWithCard>;
  ```

- Type env bindings, exec results, and API responses fully. Throw on a missing required value instead of defaulting to `""`.
- Prefer `type` over `interface`; use `interface` only for declaration merging.
- Model state as a tagged union rather than juggling related booleans:

  ```ts
  type Flow = { stage: "checking" } | { stage: "no-session" } | { stage: "ready"; id: string };
  ```

  Consumers branch on `stage` instead of recombining `isLoading`, `hasSession`, `!!data` at every call site.

## 10. Derive state, don't store it

- Use the query's `data` directly. Never copy server state into `useState`.
- No `useEffect` → `setState` waterfalls; compute derived values inline.
- Dependent queries use `enabled`, not effect chaining.
- Non-reactive values (DOM handles, imperative callbacks) go in refs.
- Never create contradictory boolean pairs (`showX` and `hideX`).
- `useReducer` with a typed `Action` union once a component has ~5 related `useState`s.
- For state that lives outside React (session probes, browser APIs, emitters), prefer `useSyncExternalStore` over wrapping the value in a context.

## 11. Trust the React compiler

The React 19 compiler makes manual memoization noise.

- No `useCallback` / `useMemo` / `React.memo` for pure perf. Reach for them only when reference identity genuinely matters — effect deps, third-party hooks, context values — or the compiler bailed out.
- Rules-of-React lint errors signal a structural problem. Fix the structure.
- `lazy()` for genuinely heavy components is still fine; it's an optimization, not a requirement.
- Prefer CSS (`@media (prefers-reduced-motion)`) over a hook for media queries.

## 12. Use project primitives

- Design system components over hand-rolled interactive elements. Never style a `div` to look like a button.
- Import the project's wrapper (icons, forms, http client), not the upstream library it wraps.
- Env and config live in the config package; never re-parse env inside an app.
- Dates, validation, and formatting go through the project's chosen library — no bespoke `formatDate`.
- Never cross-import between apps; share via a package. Runtime deps in `dependencies`, build-only in `devDependencies`.

## 13. React conventions

Details in [references/react-conventions.md](references/react-conventions.md). The short version:

- Named exports only; one exported component per file.
- Hooks live in `hooks/`, prefixed `use`, one per file; wrap every `useQuery` in a named hook.
- Server components by default; push `"use client"` down to the leaf that needs interactivity.
- Map over a const array instead of repeating JSX by hand.
- Derived booleans and class strings become `const`s above the `return`.
- Never mutate props; derive into a local.
- Accessibility baseline: labelled inputs, `role="alert"` error regions wired via `aria-describedby`, `aria-invalid` on failures, `aria-hidden` on decorative icons, visible focus rings.
- Tailwind only, via the project's `cn()` helper — never a template literal `className`, and prefer scale tokens (`p-4`, `gap-6`) over `p-[17px]`.

## 14. Verify

Run the project's own commands — check `package.json` and project memory first. Typically:

```bash
bun run lint
bun run typecheck   # or tsc --noEmit
bun test
```

Prefer `bun`/`bunx` when the repo uses bun. Lint and types must be clean before the work is called done.

## Self-check before submitting

1. Is this the only place this logic lives?
2. Would deleting this wrapper make the code shorter and just as clear?
3. Any `as`, `any`, or `unknown` I can replace with a real type?
4. Am I storing something I could derive?
5. Did I add memoization the compiler already handles?
6. Does a project primitive already do this?
7. Is there dead code, or a comment I added that the code already says?
8. Can this fail silently?
9. Will this break silently if a neighbour changes?
10. Do lint, types, and tests pass?
