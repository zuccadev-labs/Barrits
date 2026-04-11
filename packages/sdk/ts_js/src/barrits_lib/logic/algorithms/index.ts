import { aggregateAlgorithms } from "./aggregate";
import { collectionAlgorithms } from "./collection";
import { graphAlgorithms } from "./graph";
import { searchAlgorithms } from "./search";
import { selectionAlgorithms } from "./selection";
import { sortAlgorithms } from "./sort";
import { timeSeriesAlgorithms } from "./timeseries";
import { windowAlgorithms } from "./window";

export { aggregateAlgorithms, averageBy, histogramBy, maxBy, minBy, sumBy } from "./aggregate";
export { chunk, collectionAlgorithms, groupBy, indexBy, uniqueBy } from "./collection";
export { breadthFirstSearch, buildAdjacencyList, depthFirstSearch, detectDirectedCycle, dijkstraShortestPath, graphAlgorithms, maxFlow, minimumSpanningTree, topologicalSort } from "./graph";
export type { GraphAdjacencyEntry, GraphEdge, GraphNodeId, GraphPath, MaxFlowResult, MinimumSpanningTreeResult } from "./graph";
export { binarySearch, findSortedRange, linearSearch, lowerBound, searchAlgorithms, upperBound } from "./search";
export type { CompareFunction, SearchPredicate, SortedRangeMatch } from "./search";
export { paginate, partitionBy, rankBy, selectionAlgorithms, topK } from "./selection";
export type { PaginatedResult, PaginationOptions, PartitionResult, RankedValue } from "./selection";
export { insertSorted, orderBy, quickSort, sortAlgorithms, stableSortBy } from "./sort";
export type { OrderCriterion } from "./sort";
export { annualizedVolatility, bucketByInterval, detectTimeSeriesGaps, differenceSeries, exponentialMovingAverage, financeTimeSeriesAlgorithms, maxDrawdown, movingAverageSeries, resampleSeries, returnsSeries, sortTimeSeries, timeSeriesAlgorithms } from "./timeseries";
export type { DrawdownPoint, TimeBucket, TimeGap, TimeSeriesPoint } from "./timeseries";
export { movingAverage, rollingSum, slidingWindow, windowAlgorithms, windowDelta } from "./window";
export type { SortDirection } from "./internal/compare";

export const algorithms = {
  aggregate: aggregateAlgorithms,
  collection: collectionAlgorithms,
  graph: graphAlgorithms,
  search: searchAlgorithms,
  selection: selectionAlgorithms,
  sort: sortAlgorithms,
  timeseries: timeSeriesAlgorithms,
  window: windowAlgorithms,
};
