# Ownership, types, and errors

Read when a change involves borrowing decisions, lifetimes, smart pointers, or error types.

## Parameters and returns

```rust
fn count_nonzero(data: &[u8]) -> usize {      // &[u8], not Vec<u8>
    data.iter().filter(|&&b| b != 0).count()
}

fn label(name: &str, id: UserId) -> String {  // &str in, owned String out
    format!("{name}#{id}")
}
```

Rules of thumb:

- `&T` for read, `&mut T` for in-place mutation, `T` only when you store or consume it.
- `impl AsRef<Path>` / `impl Into<String>` at ergonomic boundaries — not on every internal function.
- Returning a borrow tied to an input is fine; returning one tied to a local is the compiler telling you the design is wrong.

## Clone vs borrow

`.clone()` is legitimate when it makes ownership obvious and the value is small or the path is cold. It's a defect when it appears inside a loop, in a hot path, or purely to escape a borrow-checker error you could restructure away.

```rust
// Conditional ownership without always allocating
fn normalize(input: &str) -> Cow<'_, str> {
    if input.contains(' ') { Cow::Owned(input.replace(' ', "-")) } else { Cow::Borrowed(input) }
}
```

## Shared ownership and interior mutability

| Need | Reach for |
| --- | --- |
| Single owner, heap indirection | `Box<T>` |
| Shared, single-threaded | `Rc<T>` |
| Shared across tasks/threads | `Arc<T>` |
| Mutation behind a shared ref, single-threaded | `RefCell<T>` |
| Mutation across threads | `Mutex<T>` / `RwLock<T>` (async variants in async code) |
| Cheap counters/flags | atomics |

`Arc<Mutex<T>>` everywhere is a smell: usually one owner plus message passing is the simpler shape.

## Lifetimes

- Elide where possible; annotate when returning a borrow derived from several inputs.
- A struct holding a `&'a` field couples its lifetime to the borrow — for long-lived state prefer owned data.
- `PhantomData` is for typestate and variance, not for silencing errors.

## Drop and RAII

Guards (`MutexGuard`, temp dirs, span guards) release on drop — bind them to a name only as long as needed, and don't `drop()` manually just to be explicit unless ordering matters.

## Error types

Library crates define their own enum:

```rust
use thiserror::Error;

#[derive(Debug, Error)]
pub enum ConfigError {
    #[error("io error reading {path}")]
    Io { path: PathBuf, #[source] source: std::io::Error },
    #[error("missing required key `{0}`")]
    MissingKey(String),
    #[error("invalid port `{value}`: {reason}")]
    InvalidPort { value: String, reason: String },
}
```

- One variant per failure mode a caller might branch on. Prose in one `Other(String)` variant is not error handling.
- `#[from]` for pure pass-through conversions; `#[source]` plus context fields when you have something useful to add.
- Binaries use `anyhow::Result` at the top level and add context as the error travels:

  ```rust
  let cfg = load_config(&path).with_context(|| format!("loading config from {}", path.display()))?;
  ```

- `Option` for absence, `Result` for failure. Don't encode failure as `None`.
- Combinators (`map`, `and_then`, `ok_or_else`, `unwrap_or_default`) read better than nested `match` for single-step transforms; use `?` for propagation.

## Panics

Acceptable: broken internal invariants, slice bounds you've already validated, tests, and `expect()` on a genuinely impossible state with a message that explains why it's impossible. Everything else returns `Result`. Document any panic in the doc comment.
