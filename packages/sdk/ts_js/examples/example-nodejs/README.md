# example-nodejs — Monorepo Service Orchestration Reference

## Purpose

This example demonstrates how the Barrits SDK integrates within a Node.js
service operating as part of a larger monorepo. It covers the complete SDK
surface: traits, configuration, algorithm catalogue, build manifest
consumption, snapshot processing, IoC dependency injection, and OpenAPI
schema generation.

## Architecture

```
example-nodejs/
├── barrits/
│   ├── traits/
│   │   ├── index.ts              # Barrel re-exporting all 3 traits
│   │   ├── runtime-trait.ts      # Node.js runtime capability declaration
│   │   ├── user-service.ts       # CRUD service trait with state ownership
│   │   └── http-handler.ts       # HTTP handler tagged for OpenAPI discovery
│   ├── validation/index.ts       # Yup schema validation
│   └── logic/math/index.ts       # Arithmetic helpers
├── barrits.config.ts              # Root configuration with 3 trait contracts
├── src/
│   ├── main.ts                    # Primary service entrypoint
│   └── examples/                  # Algorithm family demonstrations (7 families)
├── scripts/
│   ├── showcase.mjs               # Functional walkthrough of all algorithm families
│   ├── build-runner.mjs           # Build manifest consumption from Node.js
│   ├── dev-runner.mjs             # Watch snapshot consumer (dev mode)
│   ├── snapshot-consumer.mjs      # Standalone snapshot processing
│   ├── barrits-validation.ts      # Yup input validation demo
│   ├── openapi-demo.ts            # OpenAPI v3.1 schema generation from traits
│   ├── ioc-demo.ts                # IoC container: register, wire, resolve
│   └── cli-workflow.ts            # Programmatic CLI pipeline: discover → manifest → summary
├── tests/
│   └── example.test.ts            # Automated validation suite (node:test)
└── package.json
```

## What This Example Demonstrates

### 1. Algorithm Catalogue Validation

The `src/examples/` directory contains executable demonstrations for each
algorithm family, exercising functions in realistic operational contexts
rather than isolated unit tests:

| Family | Functions |
|---|---|
| Search | `binarySearch`, `linearSearch`, `lowerBound`, `upperBound`, `findSortedRange` |
| Collection | `chunk`, `groupBy`, `indexBy`, `uniqueBy` |
| Sort | `orderBy`, `quickSort`, `stableSortBy`, `insertSorted` |
| Selection | `paginate`, `partitionBy`, `rankBy`, `topK` |
| Time Series | `averageBy`, `bucketByInterval`, `detectTimeSeriesGaps`, `differenceSeries`, `movingAverageSeries`, `resampleSeries` |
| Window | `movingAverage`, `rollingSum`, `slidingWindow`, `windowDelta` |
| Graph | `breadthFirstSearch`, `dijkstraShortestPath`, `topologicalSort` |

### 2. Trait Declaration and Composition

Three traits demonstrate the full contract system:
- **runtime-node** — Declares Node.js runtime capabilities
- **user-service** — CRUD service with `@barrits-provides user:crud` and state ownership
- **http-handler** — HTTP handler tagged with `http-endpoint` for OpenAPI discovery

Contracts are centralized in `barrits.config.ts`.

### 3. Build Manifest Consumption

The `scripts/build-runner.mjs` script demonstrates how a Node.js service
reads and validates the build manifest at startup, verifying the SHA-256
integrity checksum before proceeding with domain initialization.

### 4. OpenAPI Schema Generation

`scripts/openapi-demo.ts` imports `generateOpenApiSchema` to produce an
OpenAPI v3.1 schema from trait descriptors tagged with `http-endpoint`,
showing how Barrits enables REST API discovery from source-level
annotations.

### 5. IoC Dependency Injection

`scripts/ioc-demo.ts` uses `BarritsIoCContainer` to register, wire, and
resolve a three-service graph (Config → Logger → UserService),
demonstrating factory injection with inter-service dependencies.

### 6. CLI Pipeline

`scripts/cli-workflow.ts` demonstrates the programmatic API for the
full Barrits pipeline: discovery → graph filtering → manifest creation →
summary generation.

### 7. Watch Snapshot Processing

`scripts/dev-runner.mjs` consumes real-time watch snapshots, the pattern
used by development servers and hot-reload systems to respond to file
changes in the orchestration layer.

### 8. Validation

`scripts/barrits-validation.ts` demonstrates Yup-based input validation
using the barrits orchestration layer.

## Execution

```bash
npm run test                    # Run the automated test suite
npm run showcase                # Execute the full algorithm walkthrough
npm run demo:openapi            # Generate OpenAPI v3.1 schema
npm run demo:ioc                # Run IoC container demo
npm run demo:cli-workflow       # Run CLI pipeline demo
npm run demo:validation         # Execute Yup validation checks
npm run build                   # Build manifest consumption
npm run benchmark:algorithms    # Run performance benchmarks
```

## Reading Guide

- For functional algorithm demonstrations, the `src/examples/` directory
  contains one file per algorithm family with annotated usage scenarios.
- For operational integration patterns (traits, IoC, OpenAPI, manifests,
  snapshots, CLI pipeline), the `scripts/` directory provides executable
  demonstrations.
- For the complete API reference, consult the documentation at
  `docs/users/ES/packages/ts_js/09_referencia-de-api.md`.
