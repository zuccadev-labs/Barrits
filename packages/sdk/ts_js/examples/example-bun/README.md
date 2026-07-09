# example-bun — Bun Runtime Validation

## Purpose

This example validates the full Barrits SDK surface on the **Bun** runtime. It exercises all major SDK subsystems — traits, configuration, package manifest, OpenAPI schema generation, IoC container, CLI pipeline, algorithmic catalogue (10 families), Zod validation, build-runner, watch-snapshot consumers, and resilience/hashing/datetime stubs — confirming correct operation outside Node.js and Deno ecosystems.

## SDK Surfaces Covered

| Surface | Script / Module | Status |
|---|---|---|
| **Traits** (`createTraitDescriptor`, discovery) | `barrits/traits/` | ✅ 4 tests |
| **Config** (`defineBarritsConfig`, `runtime: "bun"`) | `barrits.config.ts` | ✅ |
| **Package manifest** (`defineBarritsPackage`) | `src/main.ts` | ✅ |
| **OpenAPI schema** (`generateOpenApiSchema`) | `scripts/openapi-demo.ts` | ✅ |
| **IoC container** (`BarritsIoCContainer`) | `scripts/ioc-demo.ts` | ✅ |
| **CLI pipeline** (`parseBuildManifest`, `createBuildManifestSummary`) | `scripts/cli-workflow.ts` | ✅ |
| **Build runner** (`readBunBuildManifestSummary`) | `scripts/build-runner.mjs` | ✅ |
| **Dev/watch snapshots** (`readBunLanguageToolSnapshot`) | `scripts/dev-runner.mjs`, `scripts/snapshot-consumer.mjs` | ✅ |
| **Zod validation** (`parseBunUser`) | `scripts/barrits-validation.ts` | ✅ |
| **Algorithm catalogue** (aggregate, collection, graph, search, selection, sort, timeseries, window, resilience↗, hashing↗, datetime↗) | `scripts/showcase.mjs` / `src/examples/` | ✅ 7 families live, 3 stubs |
| **Resilience / Hashing / Datetime** (stubs) | `src/examples/{resilience,hashing,datetime}/` | ⏳ SDK export pending |

## Algorithm Families

| Family | Source | Real data |
|---|---|---|
| Aggregate | `timeseries/real-timeseries-cases.mjs` | ✅ `averageBy`, `bucketByInterval` |
| Collection | `collection/real-collection-cases.mjs` | ✅ `uniqueBy`, `groupBy`, `indexBy`, `chunk` |
| Graph | `graph/real-graph-cases.mjs` | ✅ `breadthFirstSearch`, `topologicalSort`, `dijkstraShortestPath` |
| Search | `search/real-search-cases.mjs` | ✅ `linearSearch`, `binarySearch`, `lowerBound`, `upperBound`, `findSortedRange` |
| Selection | `selection/real-selection-cases.mjs` | ✅ `rankBy`, `topK`, `paginate`, `partitionBy` |
| Sort | `sort/real-sort-cases.mjs` | ✅ `quickSort`, `stableSortBy`, `orderBy`, `insertSorted` |
| Timeseries | `timeseries/real-timeseries-cases.mjs` | ✅ `detectTimeSeriesGaps`, `differenceSeries`, `movingAverageSeries`, `resampleSeries` |
| Window | `window/real-window-cases.mjs` | ✅ `slidingWindow`, `rollingSum`, `windowDelta` |
| Resilience | `resilience/real-resilience-cases.mjs` | ⏳ stub — `retryWithBackoff`, `createCircuitBreaker` not yet in SDK barrel |
| Hashing | `hashing/real-hashing-cases.mjs` | ⏳ stub — `sha256Hex`, `deterministicStringify`, `murmurHash3` not yet in SDK barrel |
| Datetime | `datetime/real-datetime-cases.mjs` | ⏳ stub — `toIsoString`, `toRelativeTime` not yet in SDK barrel |

## Execution

```bash
bun run dev              # Execute the main entrypoint (full showcase)
bun run showcase         # Same as dev
bun test                 # Run 14 tests (traits, scripts, showcase)
bun run build            # Build via the Barrits Bun CLI adapter
bun run inspect          # Inspect the project manifest
```

## Tests

14 tests covering:
- 4 trait import / barrel tests
- 1 OpenAPI schema generation test
- 1 IoC container registration / resolution test
- 1 CLI manifest parsing test
- 1 Build runner flow test
- 1 Zod validation test
- 4 Showcase tests (resilience, hashing, datetime, full 10-family)
- 1 Main entrypoint execution test

Run: `bun test`

## Architecture

```
example-bun/
├── barrits/
│   ├── index.ts              # Consumer barrel (buildPath, parsePath, traits, validation)
│   ├── config.ts             # (created by Barrits CLI)
│   ├── traits/
│   │   ├── runtime-trait.ts  # Provides runtime:bun
│   │   ├── queue-service.ts  # Provides queue:crud
│   │   ├── http-handler.ts   # Provides http:request
│   │   └── index.ts          # Trait barrel
│   └── validation/
│       └── index.ts          # Zod schema (parseBunUser)
├── scripts/
│   ├── openapi-demo.ts       # OpenAPI 3.1 schema generation
│   ├── ioc-demo.ts           # IoC container demo
│   ├── cli-workflow.ts       # CLI manifest parsing
│   ├── build-runner.mjs      # Build via Bun CLI adapter
│   ├── dev-runner.mjs        # Watch snapshot consumer
│   ├── snapshot-consumer.mjs # Standalone snapshot reader
│   ├── barrits-validation.ts # Zod validation demo
│   └── showcase.mjs          # Full algorithm showcase runner
├── src/
│   ├── main.ts               # Entrypoint
│   └── examples/             # 10-family algorithm catalogue
├── tests/
│   └── example.test.ts       # 14 automated tests
├── barrits.config.ts         # Runtime: "bun", 3 trait contracts
└── package.json
```

## Reference

For the complete API specification, consult `docs/users/ES/packages/ts_js/09_referencia-de-api.md`.
