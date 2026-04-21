/**
 * @module
 * Deno adapter entrypoint for Barrits runtime APIs, algorithms, and tooling helpers.
 */

/** Package identification constants shared across runtimes. */
export { PACKAGE_ALIAS, PACKAGE_NAME } from "../../src/barrits/shared";

/** Domain namespaces (`barrits`, `brt`) for package-first composition. */
export { barrits, brt } from "../../src/barrits/api/domains";

/** Flat algorithm and functional API exports for direct Deno consumption. */
export {
	aggregateAlgorithms,
	algorithms,
	annualizedVolatility,
	arithmetic,
	averageBy,
	binarySearch,
	breadthFirstSearch,
	bucketByInterval,
	buildAdjacencyList,
	buildPath,
	chunk,
	collectionAlgorithms,
	composePipeline,
	depthFirstSearch,
	detectDirectedCycle,
	detectTimeSeriesGaps,
	differenceSeries,
	dijkstraShortestPath,
	exponentialMovingAverage,
	findSortedRange,
	graphAlgorithms,
	groupBy,
	histogramBy,
	indexBy,
	insertSorted,
	linearSearch,
	lowerBound,
	maxBy,
	maxDrawdown,
	maxFlow,
	mergeTraits,
	minBy,
	minimumSpanningTree,
	movingAverage,
	movingAverageSeries,
	orderBy,
	paginate,
	parsePath,
	partitionBy,
	quickSort,
	rankBy,
	resampleSeries,
	restar,
	returnsSeries,
	rollingSum,
	searchAlgorithms,
	selectionAlgorithms,
	slidingWindow,
	sortAlgorithms,
	sortTimeSeries,
	stableSortBy,
	sumBy,
	sumar,
	timeSeriesAlgorithms,
	topK,
	topologicalSort,
	uniqueBy,
	upperBound,
	windowAlgorithms,
	windowDelta,
} from "../../src/barrits/api/flat";

/** Package-level configuration helpers used by runtimes and plugins. */
export {
	defineBarritsConfig,
	defineBarritsPackage,
	toBarritsAutomationOptions,
} from "../../src/barrits/package";

/** Runtime and watch mode types used by package-first config. */
export type {
	BarritsRuntimeKind,
	BarritsWatchMode,
} from "../../src/barrits/package";

/** File system adapter implementation backed by Deno APIs. */
export { createDenoFileSystemAdapter } from "./filesystem";

/** Deno-specific readers for build manifests and watch snapshots. */
export { readDenoBuildManifest, readDenoBuildManifestSummary, readDenoLanguageToolSnapshot, readDenoWatchSnapshot, readDenoWatchSnapshotSummary } from "./tooling";

/** Lazy CLI runner used by runtime wrappers and integration tests. */
export const runDenoCli = async (argumentsList?: string[]): Promise<number> => {
	const cliModule = await import("./cli");
	return cliModule.runDenoCli(argumentsList);
};