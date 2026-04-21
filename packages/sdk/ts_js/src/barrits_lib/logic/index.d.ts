export { algorithms } from "./algorithms";
export { accentInsensitiveRegex, capitalize, capitalizeWords, slugify, stringAlgorithms, truncate } from "./strings";
export { aggregateAlgorithms, averageBy, binarySearch, breadthFirstSearch, buildAdjacencyList, bucketByInterval, chunk, collectionAlgorithms, depthFirstSearch, detectDirectedCycle, detectTimeSeriesGaps, differenceSeries, dijkstraShortestPath, annualizedVolatility, exponentialMovingAverage, findSortedRange, graphAlgorithms, groupBy, histogramBy, indexBy, insertSorted, linearSearch, lowerBound, maxDrawdown, maxFlow, maxBy, minBy, minimumSpanningTree, movingAverage, movingAverageSeries, orderBy, paginate, partitionBy, quickSort, rankBy, resampleSeries, returnsSeries, rollingSum, searchAlgorithms, selectionAlgorithms, slidingWindow, sortTimeSeries, sortAlgorithms, stableSortBy, sumBy, timeSeriesAlgorithms, topologicalSort, topK, uniqueBy, upperBound, windowAlgorithms, windowDelta, } from "./algorithms";
export type { CompareFunction, DrawdownPoint, GraphAdjacencyEntry, GraphEdge, GraphNodeId, GraphPath, MaxFlowResult, MinimumSpanningTreeResult, OrderCriterion, PaginatedResult, PaginationOptions, PartitionResult, RankedValue, SearchPredicate, SortDirection, SortedRangeMatch, TimeBucket, TimeGap, TimeSeriesPoint, } from "./algorithms";
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
            breadthFirstSearch: <NodeId extends import("./algorithms").GraphNodeId>(edges: readonly import("./algorithms").GraphEdge<NodeId>[], startNode: NodeId) => NodeId[];
            buildAdjacencyList: <NodeId extends import("./algorithms").GraphNodeId>(edges: readonly import("./algorithms").GraphEdge<NodeId>[], options?: {
                readonly directed?: boolean;
            }) => Map<NodeId, import("./algorithms").GraphAdjacencyEntry<NodeId>[]>;
            detectDirectedCycle: <NodeId extends import("./algorithms").GraphNodeId>(edges: readonly import("./algorithms").GraphEdge<NodeId>[]) => NodeId[] | null;
            depthFirstSearch: <NodeId extends import("./algorithms").GraphNodeId>(edges: readonly import("./algorithms").GraphEdge<NodeId>[], startNode: NodeId) => NodeId[];
            dijkstraShortestPath: <NodeId extends import("./algorithms").GraphNodeId>(edges: readonly import("./algorithms").GraphEdge<NodeId>[], startNode: NodeId, targetNode: NodeId) => import("./algorithms").GraphPath<NodeId>;
            maxFlow: <NodeId extends import("./algorithms").GraphNodeId>(edges: readonly import("./algorithms").GraphEdge<NodeId>[], source: NodeId, sink: NodeId) => import("./algorithms").MaxFlowResult<NodeId>;
            minimumSpanningTree: <NodeId extends import("./algorithms").GraphNodeId>(edges: readonly import("./algorithms").GraphEdge<NodeId>[]) => import("./algorithms").MinimumSpanningTreeResult<NodeId>;
            topologicalSort: <NodeId extends import("./algorithms").GraphNodeId>(edges: readonly import("./algorithms").GraphEdge<NodeId>[]) => NodeId[];
        };
        search: {
            binarySearch: <Value>(values: readonly Value[], target: Value, compare?: import("./algorithms").CompareFunction<Value>) => number;
            findSortedRange: <Value>(values: readonly Value[], target: Value, compare?: import("./algorithms").CompareFunction<Value>) => import("./algorithms").SortedRangeMatch;
            linearSearch: <Value>(values: readonly Value[], matcher: import("./algorithms").SearchPredicate<Value> | Value) => number;
            lowerBound: <Value>(values: readonly Value[], target: Value, compare?: import("./algorithms").CompareFunction<Value>) => number;
            upperBound: <Value>(values: readonly Value[], target: Value, compare?: import("./algorithms").CompareFunction<Value>) => number;
        };
        selection: {
            paginate: <Value>(values: readonly Value[], options: import("./algorithms").PaginationOptions) => import("./algorithms").PaginatedResult<Value>;
            partitionBy: <Value>(values: readonly Value[], predicate: (value: Value, index: number, values: readonly Value[]) => boolean) => import("./algorithms").PartitionResult<Value>;
            rankBy: <Value>(values: readonly Value[], criteria: readonly import("./algorithms").OrderCriterion<Value>[]) => import("./algorithms").RankedValue<Value>[];
            topK: <Value>(values: readonly Value[], count: number, compare?: import("./algorithms").CompareFunction<Value>, direction?: import("./algorithms").SortDirection) => Value[];
        };
        sort: {
            insertSorted: <Value>(values: readonly Value[], value: Value, compare?: import("./algorithms").CompareFunction<Value>) => Value[];
            orderBy: <Value>(values: readonly Value[], criteria: readonly import("./algorithms").OrderCriterion<Value>[]) => Value[];
            quickSort: <Value>(values: readonly Value[], compare?: import("./algorithms").CompareFunction<Value>) => Value[];
            stableSortBy: <Value, Result>(values: readonly Value[], rank: (value: Value) => Result, options?: {
                readonly direction?: import("./algorithms").SortDirection;
                readonly compare?: import("./algorithms").CompareFunction<Result>;
            }) => Value[];
        };
        timeseries: {
            bucketByInterval: <Value>(points: readonly import("./algorithms").TimeSeriesPoint<Value>[], intervalMs: number) => import("./algorithms").TimeBucket<Value>[];
            detectTimeSeriesGaps: <Value>(points: readonly import("./algorithms").TimeSeriesPoint<Value>[], expectedIntervalMs: number) => import("./algorithms").TimeGap[];
            differenceSeries: (points: readonly import("./algorithms").TimeSeriesPoint<number>[]) => import("./algorithms").TimeSeriesPoint<number>[];
            finance: {
                annualizedVolatility: (points: readonly import("./algorithms").TimeSeriesPoint<number>[], periodsPerYear: number) => number;
                exponentialMovingAverage: (points: readonly import("./algorithms").TimeSeriesPoint<number>[], smoothingFactor?: number) => import("./algorithms").TimeSeriesPoint<number>[];
                maxDrawdown: (points: readonly import("./algorithms").TimeSeriesPoint<number>[]) => import("./algorithms").DrawdownPoint | null;
                returnsSeries: (points: readonly import("./algorithms").TimeSeriesPoint<number>[]) => import("./algorithms").TimeSeriesPoint<number>[];
            };
            movingAverageSeries: (points: readonly import("./algorithms").TimeSeriesPoint<number>[], size: number) => import("./algorithms").TimeSeriesPoint<number>[];
            resampleSeries: (points: readonly import("./algorithms").TimeSeriesPoint<number>[], intervalMs: number) => import("./algorithms").TimeSeriesPoint<number>[];
            sortTimeSeries: <Value>(points: readonly import("./algorithms").TimeSeriesPoint<Value>[]) => import("./algorithms").TimeSeriesPoint<Value>[];
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
};
export { hashingAlgorithms, sha256Hex, murmurHash3, deterministicStringify } from "./hashing";
export { validationAlgorithms, isEmail, isUrl, isUuid, isIsoDate, isIpAddress, assertNonNullish } from "./validation";
export { datetimeAlgorithms, toIsoString, fromIsoString, diffMs, addMs, toRelativeTime } from "./datetime";
export { resilienceAlgorithms, retryWithBackoff, withTimeout, createCircuitBreaker } from "./resilience";
export type { RetryOptions, CircuitBreakerOptions, CircuitBreaker } from "./resilience";
export * from "./arithmetic";
