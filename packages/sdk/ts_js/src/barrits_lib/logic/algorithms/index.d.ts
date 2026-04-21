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
export declare const algorithms: {
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
        breadthFirstSearch: <NodeId extends import("./graph").GraphNodeId>(edges: readonly import("./graph").GraphEdge<NodeId>[], startNode: NodeId) => NodeId[];
        buildAdjacencyList: <NodeId extends import("./graph").GraphNodeId>(edges: readonly import("./graph").GraphEdge<NodeId>[], options?: {
            readonly directed?: boolean;
        }) => Map<NodeId, import("./graph").GraphAdjacencyEntry<NodeId>[]>;
        detectDirectedCycle: <NodeId extends import("./graph").GraphNodeId>(edges: readonly import("./graph").GraphEdge<NodeId>[]) => NodeId[] | null;
        depthFirstSearch: <NodeId extends import("./graph").GraphNodeId>(edges: readonly import("./graph").GraphEdge<NodeId>[], startNode: NodeId) => NodeId[];
        dijkstraShortestPath: <NodeId extends import("./graph").GraphNodeId>(edges: readonly import("./graph").GraphEdge<NodeId>[], startNode: NodeId, targetNode: NodeId) => import("./graph").GraphPath<NodeId>;
        maxFlow: <NodeId extends import("./graph").GraphNodeId>(edges: readonly import("./graph").GraphEdge<NodeId>[], source: NodeId, sink: NodeId) => import("./graph").MaxFlowResult<NodeId>;
        minimumSpanningTree: <NodeId extends import("./graph").GraphNodeId>(edges: readonly import("./graph").GraphEdge<NodeId>[]) => import("./graph").MinimumSpanningTreeResult<NodeId>;
        topologicalSort: <NodeId extends import("./graph").GraphNodeId>(edges: readonly import("./graph").GraphEdge<NodeId>[]) => NodeId[];
    };
    search: {
        binarySearch: <Value>(values: readonly Value[], target: Value, compare?: import("./search").CompareFunction<Value>) => number;
        findSortedRange: <Value>(values: readonly Value[], target: Value, compare?: import("./search").CompareFunction<Value>) => import("./search").SortedRangeMatch;
        linearSearch: <Value>(values: readonly Value[], matcher: import("./search").SearchPredicate<Value> | Value) => number;
        lowerBound: <Value>(values: readonly Value[], target: Value, compare?: import("./search").CompareFunction<Value>) => number;
        upperBound: <Value>(values: readonly Value[], target: Value, compare?: import("./search").CompareFunction<Value>) => number;
    };
    selection: {
        paginate: <Value>(values: readonly Value[], options: import("./selection").PaginationOptions) => import("./selection").PaginatedResult<Value>;
        partitionBy: <Value>(values: readonly Value[], predicate: (value: Value, index: number, values: readonly Value[]) => boolean) => import("./selection").PartitionResult<Value>;
        rankBy: <Value>(values: readonly Value[], criteria: readonly import("./sort").OrderCriterion<Value>[]) => import("./selection").RankedValue<Value>[];
        topK: <Value>(values: readonly Value[], count: number, compare?: import("./search").CompareFunction<Value>, direction?: import(".").SortDirection) => Value[];
    };
    sort: {
        insertSorted: <Value>(values: readonly Value[], value: Value, compare?: import("./search").CompareFunction<Value>) => Value[];
        orderBy: <Value>(values: readonly Value[], criteria: readonly import("./sort").OrderCriterion<Value>[]) => Value[];
        quickSort: <Value>(values: readonly Value[], compare?: import("./search").CompareFunction<Value>) => Value[];
        stableSortBy: <Value, Result>(values: readonly Value[], rank: (value: Value) => Result, options?: {
            readonly direction?: import(".").SortDirection;
            readonly compare?: import("./search").CompareFunction<Result>;
        }) => Value[];
    };
    timeseries: {
        bucketByInterval: <Value>(points: readonly import("./timeseries").TimeSeriesPoint<Value>[], intervalMs: number) => import("./timeseries").TimeBucket<Value>[];
        detectTimeSeriesGaps: <Value>(points: readonly import("./timeseries").TimeSeriesPoint<Value>[], expectedIntervalMs: number) => import("./timeseries").TimeGap[];
        differenceSeries: (points: readonly import("./timeseries").TimeSeriesPoint<number>[]) => import("./timeseries").TimeSeriesPoint<number>[];
        finance: {
            annualizedVolatility: (points: readonly import("./timeseries").TimeSeriesPoint<number>[], periodsPerYear: number) => number;
            exponentialMovingAverage: (points: readonly import("./timeseries").TimeSeriesPoint<number>[], smoothingFactor?: number) => import("./timeseries").TimeSeriesPoint<number>[];
            maxDrawdown: (points: readonly import("./timeseries").TimeSeriesPoint<number>[]) => import("./timeseries").DrawdownPoint | null;
            returnsSeries: (points: readonly import("./timeseries").TimeSeriesPoint<number>[]) => import("./timeseries").TimeSeriesPoint<number>[];
        };
        movingAverageSeries: (points: readonly import("./timeseries").TimeSeriesPoint<number>[], size: number) => import("./timeseries").TimeSeriesPoint<number>[];
        resampleSeries: (points: readonly import("./timeseries").TimeSeriesPoint<number>[], intervalMs: number) => import("./timeseries").TimeSeriesPoint<number>[];
        sortTimeSeries: <Value>(points: readonly import("./timeseries").TimeSeriesPoint<Value>[]) => import("./timeseries").TimeSeriesPoint<Value>[];
    };
    window: {
        movingAverage: (values: readonly number[], size: number) => number[];
        rollingSum: (values: readonly number[], size: number) => number[];
        slidingWindow: <Value>(values: readonly Value[], size: number) => Value[][];
        windowDelta: (values: readonly number[], size: number) => number[];
    };
};
