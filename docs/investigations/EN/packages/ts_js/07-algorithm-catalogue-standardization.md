---
title: "07 — Algorithm Catalogue Standardization"
description: "ADR and investigation record on the standardization and validation of the 10-family algorithm catalogue in the ts_js SDK."
---

# 07 — Algorithm Catalogue Standardization

## Context and Investigation

With the base architecture resolved (runtime-agnostic, traits, node/deno adapters), the team identified the need to offer a **uniform algorithmic catalogue** that could be consumed from any runtime without friction. Until that point, algorithm functions lived scattered across `barrits_lib/logic/` and loose modules, without a clear taxonomy or cross-validation.

Existing SDK functions were audited, revealing 53 exported functions from `src/barrits/logic/index.ts`, groupable into the following natural families:

| Family | Functions | Maturity |
|---------|-----------|---------|
| Search | `binarySearch`, `linearSearch`, `lowerBound`, `upperBound`, `findSortedRange` | Stable |
| Collection | `chunk`, `groupBy`, `indexBy`, `uniqueBy` | Stable |
| Sort | `orderBy`, `quickSort`, `stableSortBy`, `insertSorted` | Stable |
| Selection | `paginate`, `partitionBy`, `rankBy`, `topK` | Stable |
| Time Series | `averageBy`, `bucketByInterval`, `detectTimeSeriesGaps`, `differenceSeries`, `movingAverageSeries`, `resampleSeries` | Stable |
| Window | `movingAverage`, `rollingSum`, `slidingWindow`, `windowDelta` | Stable |
| Graph | `breadthFirstSearch`, `dijkstraShortestPath`, `topologicalSort` | Stable |
| Resilience | `retryWithBackoff`, `createCircuitBreaker`, `withTimeout` | Stable |
| Hashing | `sha256Hex`, `deterministicStringify` | Stable |
| Datetime | `toIsoString`, `toRelativeTime`, `toDateString` | Stable |

## Architectural Decisions (ADR)

1. **10-Family Taxonomy as Public Contract:**
   - **Decision:** 10 algorithm families were established as the official SDK classification. Each family has a dedicated folder within `src/barrits/logic/` and a barrel re-exporting its functions.
   - **Why:** Provides predictable navigation for human consumers and AI agents. The taxonomy reflects recognizable semantic domains (search, collections, sorting, time series, etc.).
   - **Implementation:** `src/barrits/logic/{algorithms,hashing,resilience,datetime,validation}/` with individual barrels and a root barrel at `src/barrits/logic/index.ts`.

2. **Validation through Real Examples instead of Isolated Unit Tests:**
   - **Decision:** Algorithm functions are validated through executable examples that demonstrate their use in real operational contexts, rather than traditional unit tests.
   - **Why:** An executable example simultaneously documents the API, expected behavior, and real use case. Reduces duplication between tests and documentation.
   - **Implementation:** `packages/sdk/ts_js/examples/example-nodejs/src/examples/` contains one file per family with annotated scenarios.

3. **Stubs for SDK-Unimplemented Functions:**
   - **Decision:** Functions in the taxonomy that lack real SDK implementation are declared as stubs in examples, with a minimal functional implementation and a `// @stub pending SDK export` comment.
   - **Why:** Allows examples to compile and run completely from day one, while maintaining visibility of the implementation gap.
   - **Implementation:** `example-bun` contains 3 stubs (hashing, resilience, datetime) to be replaced when the SDK exports those functions.

## Results and Next Steps

The catalogue standardization enabled:
- Reduced conceptual duplication across runtimes (node/deno/bun share the same taxonomy).
- Living documentation: executable examples serve as the source of truth for algorithmic behavior.
- Foundation for cross-validation: the same examples run on all supported runtimes.

The natural next step is migrating stubs to real SDK implementations and adding property-based testing for critical families (Sort, Time Series, Graph).

---

[← Conclusions and Design Limits](05-conclusions-and-limits.md) | [Index](00-index.md)
