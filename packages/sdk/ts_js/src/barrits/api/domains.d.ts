/**
 * [EN] Primary Barrits domain namespace exported to consumers.
 * Features a fractal orchestration structure containing logic, routes, and traits.
 *
 * [ES] Espacio de nombres primario de Barrits exportado a los consumidores.
 * Presenta una estructura de orquestación fractal que contiene lógica, rutas y traits.
 */
export declare const barrits: {
    /** [EN] Algorithm and logic libraries. [ES] Librerías de algoritmos y lógica. */
    logic: {
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
                breadthFirstSearch: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[], startNode: NodeId) => NodeId[];
                buildAdjacencyList: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[], options?: {
                    readonly directed?: boolean;
                }) => Map<NodeId, import("./flat").GraphAdjacencyEntry<NodeId>[]>;
                detectDirectedCycle: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[]) => NodeId[] | null;
                depthFirstSearch: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[], startNode: NodeId) => NodeId[];
                dijkstraShortestPath: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[], startNode: NodeId, targetNode: NodeId) => import("./flat").GraphPath<NodeId>;
                maxFlow: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[], source: NodeId, sink: NodeId) => import("./flat").MaxFlowResult<NodeId>;
                minimumSpanningTree: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[]) => import("./flat").MinimumSpanningTreeResult<NodeId>;
                topologicalSort: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[]) => NodeId[];
            };
            search: {
                binarySearch: <Value>(values: readonly Value[], target: Value, compare?: import("./flat").CompareFunction<Value>) => number;
                findSortedRange: <Value>(values: readonly Value[], target: Value, compare?: import("./flat").CompareFunction<Value>) => import("./flat").SortedRangeMatch;
                linearSearch: <Value>(values: readonly Value[], matcher: import("./flat").SearchPredicate<Value> | Value) => number;
                lowerBound: <Value>(values: readonly Value[], target: Value, compare?: import("./flat").CompareFunction<Value>) => number;
                upperBound: <Value>(values: readonly Value[], target: Value, compare?: import("./flat").CompareFunction<Value>) => number;
            };
            selection: {
                paginate: <Value>(values: readonly Value[], options: import("./flat").PaginationOptions) => import("./flat").PaginatedResult<Value>;
                partitionBy: <Value>(values: readonly Value[], predicate: (value: Value, index: number, values: readonly Value[]) => boolean) => import("./flat").PartitionResult<Value>;
                rankBy: <Value>(values: readonly Value[], criteria: readonly import("./flat").OrderCriterion<Value>[]) => import("./flat").RankedValue<Value>[];
                topK: <Value>(values: readonly Value[], k: number, compare?: import("./flat").CompareFunction<Value>, direction?: import("./flat").SortDirection) => Value[];
            };
            sort: {
                insertSorted: <Value>(values: readonly Value[], value: Value, compare?: import("./flat").CompareFunction<Value>) => Value[];
                orderBy: <Value>(values: readonly Value[], criteria: readonly import("./flat").OrderCriterion<Value>[]) => Value[];
                quickSort: <Value>(values: readonly Value[], compare?: import("./flat").CompareFunction<Value>) => Value[];
                stableSortBy: <Value, Result>(values: readonly Value[], rank: (value: Value) => Result, options?: {
                    readonly direction?: import("./flat").SortDirection;
                    readonly compare?: import("./flat").CompareFunction<Result>;
                }) => Value[];
            };
            timeseries: {
                bucketByInterval: <Value>(points: readonly import("./flat").TimeSeriesPoint<Value>[], intervalMs: number) => import("./flat").TimeBucket<Value>[];
                detectTimeSeriesGaps: <Value>(points: readonly import("./flat").TimeSeriesPoint<Value>[], expectedIntervalMs: number) => import("./flat").TimeGap[];
                differenceSeries: (points: readonly import("./flat").TimeSeriesPoint<number>[]) => import("./flat").TimeSeriesPoint<number>[];
                finance: {
                    annualizedVolatility: (points: readonly import("./flat").TimeSeriesPoint<number>[], periodsPerYear: number) => number;
                    exponentialMovingAverage: (points: readonly import("./flat").TimeSeriesPoint<number>[], smoothingFactor?: number) => import("./flat").TimeSeriesPoint<number>[];
                    maxDrawdown: (points: readonly import("./flat").TimeSeriesPoint<number>[]) => import("./flat").DrawdownPoint | null;
                    returnsSeries: (points: readonly import("./flat").TimeSeriesPoint<number>[]) => import("./flat").TimeSeriesPoint<number>[];
                };
                movingAverageSeries: (points: readonly import("./flat").TimeSeriesPoint<number>[], size: number) => import("./flat").TimeSeriesPoint<number>[];
                resampleSeries: (points: readonly import("./flat").TimeSeriesPoint<number>[], intervalMs: number) => import("./flat").TimeSeriesPoint<number>[];
                sortTimeSeries: <Value>(points: readonly import("./flat").TimeSeriesPoint<Value>[]) => import("./flat").TimeSeriesPoint<Value>[];
            };
            window: {
                movingAverage: (values: readonly number[], size: number) => number[];
                rollingSum: (values: readonly number[], size: number) => number[];
                slidingWindow: <Value>(values: readonly Value[], size: number) => Value[][];
                windowDelta: (values: readonly number[], size: number) => number[];
            };
        };
        averageBy: <Value>(values: readonly Value[], project: (value: Value, index: number, values: readonly Value[]) => number) => number;
        annualizedVolatility: (points: readonly import("./flat").TimeSeriesPoint<number>[], periodsPerYear: number) => number;
        breadthFirstSearch: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[], startNode: NodeId) => NodeId[];
        buildAdjacencyList: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[], options?: {
            readonly directed?: boolean;
        }) => Map<NodeId, import("./flat").GraphAdjacencyEntry<NodeId>[]>;
        bucketByInterval: <Value>(points: readonly import("./flat").TimeSeriesPoint<Value>[], intervalMs: number) => import("./flat").TimeBucket<Value>[];
        maxBy: <Value>(values: readonly Value[], project: (value: Value, index: number, values: readonly Value[]) => number) => Value | undefined;
        minBy: <Value>(values: readonly Value[], project: (value: Value, index: number, values: readonly Value[]) => number) => Value | undefined;
        movingAverage: (values: readonly number[], size: number) => number[];
        movingAverageSeries: (points: readonly import("./flat").TimeSeriesPoint<number>[], size: number) => import("./flat").TimeSeriesPoint<number>[];
        arithmetic: {
            sumar: (left: import("./flat").NumberInput, right: import("./flat").NumberInput) => number;
            restar: (left: import("./flat").NumberInput, right: import("./flat").NumberInput) => number;
        };
        binarySearch: <Value>(values: readonly Value[], target: Value, compare?: import("./flat").CompareFunction<Value>) => number;
        chunk: <Value>(values: readonly Value[], size: number) => Value[][];
        collectionAlgorithms: {
            chunk: <Value>(values: readonly Value[], size: number) => Value[][];
            groupBy: <Value, Key>(values: readonly Value[], selectKey: (value: Value, index: number, values: readonly Value[]) => Key) => Map<Key, Value[]>;
            indexBy: <Value, Key>(values: readonly Value[], selectKey: (value: Value, index: number, values: readonly Value[]) => Key) => Map<Key, Value>;
            uniqueBy: <Value, Key>(values: readonly Value[], selectKey: (value: Value, index: number, values: readonly Value[]) => Key) => Value[];
        };
        depthFirstSearch: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[], startNode: NodeId) => NodeId[];
        detectDirectedCycle: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[]) => NodeId[] | null;
        detectTimeSeriesGaps: <Value>(points: readonly import("./flat").TimeSeriesPoint<Value>[], expectedIntervalMs: number) => import("./flat").TimeGap[];
        differenceSeries: (points: readonly import("./flat").TimeSeriesPoint<number>[]) => import("./flat").TimeSeriesPoint<number>[];
        dijkstraShortestPath: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[], startNode: NodeId, targetNode: NodeId) => import("./flat").GraphPath<NodeId>;
        exponentialMovingAverage: (points: readonly import("./flat").TimeSeriesPoint<number>[], smoothingFactor?: number) => import("./flat").TimeSeriesPoint<number>[];
        findSortedRange: <Value>(values: readonly Value[], target: Value, compare?: import("./flat").CompareFunction<Value>) => import("./flat").SortedRangeMatch;
        graphAlgorithms: {
            breadthFirstSearch: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[], startNode: NodeId) => NodeId[];
            buildAdjacencyList: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[], options?: {
                readonly directed?: boolean;
            }) => Map<NodeId, import("./flat").GraphAdjacencyEntry<NodeId>[]>;
            detectDirectedCycle: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[]) => NodeId[] | null;
            depthFirstSearch: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[], startNode: NodeId) => NodeId[];
            dijkstraShortestPath: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[], startNode: NodeId, targetNode: NodeId) => import("./flat").GraphPath<NodeId>;
            maxFlow: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[], source: NodeId, sink: NodeId) => import("./flat").MaxFlowResult<NodeId>;
            minimumSpanningTree: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[]) => import("./flat").MinimumSpanningTreeResult<NodeId>;
            topologicalSort: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[]) => NodeId[];
        };
        histogramBy: <Value, Key extends string | number>(values: readonly Value[], selectKey: (value: Value, index: number, values: readonly Value[]) => Key) => Record<Key, number>;
        maxDrawdown: (points: readonly import("./flat").TimeSeriesPoint<number>[]) => import("./flat").DrawdownPoint | null;
        maxFlow: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[], source: NodeId, sink: NodeId) => import("./flat").MaxFlowResult<NodeId>;
        minimumSpanningTree: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[]) => import("./flat").MinimumSpanningTreeResult<NodeId>;
        resampleSeries: (points: readonly import("./flat").TimeSeriesPoint<number>[], intervalMs: number) => import("./flat").TimeSeriesPoint<number>[];
        returnsSeries: (points: readonly import("./flat").TimeSeriesPoint<number>[]) => import("./flat").TimeSeriesPoint<number>[];
        rollingSum: (values: readonly number[], size: number) => number[];
        groupBy: <Value, Key>(values: readonly Value[], selectKey: (value: Value, index: number, values: readonly Value[]) => Key) => Map<Key, Value[]>;
        indexBy: <Value, Key>(values: readonly Value[], selectKey: (value: Value, index: number, values: readonly Value[]) => Key) => Map<Key, Value>;
        insertSorted: <Value>(values: readonly Value[], value: Value, compare?: import("./flat").CompareFunction<Value>) => Value[];
        linearSearch: <Value>(values: readonly Value[], matcher: import("./flat").SearchPredicate<Value> | Value) => number;
        slidingWindow: <Value>(values: readonly Value[], size: number) => Value[][];
        sortTimeSeries: <Value>(points: readonly import("./flat").TimeSeriesPoint<Value>[]) => import("./flat").TimeSeriesPoint<Value>[];
        lowerBound: <Value>(values: readonly Value[], target: Value, compare?: import("./flat").CompareFunction<Value>) => number;
        orderBy: <Value>(values: readonly Value[], criteria: readonly import("./flat").OrderCriterion<Value>[]) => Value[];
        sumBy: <Value>(values: readonly Value[], project: (value: Value, index: number, values: readonly Value[]) => number) => number;
        timeSeriesAlgorithms: {
            bucketByInterval: <Value>(points: readonly import("./flat").TimeSeriesPoint<Value>[], intervalMs: number) => import("./flat").TimeBucket<Value>[];
            detectTimeSeriesGaps: <Value>(points: readonly import("./flat").TimeSeriesPoint<Value>[], expectedIntervalMs: number) => import("./flat").TimeGap[];
            differenceSeries: (points: readonly import("./flat").TimeSeriesPoint<number>[]) => import("./flat").TimeSeriesPoint<number>[];
            finance: {
                annualizedVolatility: (points: readonly import("./flat").TimeSeriesPoint<number>[], periodsPerYear: number) => number;
                exponentialMovingAverage: (points: readonly import("./flat").TimeSeriesPoint<number>[], smoothingFactor?: number) => import("./flat").TimeSeriesPoint<number>[];
                maxDrawdown: (points: readonly import("./flat").TimeSeriesPoint<number>[]) => import("./flat").DrawdownPoint | null;
                returnsSeries: (points: readonly import("./flat").TimeSeriesPoint<number>[]) => import("./flat").TimeSeriesPoint<number>[];
            };
            movingAverageSeries: (points: readonly import("./flat").TimeSeriesPoint<number>[], size: number) => import("./flat").TimeSeriesPoint<number>[];
            resampleSeries: (points: readonly import("./flat").TimeSeriesPoint<number>[], intervalMs: number) => import("./flat").TimeSeriesPoint<number>[];
            sortTimeSeries: <Value>(points: readonly import("./flat").TimeSeriesPoint<Value>[]) => import("./flat").TimeSeriesPoint<Value>[];
        };
        topologicalSort: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[]) => NodeId[];
        paginate: <Value>(values: readonly Value[], options: import("./flat").PaginationOptions) => import("./flat").PaginatedResult<Value>;
        partitionBy: <Value>(values: readonly Value[], predicate: (value: Value, index: number, values: readonly Value[]) => boolean) => import("./flat").PartitionResult<Value>;
        quickSort: <Value>(values: readonly Value[], compare?: import("./flat").CompareFunction<Value>) => Value[];
        windowAlgorithms: {
            movingAverage: (values: readonly number[], size: number) => number[];
            rollingSum: (values: readonly number[], size: number) => number[];
            slidingWindow: <Value>(values: readonly Value[], size: number) => Value[][];
            windowDelta: (values: readonly number[], size: number) => number[];
        };
        windowDelta: (values: readonly number[], size: number) => number[];
        rankBy: <Value>(values: readonly Value[], criteria: readonly import("./flat").OrderCriterion<Value>[]) => import("./flat").RankedValue<Value>[];
        sumar: (left: import("./flat").NumberInput, right: import("./flat").NumberInput) => number;
        restar: (left: import("./flat").NumberInput, right: import("./flat").NumberInput) => number;
        searchAlgorithms: {
            binarySearch: <Value>(values: readonly Value[], target: Value, compare?: import("./flat").CompareFunction<Value>) => number;
            findSortedRange: <Value>(values: readonly Value[], target: Value, compare?: import("./flat").CompareFunction<Value>) => import("./flat").SortedRangeMatch;
            linearSearch: <Value>(values: readonly Value[], matcher: import("./flat").SearchPredicate<Value> | Value) => number;
            lowerBound: <Value>(values: readonly Value[], target: Value, compare?: import("./flat").CompareFunction<Value>) => number;
            upperBound: <Value>(values: readonly Value[], target: Value, compare?: import("./flat").CompareFunction<Value>) => number;
        };
        selectionAlgorithms: {
            paginate: <Value>(values: readonly Value[], options: import("./flat").PaginationOptions) => import("./flat").PaginatedResult<Value>;
            partitionBy: <Value>(values: readonly Value[], predicate: (value: Value, index: number, values: readonly Value[]) => boolean) => import("./flat").PartitionResult<Value>;
            rankBy: <Value>(values: readonly Value[], criteria: readonly import("./flat").OrderCriterion<Value>[]) => import("./flat").RankedValue<Value>[];
            topK: <Value>(values: readonly Value[], k: number, compare?: import("./flat").CompareFunction<Value>, direction?: import("./flat").SortDirection) => Value[];
        };
        sortAlgorithms: {
            insertSorted: <Value>(values: readonly Value[], value: Value, compare?: import("./flat").CompareFunction<Value>) => Value[];
            orderBy: <Value>(values: readonly Value[], criteria: readonly import("./flat").OrderCriterion<Value>[]) => Value[];
            quickSort: <Value>(values: readonly Value[], compare?: import("./flat").CompareFunction<Value>) => Value[];
            stableSortBy: <Value, Result>(values: readonly Value[], rank: (value: Value) => Result, options?: {
                readonly direction?: import("./flat").SortDirection;
                readonly compare?: import("./flat").CompareFunction<Result>;
            }) => Value[];
        };
        stableSortBy: <Value, Result>(values: readonly Value[], rank: (value: Value) => Result, options?: {
            readonly direction?: import("./flat").SortDirection;
            readonly compare?: import("./flat").CompareFunction<Result>;
        }) => Value[];
        topK: <Value>(values: readonly Value[], k: number, compare?: import("./flat").CompareFunction<Value>, direction?: import("./flat").SortDirection) => Value[];
        uniqueBy: <Value, Key>(values: readonly Value[], selectKey: (value: Value, index: number, values: readonly Value[]) => Key) => Value[];
        upperBound: <Value>(values: readonly Value[], target: Value, compare?: import("./flat").CompareFunction<Value>) => number;
    };
    /** [EN] Path routing and parsing. [ES] Enrutamiento y parseo de rutas. */
    routes: {
        path: {
            buildPath: (...segments: string[]) => string;
            parsePath: (value: string) => import("./flat").PathParts;
        };
        buildPath: (...segments: string[]) => string;
        parsePath: (value: string) => import("./flat").PathParts;
    };
    /** [EN] Trait composition engine. [ES] Motor de composición de traits. */
    traits: {
        compose: {
            mergeTraits: <TLeft extends object, TRight extends object>(left: TLeft, right: TRight, options?: import("../traits/compose/merge").MergeTraitsOptions) => TLeft & TRight;
            composePipeline: <TValue>(initialValue: TValue, ...steps: Array<import("./flat").UnaryFunction<TValue, TValue>>) => TValue;
        };
        composePipeline: <TValue>(initialValue: TValue, ...steps: Array<import("./flat").UnaryFunction<TValue, TValue>>) => TValue;
        composeTraitDescriptors: <TState extends object = Record<string, never>, const TDescriptors extends readonly {
            readonly name: string;
            readonly summary?: string;
            readonly requires: readonly string[];
            readonly conflicts: readonly string[];
            readonly state: readonly string[];
            readonly consumes: readonly string[];
            readonly provides: readonly string[];
            readonly tags: readonly string[];
            readonly runtimes: readonly string[];
            readonly create: (context: import("./flat").TraitDescriptorContext<any, any, string>) => any;
        }[] = readonly {
            readonly name: string;
            readonly summary?: string;
            readonly requires: readonly string[];
            readonly conflicts: readonly string[];
            readonly state: readonly string[];
            readonly consumes: readonly string[];
            readonly provides: readonly string[];
            readonly tags: readonly string[];
            readonly runtimes: readonly string[];
            readonly create: (context: import("./flat").TraitDescriptorContext<any, any, string>) => any;
        }[]>(descriptors: TDescriptors, options?: import("./flat").ComposeTraitDescriptorsOptions<TState>) => import("./flat").ComposedTraitDescriptorsResult<TState, (((TDescriptors[number] extends infer T ? T extends TDescriptors[number] ? T extends import("./flat").TraitDescriptor<string, object, infer TProvides extends object> ? TProvides : never : never : never) extends infer T_1 ? T_1 extends (TDescriptors[number] extends infer T_2 ? T_2 extends TDescriptors[number] ? T_2 extends import("./flat").TraitDescriptor<string, object, infer TProvides extends object> ? TProvides : never : never : never) ? T_1 extends unknown ? (value: T_1) => void : never : never : never) extends (value: infer TIntersection) => void ? TIntersection : never) extends object ? object & (((TDescriptors[number] extends infer T_3 ? T_3 extends TDescriptors[number] ? T_3 extends import("./flat").TraitDescriptor<string, object, infer TProvides extends object> ? TProvides : never : never : never) extends infer T_4 ? T_4 extends (TDescriptors[number] extends infer T_5 ? T_5 extends TDescriptors[number] ? T_5 extends import("./flat").TraitDescriptor<string, object, infer TProvides extends object> ? TProvides : never : never : never) ? T_4 extends unknown ? (value: T_4) => void : never : never : never) extends (value: infer TIntersection) => void ? TIntersection : never) : Record<string, never>>;
        createTraitDescriptor: <const TName extends string, TState extends object, TProvides extends object>(descriptor: import("./flat").TraitDescriptorInput<TName, TState, TProvides>) => import("./flat").TraitDescriptor<TName, TState, TProvides>;
        createTraitDescriptorFromJsDoc: <const TName extends string = string, TState extends object = Record<string, never>, TProvides extends object = Record<string, never>>(jsDoc: string, descriptor: import("./flat").TraitDescriptorFromJsDocInput<TName, TState, TProvides>) => import("./flat").TraitDescriptor<TName, TState, TProvides>;
        mergeTraits: <TLeft extends object, TRight extends object>(left: TLeft, right: TRight, options?: import("../traits/compose/merge").MergeTraitsOptions) => TLeft & TRight;
        parseTraitDescriptorJsDoc: (jsDoc: string) => import("./flat").TraitDescriptorJsDocMetadata;
    };
};
/**
 * [EN] Short alias of the Barrits domain namespace (brt).
 * [ES] Alias corto del espacio de nombres de Barrits (brt).
 */
export declare const brt: {
    /** [EN] Algorithm and logic libraries. [ES] Librerías de algoritmos y lógica. */
    logic: {
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
                breadthFirstSearch: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[], startNode: NodeId) => NodeId[];
                buildAdjacencyList: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[], options?: {
                    readonly directed?: boolean;
                }) => Map<NodeId, import("./flat").GraphAdjacencyEntry<NodeId>[]>;
                detectDirectedCycle: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[]) => NodeId[] | null;
                depthFirstSearch: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[], startNode: NodeId) => NodeId[];
                dijkstraShortestPath: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[], startNode: NodeId, targetNode: NodeId) => import("./flat").GraphPath<NodeId>;
                maxFlow: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[], source: NodeId, sink: NodeId) => import("./flat").MaxFlowResult<NodeId>;
                minimumSpanningTree: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[]) => import("./flat").MinimumSpanningTreeResult<NodeId>;
                topologicalSort: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[]) => NodeId[];
            };
            search: {
                binarySearch: <Value>(values: readonly Value[], target: Value, compare?: import("./flat").CompareFunction<Value>) => number;
                findSortedRange: <Value>(values: readonly Value[], target: Value, compare?: import("./flat").CompareFunction<Value>) => import("./flat").SortedRangeMatch;
                linearSearch: <Value>(values: readonly Value[], matcher: import("./flat").SearchPredicate<Value> | Value) => number;
                lowerBound: <Value>(values: readonly Value[], target: Value, compare?: import("./flat").CompareFunction<Value>) => number;
                upperBound: <Value>(values: readonly Value[], target: Value, compare?: import("./flat").CompareFunction<Value>) => number;
            };
            selection: {
                paginate: <Value>(values: readonly Value[], options: import("./flat").PaginationOptions) => import("./flat").PaginatedResult<Value>;
                partitionBy: <Value>(values: readonly Value[], predicate: (value: Value, index: number, values: readonly Value[]) => boolean) => import("./flat").PartitionResult<Value>;
                rankBy: <Value>(values: readonly Value[], criteria: readonly import("./flat").OrderCriterion<Value>[]) => import("./flat").RankedValue<Value>[];
                topK: <Value>(values: readonly Value[], k: number, compare?: import("./flat").CompareFunction<Value>, direction?: import("./flat").SortDirection) => Value[];
            };
            sort: {
                insertSorted: <Value>(values: readonly Value[], value: Value, compare?: import("./flat").CompareFunction<Value>) => Value[];
                orderBy: <Value>(values: readonly Value[], criteria: readonly import("./flat").OrderCriterion<Value>[]) => Value[];
                quickSort: <Value>(values: readonly Value[], compare?: import("./flat").CompareFunction<Value>) => Value[];
                stableSortBy: <Value, Result>(values: readonly Value[], rank: (value: Value) => Result, options?: {
                    readonly direction?: import("./flat").SortDirection;
                    readonly compare?: import("./flat").CompareFunction<Result>;
                }) => Value[];
            };
            timeseries: {
                bucketByInterval: <Value>(points: readonly import("./flat").TimeSeriesPoint<Value>[], intervalMs: number) => import("./flat").TimeBucket<Value>[];
                detectTimeSeriesGaps: <Value>(points: readonly import("./flat").TimeSeriesPoint<Value>[], expectedIntervalMs: number) => import("./flat").TimeGap[];
                differenceSeries: (points: readonly import("./flat").TimeSeriesPoint<number>[]) => import("./flat").TimeSeriesPoint<number>[];
                finance: {
                    annualizedVolatility: (points: readonly import("./flat").TimeSeriesPoint<number>[], periodsPerYear: number) => number;
                    exponentialMovingAverage: (points: readonly import("./flat").TimeSeriesPoint<number>[], smoothingFactor?: number) => import("./flat").TimeSeriesPoint<number>[];
                    maxDrawdown: (points: readonly import("./flat").TimeSeriesPoint<number>[]) => import("./flat").DrawdownPoint | null;
                    returnsSeries: (points: readonly import("./flat").TimeSeriesPoint<number>[]) => import("./flat").TimeSeriesPoint<number>[];
                };
                movingAverageSeries: (points: readonly import("./flat").TimeSeriesPoint<number>[], size: number) => import("./flat").TimeSeriesPoint<number>[];
                resampleSeries: (points: readonly import("./flat").TimeSeriesPoint<number>[], intervalMs: number) => import("./flat").TimeSeriesPoint<number>[];
                sortTimeSeries: <Value>(points: readonly import("./flat").TimeSeriesPoint<Value>[]) => import("./flat").TimeSeriesPoint<Value>[];
            };
            window: {
                movingAverage: (values: readonly number[], size: number) => number[];
                rollingSum: (values: readonly number[], size: number) => number[];
                slidingWindow: <Value>(values: readonly Value[], size: number) => Value[][];
                windowDelta: (values: readonly number[], size: number) => number[];
            };
        };
        averageBy: <Value>(values: readonly Value[], project: (value: Value, index: number, values: readonly Value[]) => number) => number;
        annualizedVolatility: (points: readonly import("./flat").TimeSeriesPoint<number>[], periodsPerYear: number) => number;
        breadthFirstSearch: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[], startNode: NodeId) => NodeId[];
        buildAdjacencyList: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[], options?: {
            readonly directed?: boolean;
        }) => Map<NodeId, import("./flat").GraphAdjacencyEntry<NodeId>[]>;
        bucketByInterval: <Value>(points: readonly import("./flat").TimeSeriesPoint<Value>[], intervalMs: number) => import("./flat").TimeBucket<Value>[];
        maxBy: <Value>(values: readonly Value[], project: (value: Value, index: number, values: readonly Value[]) => number) => Value | undefined;
        minBy: <Value>(values: readonly Value[], project: (value: Value, index: number, values: readonly Value[]) => number) => Value | undefined;
        movingAverage: (values: readonly number[], size: number) => number[];
        movingAverageSeries: (points: readonly import("./flat").TimeSeriesPoint<number>[], size: number) => import("./flat").TimeSeriesPoint<number>[];
        arithmetic: {
            sumar: (left: import("./flat").NumberInput, right: import("./flat").NumberInput) => number;
            restar: (left: import("./flat").NumberInput, right: import("./flat").NumberInput) => number;
        };
        binarySearch: <Value>(values: readonly Value[], target: Value, compare?: import("./flat").CompareFunction<Value>) => number;
        chunk: <Value>(values: readonly Value[], size: number) => Value[][];
        collectionAlgorithms: {
            chunk: <Value>(values: readonly Value[], size: number) => Value[][];
            groupBy: <Value, Key>(values: readonly Value[], selectKey: (value: Value, index: number, values: readonly Value[]) => Key) => Map<Key, Value[]>;
            indexBy: <Value, Key>(values: readonly Value[], selectKey: (value: Value, index: number, values: readonly Value[]) => Key) => Map<Key, Value>;
            uniqueBy: <Value, Key>(values: readonly Value[], selectKey: (value: Value, index: number, values: readonly Value[]) => Key) => Value[];
        };
        depthFirstSearch: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[], startNode: NodeId) => NodeId[];
        detectDirectedCycle: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[]) => NodeId[] | null;
        detectTimeSeriesGaps: <Value>(points: readonly import("./flat").TimeSeriesPoint<Value>[], expectedIntervalMs: number) => import("./flat").TimeGap[];
        differenceSeries: (points: readonly import("./flat").TimeSeriesPoint<number>[]) => import("./flat").TimeSeriesPoint<number>[];
        dijkstraShortestPath: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[], startNode: NodeId, targetNode: NodeId) => import("./flat").GraphPath<NodeId>;
        exponentialMovingAverage: (points: readonly import("./flat").TimeSeriesPoint<number>[], smoothingFactor?: number) => import("./flat").TimeSeriesPoint<number>[];
        findSortedRange: <Value>(values: readonly Value[], target: Value, compare?: import("./flat").CompareFunction<Value>) => import("./flat").SortedRangeMatch;
        graphAlgorithms: {
            breadthFirstSearch: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[], startNode: NodeId) => NodeId[];
            buildAdjacencyList: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[], options?: {
                readonly directed?: boolean;
            }) => Map<NodeId, import("./flat").GraphAdjacencyEntry<NodeId>[]>;
            detectDirectedCycle: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[]) => NodeId[] | null;
            depthFirstSearch: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[], startNode: NodeId) => NodeId[];
            dijkstraShortestPath: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[], startNode: NodeId, targetNode: NodeId) => import("./flat").GraphPath<NodeId>;
            maxFlow: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[], source: NodeId, sink: NodeId) => import("./flat").MaxFlowResult<NodeId>;
            minimumSpanningTree: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[]) => import("./flat").MinimumSpanningTreeResult<NodeId>;
            topologicalSort: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[]) => NodeId[];
        };
        histogramBy: <Value, Key extends string | number>(values: readonly Value[], selectKey: (value: Value, index: number, values: readonly Value[]) => Key) => Record<Key, number>;
        maxDrawdown: (points: readonly import("./flat").TimeSeriesPoint<number>[]) => import("./flat").DrawdownPoint | null;
        maxFlow: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[], source: NodeId, sink: NodeId) => import("./flat").MaxFlowResult<NodeId>;
        minimumSpanningTree: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[]) => import("./flat").MinimumSpanningTreeResult<NodeId>;
        resampleSeries: (points: readonly import("./flat").TimeSeriesPoint<number>[], intervalMs: number) => import("./flat").TimeSeriesPoint<number>[];
        returnsSeries: (points: readonly import("./flat").TimeSeriesPoint<number>[]) => import("./flat").TimeSeriesPoint<number>[];
        rollingSum: (values: readonly number[], size: number) => number[];
        groupBy: <Value, Key>(values: readonly Value[], selectKey: (value: Value, index: number, values: readonly Value[]) => Key) => Map<Key, Value[]>;
        indexBy: <Value, Key>(values: readonly Value[], selectKey: (value: Value, index: number, values: readonly Value[]) => Key) => Map<Key, Value>;
        insertSorted: <Value>(values: readonly Value[], value: Value, compare?: import("./flat").CompareFunction<Value>) => Value[];
        linearSearch: <Value>(values: readonly Value[], matcher: import("./flat").SearchPredicate<Value> | Value) => number;
        slidingWindow: <Value>(values: readonly Value[], size: number) => Value[][];
        sortTimeSeries: <Value>(points: readonly import("./flat").TimeSeriesPoint<Value>[]) => import("./flat").TimeSeriesPoint<Value>[];
        lowerBound: <Value>(values: readonly Value[], target: Value, compare?: import("./flat").CompareFunction<Value>) => number;
        orderBy: <Value>(values: readonly Value[], criteria: readonly import("./flat").OrderCriterion<Value>[]) => Value[];
        sumBy: <Value>(values: readonly Value[], project: (value: Value, index: number, values: readonly Value[]) => number) => number;
        timeSeriesAlgorithms: {
            bucketByInterval: <Value>(points: readonly import("./flat").TimeSeriesPoint<Value>[], intervalMs: number) => import("./flat").TimeBucket<Value>[];
            detectTimeSeriesGaps: <Value>(points: readonly import("./flat").TimeSeriesPoint<Value>[], expectedIntervalMs: number) => import("./flat").TimeGap[];
            differenceSeries: (points: readonly import("./flat").TimeSeriesPoint<number>[]) => import("./flat").TimeSeriesPoint<number>[];
            finance: {
                annualizedVolatility: (points: readonly import("./flat").TimeSeriesPoint<number>[], periodsPerYear: number) => number;
                exponentialMovingAverage: (points: readonly import("./flat").TimeSeriesPoint<number>[], smoothingFactor?: number) => import("./flat").TimeSeriesPoint<number>[];
                maxDrawdown: (points: readonly import("./flat").TimeSeriesPoint<number>[]) => import("./flat").DrawdownPoint | null;
                returnsSeries: (points: readonly import("./flat").TimeSeriesPoint<number>[]) => import("./flat").TimeSeriesPoint<number>[];
            };
            movingAverageSeries: (points: readonly import("./flat").TimeSeriesPoint<number>[], size: number) => import("./flat").TimeSeriesPoint<number>[];
            resampleSeries: (points: readonly import("./flat").TimeSeriesPoint<number>[], intervalMs: number) => import("./flat").TimeSeriesPoint<number>[];
            sortTimeSeries: <Value>(points: readonly import("./flat").TimeSeriesPoint<Value>[]) => import("./flat").TimeSeriesPoint<Value>[];
        };
        topologicalSort: <NodeId extends import("./flat").GraphNodeId>(edges: readonly import("./flat").GraphEdge<NodeId>[]) => NodeId[];
        paginate: <Value>(values: readonly Value[], options: import("./flat").PaginationOptions) => import("./flat").PaginatedResult<Value>;
        partitionBy: <Value>(values: readonly Value[], predicate: (value: Value, index: number, values: readonly Value[]) => boolean) => import("./flat").PartitionResult<Value>;
        quickSort: <Value>(values: readonly Value[], compare?: import("./flat").CompareFunction<Value>) => Value[];
        windowAlgorithms: {
            movingAverage: (values: readonly number[], size: number) => number[];
            rollingSum: (values: readonly number[], size: number) => number[];
            slidingWindow: <Value>(values: readonly Value[], size: number) => Value[][];
            windowDelta: (values: readonly number[], size: number) => number[];
        };
        windowDelta: (values: readonly number[], size: number) => number[];
        rankBy: <Value>(values: readonly Value[], criteria: readonly import("./flat").OrderCriterion<Value>[]) => import("./flat").RankedValue<Value>[];
        sumar: (left: import("./flat").NumberInput, right: import("./flat").NumberInput) => number;
        restar: (left: import("./flat").NumberInput, right: import("./flat").NumberInput) => number;
        searchAlgorithms: {
            binarySearch: <Value>(values: readonly Value[], target: Value, compare?: import("./flat").CompareFunction<Value>) => number;
            findSortedRange: <Value>(values: readonly Value[], target: Value, compare?: import("./flat").CompareFunction<Value>) => import("./flat").SortedRangeMatch;
            linearSearch: <Value>(values: readonly Value[], matcher: import("./flat").SearchPredicate<Value> | Value) => number;
            lowerBound: <Value>(values: readonly Value[], target: Value, compare?: import("./flat").CompareFunction<Value>) => number;
            upperBound: <Value>(values: readonly Value[], target: Value, compare?: import("./flat").CompareFunction<Value>) => number;
        };
        selectionAlgorithms: {
            paginate: <Value>(values: readonly Value[], options: import("./flat").PaginationOptions) => import("./flat").PaginatedResult<Value>;
            partitionBy: <Value>(values: readonly Value[], predicate: (value: Value, index: number, values: readonly Value[]) => boolean) => import("./flat").PartitionResult<Value>;
            rankBy: <Value>(values: readonly Value[], criteria: readonly import("./flat").OrderCriterion<Value>[]) => import("./flat").RankedValue<Value>[];
            topK: <Value>(values: readonly Value[], k: number, compare?: import("./flat").CompareFunction<Value>, direction?: import("./flat").SortDirection) => Value[];
        };
        sortAlgorithms: {
            insertSorted: <Value>(values: readonly Value[], value: Value, compare?: import("./flat").CompareFunction<Value>) => Value[];
            orderBy: <Value>(values: readonly Value[], criteria: readonly import("./flat").OrderCriterion<Value>[]) => Value[];
            quickSort: <Value>(values: readonly Value[], compare?: import("./flat").CompareFunction<Value>) => Value[];
            stableSortBy: <Value, Result>(values: readonly Value[], rank: (value: Value) => Result, options?: {
                readonly direction?: import("./flat").SortDirection;
                readonly compare?: import("./flat").CompareFunction<Result>;
            }) => Value[];
        };
        stableSortBy: <Value, Result>(values: readonly Value[], rank: (value: Value) => Result, options?: {
            readonly direction?: import("./flat").SortDirection;
            readonly compare?: import("./flat").CompareFunction<Result>;
        }) => Value[];
        topK: <Value>(values: readonly Value[], k: number, compare?: import("./flat").CompareFunction<Value>, direction?: import("./flat").SortDirection) => Value[];
        uniqueBy: <Value, Key>(values: readonly Value[], selectKey: (value: Value, index: number, values: readonly Value[]) => Key) => Value[];
        upperBound: <Value>(values: readonly Value[], target: Value, compare?: import("./flat").CompareFunction<Value>) => number;
    };
    /** [EN] Path routing and parsing. [ES] Enrutamiento y parseo de rutas. */
    routes: {
        path: {
            buildPath: (...segments: string[]) => string;
            parsePath: (value: string) => import("./flat").PathParts;
        };
        buildPath: (...segments: string[]) => string;
        parsePath: (value: string) => import("./flat").PathParts;
    };
    /** [EN] Trait composition engine. [ES] Motor de composición de traits. */
    traits: {
        compose: {
            mergeTraits: <TLeft extends object, TRight extends object>(left: TLeft, right: TRight, options?: import("../traits/compose/merge").MergeTraitsOptions) => TLeft & TRight;
            composePipeline: <TValue>(initialValue: TValue, ...steps: Array<import("./flat").UnaryFunction<TValue, TValue>>) => TValue;
        };
        composePipeline: <TValue>(initialValue: TValue, ...steps: Array<import("./flat").UnaryFunction<TValue, TValue>>) => TValue;
        composeTraitDescriptors: <TState extends object = Record<string, never>, const TDescriptors extends readonly {
            readonly name: string;
            readonly summary?: string;
            readonly requires: readonly string[];
            readonly conflicts: readonly string[];
            readonly state: readonly string[];
            readonly consumes: readonly string[];
            readonly provides: readonly string[];
            readonly tags: readonly string[];
            readonly runtimes: readonly string[];
            readonly create: (context: import("./flat").TraitDescriptorContext<any, any, string>) => any;
        }[] = readonly {
            readonly name: string;
            readonly summary?: string;
            readonly requires: readonly string[];
            readonly conflicts: readonly string[];
            readonly state: readonly string[];
            readonly consumes: readonly string[];
            readonly provides: readonly string[];
            readonly tags: readonly string[];
            readonly runtimes: readonly string[];
            readonly create: (context: import("./flat").TraitDescriptorContext<any, any, string>) => any;
        }[]>(descriptors: TDescriptors, options?: import("./flat").ComposeTraitDescriptorsOptions<TState>) => import("./flat").ComposedTraitDescriptorsResult<TState, (((TDescriptors[number] extends infer T ? T extends TDescriptors[number] ? T extends import("./flat").TraitDescriptor<string, object, infer TProvides extends object> ? TProvides : never : never : never) extends infer T_1 ? T_1 extends (TDescriptors[number] extends infer T_2 ? T_2 extends TDescriptors[number] ? T_2 extends import("./flat").TraitDescriptor<string, object, infer TProvides extends object> ? TProvides : never : never : never) ? T_1 extends unknown ? (value: T_1) => void : never : never : never) extends (value: infer TIntersection) => void ? TIntersection : never) extends object ? object & (((TDescriptors[number] extends infer T_3 ? T_3 extends TDescriptors[number] ? T_3 extends import("./flat").TraitDescriptor<string, object, infer TProvides extends object> ? TProvides : never : never : never) extends infer T_4 ? T_4 extends (TDescriptors[number] extends infer T_5 ? T_5 extends TDescriptors[number] ? T_5 extends import("./flat").TraitDescriptor<string, object, infer TProvides extends object> ? TProvides : never : never : never) ? T_4 extends unknown ? (value: T_4) => void : never : never : never) extends (value: infer TIntersection) => void ? TIntersection : never) : Record<string, never>>;
        createTraitDescriptor: <const TName extends string, TState extends object, TProvides extends object>(descriptor: import("./flat").TraitDescriptorInput<TName, TState, TProvides>) => import("./flat").TraitDescriptor<TName, TState, TProvides>;
        createTraitDescriptorFromJsDoc: <const TName extends string = string, TState extends object = Record<string, never>, TProvides extends object = Record<string, never>>(jsDoc: string, descriptor: import("./flat").TraitDescriptorFromJsDocInput<TName, TState, TProvides>) => import("./flat").TraitDescriptor<TName, TState, TProvides>;
        mergeTraits: <TLeft extends object, TRight extends object>(left: TLeft, right: TRight, options?: import("../traits/compose/merge").MergeTraitsOptions) => TLeft & TRight;
        parseTraitDescriptorJsDoc: (jsDoc: string) => import("./flat").TraitDescriptorJsDocMetadata;
    };
};
