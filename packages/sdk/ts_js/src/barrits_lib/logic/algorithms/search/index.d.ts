export { binarySearch } from "./binary-search";
export type { CompareFunction } from "../internal/compare";
export { findSortedRange } from "./find-sorted-range";
export type { SortedRangeMatch } from "./find-sorted-range";
export { linearSearch } from "./linear-search";
export type { SearchPredicate } from "./linear-search";
export { lowerBound } from "./lower-bound";
export { upperBound } from "./upper-bound";
/**
 * [EN] Collection of high-performance search algorithms.
 * [ES] Colección de algoritmos de búsqueda de alto rendimiento.
 */
export declare const searchAlgorithms: {
    /** [EN] Binary search for sorted collections. [ES] Búsqueda binaria para colecciones ordenadas. */
    binarySearch: <Value>(values: readonly Value[], target: Value, compare?: import(".").CompareFunction<Value>) => number;
    /** [EN] Finds a range of matching elements. [ES] Encuentra un rango de elementos coincidentes. */
    findSortedRange: <Value>(values: readonly Value[], target: Value, compare?: import(".").CompareFunction<Value>) => import("./find-sorted-range").SortedRangeMatch;
    /** [EN] Linear search for unsorted collections. [ES] Búsqueda lineal para colecciones no ordenadas. */
    linearSearch: <Value>(values: readonly Value[], matcher: import("./linear-search").SearchPredicate<Value> | Value) => number;
    /** [EN] Finds the inclusive lower bound. [ES] Encuentra el límite inferior inclusivo. */
    lowerBound: <Value>(values: readonly Value[], target: Value, compare?: import(".").CompareFunction<Value>) => number;
    /** [EN] Finds the exclusive upper bound. [ES] Encuentra el límite superior exclusivo. */
    upperBound: <Value>(values: readonly Value[], target: Value, compare?: import(".").CompareFunction<Value>) => number;
};
