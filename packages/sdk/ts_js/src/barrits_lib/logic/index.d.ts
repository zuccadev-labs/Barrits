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
export declare const BarritsLogic: {
    /** Computational algorithms collection (aggregate, graph, search, sort, timeseries, window). */
    algorithms: {
        aggregate: {
            averageBy: <Value>(values: readonly Value[], project: (value: Value, index: number, values: readonly Value[]) => number) => number;
            histogramBy: <Value, Key extends string | number>(values: readonly Value[], selectKey: (value: Value, index: number, values: readonly Value[]) => Key) => Record<Key, number>;
            maxBy: <Value>(values: readonly Value[], project: (value: Value, index: number, values: readonly Value[]) => number) => Value | undefined;
            minBy: <Value>(values: readonly Value[], project: (value: Value, index: number, values: readonly Value[]) => number) => Value | undefined;
            sumBy: <Value>(values: readonly Value[], project: (value: Value, index: number, values: readonly Value[]) => number) => number;
        };
        collection: {
            chunk: <Value>(values: readonly Value[], size: number) => Value[][];
            groupBy: <Value, Key>(values: readonly Value[], selectKey: (value: Value, index: number, values: readonly Value[]) => Key) => Map<Key, Value[]>;
            indexBy: <Value, Key>(values: readonly Value[], selectKey: (value: Value, index: number, values: readonly Value[]) => Key) => Map<Key, Value>;
            uniqueBy: <Value, Key>(values: readonly Value[], selectKey: (value: Value, index: number, values: readonly Value[]) => Key) => Value[];
        };
        graph: {
            breadthFirstSearch: <NodeId extends import(".").GraphNodeId>(edges: readonly import(".").GraphEdge<NodeId>[], startNode: NodeId) => NodeId[];
            buildAdjacencyList: <NodeId extends import(".").GraphNodeId>(edges: readonly import(".").GraphEdge<NodeId>[], options?: {
                readonly directed?: boolean;
            }) => Map<NodeId, import(".").GraphAdjacencyEntry<NodeId>[]>;
            detectDirectedCycle: <NodeId extends import(".").GraphNodeId>(edges: readonly import(".").GraphEdge<NodeId>[]) => NodeId[] | null;
            depthFirstSearch: <NodeId extends import(".").GraphNodeId>(edges: readonly import(".").GraphEdge<NodeId>[], startNode: NodeId) => NodeId[];
            dijkstraShortestPath: <NodeId extends import(".").GraphNodeId>(edges: readonly import(".").GraphEdge<NodeId>[], startNode: NodeId, targetNode: NodeId) => import(".").GraphPath<NodeId>;
            maxFlow: <NodeId extends import(".").GraphNodeId>(edges: readonly import(".").GraphEdge<NodeId>[], source: NodeId, sink: NodeId) => import(".").MaxFlowResult<NodeId>;
            minimumSpanningTree: <NodeId extends import(".").GraphNodeId>(edges: readonly import(".").GraphEdge<NodeId>[]) => import(".").MinimumSpanningTreeResult<NodeId>;
            topologicalSort: <NodeId extends import(".").GraphNodeId>(edges: readonly import(".").GraphEdge<NodeId>[]) => NodeId[];
        };
        search: {
            binarySearch: <Value>(values: readonly Value[], target: Value, compare?: import(".").CompareFunction<Value>) => number;
            findSortedRange: <Value>(values: readonly Value[], target: Value, compare?: import(".").CompareFunction<Value>) => import(".").SortedRangeMatch;
            linearSearch: <Value>(values: readonly Value[], matcher: import(".").SearchPredicate<Value> | Value) => number;
            lowerBound: <Value>(values: readonly Value[], target: Value, compare?: import(".").CompareFunction<Value>) => number;
            upperBound: <Value>(values: readonly Value[], target: Value, compare?: import(".").CompareFunction<Value>) => number;
        };
        selection: {
            paginate: <Value>(values: readonly Value[], options: import(".").PaginationOptions) => import(".").PaginatedResult<Value>;
            partitionBy: <Value>(values: readonly Value[], predicate: (value: Value, index: number, values: readonly Value[]) => boolean) => import(".").PartitionResult<Value>;
            rankBy: <Value>(values: readonly Value[], criteria: readonly import(".").OrderCriterion<Value>[]) => import(".").RankedValue<Value>[];
            topK: <Value>(values: readonly Value[], k: number, compare?: import(".").CompareFunction<Value>, direction?: import(".").SortDirection) => Value[];
        };
        sort: {
            insertSorted: <Value>(values: readonly Value[], value: Value, compare?: import(".").CompareFunction<Value>) => Value[];
            orderBy: <Value>(values: readonly Value[], criteria: readonly import(".").OrderCriterion<Value>[]) => Value[];
            quickSort: <Value>(values: readonly Value[], compare?: import(".").CompareFunction<Value>) => Value[];
            stableSortBy: <Value, Result>(values: readonly Value[], rank: (value: Value) => Result, options?: {
                readonly direction?: import(".").SortDirection;
                readonly compare?: import(".").CompareFunction<Result>;
            }) => Value[];
        };
        timeseries: {
            bucketByInterval: <Value>(points: readonly import(".").TimeSeriesPoint<Value>[], intervalMs: number) => import(".").TimeBucket<Value>[];
            detectTimeSeriesGaps: <Value>(points: readonly import(".").TimeSeriesPoint<Value>[], expectedIntervalMs: number) => import(".").TimeGap[];
            differenceSeries: (points: readonly import(".").TimeSeriesPoint<number>[]) => import(".").TimeSeriesPoint<number>[];
            finance: {
                annualizedVolatility: (points: readonly import(".").TimeSeriesPoint<number>[], periodsPerYear: number) => number;
                exponentialMovingAverage: (points: readonly import(".").TimeSeriesPoint<number>[], smoothingFactor?: number) => import(".").TimeSeriesPoint<number>[];
                maxDrawdown: (points: readonly import(".").TimeSeriesPoint<number>[]) => import(".").DrawdownPoint | null;
                returnsSeries: (points: readonly import(".").TimeSeriesPoint<number>[]) => import(".").TimeSeriesPoint<number>[];
            };
            movingAverageSeries: (points: readonly import(".").TimeSeriesPoint<number>[], size: number) => import(".").TimeSeriesPoint<number>[];
            resampleSeries: (points: readonly import(".").TimeSeriesPoint<number>[], intervalMs: number) => import(".").TimeSeriesPoint<number>[];
            sortTimeSeries: <Value>(points: readonly import(".").TimeSeriesPoint<Value>[]) => import(".").TimeSeriesPoint<Value>[];
        };
        window: {
            movingAverage: (values: readonly number[], size: number) => number[];
            rollingSum: (values: readonly number[], size: number) => number[];
            slidingWindow: <Value>(values: readonly Value[], size: number) => Value[][];
            windowDelta: (values: readonly number[], size: number) => number[];
        };
    };
    /** String manipulation services (capitalize, slugify, truncate, accent-insensitive). */
    strings: {
        readonly accentInsensitiveRegex: (input: string) => string;
        readonly capitalize: (input: string) => string;
        readonly capitalizeWords: (input: string) => string;
        readonly slugify: (input: string) => string;
        readonly truncate: (input: string, maxLength: number, ellipsis?: string) => string;
    };
    /** Hashing and integrity services (SHA-256, MurmurHash3, deterministic JSON). */
    hashing: {
        readonly sha256Hex: (input: string) => Promise<string>;
        readonly murmurHash3: (input: string, seed?: number) => number;
        readonly deterministicStringify: (value: unknown, indent?: number) => string;
    };
    /** Validation and assertion guards (email, URL, UUID, ISO date, IP address). */
    validation: {
        readonly isEmail: (value: string) => boolean;
        readonly isUrl: (value: string) => boolean;
        readonly isUuid: (value: string) => boolean;
        readonly isIsoDate: (value: string) => boolean;
        readonly isIpAddress: (value: string) => boolean;
        readonly assertNonNullish: <T>(value: T | null | undefined, label: string) => T;
    };
    /** Date and time manipulation (ISO 8601 serialize/parse, diff, add, relative). */
    datetime: {
        readonly toIsoString: (input: Date | number | string) => string;
        readonly fromIsoString: (input: string) => Date | null;
        readonly diffMs: (start: Date, end: Date) => number;
        readonly addMs: (date: Date, milliseconds: number) => Date;
        readonly toRelativeTime: (date: Date, locale?: string) => string;
    };
    /** Resilience patterns (retry with backoff, timeout, circuit breaker). */
    resilience: {
        readonly retryWithBackoff: <T>(operation: () => Promise<T>, options?: import(".").RetryOptions) => Promise<T>;
        readonly withTimeout: <T>(operation: Promise<T>, timeoutMs: number, label?: string) => Promise<T>;
        readonly createCircuitBreaker: (options?: import(".").CircuitBreakerOptions) => import(".").CircuitBreaker;
    };
};
export { aggregateAlgorithms, averageBy, binarySearch, breadthFirstSearch, buildAdjacencyList, bucketByInterval, chunk, collectionAlgorithms, depthFirstSearch, detectDirectedCycle, detectTimeSeriesGaps, differenceSeries, dijkstraShortestPath, annualizedVolatility, exponentialMovingAverage, findSortedRange, graphAlgorithms, groupBy, histogramBy, indexBy, insertSorted, linearSearch, lowerBound, maxDrawdown, maxFlow, maxBy, minBy, minimumSpanningTree, movingAverage, movingAverageSeries, orderBy, paginate, partitionBy, quickSort, rankBy, resampleSeries, returnsSeries, rollingSum, searchAlgorithms, selectionAlgorithms, slidingWindow, sortTimeSeries, sortAlgorithms, stableSortBy, sumBy, timeSeriesAlgorithms, topologicalSort, topK, uniqueBy, upperBound, windowAlgorithms, windowDelta, } from "./algorithms/index";
export type { CompareFunction, DrawdownPoint, GraphAdjacencyEntry, GraphEdge, GraphNodeId, GraphPath, MaxFlowResult, MinimumSpanningTreeResult, OrderCriterion, PaginatedResult, PaginationOptions, PartitionResult, RankedValue, SearchPredicate, SortDirection, SortedRangeMatch, TimeBucket, TimeGap, TimeSeriesPoint, } from "./algorithms/index";
export declare const logic: {
    algorithms: {
        aggregate: {
            averageBy: <Value>(values: readonly Value[], project: (value: Value, index: number, values: readonly Value[]) => number) => number;
            histogramBy: <Value, Key extends string | number>(values: readonly Value[], selectKey: (value: Value, index: number, values: readonly Value[]) => Key) => Record<Key, number>;
            maxBy: <Value>(values: readonly Value[], project: (value: Value, index: number, values: readonly Value[]) => number) => Value | undefined;
            minBy: <Value>(values: readonly Value[], project: (value: Value, index: number, values: readonly Value[]) => number) => Value | undefined;
            sumBy: <Value>(values: readonly Value[], project: (value: Value, index: number, values: readonly Value[]) => number) => number;
        };
        collection: {
            chunk: <Value>(values: readonly Value[], size: number) => Value[][];
            groupBy: <Value, Key>(values: readonly Value[], selectKey: (value: Value, index: number, values: readonly Value[]) => Key) => Map<Key, Value[]>;
            indexBy: <Value, Key>(values: readonly Value[], selectKey: (value: Value, index: number, values: readonly Value[]) => Key) => Map<Key, Value>;
            uniqueBy: <Value, Key>(values: readonly Value[], selectKey: (value: Value, index: number, values: readonly Value[]) => Key) => Value[];
        };
        graph: {
            breadthFirstSearch: <NodeId extends import(".").GraphNodeId>(edges: readonly import(".").GraphEdge<NodeId>[], startNode: NodeId) => NodeId[];
            buildAdjacencyList: <NodeId extends import(".").GraphNodeId>(edges: readonly import(".").GraphEdge<NodeId>[], options?: {
                readonly directed?: boolean;
            }) => Map<NodeId, import(".").GraphAdjacencyEntry<NodeId>[]>;
            detectDirectedCycle: <NodeId extends import(".").GraphNodeId>(edges: readonly import(".").GraphEdge<NodeId>[]) => NodeId[] | null;
            depthFirstSearch: <NodeId extends import(".").GraphNodeId>(edges: readonly import(".").GraphEdge<NodeId>[], startNode: NodeId) => NodeId[];
            dijkstraShortestPath: <NodeId extends import(".").GraphNodeId>(edges: readonly import(".").GraphEdge<NodeId>[], startNode: NodeId, targetNode: NodeId) => import(".").GraphPath<NodeId>;
            maxFlow: <NodeId extends import(".").GraphNodeId>(edges: readonly import(".").GraphEdge<NodeId>[], source: NodeId, sink: NodeId) => import(".").MaxFlowResult<NodeId>;
            minimumSpanningTree: <NodeId extends import(".").GraphNodeId>(edges: readonly import(".").GraphEdge<NodeId>[]) => import(".").MinimumSpanningTreeResult<NodeId>;
            topologicalSort: <NodeId extends import(".").GraphNodeId>(edges: readonly import(".").GraphEdge<NodeId>[]) => NodeId[];
        };
        search: {
            binarySearch: <Value>(values: readonly Value[], target: Value, compare?: import(".").CompareFunction<Value>) => number;
            findSortedRange: <Value>(values: readonly Value[], target: Value, compare?: import(".").CompareFunction<Value>) => import(".").SortedRangeMatch;
            linearSearch: <Value>(values: readonly Value[], matcher: import(".").SearchPredicate<Value> | Value) => number;
            lowerBound: <Value>(values: readonly Value[], target: Value, compare?: import(".").CompareFunction<Value>) => number;
            upperBound: <Value>(values: readonly Value[], target: Value, compare?: import(".").CompareFunction<Value>) => number;
        };
        selection: {
            paginate: <Value>(values: readonly Value[], options: import(".").PaginationOptions) => import(".").PaginatedResult<Value>;
            partitionBy: <Value>(values: readonly Value[], predicate: (value: Value, index: number, values: readonly Value[]) => boolean) => import(".").PartitionResult<Value>;
            rankBy: <Value>(values: readonly Value[], criteria: readonly import(".").OrderCriterion<Value>[]) => import(".").RankedValue<Value>[];
            topK: <Value>(values: readonly Value[], k: number, compare?: import(".").CompareFunction<Value>, direction?: import(".").SortDirection) => Value[];
        };
        sort: {
            insertSorted: <Value>(values: readonly Value[], value: Value, compare?: import(".").CompareFunction<Value>) => Value[];
            orderBy: <Value>(values: readonly Value[], criteria: readonly import(".").OrderCriterion<Value>[]) => Value[];
            quickSort: <Value>(values: readonly Value[], compare?: import(".").CompareFunction<Value>) => Value[];
            stableSortBy: <Value, Result>(values: readonly Value[], rank: (value: Value) => Result, options?: {
                readonly direction?: import(".").SortDirection;
                readonly compare?: import(".").CompareFunction<Result>;
            }) => Value[];
        };
        timeseries: {
            bucketByInterval: <Value>(points: readonly import(".").TimeSeriesPoint<Value>[], intervalMs: number) => import(".").TimeBucket<Value>[];
            detectTimeSeriesGaps: <Value>(points: readonly import(".").TimeSeriesPoint<Value>[], expectedIntervalMs: number) => import(".").TimeGap[];
            differenceSeries: (points: readonly import(".").TimeSeriesPoint<number>[]) => import(".").TimeSeriesPoint<number>[];
            finance: {
                annualizedVolatility: (points: readonly import(".").TimeSeriesPoint<number>[], periodsPerYear: number) => number;
                exponentialMovingAverage: (points: readonly import(".").TimeSeriesPoint<number>[], smoothingFactor?: number) => import(".").TimeSeriesPoint<number>[];
                maxDrawdown: (points: readonly import(".").TimeSeriesPoint<number>[]) => import(".").DrawdownPoint | null;
                returnsSeries: (points: readonly import(".").TimeSeriesPoint<number>[]) => import(".").TimeSeriesPoint<number>[];
            };
            movingAverageSeries: (points: readonly import(".").TimeSeriesPoint<number>[], size: number) => import(".").TimeSeriesPoint<number>[];
            resampleSeries: (points: readonly import(".").TimeSeriesPoint<number>[], intervalMs: number) => import(".").TimeSeriesPoint<number>[];
            sortTimeSeries: <Value>(points: readonly import(".").TimeSeriesPoint<Value>[]) => import(".").TimeSeriesPoint<Value>[];
        };
        window: {
            movingAverage: (values: readonly number[], size: number) => number[];
            rollingSum: (values: readonly number[], size: number) => number[];
            slidingWindow: <Value>(values: readonly Value[], size: number) => Value[][];
            windowDelta: (values: readonly number[], size: number) => number[];
        };
    };
    strings: {
        readonly accentInsensitiveRegex: (input: string) => string;
        readonly capitalize: (input: string) => string;
        readonly capitalizeWords: (input: string) => string;
        readonly slugify: (input: string) => string;
        readonly truncate: (input: string, maxLength: number, ellipsis?: string) => string;
    };
    hashing: {
        readonly sha256Hex: (input: string) => Promise<string>;
        readonly murmurHash3: (input: string, seed?: number) => number;
        readonly deterministicStringify: (value: unknown, indent?: number) => string;
    };
    validation: {
        readonly isEmail: (value: string) => boolean;
        readonly isUrl: (value: string) => boolean;
        readonly isUuid: (value: string) => boolean;
        readonly isIsoDate: (value: string) => boolean;
        readonly isIpAddress: (value: string) => boolean;
        readonly assertNonNullish: <T>(value: T | null | undefined, label: string) => T;
    };
    datetime: {
        readonly toIsoString: (input: Date | number | string) => string;
        readonly fromIsoString: (input: string) => Date | null;
        readonly diffMs: (start: Date, end: Date) => number;
        readonly addMs: (date: Date, milliseconds: number) => Date;
        readonly toRelativeTime: (date: Date, locale?: string) => string;
    };
    resilience: {
        readonly retryWithBackoff: <T>(operation: () => Promise<T>, options?: import(".").RetryOptions) => Promise<T>;
        readonly withTimeout: <T>(operation: Promise<T>, timeoutMs: number, label?: string) => Promise<T>;
        readonly createCircuitBreaker: (options?: import(".").CircuitBreakerOptions) => import(".").CircuitBreaker;
    };
};
export * from "./arithmetic/index";
