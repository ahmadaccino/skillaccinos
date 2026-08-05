---
name: rust-review
description: Rust code quality rules — single source of truth, deep modules, borrowing over cloning, Result-based error handling, typestate, async/Tokio discipline, clippy-clean verification, and minimal diffs. Use when writing, reviewing, or refactoring Rust, or when debugging ownership, lifetime, trait, or async problems.
---

# Rust Review

The quality bar for Rust code. Sections 1–8 are language-agnostic and mirror `typescript-review`; sections 9+ are Rust-specific.

Apply these while writing, not only while reviewing. When reviewing, cite the rule and the file:line.

## 1. Single source of truth

Every value, type, and config has exactly one canonical home.

- One shared type in one module, not the same struct redeclared per crate.
- Constants come from the crate that owns the domain; workspace-wide settings live in the workspace manifest (`[workspace.dependencies]`, `[workspace.lints]`), not copied per crate.
- If a workspace crate already exports it, depend on it. Check before writing.

## 2. Extract at two, not at one

Used in 2+ places → shared module or crate. Used once → inline it.

- Search the workspace before writing a helper.
- A function that forwards its args to another function, or renames an operation, is not an abstraction. Inline it.
- Duplication is cheaper than the wrong abstraction. Rust makes the wrong trait especially expensive — wait for the second caller before generalizing.

## 3. Deep modules, small interfaces

A module's interface is everything a caller must know: signature, invariants, ordering, error modes, panics, `Send`/`Sync` bounds, performance. Keep that small; put a lot of behaviour behind it.

- **Deletion test.** If deleting the module makes complexity vanish, it was a pass-through — remove it. If complexity reappears across N callers, it earns its keep.
- One implementor means a hypothetical seam; two mean a real one. Don't define a trait until something actually varies across it.
- Keep the public surface deliberate: `pub` only what callers need, `pub(crate)` for the rest, and don't re-export a whole module tree from `lib.rs` just to flatten paths.
- Accept dependencies as parameters (generic or `&dyn`), don't construct them inside — that's what makes the interface the test surface.
- Box at API boundaries, not internally.

## 4. Small files, single responsibility

- One concept per module: a type plus its `impl`s, not three unrelated types.
- Split past ~300 lines of logic, and split a module edited for several unrelated reasons.
- Keep `mod.rs` / `lib.rs` to declarations and re-exports; logic lives in named modules.
- Unit tests belong in a `#[cfg(test)] mod tests` at the bottom of the module they cover; cross-crate tests go in `tests/`.

## 5. Delete aggressively

- Dead code, dead `pub` items, unused features, and `dbg!`/`println!` debugging go in the same change that made them dead.
- Never comment code out — git has history.
- Delete deprecated surface instead of keeping it "just in case"; we rarely need backwards compatibility.
- If you can't explain why an item, field, generic parameter, or lifetime exists, it shouldn't.

## 6. Errors: loud and bounded

- Fail fast on missing config, during startup.
- Never swallow an error into a default value. If you must swallow, log with context.
- Map upstream status codes faithfully; don't collapse everything into one internal error.
- Decide explicitly which errors are part of your public API and which stay internal.

## 7. Naming and magic values

- Names state what the thing is or does; rename when the domain language shifts.
- Hoist magic numbers and strings to a `const` — except obvious unit arithmetic (`60 * 60 * 1000`).
- Don't extract a constant used exactly once.
- Every `TODO` carries a linked issue: `// TODO(#42): ...`.

## 8. Fragility

Flag code that breaks silently when a neighbour changes.

- String matching for dispatch (`provider.contains("bedrock")`) → an enum or a discriminant field.
- Positional assumptions (tuple index, insertion order, slice position) → named fields or explicit keys.
- Non-exhaustive `match` closed with a catch-all `_ =>` that silently absorbs new variants → match the variants, or mark the enum `#[non_exhaustive]` deliberately.
- Implicit coupling between modules with no type connecting them → add the shared type.
- Business logic baked into inline regexes, URLs, or keys → typed config.

## 9. Ownership and borrowing

Details in [references/ownership-and-errors.md](references/ownership-and-errors.md).

- Prefer `&T` over `.clone()` unless you genuinely need ownership. A clone in a hot loop is a defect, not a style choice.
- Take `&str`, `&[T]`, `&Path` in parameters — not `String`, `Vec<T>`, `PathBuf`. Return owned values only when the caller needs ownership.
- Small `Copy` types (≲24 bytes) pass by value.
- `Cow<'_, str>` when ownership is conditional; `Arc` only when sharing across tasks or threads, `Rc` only within one thread.
- `RefCell`/`Mutex` are a design signal — reach for them after you've failed to restructure ownership, not before.
- Annotate lifetimes only where inference can't reach; elided is better than decorative.
- Every `unsafe` block carries a `// SAFETY:` comment stating the invariant it upholds. If you can't state it, don't write it.

## 10. Types that make bad states unrepresentable

- Model states as an enum, not a bag of `bool`s and `Option`s:

  ```rust
  enum Flow {
      Checking,
      NoSession,
      Ready { id: SessionId },
  }
  ```

- Wrap domain primitives in newtypes (`UserId(Uuid)`, `Cents(i64)`) instead of passing bare `String`/`i64` around.
- Use the typestate pattern when an operation is only valid in one state:

  ```rust
  struct Connection<S> { /* ... */ _state: PhantomData<S> }
  struct Disconnected;
  struct Connected;

  impl Connection<Connected> {
      fn send(&self, data: &[u8]) { /* only a connected socket can send */ }
  }
  ```

- Prefer generics (static dispatch) by default; `dyn Trait` when you need heterogeneous collections or want to cut monomorphization.
- Derive rather than hand-write: `Debug`, `Clone`, `PartialEq`, `Default`, plus `serde` derives where relevant.

## 11. Error handling

- Fallible operations return `Result<T, E>`. `panic!` is for broken invariants only.
- No `unwrap()` outside tests. `expect()` only where the invariant is real and the message explains it.
- `thiserror` for library errors with meaningful variants and `#[from]` conversions; `anyhow` only in binaries and at the top level.
- Propagate with `?`, not match chains. Add context at the boundary (`.context("reading config")`).
- Don't collapse distinct failure modes into one `String` variant — callers can't branch on prose.

## 12. Async and concurrency

Details in [references/async-tokio.md](references/async-tokio.md).

- Never block in async: no `std::thread::sleep`, no blocking file/DB calls, no CPU-heavy loops. Use the async equivalent or `spawn_blocking`.
- Never hold a `std::sync` lock across an `.await`. Restructure, or use the async lock deliberately.
- Prefer channels over shared state; `JoinSet` over loose `spawn` handles.
- Bound concurrency with a `Semaphore`; unbounded spawning is a memory leak with extra steps.
- Handle cancellation explicitly (`CancellationToken`, `select!` with a shutdown branch) and propagate errors out of tasks — a dropped `JoinHandle` swallows failure.
- Spawned futures need `Send + 'static`; if that fights you, the state layout is wrong.

## 13. Performance

- Measure before optimizing, and always in `--release`.
- Prefer iterator chains over manual loops; avoid intermediate `.collect()`.
- Watch for `redundant_clone`, `needless_collect`, `large_enum_variant` (box the big variant).
- Reserve capacity when the size is known; prefer stack allocation over `Box` unless indirection is required.

## 14. Comments and docs

- `//` explains *why* — safety invariants, workarounds, non-obvious tradeoffs. Never what the code plainly does.
- `///` documents public API: what it does, error and panic conditions, and an example that compiles as a doctest.
- Libraries: `#![deny(missing_docs)]` on the public crate root.

## 15. Verify

Check the project's own commands first, then:

```bash
cargo fmt --check
cargo clippy --all-targets --all-features --locked -- -D warnings
cargo test
cargo test --doc
```

Prefer `#[expect(clippy::lint, reason = "...")]` over `#[allow(...)]`, and never silence a lint you could fix. Details in [references/testing-and-lints.md](references/testing-and-lints.md).

## Self-check before submitting

1. Is this the only place this logic lives?
2. Would deleting this wrapper/trait make the code shorter and just as clear?
3. Any clone, `String` param, or allocation I can borrow instead?
4. Any `unwrap()`, catch-all `_ =>`, or stringly-typed error?
5. Does the type system already forbid the bad states, or am I checking them at runtime?
6. Anything blocking, or a lock held across an `.await`?
7. Is every `unsafe` block justified by a `// SAFETY:` comment?
8. Is there dead code, or a comment I added that the code already says?
9. Do `fmt`, `clippy -D warnings`, and tests pass?
