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
const byId = indexBy(items, (i) => i.id);
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
linearSearch(items, (i) => i.name === "target");
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
  { project: (i) => i.score, direction: "desc" },
  { project: (i) => i.name, direction: "asc" },
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

## Aggregated Catalogs

### `algorithms`

Exposes the full algorithm catalog for dynamic navigation or grouped exploration.

```ts
import { algorithms } from "@zuccadev-labs/barrits";
algorithms.sort.orderBy(items, criteria);
```

### `logic`

Namespaced grouping of algorithms, arithmetic, and functional families.

```ts
import { logic } from "@zuccadev-labs/barrits";
logic.orderBy(items, criteria);
logic.searchAlgorithms.binarySearch(sorted, target);
```

---

[← API Reference — Package Config](09a-api-reference-package-config.md) | [API Reference — Consume and Adapters →](09c-api-reference-consume-and-adapters.md)
