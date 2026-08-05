# React conventions

Read when writing or reviewing components, hooks, data fetching, or file layout.

## Components

- **Named exports only.** Default exports break grep and let importers rename arbitrarily.
- One exported component per file; unexported subcomponents may share the file when tightly coupled.
- Wrapping a primitive input/button and exposing a ref → `forwardRef` with `displayName` set.
- Compute derived booleans, formatted values, and class strings as `const`s above the `return` so the JSX stays declarative.
- Never mutate props. Derive a local: `const value = format ? format(props.value) : props.value`.
- Prefer rendering a component as a child over assigning JSX to a variable and slotting it in, unless the slot really is clearer.
- Prefer `[...data].map(...)` over hand-repeated JSX. Copy, nav items, and option lists belong in a const array.

## Hooks

- Every hook lives in `hooks/`, one per file, prefixed `use`.
- Never define a hook inline inside a component.
- Check `hooks/` for an existing hook before writing a new one.
- Never call `useQuery` directly in a component — write a named wrapper hook and import it.
- `useReducer`s live in `hooks/` too, with a typed `Action` union.

## Data fetching

- `@tanstack/react-query` for services you don't control; `@tanstack/react-table` for tables; `@tanstack/react-virtual` for any large mapped list.
- When both sides of the stack are yours and ORPC (or an equivalent typed RPC layer) is set up, use its hooks instead of hand-written `useQuery`.
- Query keys are exported `as const` tuples next to the hook that owns them:

  ```ts
  export const APPLICATION_QUERY_KEY = ["opr", "application"] as const;
  ```

- Invalidation is centralized in a named helper, never duplicated inline across mutations:

  ```ts
  export async function refreshApplication(queryClient: QueryClient) {
    await queryClient.invalidateQueries({ queryKey: APPLICATION_QUERY_KEY });
  }
  ```

- Every mutation that changes server truth invalidates the matching query in `onSuccess`.

## Forms

When the form library provides context, trust it:

- Never pass form internals (`control`, `register`, `setValue`) as props — children read from context.
- Use the library's validity tracking instead of watching fields into a `useState`.
- Never mirror form state in component state.
- Validation lives in the schema — conditional requirements, format checks, and transforms are schema concerns, not imperative code.

## Server vs client components (App Router)

- Server by default. `"use client"` goes on the leaf that actually needs state, effects, or browser APIs.
- A parent doesn't become a client component just because a child is. Push the boundary down.

## Styling

- Tailwind v4 only, through the project's `cn()` helper (`clsx` + `tailwind-merge`). If `cn()` is missing in the package, flag it.
- Never build `className` with a template literal.
- Scale tokens (`p-4`, `gap-6`, `rounded-lg`) over arbitrary values; brackets only when no token fits.

## File naming and layout

- Components: PascalCase matching the export — `FlowInput.tsx` exports `FlowInput`.
- Hooks: kebab-case file, camelCase export — `use-application.ts` exports `useApplication`.
- Utilities: kebab-case — `cn.ts`, `passport-types.ts`.
- Keep `.tsx` files under ~300 lines; past that, split into a sibling `components/` folder.

In-file order:

```tsx
// imports
// module-level constants
// helpers
// unexported subcomponents

export function MyComponent(props: Props) {
  // component-level constants
  // hooks, unconditionally, in one block
  // data fetching (typed RPC hooks, else a named useQuery wrapper)
  // derived locals

  if (isLoading) return <Skeleton className="h-16 w-4" />; // explicit sizing, no layout shift
  if (isError) return <ErrorState />;

  return <>{/* ... */}</>;
}
```

Trivial prop shapes destructure inline; anything non-trivial gets a named `type Props` above the component.

## Pattern consistency

Before adding a new instance of something — widget, tool, route, form, error surface — find an existing one and match its structure. Registries stay registries; if `wrapGet`/`wrapPost` helpers exist, new routes use them. Deviating needs a reason you can state out loud.
