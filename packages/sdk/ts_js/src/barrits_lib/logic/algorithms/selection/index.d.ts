export { paginate } from "./paginate";
export type { PaginatedResult, PaginationOptions } from "./paginate";
export { partitionBy } from "./partition-by";
export type { PartitionResult } from "./partition-by";
export { rankBy } from "./rank-by";
export type { RankedValue } from "./rank-by";
export { topK } from "./top-k";
export declare const selectionAlgorithms: {
    paginate: <Value>(values: readonly Value[], options: import("./paginate").PaginationOptions) => import("./paginate").PaginatedResult<Value>;
    partitionBy: <Value>(values: readonly Value[], predicate: (value: Value, index: number, values: readonly Value[]) => boolean) => import("./partition-by").PartitionResult<Value>;
    rankBy: <Value>(values: readonly Value[], criteria: readonly import("..").OrderCriterion<Value>[]) => import("./rank-by").RankedValue<Value>[];
    topK: <Value>(values: readonly Value[], count: number, compare?: import("..").CompareFunction<Value>, direction?: import("..").SortDirection) => Value[];
};
