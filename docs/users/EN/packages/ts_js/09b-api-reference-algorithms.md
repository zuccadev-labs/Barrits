---
title: "API Reference — Algorithms"
description: "Corporate documentation for API Reference — Algorithms."
---

# API Reference — Algorithms

This reference covers the built-in algorithm catalog available from `@zuccadev-labs/barrits`. These utilities are part of the `barrits_lib` base library, accessible both via the flat main import and through the `barrits.logic` namespace.

---

## Basic Arithmetic

### `sumar(left, right)`

Adds two numeric values with type guards.

```ts
import { sumar } from "@zuccadev-labs/barrits";
sumar(2, 3); // 5
```

Appears in: `examples/example-solid/src/main.tsx`, `examples/example-svelte/src/App.svelte`.

### `restar(left, right)`

Subtracts two numeric values.

```ts
import { restar } from "@zuccadev-labs/barrits";
restar(5, 2); // 3
```

### `arithmetic`

Namespaced grouping of basic arithmetic operations.

```ts
import { arithmetic } from "@zuccadev-labs/barrits";
arithmetic.sumar(2, 3);
```

---

## Collections

### `chunk(collection, size)`

Splits a collection into blocks of the specified size.

```ts
import { chunk } from "@zuccadev-labs/barrits";
chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
```

Appears in: `examples/example-nodejs/src/examples/collection/real-collection-cases.mjs`.

### `groupBy(collection, projector)`

Groups elements by a derived key.

```ts
import { groupBy } from "@zuccadev-labs/barrits";
groupBy(users, (u) => u.department);
```

### `indexBy(collection, projector)`

Indexes a collection by a unique key.

```ts
import { indexBy } from "@zuccadev-labs/barrits";
const byId = indexBy(items, (the developer) => the developer.id);
```

### `uniqueBy(collection, projector)`

Removes duplicates based on a derived key.

### `collectionAlgorithms`

Namespaced access to all collection utilities.

---

## Search

### `linearSearch(collection, predicate)`

Sequential search for unsorted or small collections.

```ts
import { linearSearch } from "@zuccadev-labs/barrits";
linearSearch(items, (the developer) => the developer.name === "target");
```

### `binarySearch(collection, target, compare?)`

O(log n) search on sorted collections.

```ts
import { binarySearch } from "@zuccadev-labs/barrits";
binarySearch(sortedItems, targetValue);
```

Appears in: `examples/example-nodejs/src/examples/search/real-search-cases.mjs`.

### `lowerBound(collection, target, compare?)`

Returns the first valid insertion position for a value in a sorted collection.

### `upperBound(collection, target, compare?)`

Returns the position after the last compatible match in a sorted collection.

### `findSortedRange(collection, target, compare?)`

Finds the full range of a value within a sorted collection.

### `searchAlgorithms`

Namespaced access to all search utilities.

---

## Sorting

### `orderBy(collection, criteria)`

Sorts a collection by one or more declarative criteria.

```ts
import { orderBy } from "@zuccadev-labs/barrits";
orderBy(items, [
  { project: (the developer) => the developer.score, direction: "desc" },
  { project: (the developer) => the developer.name, direction: "asc" },
]);
```

Appears in: `examples/example-react/src/main.jsx`, `examples/example-vue/src/App.vue`, `examples/example-nodejs/src/examples/sort/`, `examples/example-bun/src/main.ts`.

### `quickSort(collection, compare?)`

General-purpose high-performance sort.

### `stableSortBy(collection, projector, direction?)`

Stable sort preserving relative order of equal elements.

### `insertSorted(collection, value, compare?)`

Inserts a value into an already-sorted collection without resorting.

### `sortAlgorithms`

Namespaced access to all sort utilities.

---

## Selection and Aggregation

### `maxBy(collection, projector)`

Returns the item with the highest projected value.

### `minBy(collection, projector)`

Returns the item with the lowest projected value.

### `sumBy(collection, projector)`

Sums a numeric projection across the collection.

### `averageBy(collection, projector)`

Calculates the average of a numeric projection.

```ts
import { averageBy } from "@zuccadev-labs/barrits";
averageBy(metrics, (m) => m.latency);
```

Appears in: `examples/example-deno/main.ts`, `examples/example-bun/src/main.ts`.

### `histogramBy(collection, projector)`

Builds a histogram by a derived key or bucket.

### `paginate(collection, options)`

Paginates a collection with page, limit, and total context.

```ts
import { paginate } from "@zuccadev-labs/barrits";
paginate(items, { page: 1, limit: 10 });
```

Appears in: `examples/example-nodejs/src/examples/selection/real-selection-cases.mjs`.

### `partitionBy(collection, predicate)`

Splits a collection into two groups based on a predicate (true / false).

### `rankBy(collection, projector, direction?)`

Assigns a rank to each element based on a projection.

### `topK(collection, limit, compare?)`

Returns the top `k` elements without sorting the full collection.

```ts
import { topK } from "@zuccadev-labs/barrits";
topK(candidates, 5);
```

Appears in: `examples/example-deno/main.ts`, `examples/example-bun/src/main.ts`.

### `aggregateAlgorithms` and `selectionAlgorithms`

Namespaced access to all aggregation and selection utilities.

---

## Time Series and Finance

### `bucketByInterval(series, interval)`

Groups time-series points by a fixed interval.

### `detectTimeSeriesGaps(series, interval)`

Detects temporal gaps in a time series.

### `differenceSeries(series)`

Calculates the difference between consecutive points.

### `movingAverageSeries(series, windowSize)`

Calculates a moving average over a typed time series.

```ts
import { movingAverageSeries } from "@zuccadev-labs/barrits";
movingAverageSeries(priceSeries, 5);
```

Appears in: `examples/example-nodejs/src/examples/timeseries/`, `examples/example-react/src/main.jsx`, `examples/example-vue/src/App.vue`.

### `resampleSeries(series, interval)`

Resamples a series to a new interval.

### `sortTimeSeries(series)`

Sorts a series by timestamp.

### `returnsSeries(series)`

Calculates returns between points in a series.

### `maxDrawdown(series)`

Calculates the maximum drawdown from a peak in a numeric time series.

Appears in: `examples/example-react/src/main.jsx`, `examples/example-vue/src/App.vue`.

### `annualizedVolatility(series)`

Calculates annualized volatility from a returns-compatible series.

### `exponentialMovingAverage(series, alpha)`

Calculates an exponential moving average with a configurable alpha factor.

### `timeSeriesAlgorithms`

Namespaced access to all time series and finance utilities.

---

## Windows

### `movingAverage(values, windowSize)`

Calculates a moving average over a simple numeric sequence.

```ts
import { movingAverage } from "@zuccadev-labs/barrits";
movingAverage([10, 20, 30, 40], 2); // [15, 25, 35]
```

Appears in: `examples/example-deno/main.ts`, `examples/example-bun/src/main.ts`.

### `rollingSum(values, windowSize)`

Calculates the rolling sum over a numeric sequence.

### `slidingWindow(values, windowSize)`

Exposes each consecutive window of a sequence for custom transformation.

### `windowDelta(values, windowSize)`

Calculates the delta between values within a window.

### `windowAlgorithms`

Namespaced access to all window utilities.

---

## Graphs

### `buildAdjacencyList(edges)`

Creates an adjacency list from a set of edges.

### `breadthFirstSearch(graph, start)`

Traverses a graph level by level (BFS).

### `depthFirstSearch(graph, start)`

Traverses a graph depth-first (DFS).

### `detectDirectedCycle(graph)`

Detects directed cycles in a graph. Useful for validating DAGs and dependency pipelines.

### `dijkstraShortestPath(graph, from, to)`

Calculates the shortest path between two nodes.

### `maxFlow(graph, source, sink)`

Calculates the maximum flow through a capacity network.

### `minimumSpanningTree(graph)`

Calculates the minimum spanning tree of a weighted graph.

### `topologicalSort(graph)`

Topologically sorts a DAG. Useful for dependency ordering and build stage sequencing.

Appears in: `examples/example-nodejs/src/examples/graph/real-graph-cases.mjs`.

### `graphAlgorithms`

Namespaced access to all graph utilities.

---

## Resilience Patterns

Enterprise fault-tolerance patterns for distributed systems. These utilities handle transient failures from network partitions, rate limiting, and dependency outages.

### `retryWithBackoff(operation, options?)`

Executes an async operation with exponential backoff retry logic and jitter.

```ts
import { retryWithBackoff } from "@zuccadev-labs/barrits";

const data = await retryWithBackoff(
  () => fetch("https://api.example.com/data").then(r => r.json()),
  { maxRetries: 5, initialDelayMs: 500, isRetryable: (err) => err instanceof TypeError },
);
```

Options include `maxRetries` (default 3), `initialDelayMs` (default 200), `backoffFactor` (default 2), `maxDelayMs` (default 30000), and `isRetryable` predicate. A jitter factor prevents thundering-herd effects in multi-instance deployments.

### `withTimeout(operation, timeoutMs, label?)`

Wraps a promise with a timeout deadline for SLA enforcement.

```ts
import { withTimeout } from "@zuccadev-labs/barrits";

const result = await withTimeout(
  fetch("https://slow-api.example.com/data"),
  5000,
  "slow-api fetch",
);
```

Rejects with a descriptive `TimeoutError` if the operation does not complete within the specified milliseconds.

### `createCircuitBreaker(options?)`

Creates a three-state circuit breaker (closed → open → half-open → closed) for dependency protection.

```ts
import { createCircuitBreaker } from "@zuccadev-labs/barrits";

const breaker = createCircuitBreaker({ failureThreshold: 3, resetTimeoutMs: 10000 });

const data = await breaker.call(() => fetch("/api/data").then(r => r.json()));
breaker.getState(); // "closed", "open", or "half-open"
breaker.reset();    // manually reset to closed
```

The circuit opens after `failureThreshold` consecutive failures, rejects immediately while open, and tests recovery after `resetTimeoutMs` in half-open state with `successThreshold` (default 1) successful calls before closing.

### `resilienceAlgorithms`

Namespaced access to all resilience utilities.

```ts
import { resilienceAlgorithms } from "@zuccadev-labs/barrits";
resilienceAlgorithms.retryWithBackoff(op);
```

---

## Hashing and Integrity

Cryptographic and non-cryptographic hash functions for build manifest sealing, content-addressable caching, and distributed partition assignment.

### `sha256Hex(input)`

Computes the SHA-256 hash of a UTF-8 string and returns a 64-character lowercase hexadecimal digest. Uses the Web Crypto API — no external dependencies. Available in Deno, Node.js 18+, Bun, and browsers.

```ts
import { sha256Hex } from "@zuccadev-labs/barrits";

const checksum = await sha256Hex(JSON.stringify({ version: "0.2.0" }));
// "a3f2...d8e1" (64 hex chars)
```

### `murmurHash3(input, seed?)`

Computes a non-cryptographic 32-bit MurmurHash3 digest. Approximately 10x faster than SHA-256. Ideal for hash-based partitioning, consistent hashing rings, and Bloom filters.

```ts
import { murmurHash3 } from "@zuccadev-labs/barrits";

const partition = murmurHash3("user:12345", 0) % 16;
// Deterministically assigns user to partition [0-15]
```

Takes an optional 32-bit unsigned integer `seed` (defaults to 0). Returns a 32-bit unsigned integer.

### `deterministicStringify(value, indent?)`

Produces a deterministic JSON string with lexicographic key sorting. Unlike `JSON.stringify`, structurally identical objects always produce identical output regardless of insertion order.

```ts
import { deterministicStringify } from "@zuccadev-labs/barrits";

const a = { z: 1, a: 2, m: { b: 3, a: 4 } };
const b = { a: 2, m: { a: 4, b: 3 }, z: 1 };

deterministicStringify(a) === deterministicStringify(b); // true
```

Essential for reproducible checksums and content-addressable caching across distributed build systems.

### `hashingAlgorithms`

Namespaced access to all hashing utilities.

```ts
import { hashingAlgorithms } from "@zuccadev-labs/barrits";
hashingAlgorithms.sha256Hex(data);
```

---

## Datetime Utilities

Immutable, timezone-aware date and time manipulation functions. All operations produce new objects rather than mutating inputs, following referential transparency.

### `toIsoString(input)`

Normalizes Date objects, numeric timestamps (Unix ms), or ISO 8601 strings to a standardized UTC ISO 8601 string.

```ts
import { toIsoString } from "@zuccadev-labs/barrits";

toIsoString(new Date("2026-04-21T14:30:00Z"));
// "2026-04-21T14:30:00.000Z"

toIsoString(1776960600000);
// Equivalent ISO string for that timestamp
```

Throws `RangeError` for invalid date inputs.

### `fromIsoString(input)`

Safely parses an ISO 8601 string into a `Date` object. Returns `null` instead of creating an `Invalid Date`, preventing invalid date propagation through service layers.

```ts
import { fromIsoString } from "@zuccadev-labs/barrits";

const date = fromIsoString("2026-04-21T14:30:00.000Z");
// Date object, or null if parsing fails
```

### `diffMs(start, end)`

Computes the millisecond difference between two dates (`end - start`).

```ts
import { diffMs } from "@zuccadev-labs/barrits";

const start = new Date("2026-04-21T00:00:00Z");
const end = new Date("2026-04-22T00:00:00Z");
diffMs(start, end); // 86400000 (24 hours)
```

### `addMs(date, milliseconds)`

Returns a new `Date` offset by the specified milliseconds. Negative values subtract. The original date is never mutated.

```ts
import { addMs } from "@zuccadev-labs/barrits";

const later = addMs(new Date("2026-04-21T14:30:00Z"), 3600000);
// "2026-04-21T15:30:00.000Z"
```

### `toRelativeTime(date, locale?)`

Formats a Date as a human-readable relative time string (e.g., "2 hours ago", "in 3 days"). Uses `Intl.RelativeTimeFormat` for locale-aware formatting. Defaults to `"en"`.

```ts
import { toRelativeTime } from "@zuccadev-labs/barrits";

const twoHoursAgo = new Date(Date.now() - 7200000);
toRelativeTime(twoHoursAgo);       // "2 hours ago"
toRelativeTime(twoHoursAgo, "es"); // "hace 2 horas"
```

### `datetimeAlgorithms`

Namespaced access to all datetime utilities.

```ts
import { datetimeAlgorithms } from "@zuccadev-labs/barrits";
datetimeAlgorithms.toIsoString(date);
```

---

## Aggregated Catalogs

### `algorithms`

Exposes the full algorithm catalog (including resilience, hashing, and datetime) for dynamic navigation or grouped exploration.

```ts
import { algorithms } from "@zuccadev-labs/barrits";
algorithms.sort.orderBy(items, criteria);
```

### `logic`

Namespaced grouping of algorithms, arithmetic, resilience, hashing, datetime, and functional families.

```ts
import { logic } from "@zuccadev-labs/barrits";
logic.orderBy(items, criteria);
logic.searchAlgorithms.binarySearch(sorted, target);
logic.retryWithBackoff(op);         // resilience
logic.sha256Hex(manifest);          // hashing
logic.toIsoString(new Date());      // datetime
```

---

[← API Reference — Package Config](09a-api-reference-package-config.md) | [API Reference — Consume and Adapters →](09c-api-reference-consume-and-adapters.md)
