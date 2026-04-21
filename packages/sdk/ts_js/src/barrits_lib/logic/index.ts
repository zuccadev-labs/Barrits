import { algorithms } from "./algorithms/index";
import { stringAlgorithms } from "./strings/index";
import { hashingAlgorithms } from "./hashing/index";
import { validationAlgorithms } from "./validation/index";
import { datetimeAlgorithms } from "./datetime/index";
import { resilienceAlgorithms } from "./resilience/index";

export { algorithms } from "./algorithms/index";
export { accentInsensitiveRegex, capitalize, capitalizeWords, slugify, stringAlgorithms, truncate } from "./strings/index";
export { hashingAlgorithms, sha256Hex, murmurHash3, deterministicStringify } from "./hashing/index";
export { validationAlgorithms, isEmail, isUrl, isUuid, isIsoDate, isIpAddress, assertNonNullish } from "./validation/index";
export { datetimeAlgorithms, toIsoString, fromIsoString, diffMs, addMs, toRelativeTime } from "./datetime/index";
export { resilienceAlgorithms, retryWithBackoff, withTimeout, createCircuitBreaker } from "./resilience/index";
export type { RetryOptions, CircuitBreakerOptions, CircuitBreaker } from "./resilience/index";

/**
 * Root export object for all logic algorithms and utility services.
 *
 * This namespace aggregates every algorithm family in the Barrits standard
 * library, providing a single entry point for discovery and consumption.
 */
export const BarritsLogic = {
  /** Computational algorithms collection (aggregate, graph, search, sort, timeseries, window). */
  algorithms,
  /** String manipulation services (capitalize, slugify, truncate, accent-insensitive). */
  strings: stringAlgorithms,
  /** Hashing and integrity services (SHA-256, MurmurHash3, deterministic JSON). */
  hashing: hashingAlgorithms,
  /** Validation and assertion guards (email, URL, UUID, ISO date, IP address). */
  validation: validationAlgorithms,
  /** Date and time manipulation (ISO 8601 serialize/parse, diff, add, relative). */
  datetime: datetimeAlgorithms,
  /** Resilience patterns (retry with backoff, timeout, circuit breaker). */
  resilience: resilienceAlgorithms,
};

export {
  aggregateAlgorithms,
  averageBy,
  binarySearch,
  breadthFirstSearch,
  buildAdjacencyList,
  bucketByInterval,
  chunk,
  collectionAlgorithms,
  depthFirstSearch,
  detectDirectedCycle,
  detectTimeSeriesGaps,
  differenceSeries,
  dijkstraShortestPath,
  annualizedVolatility,
  exponentialMovingAverage,
  findSortedRange,
  graphAlgorithms,
  groupBy,
  histogramBy,
  indexBy,
  insertSorted,
  linearSearch,
  lowerBound,
  maxDrawdown,
  maxFlow,
  maxBy,
  minBy,
  minimumSpanningTree,
  movingAverage,
  movingAverageSeries,
  orderBy,
  paginate,
  partitionBy,
  quickSort,
  rankBy,
  resampleSeries,
  returnsSeries,
  rollingSum,
  searchAlgorithms,
  selectionAlgorithms,
  slidingWindow,
  sortTimeSeries,
  sortAlgorithms,
  stableSortBy,
  sumBy,
  timeSeriesAlgorithms,
  topologicalSort,
  topK,
  uniqueBy,
  upperBound,
  windowAlgorithms,
  windowDelta,
} from "./algorithms/index";
export type {
  CompareFunction,
  DrawdownPoint,
  GraphAdjacencyEntry,
  GraphEdge,
  GraphNodeId,
  GraphPath,
  MaxFlowResult,
  MinimumSpanningTreeResult,
  OrderCriterion,
  PaginatedResult,
  PaginationOptions,
  PartitionResult,
  RankedValue,
  SearchPredicate,
  SortDirection,
  SortedRangeMatch,
  TimeBucket,
  TimeGap,
  TimeSeriesPoint,
} from "./algorithms/index";

export const logic = {
  algorithms,
  strings: stringAlgorithms,
  hashing: hashingAlgorithms,
  validation: validationAlgorithms,
  datetime: datetimeAlgorithms,
  resilience: resilienceAlgorithms,
};

export * from "./arithmetic/index";
