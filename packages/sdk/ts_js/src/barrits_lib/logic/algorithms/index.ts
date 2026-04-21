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

/**
 * [EN] Unified collection of all logic algorithms available in the Barrits SDK.
 * [ES] Colección unificada de todos los algoritmos de lógica disponibles en el SDK de Barrits.
 */
export const algorithms = {
  /** [EN] Statistical aggregation. [ES] Agregación estadística. */
  aggregate: aggregateAlgorithms,
  /** [EN] Functional collection helpers. [ES] Ayudantes de colecciones funcionales. */
  collection: collectionAlgorithms,
  /** [EN] Graph theory algorithms. [ES] Algoritmos de teoría de grafos. */
  graph: graphAlgorithms,
  /** [EN] Searching algorithms. [ES] Algoritmos de búsqueda. */
  search: searchAlgorithms,
  /** [EN] Selection and partitioning. [ES] Selección y partición. */
  selection: selectionAlgorithms,
  /** [EN] Sorting and ordering. [ES] Ordenamiento y clasificación. */
  sort: sortAlgorithms,
  /** [EN] Time-series analysis. [ES] Análisis de series temporales. */
  timeseries: timeSeriesAlgorithms,
  /** [EN] Windowing operations. [ES] Operaciones de ventana. */
  window: windowAlgorithms,
};
