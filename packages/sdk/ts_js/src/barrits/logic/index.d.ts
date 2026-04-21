import { aggregateAlgorithms, algorithms, averageBy, annualizedVolatility, binarySearch, breadthFirstSearch, buildAdjacencyList, bucketByInterval, chunk, collectionAlgorithms, depthFirstSearch, detectDirectedCycle, detectTimeSeriesGaps, differenceSeries, dijkstraShortestPath, exponentialMovingAverage, findSortedRange, graphAlgorithms, groupBy, histogramBy, indexBy, insertSorted, linearSearch, lowerBound, maxDrawdown, maxFlow, maxBy, minBy, minimumSpanningTree, movingAverage, movingAverageSeries, orderBy, paginate, partitionBy, quickSort, rankBy, resampleSeries, returnsSeries, rollingSum, searchAlgorithms, selectionAlgorithms, slidingWindow, sortAlgorithms, sortTimeSeries, stableSortBy, sumBy, timeSeriesAlgorithms, topK, topologicalSort, uniqueBy, upperBound, windowAlgorithms, windowDelta, arithmetic, restar, sumar } from "../../barrits_lib/logic";
export { arithmetic, restar, sumar };
export { aggregateAlgorithms, algorithms, averageBy, annualizedVolatility, binarySearch, breadthFirstSearch, buildAdjacencyList, bucketByInterval, chunk, collectionAlgorithms, depthFirstSearch, detectDirectedCycle, detectTimeSeriesGaps, differenceSeries, dijkstraShortestPath, exponentialMovingAverage, findSortedRange, groupBy, graphAlgorithms, histogramBy, indexBy, insertSorted, linearSearch, lowerBound, maxDrawdown, maxFlow, maxBy, minBy, minimumSpanningTree, movingAverage, movingAverageSeries, orderBy, windowAlgorithms, windowDelta, paginate, partitionBy, quickSort, rankBy, resampleSeries, returnsSeries, rollingSum, searchAlgorithms, selectionAlgorithms, slidingWindow, sortAlgorithms, sortTimeSeries, stableSortBy, sumBy, timeSeriesAlgorithms, topologicalSort, topK, uniqueBy, upperBound, };
/**
 * Core logic namespace exposed under `barrits.logic`.
 *
 * Includes arithmetic helpers and the full algorithm catalog reused by
 * runtime examples and tooling integrations.
 */
export declare const logic: {
    aggregateAlgorithms: {
        averageBy: <Value>(values: readonly Value[], project: (value: Value, index: number, values: readonly Value[]) => number) => number;
        histogramBy: <Value, Key extends string | number>(values: readonly Value[], selectKey: (value: Value, index: number, values: readonly Value[]) => Key) => Record<Key, number>;
        maxBy: <Value>(values: readonly Value[], project: (value: Value, index: number, values: readonly Value[]) => number) => Value | undefined;
        minBy: <Value>(values: readonly Value[], project: (value: Value, index: number, values: readonly Value[]) => number) => Value | undefined;
        sumBy: <Value>(values: readonly Value[], project: (value: Value, index: number, values: readonly Value[]) => number) => number;
    };
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
            breadthFirstSearch: <NodeId extends import("..").GraphNodeId>(edges: readonly import("..").GraphEdge<NodeId>[], startNode: NodeId) => NodeId[];
            buildAdjacencyList: <NodeId extends import("..").GraphNodeId>(edges: readonly import("..").GraphEdge<NodeId>[], options?: {
                readonly directed?: boolean;
            }) => Map<NodeId, import("..").GraphAdjacencyEntry<NodeId>[]>;
            detectDirectedCycle: <NodeId extends import("..").GraphNodeId>(edges: readonly import("..").GraphEdge<NodeId>[]) => NodeId[] | null;
            depthFirstSearch: <NodeId extends import("..").GraphNodeId>(edges: readonly import("..").GraphEdge<NodeId>[], startNode: NodeId) => NodeId[];
            dijkstraShortestPath: <NodeId extends import("..").GraphNodeId>(edges: readonly import("..").GraphEdge<NodeId>[], startNode: NodeId, targetNode: NodeId) => import("..").GraphPath<NodeId>;
            maxFlow: <NodeId extends import("..").GraphNodeId>(edges: readonly import("..").GraphEdge<NodeId>[], source: NodeId, sink: NodeId) => import("..").MaxFlowResult<NodeId>;
            minimumSpanningTree: <NodeId extends import("..").GraphNodeId>(edges: readonly import("..").GraphEdge<NodeId>[]) => import("..").MinimumSpanningTreeResult<NodeId>;
            topologicalSort: <NodeId extends import("..").GraphNodeId>(edges: readonly import("..").GraphEdge<NodeId>[]) => NodeId[];
        };
        search: {
            binarySearch: <Value>(values: readonly Value[], target: Value, compare?: import("..").CompareFunction<Value>) => number;
            findSortedRange: <Value>(values: readonly Value[], target: Value, compare?: import("..").CompareFunction<Value>) => import("..").SortedRangeMatch;
            linearSearch: <Value>(values: readonly Value[], matcher: import("..").SearchPredicate<Value> | Value) => number;
            lowerBound: <Value>(values: readonly Value[], target: Value, compare?: import("..").CompareFunction<Value>) => number;
            upperBound: <Value>(values: readonly Value[], target: Value, compare?: import("..").CompareFunction<Value>) => number;
        };
        selection: {
            paginate: <Value>(values: readonly Value[], options: import("..").PaginationOptions) => import("..").PaginatedResult<Value>;
            partitionBy: <Value>(values: readonly Value[], predicate: (value: Value, index: number, values: readonly Value[]) => boolean) => import("..").PartitionResult<Value>;
            rankBy: <Value>(values: readonly Value[], criteria: readonly import("..").OrderCriterion<Value>[]) => import("..").RankedValue<Value>[];
            topK: <Value>(values: readonly Value[], count: number, compare?: import("..").CompareFunction<Value>, direction?: import("..").SortDirection) => Value[];
        };
        sort: {
            insertSorted: <Value>(values: readonly Value[], value: Value, compare?: import("..").CompareFunction<Value>) => Value[];
            orderBy: <Value>(values: readonly Value[], criteria: readonly import("..").OrderCriterion<Value>[]) => Value[];
            quickSort: <Value>(values: readonly Value[], compare?: import("..").CompareFunction<Value>) => Value[];
            stableSortBy: <Value, Result>(values: readonly Value[], rank: (value: Value) => Result, options?: {
                readonly direction?: import("..").SortDirection;
                readonly compare?: import("..").CompareFunction<Result>;
            }) => Value[];
        };
        timeseries: {
            bucketByInterval: <Value>(points: readonly import("..").TimeSeriesPoint<Value>[], intervalMs: number) => import("..").TimeBucket<Value>[];
            detectTimeSeriesGaps: <Value>(points: readonly import("..").TimeSeriesPoint<Value>[], expectedIntervalMs: number) => import("..").TimeGap[];
            differenceSeries: (points: readonly import("..").TimeSeriesPoint<number>[]) => import("..").TimeSeriesPoint<number>[];
            finance: {
                annualizedVolatility: (points: readonly import("..").TimeSeriesPoint<number>[], periodsPerYear: number) => number;
                exponentialMovingAverage: (points: readonly import("..").TimeSeriesPoint<number>[], smoothingFactor?: number) => import("..").TimeSeriesPoint<number>[];
                maxDrawdown: (points: readonly import("..").TimeSeriesPoint<number>[]) => import("..").DrawdownPoint | null;
                returnsSeries: (points: readonly import("..").TimeSeriesPoint<number>[]) => import("..").TimeSeriesPoint<number>[];
            };
            movingAverageSeries: (points: readonly import("..").TimeSeriesPoint<number>[], size: number) => import("..").TimeSeriesPoint<number>[];
            resampleSeries: (points: readonly import("..").TimeSeriesPoint<number>[], intervalMs: number) => import("..").TimeSeriesPoint<number>[];
            sortTimeSeries: <Value>(points: readonly import("..").TimeSeriesPoint<Value>[]) => import("..").TimeSeriesPoint<Value>[];
        };
        window: {
            movingAverage: (values: readonly number[], size: number) => number[];
            rollingSum: (values: readonly number[], size: number) => number[];
            slidingWindow: <Value>(values: readonly Value[], size: number) => Value[][];
            windowDelta: (values: readonly number[], size: number) => number[];
        };
    };
    averageBy: <Value>(values: readonly Value[], project: (value: Value, index: number, values: readonly Value[]) => number) => number;
    annualizedVolatility: (points: readonly import("..").TimeSeriesPoint<number>[], periodsPerYear: number) => number;
    breadthFirstSearch: <NodeId extends import("..").GraphNodeId>(edges: readonly import("..").GraphEdge<NodeId>[], startNode: NodeId) => NodeId[];
    buildAdjacencyList: <NodeId extends import("..").GraphNodeId>(edges: readonly import("..").GraphEdge<NodeId>[], options?: {
        readonly directed?: boolean;
    }) => Map<NodeId, import("..").GraphAdjacencyEntry<NodeId>[]>;
    bucketByInterval: <Value>(points: readonly import("..").TimeSeriesPoint<Value>[], intervalMs: number) => import("..").TimeBucket<Value>[];
    maxBy: <Value>(values: readonly Value[], project: (value: Value, index: number, values: readonly Value[]) => number) => Value | undefined;
    minBy: <Value>(values: readonly Value[], project: (value: Value, index: number, values: readonly Value[]) => number) => Value | undefined;
    movingAverage: (values: readonly number[], size: number) => number[];
    movingAverageSeries: (points: readonly import("..").TimeSeriesPoint<number>[], size: number) => import("..").TimeSeriesPoint<number>[];
    arithmetic: {
        sumar: (left: import("..").NumberInput, right: import("..").NumberInput) => number;
        restar: (left: import("..").NumberInput, right: import("..").NumberInput) => number;
    };
    binarySearch: <Value>(values: readonly Value[], target: Value, compare?: import("..").CompareFunction<Value>) => number;
    chunk: <Value>(values: readonly Value[], size: number) => Value[][];
    collectionAlgorithms: {
        chunk: <Value>(values: readonly Value[], size: number) => Value[][];
        groupBy: <Value, Key>(values: readonly Value[], selectKey: (value: Value, index: number, values: readonly Value[]) => Key) => Map<Key, Value[]>;
        indexBy: <Value, Key>(values: readonly Value[], selectKey: (value: Value, index: number, values: readonly Value[]) => Key) => Map<Key, Value>;
        uniqueBy: <Value, Key>(values: readonly Value[], selectKey: (value: Value, index: number, values: readonly Value[]) => Key) => Value[];
    };
    depthFirstSearch: <NodeId extends import("..").GraphNodeId>(edges: readonly import("..").GraphEdge<NodeId>[], startNode: NodeId) => NodeId[];
    detectDirectedCycle: <NodeId extends import("..").GraphNodeId>(edges: readonly import("..").GraphEdge<NodeId>[]) => NodeId[] | null;
    detectTimeSeriesGaps: <Value>(points: readonly import("..").TimeSeriesPoint<Value>[], expectedIntervalMs: number) => import("..").TimeGap[];
    differenceSeries: (points: readonly import("..").TimeSeriesPoint<number>[]) => import("..").TimeSeriesPoint<number>[];
    dijkstraShortestPath: <NodeId extends import("..").GraphNodeId>(edges: readonly import("..").GraphEdge<NodeId>[], startNode: NodeId, targetNode: NodeId) => import("..").GraphPath<NodeId>;
    exponentialMovingAverage: (points: readonly import("..").TimeSeriesPoint<number>[], smoothingFactor?: number) => import("..").TimeSeriesPoint<number>[];
    findSortedRange: <Value>(values: readonly Value[], target: Value, compare?: import("..").CompareFunction<Value>) => import("..").SortedRangeMatch;
    graphAlgorithms: {
        breadthFirstSearch: <NodeId extends import("..").GraphNodeId>(edges: readonly import("..").GraphEdge<NodeId>[], startNode: NodeId) => NodeId[];
        buildAdjacencyList: <NodeId extends import("..").GraphNodeId>(edges: readonly import("..").GraphEdge<NodeId>[], options?: {
            readonly directed?: boolean;
        }) => Map<NodeId, import("..").GraphAdjacencyEntry<NodeId>[]>;
        detectDirectedCycle: <NodeId extends import("..").GraphNodeId>(edges: readonly import("..").GraphEdge<NodeId>[]) => NodeId[] | null;
        depthFirstSearch: <NodeId extends import("..").GraphNodeId>(edges: readonly import("..").GraphEdge<NodeId>[], startNode: NodeId) => NodeId[];
        dijkstraShortestPath: <NodeId extends import("..").GraphNodeId>(edges: readonly import("..").GraphEdge<NodeId>[], startNode: NodeId, targetNode: NodeId) => import("..").GraphPath<NodeId>;
        maxFlow: <NodeId extends import("..").GraphNodeId>(edges: readonly import("..").GraphEdge<NodeId>[], source: NodeId, sink: NodeId) => import("..").MaxFlowResult<NodeId>;
        minimumSpanningTree: <NodeId extends import("..").GraphNodeId>(edges: readonly import("..").GraphEdge<NodeId>[]) => import("..").MinimumSpanningTreeResult<NodeId>;
        topologicalSort: <NodeId extends import("..").GraphNodeId>(edges: readonly import("..").GraphEdge<NodeId>[]) => NodeId[];
    };
    histogramBy: <Value, Key extends string | number>(values: readonly Value[], selectKey: (value: Value, index: number, values: readonly Value[]) => Key) => Record<Key, number>;
    maxDrawdown: (points: readonly import("..").TimeSeriesPoint<number>[]) => import("..").DrawdownPoint | null;
    maxFlow: <NodeId extends import("..").GraphNodeId>(edges: readonly import("..").GraphEdge<NodeId>[], source: NodeId, sink: NodeId) => import("..").MaxFlowResult<NodeId>;
    minimumSpanningTree: <NodeId extends import("..").GraphNodeId>(edges: readonly import("..").GraphEdge<NodeId>[]) => import("..").MinimumSpanningTreeResult<NodeId>;
    resampleSeries: (points: readonly import("..").TimeSeriesPoint<number>[], intervalMs: number) => import("..").TimeSeriesPoint<number>[];
    returnsSeries: (points: readonly import("..").TimeSeriesPoint<number>[]) => import("..").TimeSeriesPoint<number>[];
    rollingSum: (values: readonly number[], size: number) => number[];
    groupBy: <Value, Key>(values: readonly Value[], selectKey: (value: Value, index: number, values: readonly Value[]) => Key) => Map<Key, Value[]>;
    indexBy: <Value, Key>(values: readonly Value[], selectKey: (value: Value, index: number, values: readonly Value[]) => Key) => Map<Key, Value>;
    insertSorted: <Value>(values: readonly Value[], value: Value, compare?: import("..").CompareFunction<Value>) => Value[];
    linearSearch: <Value>(values: readonly Value[], matcher: import("..").SearchPredicate<Value> | Value) => number;
    slidingWindow: <Value>(values: readonly Value[], size: number) => Value[][];
    sortTimeSeries: <Value>(points: readonly import("..").TimeSeriesPoint<Value>[]) => import("..").TimeSeriesPoint<Value>[];
    lowerBound: <Value>(values: readonly Value[], target: Value, compare?: import("..").CompareFunction<Value>) => number;
    orderBy: <Value>(values: readonly Value[], criteria: readonly import("..").OrderCriterion<Value>[]) => Value[];
    sumBy: <Value>(values: readonly Value[], project: (value: Value, index: number, values: readonly Value[]) => number) => number;
    timeSeriesAlgorithms: {
        bucketByInterval: <Value>(points: readonly import("..").TimeSeriesPoint<Value>[], intervalMs: number) => import("..").TimeBucket<Value>[];
        detectTimeSeriesGaps: <Value>(points: readonly import("..").TimeSeriesPoint<Value>[], expectedIntervalMs: number) => import("..").TimeGap[];
        differenceSeries: (points: readonly import("..").TimeSeriesPoint<number>[]) => import("..").TimeSeriesPoint<number>[];
        finance: {
            annualizedVolatility: (points: readonly import("..").TimeSeriesPoint<number>[], periodsPerYear: number) => number;
            exponentialMovingAverage: (points: readonly import("..").TimeSeriesPoint<number>[], smoothingFactor?: number) => import("..").TimeSeriesPoint<number>[];
            maxDrawdown: (points: readonly import("..").TimeSeriesPoint<number>[]) => import("..").DrawdownPoint | null;
            returnsSeries: (points: readonly import("..").TimeSeriesPoint<number>[]) => import("..").TimeSeriesPoint<number>[];
        };
        movingAverageSeries: (points: readonly import("..").TimeSeriesPoint<number>[], size: number) => import("..").TimeSeriesPoint<number>[];
        resampleSeries: (points: readonly import("..").TimeSeriesPoint<number>[], intervalMs: number) => import("..").TimeSeriesPoint<number>[];
        sortTimeSeries: <Value>(points: readonly import("..").TimeSeriesPoint<Value>[]) => import("..").TimeSeriesPoint<Value>[];
    };
    topologicalSort: <NodeId extends import("..").GraphNodeId>(edges: readonly import("..").GraphEdge<NodeId>[]) => NodeId[];
    paginate: <Value>(values: readonly Value[], options: import("..").PaginationOptions) => import("..").PaginatedResult<Value>;
    partitionBy: <Value>(values: readonly Value[], predicate: (value: Value, index: number, values: readonly Value[]) => boolean) => import("..").PartitionResult<Value>;
    quickSort: <Value>(values: readonly Value[], compare?: import("..").CompareFunction<Value>) => Value[];
    windowAlgorithms: {
        movingAverage: (values: readonly number[], size: number) => number[];
        rollingSum: (values: readonly number[], size: number) => number[];
        slidingWindow: <Value>(values: readonly Value[], size: number) => Value[][];
        windowDelta: (values: readonly number[], size: number) => number[];
    };
    windowDelta: (values: readonly number[], size: number) => number[];
    rankBy: <Value>(values: readonly Value[], criteria: readonly import("..").OrderCriterion<Value>[]) => import("..").RankedValue<Value>[];
    sumar: (left: import("..").NumberInput, right: import("..").NumberInput) => number;
    restar: (left: import("..").NumberInput, right: import("..").NumberInput) => number;
    searchAlgorithms: {
        binarySearch: <Value>(values: readonly Value[], target: Value, compare?: import("..").CompareFunction<Value>) => number;
        findSortedRange: <Value>(values: readonly Value[], target: Value, compare?: import("..").CompareFunction<Value>) => import("..").SortedRangeMatch;
        linearSearch: <Value>(values: readonly Value[], matcher: import("..").SearchPredicate<Value> | Value) => number;
        lowerBound: <Value>(values: readonly Value[], target: Value, compare?: import("..").CompareFunction<Value>) => number;
        upperBound: <Value>(values: readonly Value[], target: Value, compare?: import("..").CompareFunction<Value>) => number;
    };
    selectionAlgorithms: {
        paginate: <Value>(values: readonly Value[], options: import("..").PaginationOptions) => import("..").PaginatedResult<Value>;
        partitionBy: <Value>(values: readonly Value[], predicate: (value: Value, index: number, values: readonly Value[]) => boolean) => import("..").PartitionResult<Value>;
        rankBy: <Value>(values: readonly Value[], criteria: readonly import("..").OrderCriterion<Value>[]) => import("..").RankedValue<Value>[];
        topK: <Value>(values: readonly Value[], count: number, compare?: import("..").CompareFunction<Value>, direction?: import("..").SortDirection) => Value[];
    };
    sortAlgorithms: {
        insertSorted: <Value>(values: readonly Value[], value: Value, compare?: import("..").CompareFunction<Value>) => Value[];
        orderBy: <Value>(values: readonly Value[], criteria: readonly import("..").OrderCriterion<Value>[]) => Value[];
        quickSort: <Value>(values: readonly Value[], compare?: import("..").CompareFunction<Value>) => Value[];
        stableSortBy: <Value, Result>(values: readonly Value[], rank: (value: Value) => Result, options?: {
            readonly direction?: import("..").SortDirection;
            readonly compare?: import("..").CompareFunction<Result>;
        }) => Value[];
    };
    stableSortBy: <Value, Result>(values: readonly Value[], rank: (value: Value) => Result, options?: {
        readonly direction?: import("..").SortDirection;
        readonly compare?: import("..").CompareFunction<Result>;
    }) => Value[];
    topK: <Value>(values: readonly Value[], count: number, compare?: import("..").CompareFunction<Value>, direction?: import("..").SortDirection) => Value[];
    uniqueBy: <Value, Key>(values: readonly Value[], selectKey: (value: Value, index: number, values: readonly Value[]) => Key) => Value[];
    upperBound: <Value>(values: readonly Value[], target: Value, compare?: import("..").CompareFunction<Value>) => number;
};
