export { insertSorted } from "./insert-sorted";
export { createOrderComparator, orderBy } from "./order-by";
export type { OrderCriterion } from "./order-by";
export { quickSort } from "./quick-sort";
export { stableSortBy } from "./stable-sort-by";
/**
 * [EN] Collection of sorting and ordering services.
 * [ES] Colección de servicios de ordenamiento.
 */
export declare const sortAlgorithms: {
    /** [EN] Inserts into a sorted array. [ES] Inserta en un arreglo ordenado. */
    insertSorted: <Value>(values: readonly Value[], value: Value, compare?: import("..").CompareFunction<Value>) => Value[];
    /** [EN] Multi-level stable sort. [ES] Ordenamiento estable multinivel. */
    orderBy: <Value>(values: readonly Value[], criteria: readonly import("./order-by").OrderCriterion<Value>[]) => Value[];
    /** [EN] Fast recursive sort. [ES] Ordenamiento recursivo rápido. */
    quickSort: <Value>(values: readonly Value[], compare?: import("..").CompareFunction<Value>) => Value[];
    /** [EN] Native-compatible stable sort. [ES] Ordenamiento estable compatible con nativo. */
    stableSortBy: <Value, Result>(values: readonly Value[], rank: (value: Value) => Result, options?: {
        readonly direction?: import("..").SortDirection;
        readonly compare?: import("..").CompareFunction<Result>;
    }) => Value[];
};
