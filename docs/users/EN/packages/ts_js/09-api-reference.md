---
title: "API Reference — Complete Surface"
description: "Comprehensive API reference for the @zuccadev-labs/barrits SDK covering all exported functions, types, and subpaths."
---

# API Reference — Complete Surface

> **This document serves as the consolidated historical reference.**
> The active reference is divided into four specialized documents:
>
> - [09a — Configuration, Traits and Manifests](09a-api-reference-package-config.md)
> - [09b — Algorithms](09b-api-reference-algorithms.md)
> - [09c — Consume and Adapters](09c-api-reference-consume-and-adapters.md)
> - [09d — Traits and Composition](09d-api-reference-traits-and-composition.md)

---

This file serves as the centralized backup reference for the public surface of `@zuccadev-labs/barrits`. The goal is to answer four questions for each method or family: what it does, what it is for, how to use it, and where it appears in real repository walkthroughs.

## How to Read This Reference

- For a quick start, read `packages/sdk/ts_js/README.md` first
- To locate the example of interest, enter `examples/00_indice.md`, which documents the canonical `packages/sdk/ts_js/examples/` folder, then the local README for each demo
- For exact detail of a function, consult documents 09a, 09b, 09c and 09d

## Main Entry Point `@zuccadev-labs/barrits`

### Package-First Configuration

- `defineBarritsPackage(options)`
  What it does: normalizes the consumer description.
  Purpose: unifies runtime, watch, autoManifest, projectRoot and automationDirectory before touching plugins or tooling.
  Usage: called in `vite.config.ts`, `webpack.config.mjs`, `rollup.config.mjs`, `esbuild.config.mjs` or equivalent scripts.
  Where used: `examples/example-react/vite.config.ts`, `examples/example-vue/vite.config.ts`, `examples/example-solid/vite.config.ts`, `examples/example-svelte/vite.config.ts`, `examples/bundlers/*` and `examples/example-bun/src/main.ts`.

- `toBarritsAutomationOptions(options)`
  What it does: adapts the package definition to the operational options expected by the plugins.
  Purpose: prevents the bundler from knowing configuration details it does not need.
  Usage: the result of `defineBarritsPackage()` or the same input object is passed.
  Where used: `examples/example-react/vite.config.ts` and each configuration in `examples/bundlers/`.

- `defineBarritsConfig(options)`
  What it does: creates a valid configuration for `barrits.config.*`.
  Purpose: declares persistent project defaults instead of repeating them in each file.
  Usage: exported as default from the configuration file.
  Where used: explained in `05-automation-and-configuration.md`.

- `loadBarritsConfig()`
  What it does: loads the project configuration from disk.
  Purpose: tooling, CLI or automations can resolve the configuration without duplicating the reading logic.
  Usage: invoked from internal processes or tools that need introspection.
  Where used: part of the flow documented in `06-commands-and-runtimes.md`.

- `findBarritsConfigFile()`
  What it does: locates the project configuration file.
  Purpose: controlled discovery of `barrits.config.*`.
  Usage: called before loading or resolving configuration when it is necessary to determine whether the file exists.
  Where used: useful in tooling and diagnostics; explained in `05-automation-and-configuration.md`.

- `resolveBarritsConfig()`
  What it does: resolves the effective project configuration.
  Purpose: applies defaults and returns an object ready to operate.
  Usage: used when the final configuration is required, not just the source file.
  Where used: in automation and CLI flows.

- `createBarrits(options?)`
  What it does: starts the application by dynamically building the SDK context based on the configuration file.
  Purpose: allows renaming the system root (dynamic namespace) by injecting predefined domains (`logic`, `traits`) into the local object without breaking the IDE or Typings Tooling.
  Usage: invoked asynchronously at the consumer application boot and returns a typed instance with a custom `namespace`.
  Where used: in main scripts of `examples/example-nodejs` as a corporate replacement for global variables.

### Paths, Names and Domains

- `buildPath(...parts)`
  What it does: composes an operational path from safe parts.
  Purpose: build consistent paths for artifacts, exports or derived routes.
  Usage: a sequence of segments is passed and the normalized path is returned.
  Where used: the Deno example builds a local variant in `examples/example-deno/barrits/` and Bun uses the API directly in `examples/example-bun/barrits/index.ts`.

- `parsePath(path)`
  What it does: separates a public path into its parts.
  Purpose: inspection, validation or transformation of package-first paths.
  Usage: called when it is necessary to recover domains or segments from a known path.
  Where used: diagnostics, tooling or internal consumer validations; Bun uses it in `examples/example-bun/barrits/index.ts`.

- `PACKAGE_NAME`
  What it does: exposes the canonical package name.
  Purpose: logs, banners, tooling and consistent messages.
  Usage: imported as a constant.
  Where used: integrations or CLIs that prefer not to hardcode the name.

- `PACKAGE_ALIAS`
  What it does: exposes the short package alias.
  Purpose: automation, short branding and abbreviated commands.
  Usage: imported as a constant.
  Where used: scripts or internal tooling that need a brief representation.

- `barrits` and `brt`
  What it does: groups the API by domains (`logic`, `routes`, `traits` and others).
  Purpose: namespaced access when navigating by families instead of flat imports is preferred.
  Usage:
    - Domain access: `barrits.logic.orderBy(...)`, `barrits.routes.buildPath(...)`
    - Submodule access: `barrits.logic.searchAlgorithms.binarySearch(...)`
    - Specific function access: `barrits.traits.composePipeline(...)`
    - Short access: `brt.logic.orderBy(...)` (alias for barrits)
  Where used: advanced consumption, exploratory shells and when avoiding multiple imports is desired.

### Summarized Manifest and Snapshot Consumption

- `parseBuildManifest(value)`
  What it does: parses a build manifest.
  Purpose: validate or convert the raw artifact before consuming it.
  Usage: receives text or serialized structure and returns the typed manifest.
  Where used: consumption pipelines and tooling.

- `parseWatchSnapshot(value)`
  What it does: parses a watch snapshot.
  Purpose: transform the serialized output into a usable structure.
  Usage: applied over the snapshot payload before summarizing or displaying it.
  Where used: tooling consumption and observability flows.

- `createBuildManifestSummary(manifest)`
  What it does: generates a summary of the build manifest.
  Purpose: UIs, dashboards or plugins do not need to load the complete structure.
  Usage: receives a manifest already available in memory or injected by a plugin.
  Where used: `examples/example-react/src/main.jsx`, `examples/example-vue/src/App.vue`, `examples/example-solid/src/main.tsx`, `examples/example-svelte/src/App.svelte` and `examples/bundlers/*-manifest-entry.mjs`.

- `createWatchSnapshotSummary(snapshot)`
  What it does: summarizes a watch snapshot.
  Purpose: observability, panels or quick diagnostics.
  Usage: receives the already parsed snapshot.
  Where used: consumption walkthroughs and tooling.

- `createLanguageToolSnapshot(input)`
  What it does: builds a snapshot oriented to language tooling.
  Purpose: compatibility with inspection and assisted editing flows.
  Usage: called when a stable view of the domain state is needed.
  Where used: tooling and artifact consumption.

### Traits and Declarative Composition

- `composePipeline(initialValue, ...steps)`
  What it does: composes a pipeline of transformations.
  Purpose: declare chained processing flows clearly.
  Usage: receives an initial value and then a sequence of steps; each step receives the result of the previous one.
  Where used: `08-traits-and-composition.md`.

- `composeTraitDescriptors(input)`
  What it does: composes trait descriptors into a final structure.
  Purpose: consolidate metadata and declarative conflicts.
  Usage: receives a set of descriptors and composition rules.
  Where used: trait documentation and advanced package-first scenarios.

- `createTraitDescriptor(input)`
  What it does: creates a trait descriptor from explicit metadata.
  Purpose: formalize reusable traits.
  Usage: the name, metadata and expected behavior are defined.
  Where used: `08-traits-and-composition.md`.

- `createTraitDescriptorFromJsDoc(jsDoc, descriptor)`
  What it does: creates a descriptor from JSDoc.
  Purpose: derive metadata from existing comments.
  Usage: the JSDoc block and a descriptor with the `create` function and optional overrides are passed.
  Where used: introspection and automated documentation pipelines.

- `parseTraitDescriptorJsDoc(value)`
  What it does: parses trait JSDoc.
  Purpose: convert comments into structured metadata.
  Usage: applied before `createTraitDescriptorFromJsDoc()`.
  Where used: tooling and declarative contracts.

Recognized declarative tags for this flow:

- `@barrits-trait`
- `@barrits-summary`
- `@barrits-requires`
- `@barrits-conflicts`
- `@barrits-state`
- `@barrits-consumes`
- `@barrits-provides`
- `@barrits-tags`
- `@barrits-runtime`
- `@barrits-version`
- `@barrits-stability`

- `mergeTraits(...traits)`
  What it does: merges traits.
  Purpose: consolidate behavior and metadata into a single result.
  Usage: used when the consumer needs controlled inheritance or mixing.
  Where used: `08-traits-and-composition.md`.

## Algorithms and Functional Utilities

### Basic Arithmetic

- `sumar(a, b)`
  What it does: adds numeric values with the package guards.
  Purpose: simple demos, pipelines and basic utilities.
  Usage: `sumar(2, 3)`.
  Where used: `examples/example-solid/src/main.tsx` and `examples/example-svelte/src/App.svelte`.

- `restar(a, b)`
  What it does: subtracts numeric values.
  Purpose: simple operations within the same functional catalog.
  Usage: `restar(5, 2)`.
  Where used: available for scripts and demos.

- `arithmetic`
  What it does: groups the basic arithmetic operations.
  Purpose: namespaced consumption.
  Usage: `arithmetic.sumar(...)`.
  Where used: shells or interactive exploration.

### Collections

- `chunk(collection, size)`
  What it does: divides a collection into blocks.
  Purpose: batch processing or manual pagination.
  Usage: the array and the size of each block are passed.
  Where used: `examples/example-nodejs/src/examples/collection/real-collection-cases.mjs`.

- `groupBy(collection, projector)`
  What it does: groups elements by a derived key.
  Purpose: prior aggregation, reports or grouped views.
  Usage: the projector returns the grouping key.
  Where used: `examples/example-nodejs/src/examples/collection/real-collection-cases.mjs`.

- `indexBy(collection, projector)`
  What it does: indexes a collection by a unique key.
  Purpose: fast access by id or code.
  Usage: the projector returns the index key.
  Where used: `examples/example-nodejs/src/examples/collection/real-collection-cases.mjs`.

- `uniqueBy(collection, projector)`
  What it does: removes duplicates based on a derived key.
  Purpose: prior data normalization.
  Usage: the projector identifies when two items represent the same entity.
  Where used: `examples/example-nodejs/src/examples/collection/real-collection-cases.mjs`.

- `collectionAlgorithms`
  What it does: groups the collection catalog.
  Purpose: namespaced consumption.
  Usage: `collectionAlgorithms.groupBy(...)`.
  Where used: exploration and tooling.

### Search

- `linearSearch(collection, predicate)`
  What it does: traverses sequentially until a match is found.
  Purpose: short lists or those without guaranteed order.
  Usage: the predicate decides the match.
  Where used: `examples/example-nodejs/src/examples/search/real-search-cases.mjs`.

- `binarySearch(collection, target, compare?)`
  What it does: searches over sorted collections.
  Purpose: fast access with logarithmic cost.
  Usage: the collection must be sorted according to the comparator.
  Where used: `examples/example-nodejs/src/examples/search/real-search-cases.mjs`.

- `lowerBound(collection, target, compare?)`
  What it does: returns the first valid position to insert a value.
  Purpose: sorted windows, insertion or ranges.
  Usage: over an already sorted collection.
  Where used: `examples/example-nodejs/src/examples/search/real-search-cases.mjs`.

- `upperBound(collection, target, compare?)`
  What it does: returns the position after the last compatible match.
  Purpose: delimit ranges or duplicates in sorted structures.
  Usage: same as `lowerBound()`.
  Where used: `examples/example-nodejs/src/examples/search/real-search-cases.mjs`.

- `findSortedRange(collection, target, compare?)`
  What it does: locates the complete range of a value within a sorted collection.
  Purpose: datasets with duplicates or matching windows.
  Usage: internally combines lower and upper bounds.
  Where used: `examples/example-nodejs/src/examples/search/real-search-cases.mjs`.

- `searchAlgorithms`
  What it does: groups the search catalog.
  Purpose: namespaced access.
  Usage: `searchAlgorithms.binarySearch(...)`.
  Where used: exploration and tooling.

### Sorting

- `orderBy(collection, criteria)`
  What it does: sorts by one or more declarative criteria.
  Purpose: UI lists, reports or dashboards.
  Usage: a list of criteria with `project` and `direction` is passed.
  Where used: `examples/example-react/src/main.jsx`, `examples/example-vue/src/App.vue`, `examples/example-nodejs/src/examples/sort/real-sort-cases.mjs` and `examples/example-bun/src/main.ts`.

- `quickSort(collection, compare?)`
  What it does: sorts with a general high-performance strategy.
  Purpose: large collections when stability is not needed.
  Usage: optionally receives a comparator.
  Where used: `examples/example-nodejs/src/examples/sort/real-sort-cases.mjs`.

- `stableSortBy(collection, projector, direction?)`
  What it does: sorts maintaining relative stability between equals.
  Purpose: UI and reports where the previous order matters.
  Usage: the projection and direction are defined.
  Where used: `examples/example-nodejs/src/examples/sort/real-sort-cases.mjs`.

- `insertSorted(collection, value, compare?)`
  What it does: inserts a value into an already sorted collection.
  Purpose: maintain incremental order without resorting everything.
  Usage: the input collection must respect the same criterion.
  Where used: `examples/example-nodejs/src/examples/sort/real-sort-cases.mjs`.

- `sortAlgorithms`
  What it does: groups the sorting catalog.
  Purpose: namespaced access.
  Usage: `sortAlgorithms.orderBy(...)`.
  Where used: exploration and tooling.

### Selection and Aggregation

- `maxBy(collection, projector)`
  What it does: returns the item with the highest projected value.
  Purpose: top item or best candidate.
  Usage: the projector returns the comparable value.
  Where used: available for scripts and reports.

- `minBy(collection, projector)`
  What it does: returns the item with the lowest projected value.
  Purpose: operational minimum or baseline.
  Usage: same as `maxBy()`.
  Where used: scripts and reports.

- `sumBy(collection, projector)`
  What it does: sums a numeric projection over the collection.
  Purpose: totals, costs, volume or accumulated score.
  Usage: the projector returns the number to sum.
  Where used: analytics and reports.

- `averageBy(collection, projector)`
  What it does: calculates the average of a numeric projection.
  Purpose: KPIs, capacity, throughput or average latency.
  Usage: an array and a projection are passed.
  Where used: `examples/example-nodejs/src/examples/timeseries/real-timeseries-cases.mjs`, `examples/example-deno/main.ts` and `examples/example-bun/src/main.ts`.

- `histogramBy(collection, projector)`
  What it does: builds a histogram from a derived key or bucket.
  Purpose: distributions and counts by category.
  Usage: the projector returns the bucket.
  Where used: analytics scripts and aggregated catalogs.

- `paginate(collection, options)`
  What it does: paginates a collection.
  Purpose: UIs and APIs that need page, total and subset.
  Usage: page, limit or equivalent cursors are indicated according to the API.
  Where used: `examples/example-nodejs/src/examples/selection/real-selection-cases.mjs`.

- `partitionBy(collection, predicate)`
  What it does: separates the collection into two groups.
  Purpose: valid vs invalid, active vs inactive, etc.
  Usage: the predicate defines the partition condition.
  Where used: `examples/example-nodejs/src/examples/selection/real-selection-cases.mjs`.

- `rankBy(collection, projector, direction?)`
  What it does: assigns ranking to each element based on a projection.
  Purpose: leaderboards, prioritization or scoring.
  Usage: the metric and direction are defined.
  Where used: `examples/example-nodejs/src/examples/selection/real-selection-cases.mjs`.

- `topK(collection, limit, compare?)`
  What it does: returns the best `k` elements.
  Purpose: partial selection without sorting the entire collection.
  Usage: the limit and optionally the comparator are indicated.
  Where used: `examples/example-nodejs/src/examples/selection/real-selection-cases.mjs`, `examples/example-deno/main.ts` and `examples/example-bun/src/main.ts`.

- `aggregateAlgorithms` and `selectionAlgorithms`
  What it does: groups aggregation and selection algorithms.
  Purpose: namespaced access.
  Usage: `aggregateAlgorithms.averageBy(...)`, `selectionAlgorithms.topK(...)`.
  Where used: exploration and tooling.

### Time Series and Finance

- `bucketByInterval(series, interval)`
  What it does: groups temporal points by interval.
  Purpose: resampling, dashboards or window aggregation.
  Usage: the series and expected interval are passed.
  Where used: `examples/example-nodejs/src/examples/timeseries/real-timeseries-cases.mjs`.

- `detectTimeSeriesGaps(series, interval)`
  What it does: detects temporal gaps.
  Purpose: observability and data quality.
  Usage: the series and expected interval are passed.
  Where used: `examples/example-nodejs/src/examples/timeseries/real-timeseries-cases.mjs`.

- `differenceSeries(series)`
  What it does: calculates the difference between consecutive points.
  Purpose: variation, delta or basic momentum.
  Usage: receives a sorted series.
  Where used: `examples/example-nodejs/src/examples/timeseries/real-timeseries-cases.mjs`.

- `movingAverageSeries(series, windowSize)`
  What it does: calculates the moving average over a typed time series.
  Purpose: trend smoothing.
  Usage: the window size is defined.
  Where used: `examples/example-nodejs/src/examples/timeseries/real-timeseries-cases.mjs`, `examples/example-react/src/main.jsx`, `examples/example-vue/src/App.vue` and `examples/example-svelte/src/App.svelte`.

- `resampleSeries(series, interval)`
  What it does: resamples a series to a new interval.
  Purpose: comparability or temporal consolidation.
  Usage: the series and target interval are passed.
  Where used: `examples/example-nodejs/src/examples/timeseries/real-timeseries-cases.mjs`.

- `sortTimeSeries(series)`
  What it does: sorts a series by timestamp.
  Purpose: normalize input before temporal analytics.
  Usage: called before algorithms that assume chronological order.
  Where used: useful in temporal pipelines.

- `returnsSeries(series)`
  What it does: calculates returns between series points.
  Purpose: financial analytics and relative performance.
  Usage: receives a sorted numeric series.
  Where used: finance and advanced KPIs.

- `maxDrawdown(series)`
  What it does: calculates the largest drop from a previous maximum.
  Purpose: risk and financial analytics.
  Usage: a numeric time series is passed.
  Where used: `examples/example-react/src/main.jsx` and `examples/example-vue/src/App.vue`.

- `annualizedVolatility(series)`
  What it does: calculates annualized volatility.
  Purpose: advanced financial analytics.
  Usage: applied over returns or a compatible series.
  Where used: analytical scripts of the package.

- `exponentialMovingAverage(series, alpha)`
  What it does: calculates exponential moving average.
  Purpose: smoothing with more weight on recent data.
  Usage: the factor or alpha is defined.
  Where used: financial or operational analytics.

- `timeSeriesAlgorithms`
  What it does: groups the temporal and financial catalog.
  Purpose: namespaced access.
  Usage: `timeSeriesAlgorithms.movingAverageSeries(...)`.
  Where used: exploration and tooling.

### Windows

- `movingAverage(values, windowSize)`
  What it does: calculates moving average over a simple sequence.
  Purpose: quick smoothing over numeric lists.
  Usage: receives an array of numbers and the window size.
  Where used: `examples/example-nodejs/src/examples/window/real-window-cases.mjs`, `examples/example-deno/main.ts` and `examples/example-bun/src/main.ts`.

- `rollingSum(values, windowSize)`
  What it does: calculates rolling sum.
  Purpose: volume, load or accumulated throughput per window.
  Usage: same as `movingAverage()`.
  Where used: `examples/example-nodejs/src/examples/window/real-window-cases.mjs`.

- `slidingWindow(values, windowSize)`
  What it does: exposes each consecutive window of a sequence.
  Purpose: apply transformations or custom analytics over windows.
  Usage: returns the corresponding subcollections.
  Where used: `examples/example-nodejs/src/examples/window/real-window-cases.mjs`.

- `windowDelta(values, windowSize)`
  What it does: calculates the delta between values within a window.
  Purpose: relative change or acceleration.
  Usage: receives a sequence and window size.
  Where used: `examples/example-nodejs/src/examples/window/real-window-cases.mjs`.

- `windowAlgorithms`
  What it does: groups the windows catalog.
  Purpose: namespaced access.
  Usage: `windowAlgorithms.rollingSum(...)`.
  Where used: exploration and tooling.

### Graphs

- `buildAdjacencyList(edges)`
  What it does: creates an adjacency list.
  Purpose: prepare graph structures for subsequent algorithms.
  Usage: receives edges or relationships between nodes.
  Where used: base for graph cases in `examples/example-nodejs/src/examples/graph/real-graph-cases.mjs`.

- `breadthFirstSearch(graph, start)`
  What it does: traverses the graph in breadth-first order.
  Purpose: levels, connectivity or simple paths.
  Usage: the starting node is indicated.
  Where used: `examples/example-nodejs/src/examples/graph/real-graph-cases.mjs`.

- `depthFirstSearch(graph, start)`
  What it does: traverses the graph in depth-first order.
  Purpose: exhaustive exploration or structural detection.
  Usage: the starting node is indicated.
  Where used: available in the same graph catalog.

- `detectDirectedCycle(graph)`
  What it does: detects directed cycles.
  Purpose: validation of pipelines, DAGs or dependencies.
  Usage: receives a directed graph.
  Where used: tooling and structural validation.

- `dijkstraShortestPath(graph, from, to)`
  What it does: calculates the shortest path.
  Purpose: optimal routes, costs and planning.
  Usage: the graph must include compatible weights.
  Where used: `examples/example-nodejs/src/examples/graph/real-graph-cases.mjs`.

- `maxFlow(graph, source, sink)`
  What it does: calculates maximum flow.
  Purpose: capacity networks or throughput optimization.
  Usage: source and sink are indicated.
  Where used: advanced graph scripts.

- `minimumSpanningTree(graph)`
  What it does: calculates the minimum spanning tree.
  Purpose: minimum connectivity with reduced cost.
  Usage: a weighted graph is passed.
  Where used: graph utilities and network scenarios.

- `topologicalSort(graph)`
  What it does: topologically sorts a DAG.
  Purpose: dependencies, build stages or execution.
  Usage: the graph must not have cycles.
  Where used: `examples/example-nodejs/src/examples/graph/real-graph-cases.mjs`.

- `graphAlgorithms`
  What it does: groups the graph catalog.
  Purpose: namespaced access.
  Usage: `graphAlgorithms.topologicalSort(...)`.
  Where used: exploration and tooling.

### Aggregated Catalogs

- `algorithms`
  What it does: exposes the general algorithm catalog.
  Purpose: dynamic navigation or grouped exploration.
  Usage: `algorithms.sort.orderBy(...)` or equivalent structure per module.
  Where used: diagnostics and tooling.

- `logic`
  What it does: groups algorithms, arithmetic and functional families.
  Purpose: namespaced access from the main domain `barrits.logic`.
  Usage: `logic.orderBy(...)`, `logic.searchAlgorithms`, etc.
  Where used: namespaced consumption.

## Specialized Subpaths

### `@zuccadev-labs/barrits/consume`

- `readBuildManifest(path, readTextFile)`
  What it does: reads and parses a manifest from a text access function.
  Purpose: decouple filesystem, renderer or backend.
  Usage: the path and an async reader are passed.
  Where used: secure flows such as Tauri or controlled backends.

- `readBuildManifestSummary(path, readTextFile)`
  What it does: reads the manifest and directly returns the summary.
  Purpose: UIs and dashboards that do not want the complete artifact.
  Usage: same as `readBuildManifest()`.
  Where used: `examples/example-tauri/src/main.ts`.

- `readWatchSnapshot(path, readTextFile)`
  What it does: reads and parses a watch snapshot.
  Purpose: observability and tooling.
  Usage: an async reader is passed.
  Where used: secure snapshot consumption.

- `readWatchSnapshotSummary(path, readTextFile)`
  What it does: reads and summarizes the watch snapshot.
  Purpose: compact views of automation state.
  Usage: direct wrapper for UIs or reports.
  Where used: panels or operational inspection.

- `readLanguageToolSnapshot(path, readTextFile)`
  What it does: reads a language tooling snapshot.
  Purpose: editors, tooling and secure rendering.
  Usage: same as the rest of `consume` readers.
  Where used: `examples/example-tauri/src/main.ts`.

### `@zuccadev-labs/barrits/node`

- `createNodeFileSystemAdapter()`
  What it does: creates a filesystem adapter for Node.
  Purpose: discovery, inspection and tooling with real disk access.
  Usage: imported from the Node subpath and connected to the reading or inspection flow.
  Where used: scripts and Node runtime tooling.

- `readNodeBuildManifest(path)`
  What it does: reads a manifest from disk in Node.
  Purpose: ready-made wrapper for local filesystem.
  Usage: only the file path is needed.
  Where used: operational scripts of the Node runtime.

- `readNodeBuildManifestSummary(path)`
  What it does: reads and summarizes the manifest from disk.
  Purpose: simplify consumption in scripts or CLIs.
  Usage: called with a single path.
  Where used: `examples/example-nodejs/scripts/build-runner.mjs`.

- `readNodeWatchSnapshot(path)`
  What it does: reads a watch snapshot in Node.
  Purpose: diagnostics or local tooling.
  Usage: receives the snapshot path.
  Where used: observability scripts.

- `readNodeWatchSnapshotSummary(path)`
  What it does: reads and summarizes the watch snapshot.
  Purpose: compact reports.
  Usage: direct wrapper by path.
  Where used: local tooling.

- `readNodeLanguageToolSnapshot(path)`
  What it does: reads a language tooling snapshot from disk.
  Purpose: editors, scripts or offline inspection.
  Usage: called with the file path.
  Where used: `examples/example-nodejs/scripts/snapshot-consumer.mjs`.

- `runNodeCli(argumentsList?)`
  What it does: executes the Node CLI from code.
  Purpose: wrappers, tests or automations that avoid manual spawn.
  Usage: receives the optional argument list.
  Where used: Node integrations and `@zuccadev-labs/barrits/node/cli`.

### `@zuccadev-labs/barrits/deno`

- `createDenoFileSystemAdapter()`
  What it does: creates a filesystem adapter for Deno.
  Purpose: discovery and inspection in the Deno runtime.
  Usage: connected to tooling or controlled reading.
  Where used: Deno and JSR flows.

- `readDenoBuildManifest(path)`
  What it does: reads a manifest in Deno.
  Purpose: ready-made wrapper for the runtime.
  Usage: the file path is passed.
  Where used: Deno tooling.

- `readDenoBuildManifestSummary(path)`
  What it does: reads and summarizes the manifest in Deno.
  Purpose: scripts or `deno task` tasks.
  Usage: direct wrapper by path.
  Where used: Deno runtime walkthroughs.

- `readDenoWatchSnapshot(path)`
  What it does: reads a watch snapshot in Deno.
  Purpose: observability and tooling.
  Usage: the snapshot path is passed.
  Where used: Deno scripts.

- `readDenoWatchSnapshotSummary(path)`
  What it does: summarizes a watch snapshot in Deno.
  Purpose: compact view of the project state.
  Usage: wrapper by path.
  Where used: Deno tooling.

- `readDenoLanguageToolSnapshot(path)`
  What it does: reads a language tooling snapshot in Deno.
  Purpose: inspection or editor-friendly integrations.
  Usage: receives the file path.
  Where used: scripts and runtime tasks.

- `runDenoCli(argumentsList?)`
  What it does: executes the Deno CLI from code.
  Purpose: wrappers or automation from Deno.
  Usage: receives optional arguments.
  Where used: `@zuccadev-labs/barrits/deno/cli`.

### Bundler Plugins

- `barritsVitePlugin(options)`
  What it does: integrates the package-first contract into Vite.
  Purpose: virtual manifest, automation and wiring of the consumer project.
  Usage: receives `package: toBarritsAutomationOptions(...)`.
  Where used: `examples/example-react/vite.config.ts`, `examples/example-vue/vite.config.ts`, `examples/example-solid/vite.config.ts`, `examples/example-svelte/vite.config.ts` and `examples/bundlers/vite/vite.config.ts`.

- `barritsEsbuildPlugin(options)`
  What it does: integrates the package-first contract into esbuild.
  Purpose: automated build without repeating discovery or artifacts.
  Usage: connected to the esbuild configuration with options derived from the package.
  Where used: `examples/bundlers/esbuild/esbuild.config.mjs`.

- `barritsRollupPlugin(options)`
  What it does: integrates the package-first contract into Rollup.
  Purpose: same artifacts and same conventions on another bundler.
  Usage: plugin within the Rollup config.
  Where used: `examples/bundlers/rollup/rollup.config.mjs`.

- `barritsWebpackPlugin(options)`
  What it does: integrates the package-first contract into Webpack.
  Purpose: automation and artifact materialization in Webpack.
  Usage: instantiated or invoked depending on the plugin mode.
  Where used: `examples/bundlers/webpack/webpack.config.mjs`.

- `BarritsWebpackPlugin`
  What it does: exposes the Webpack plugin class.
  Purpose: integrations that prefer explicit instantiation.
  Usage: `new BarritsWebpackPlugin(...)`.
  Where used: available for advanced Webpack consumers.

## Public Types

In addition to functions, the root and subpaths export useful types for typed consumers: paths (`PathParts`), runtimes (`RuntimeName`, `BarritsRuntimeKind`, `BarritsWatchMode`), manifest and snapshot structures (`BarritsBuildManifest`, `BarritsLanguageToolSnapshot`, `BarritsWatchSnapshot`, `BarritsConsumedStateSummary`) and algorithm types (`OrderCriterion`, `TimeSeriesPoint`, `PaginatedResult`, `GraphEdge`, among others).

> [!TIP]
> It is recommended to import these types only when the consumer truly needs explicit typed contracts. If the integration already lives completely within a repository example, following the example walkthrough and adding concrete types as the project needs arise is the suggested approach.

---

[← Index](00-index.md)
