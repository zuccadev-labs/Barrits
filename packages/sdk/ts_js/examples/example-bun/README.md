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
