# example-nodejs — Monorepo Service Orchestration Reference

## Purpose

This example demonstrates how the Barrits SDK integrates within a Node.js
service operating as part of a larger monorepo. It validates the package-first
contract, exercises the complete algorithm catalogue, and demonstrates
manifest consumption and snapshot processing from the Node.js runtime.

## Architecture

```
example-nodejs/
├── barrits/                   # Visible orchestration layer
│   └── traits/index.ts        # Declarative trait for Node.js runtime
├── barrits.config.ts           # Root configuration with contracts
├── src/
│   ├── main.ts                 # Primary service entrypoint
│   └── examples/               # Algorithm family demonstrations
├── scripts/
│   ├── showcase.mjs            # Functional walkthrough of all algorithm families
│   ├── build-runner.mjs        # Build manifest consumption from Node.js
│   └── snapshot-consumer.mjs   # Watch snapshot processing
└── package.json                # NPM scripts and dependency declaration
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

### 2. Build Manifest Consumption

The `scripts/build-runner.mjs` script demonstrates how a Node.js service
reads and validates the build manifest at startup, verifying the SHA-256
integrity checksum before proceeding with domain initialization.

### 3. Trait Declaration and Inspection

The `barrits/traits/index.ts` file declares a Node.js runtime trait using
the `createTraitDescriptor` factory with JSDoc annotations, enabling the
SDK to discover and validate the trait composition at build time.

### 4. Watch Snapshot Processing

The `scripts/snapshot-consumer.mjs` script demonstrates real-time consumption
of watch snapshots, which is the pattern used by development servers and
hot-reload systems to respond to file changes in the orchestration layer.

## Execution

```bash
npm run dev                    # Start the service entrypoint
npm run showcase               # Execute the full algorithm walkthrough
npm run benchmark:algorithms   # Run performance benchmarks
npm run demo:validation        # Execute operational validation checks
```

## Reading Guide

- For functional algorithm demonstrations, the `src/examples/` directory
  contains one file per algorithm family with annotated usage scenarios.
- For operational integration patterns (manifests, snapshots, runtime
  inspection), the `scripts/` directory provides executable examples.
- For the complete API reference, consult the documentation at
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
