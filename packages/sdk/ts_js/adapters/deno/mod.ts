export { PACKAGE_ALIAS, PACKAGE_NAME } from "../../src/barrits/shared";
export { barrits, brt } from "../../src/barrits/api/domains";
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
export {
	defineBarritsPackage,
	toBarritsAutomationOptions,
} from "../../src/barrits/package";
export type {
	BarritsRuntimeKind,
	BarritsWatchMode,
} from "../../src/barrits/package";
export { createDenoFileSystemAdapter } from "./filesystem";
export { readDenoBuildManifest, readDenoBuildManifestSummary, readDenoLanguageToolSnapshot, readDenoWatchSnapshot, readDenoWatchSnapshotSummary } from "./tooling";

export const runDenoCli = async (argumentsList?: string[]): Promise<number> => {
	const cliModule = await import("./cli");
	return cliModule.runDenoCli(argumentsList);
};