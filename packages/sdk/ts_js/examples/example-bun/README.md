# example-bun — Bun Runtime Validation

## Purpose

This example validates the Barrits SDK package-first contract on the Bun
runtime, confirming that all functional utilities and operational analytics
operate correctly outside the Node.js and Deno ecosystems.

## Key Files

| File | Description |
|---|---|
| `src/main.ts` | Primary execution entrypoint |
| `barrits/index.ts` | Consumer-visible orchestration layer with `buildPath` and `parsePath` |
| `package.json` | Script definitions for `dev`, `build`, `inspect`, and `showcase` |

## API Functions Demonstrated

| Function | Purpose |
|---|---|
| `defineBarritsPackage` | Declares the consumer runtime identity |
| `orderBy` | Sorts domain records by score |
| `movingAverage` | Computes a moving average over throughput data |
| `averageBy` | Computes the arithmetic mean of a series |
| `topK` | Selects the highest-throughput values |
| `buildPath` / `parsePath` | Constructs and inspects operational paths |

## Execution

```bash
bun run dev        # Execute the base orchestration flow
bun run showcase   # Run the demonstration walkthrough
bun run build      # Build via the Barrits CLI
bun run inspect    # Inspect the project manifest
```

## Reference

For the complete API specification, consult
`docs/users/ES/packages/ts_js/09_referencia-de-api.md`.
## How it works

Barrits discovers traits automatically by scanning the consumer project for exported functions and JSDoc annotations. The flow is:

1. **Trait Discovery**: Barrits walks the source tree (by default src/) and collects all exported functions, classes, and constants that are marked with @barrits-trait JSDoc tags or reside in a 	raits/ folder.

2. **Dependency Graph**: For each discovered trait, Barrits analyzes its provides, consumes, and state fields to build a directed graph.

3. **Validation**: The graph is checked for missing capabilities, circular dependencies, and conflicting state ownership.

4. **Composition**: Traits are composed in dependency order, producing a final set of capabilities that are made available to the runtime adapters.

5. **Dependency Injection**: When the application starts, Barrits creates a lightweight DI container that injects the required consumes into each trait's initializer, ensuring that each trait receives only the dependencies it declared.

6. **Immutability & Safety**: All provided capabilities are frozen (Object.freeze) to prevent accidental mutation, and state is encapsulated within each trait's closure.

This automatic discovery reduces boilerplate and guarantees that the runtime contract matches the source-of-truth definitions.
