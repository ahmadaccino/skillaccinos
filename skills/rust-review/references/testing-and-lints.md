# Testing and lints

Read when adding tests to a change, or when setting up / arguing with clippy.

## Layout

- Unit tests: `#[cfg(test)] mod tests` at the bottom of the module under test — they may reach private items.
- Integration tests: `tests/*.rs`, one binary per file, exercising the crate through its public interface only. If an integration test needs a private item, the interface is the wrong shape.
- Doctests on every public function whose usage isn't obvious. They run in CI via `cargo test --doc` and double as documentation that can't rot.

## Naming and shape

```rust
#[test]
fn parse_returns_error_when_port_is_not_numeric() {
    let err = parse("port=abc").unwrap_err();
    assert!(matches!(err, ConfigError::InvalidPort { .. }));
}
```

- Name the behaviour, not the function: `<subject>_<expected>_when_<condition>`.
- One behaviour per test; prefer several small tests to one that asserts eight things.
- Assert on the variant with `matches!`, not on the `Display` string — message wording is not a contract.
- `unwrap()`/`expect()` are fine in tests; that's the one place they belong.

## Async tests

```rust
#[tokio::test]
async fn shutdown_drains_in_flight_requests() { /* ... */ }
```

Use `tokio::time::pause()` and `advance()` instead of real sleeps. A test that sleeps to fix a race is a flake waiting to happen — synchronize on a channel or a notify instead.

## Beyond examples

- **Property tests** (`proptest`) for parsers, encoders, and anything with an invariant like round-tripping.
- **Snapshot tests** (`insta`) for generated output — schemas, rendered text, CLI help.
- **Fixtures**: plain constructor functions, or a builder for structs with many fields. Prefer real values over mocks; introduce a trait for a seam only when something actually varies across it (a second implementor).
- **Benchmarks** (`criterion`) only where a performance claim needs proof, and always run in release.
- `#[should_panic]` sparingly — assert on `Result` instead where you can.

## Lints

Workspace-level configuration keeps every crate honest:

```toml
[workspace.lints.rust]
unsafe_code = "warn"
missing_docs = "warn"

[workspace.lints.clippy]
all = { level = "deny", priority = -1 }
perf = "deny"
```

Then in each crate's manifest:

```toml
[lints]
workspace = true
```

Run before declaring work done:

```bash
cargo fmt --check
cargo clippy --all-targets --all-features --locked -- -D warnings
cargo test && cargo test --doc
```

Lints worth knowing by name: `redundant_clone`, `needless_collect`, `large_enum_variant`, `await_holding_lock`, `unwrap_used`, `todo`.

Silencing is a last resort, is narrow, and states a reason:

```rust
#[expect(clippy::too_many_arguments, reason = "mirrors the C API signature")]
```

`#[expect]` over `#[allow]` — it fails when the lint stops firing, so stale suppressions get removed instead of accumulating. Never suppress a lint on a whole module to avoid fixing one call site.
