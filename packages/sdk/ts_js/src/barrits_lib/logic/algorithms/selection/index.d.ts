export { paginate } from "./paginate";
export type { PaginatedResult, PaginationOptions } from "./paginate";
export { partitionBy } from "./partition-by";
export type { PartitionResult } from "./partition-by";
export { rankBy } from "./rank-by";
export type { RankedValue } from "./rank-by";
export { topK } from "./top-k";
/**
 * [EN] Collection of data selection and partitioning services.
 * [ES] Colección de servicios de selección y partición de datos.
 */
export declare const selectionAlgorithms: {
    /** [EN] Data pagination service. [ES] Servicio de paginación de datos. */
    paginate: <Value>(values: readonly Value[], options: import("./paginate").PaginationOptions) => import("./paginate").PaginatedResult<Value>;
    /** [EN] Collection partitioning based on predicates. [ES] Partición de colecciones basada en predicados. */
    partitionBy: <Value>(values: readonly Value[], predicate: (value: Value, index: number, values: readonly Value[]) => boolean) => import("./partition-by").PartitionResult<Value>;
    /** [EN] Relative ranking service. [ES] Servicio de clasificación relativa. */
    rankBy: <Value>(values: readonly Value[], criteria: readonly import("..").OrderCriterion<Value>[]) => import("./rank-by").RankedValue<Value>[];
    /** [EN] High-performance Top-K selection. [ES] Selección Top-K de alto rendimiento. */
    topK: <Value>(values: readonly Value[], k: number, compare?: import("..").CompareFunction<Value>, direction?: import("..").SortDirection) => Value[];
};
