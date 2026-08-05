# Async and Tokio

Read when a change spawns tasks, awaits I/O, shares state across tasks, or shuts a service down.

## Model

Futures are lazy: nothing runs until polled. An `async fn` returns a state machine; `.await` yields to the runtime. A task is a spawned future the runtime polls concurrently.

Consequences worth remembering:

- A future you never await does nothing — no timers started, no requests sent.
- Everything between two `.await`s runs to completion on the runtime thread. Long CPU work there starves every other task on that thread.
- `select!` drops the losing futures at the branch point, so anything mid-flight is cancelled. Design for that.

## Concurrency

```rust
// Independent work, both awaited together
let (users, orders) = tokio::try_join!(fetch_users(), fetch_orders())?;

// Many tasks with results collected and errors surfaced
let mut set = JoinSet::new();
for id in ids {
    set.spawn(fetch_one(id));
}
while let Some(res) = set.join_next().await {
    let item = res??; // JoinError, then the task's own error
}

// Bound the fan-out
let permits = Arc::new(Semaphore::new(16));
```

- `join!` / `try_join!` for a fixed set, `JoinSet` for a dynamic one.
- Never let a `JoinHandle` drop unobserved — a panicking or failing task then disappears silently.
- Unbounded `spawn` in a loop over untrusted input is a resource exhaustion bug. Use a semaphore or a bounded worker pool.

## Blocking

```rust
let rows = tokio::task::spawn_blocking(move || heavy_sync_query(&conn)).await??;
```

Anything filesystem-heavy, CPU-heavy, or from a sync-only library goes through `spawn_blocking`. `std::thread::sleep` in async code is always a bug — use `tokio::time::sleep`.

## Locks

Never hold a `std::sync::Mutex` guard across `.await`: it deadlocks or blocks the worker.

```rust
// Good: scope the guard so it drops before the await
let snapshot = { state.lock().unwrap().clone() };
send(snapshot).await?;
```

Use `tokio::sync::Mutex` only when the critical section genuinely must span awaits, and keep it tiny. Prefer passing ownership over a channel to sharing a lock at all.

## Channels

| Channel | Use |
| --- | --- |
| `mpsc` (bounded) | work queues; backpressure comes free |
| `mpsc::unbounded` | only when the producer is provably bounded |
| `oneshot` | request/response handoff |
| `broadcast` | fan-out events, tolerating lag |
| `watch` | latest-value state (config, shutdown flags) |

Always handle the closed-channel case explicitly — `send` failing means the receiver is gone, which is usually shutdown, not an error to log at `error!`.

## Cancellation and shutdown

```rust
let token = CancellationToken::new();

loop {
    tokio::select! {
        _ = token.cancelled() => break,
        conn = listener.accept() => { /* ... */ }
    }
}
```

- One shutdown signal (`CancellationToken` or a `watch` channel) shared by every task.
- Wait for tasks to finish (`JoinSet::join_next` to exhaustion, or a `TaskTracker`) before returning from `main`, so buffers flush.
- Timeouts belong at the call site: `tokio::time::timeout(dur, fut).await`.

## Streams

```rust
use futures::StreamExt;

let mut stream = client.events().await?;
while let Some(event) = stream.next().await {
    handle(event?).await?;
}
```

`buffer_unordered(n)` for concurrent per-item work with a cap; avoid `collect()` on an unbounded stream.

## Traits

Native `async fn` in traits works for non-`dyn` use. Reach for `#[async_trait]` when you need `dyn` dispatch, and remember it boxes every call — don't put it on a hot path.

## Errors and observability

- Propagate with `?` inside tasks and surface the result through the join handle. Don't log-and-forget inside a spawned task.
- Instrument with `tracing`: `#[instrument]` on entry points, spans across awaits so context survives task switches.
- When debugging stalls: `tokio-console`, then look for a blocking call or a lock held across an await.
