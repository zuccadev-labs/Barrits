/**
 * @module
 * Flat public API surface that re-exports the package-first symbols used by consumers.
 */

/** Path route builders and parsers for operational path handling. */
export { buildPath, parsePath } from "../routes";

/** Build and watch manifest readers/summaries for automation tooling. */
export { createBuildManifestSummary, createLanguageToolSnapshot, createWatchSnapshotSummary, parseBuildManifest, parseWatchSnapshot } from "../consume";

/** Trait composition and descriptor authoring helpers. */
export { composePipeline, composeTraitDescriptors, createTraitDescriptor, createTraitDescriptorFromJsDoc, mergeTraits, parseTraitDescriptorJsDoc } from "../traits";

/** Core logic and algorithm families exposed for package consumers. */
export { aggregateAlgorithms, algorithms, arithmetic, averageBy, annualizedVolatility, binarySearch, breadthFirstSearch, buildAdjacencyList, bucketByInterval, chunk, collectionAlgorithms, depthFirstSearch, detectDirectedCycle, detectTimeSeriesGaps, differenceSeries, dijkstraShortestPath, exponentialMovingAverage, findSortedRange, graphAlgorithms, groupBy, histogramBy, indexBy, insertSorted, linearSearch, lowerBound, maxBy, maxDrawdown, maxFlow, minBy, minimumSpanningTree, movingAverage, movingAverageSeries, orderBy, paginate, partitionBy, quickSort, rankBy, resampleSeries, restar, returnsSeries, rollingSum, searchAlgorithms, selectionAlgorithms, slidingWindow, sortAlgorithms, sortTimeSeries, stableSortBy, sumBy, sumar, timeSeriesAlgorithms, topK, topologicalSort, uniqueBy, upperBound, windowAlgorithms, windowDelta } from "../logic";

/** Shared package naming constants used in generated imports and tooling. */
export { PACKAGE_ALIAS, PACKAGE_NAME } from "../shared";

/** Algorithm-level type contracts shared by graph, search, sort, and timeseries APIs. */
export type { CompareFunction, DrawdownPoint, GraphAdjacencyEntry, GraphEdge, GraphNodeId, GraphPath, MaxFlowResult, MinimumSpanningTreeResult, OrderCriterion, PaginatedResult, PaginationOptions, PartitionResult, RankedValue, SearchPredicate, SortDirection, SortedRangeMatch, TimeBucket, TimeGap, TimeSeriesPoint } from "../../barrits_lib/logic";

/** Primitive and shared runtime types used across helper APIs. */
export type { NumberInput, PathParts, RuntimeName, UnaryFunction } from "../shared";

/** Trait descriptor and composition type contracts for advanced typing scenarios. */
export type {
	ComposedTraitDescriptorsResult,
	ComposeTraitDescriptorsOptions,
	TraitConflictStrategy,
	TraitDescriptor,
	TraitDescriptorContext,
	TraitDescriptorFromJsDocInput,
	TraitDescriptorInput,
	TraitDescriptorJsDocMetadata,
	TraitDescriptorMetadata,
} from "../traits";

/** SDK discovery, graph, import, and manifest contracts exposed to tooling integrators. */
export type {
	BarritsDiscovery,
	BarritsDiscoveryStrategy,
	BarritsBuildManifest,
	BarritsConsumedStateSummary,
	BarritsDomainIntegration,
	BarritsExportCollision,
	BarritsExportKind,
	BarritsExportVisibility,
	BarritsFileExport,
	BarritsFileKind,
	BarritsFileIntegration,
	BarritsGraphFilters,
	BarritsIntegrationGraph,
	BarritsImportAction,
	BarritsImportActionKind,
	BarritsSourceLayer,
	BarritsSelectionFilters,
	BarritsLanguageToolDomain,
	BarritsLanguageToolSnapshot,
	BarritsWatchSnapshot,
	FindBarritsOptions,
	RuntimeFileSystemAdapter,
	RuntimeFileSystemEntry,
	RuntimeFileSystemEntryType,
} from "../sdk";