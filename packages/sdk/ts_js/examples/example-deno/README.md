# example-deno — Parse-Server Orchestration Reference

## Purpose

This example demonstrates how Barrits serves as the orchestration core
for a Deno-native service equivalent to a modern Parse-Server. It exercises
the complete SDK surface: contract discovery, trait composition, manifest
integrity verification, resilience patterns, and operational algorithms.

## Architecture

```
example-deno/
├── barrits/                 # Visible orchestration layer
│   └── index.ts             # Domain-scoped operational paths
├── barrits.config.ts        # Root configuration with discovery roots
├── deno.json                # Deno task definitions
├── main.ts                  # Primary orchestration entrypoint
└── scripts/
    └── inspect.ts           # Build manifest inspection utility
```

## What This Example Demonstrates

### 1. Contract Discovery with JSDoc

The `barrits.config.ts` file declares `discoveryRoots` and a `traitConflictStrategy`,
enabling the SDK to scan additional directories for JSDoc-annotated trait
contracts without requiring explicit factory invocations.

### 2. Manifest Integrity Verification

The example generates a build manifest with a SHA-256 checksum, then
verifies that checksum at service startup. This ensures that the automation
artifacts have not been modified between build time and deployment.

### 3. Resilience Patterns for Service Dependencies

The example demonstrates `retryWithBackoff` and `createCircuitBreaker`
to protect external API calls from transient failures, which is the
standard pattern for any Parse-Server style backend communicating with
databases and third-party services.

### 4. Operational Algorithms

Real-world usage of `topK`, `movingAverage`, `averageBy`, and time-series
functions for processing operational metrics — the type of computation
a Parse-Server performs when aggregating query statistics or monitoring
request throughput.

### 5. Validation at Service Boundaries

Input validation using `isEmail`, `isUuid`, and `assertNonNullish` at
API handler boundaries, demonstrating the zero-dependency validation
layer that replaces external packages like `zod` or `joi` for simple
format checks.

## Execution

```bash
deno task dev       # Execute the orchestration entrypoint
deno task inspect   # Inspect the build manifest
```

## API Functions Used

| Function | Module | Purpose |
|---|---|---|
| `defineBarritsPackage` | `barrits/config` | Declares the consumer runtime and watch policy |
| `sha256Hex` | `barrits_lib/logic/hashing` | Computes manifest integrity checksum |
| `deterministicStringify` | `barrits_lib/logic/hashing` | Produces reproducible JSON for checksumming |
| `retryWithBackoff` | `barrits_lib/logic/resilience` | Retries transient failures with exponential backoff |
| `createCircuitBreaker` | `barrits_lib/logic/resilience` | Protects external dependencies from cascading failure |
| `withTimeout` | `barrits_lib/logic/resilience` | Enforces SLA deadlines on async operations |
| `isEmail`, `isUuid` | `barrits_lib/logic/validation` | Validates input at service boundaries |
| `assertNonNullish` | `barrits_lib/logic/validation` | Typed assertion guard for required fields |
| `toIsoString`, `toRelativeTime` | `barrits_lib/logic/datetime` | Timestamp serialization and formatting |
| `topK`, `movingAverage`, `averageBy` | `barrits_lib/logic/algorithms` | Operational metric aggregation |
