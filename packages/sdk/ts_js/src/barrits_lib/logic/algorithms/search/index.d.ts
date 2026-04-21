export { binarySearch } from "./binary-search";
export type { CompareFunction } from "../internal/compare";
export { findSortedRange } from "./find-sorted-range";
export type { SortedRangeMatch } from "./find-sorted-range";
export { linearSearch } from "./linear-search";
export type { SearchPredicate } from "./linear-search";
export { lowerBound } from "./lower-bound";
export { upperBound } from "./upper-bound";
export declare const searchAlgorithms: {
    binarySearch: <Value>(values: readonly Value[], target: Value, compare?: import(".").CompareFunction<Value>) => number;
    findSortedRange: <Value>(values: readonly Value[], target: Value, compare?: import(".").CompareFunction<Value>) => import("./find-sorted-range").SortedRangeMatch;
    linearSearch: <Value>(values: readonly Value[], matcher: import("./linear-search").SearchPredicate<Value> | Value) => number;
    lowerBound: <Value>(values: readonly Value[], target: Value, compare?: import(".").CompareFunction<Value>) => number;
    upperBound: <Value>(values: readonly Value[], target: Value, compare?: import(".").CompareFunction<Value>) => number;
};
