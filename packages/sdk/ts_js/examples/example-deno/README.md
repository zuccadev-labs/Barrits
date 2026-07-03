# example-deno — Parse-Server Orchestration Reference

## Purpose

This example demonstrates how Barrits serves as the orchestration core
for a Deno-native service. It exercises the complete SDK surface:
contract discovery, trait composition, manifest integrity verification,
resilience patterns, operational algorithms, OpenAPI schema generation,
and dependency injection.

## Architecture

```
example-deno/
├── barrits/                 # Visible orchestration layer
│   ├── traits/              # Trait descriptors (runtime, domain, http)
│   └── index.ts             # Domain-scoped operational paths
├── barrits.config.ts        # Root configuration with discovery roots
├── deno.json                # Deno task definitions
├── main.ts                  # Primary orchestration entrypoint
├── scripts/
│   ├── build-consumer.ts    # Build manifest consumer
│   ├── openapi-demo.ts      # OpenAPI v3.1 schema generation
│   └── ioc-demo.ts          # Dependency injection demo
└── tests/
    └── example.test.ts      # Automated test suite (8 tests)
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
standard pattern for any Deno-native backend communicating with
databases and third-party services.

### 4. Operational Algorithms

Real-world usage of `topK`, `movingAverage`, `averageBy`, and time-series
functions for processing operational metrics.

### 5. Validation at Service Boundaries

Input validation using `isEmail`, `isUuid`, and `assertNonNullish` at
API handler boundaries, demonstrating the zero-dependency validation
layer that replaces external packages for simple format checks.

### 6. Trait Composition

Three traits are defined under `barrits/traits/`:

- **`runtime-trait`** — Declares the Deno runtime identity (`runtime:deno`)
- **`parse-service`** — Parse-Server style CRUD operations (`parse:crud`)
- **`http-handler`** — HTTP request handler (`http:request`) tagged for OpenAPI

### 7. OpenAPI Schema Generation

The `scripts/openapi-demo.ts` script reads the trait descriptors from a
build manifest and generates an OpenAPI v3.1 schema. Traits tagged with
`http-endpoint` are mapped to API paths.

### 8. Dependency Injection

The `scripts/ioc-demo.ts` script demonstrates the `BarritsIoCContainer` —
a lightweight DI container that registers services, wires dependencies,
and resolves them on demand.

### 9. Automated Tests

Tests are in `tests/example.test.ts` and use the native `Deno.test` runner:

- Trait loading and barrel re-exports
- Parse-service CRUD operations
- OpenAPI schema generation
- IoC container registration and resolution
- Main showcase execution integrity

## Execution

```bash
deno task dev           # Execute the orchestration entrypoint
deno task test          # Run the automated test suite
deno task build         # Build and inspect the contract graph
deno task inspect       # Inspect the build manifest
deno task demo:openapi  # Generate OpenAPI schema from trait descriptors
deno task demo:ioc      # Run the dependency injection demo
```

## API Functions Used

| Function | Module | Purpose |
|---|---|---|
| `defineBarritsPackage` | `barrits/config` | Declares the consumer runtime and watch policy |
| `createTraitDescriptor` | `barrits/adapters/deno` | Creates trait descriptors |
| `sha256Hex` | `barrits_lib/logic/hashing` | Computes manifest integrity checksum |
| `deterministicStringify` | `barrits_lib/logic/hashing` | Produces reproducible JSON for checksumming |
| `retryWithBackoff` | `barrits_lib/logic/resilience` | Retries transient failures with exponential backoff |
| `createCircuitBreaker` | `barrits_lib/logic/resilience` | Protects external dependencies from cascading failure |
| `withTimeout` | `barrits_lib/logic/resilience` | Enforces SLA deadlines on async operations |
| `isEmail`, `isUuid` | `barrits_lib/logic/validation` | Validates input at service boundaries |
| `assertNonNullish` | `barrits_lib/logic/validation` | Typed assertion guard for required fields |
| `toIsoString`, `toRelativeTime` | `barrits_lib/logic/datetime` | Timestamp serialization and formatting |
| `topK`, `movingAverage`, `averageBy` | `barrits_lib/logic/algorithms` | Operational metric aggregation |
| `generateOpenApiSchema` | `barrits/schema/openapi` | Generates OpenAPI v3.1 schema from traits |
| `BarritsIoCContainer` | `barrits/ioc` | Lightweight dependency injection container |
