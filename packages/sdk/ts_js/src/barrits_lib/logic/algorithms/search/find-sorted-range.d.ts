import type { CompareFunction } from "../internal/compare";
export type SortedRangeMatch = {
    readonly found: boolean;
    readonly startIndex: number;
    readonly endIndex: number;
    readonly count: number;
};
export declare const findSortedRange: <Value>(values: readonly Value[], target: Value, compare?: CompareFunction<Value>) => SortedRangeMatch;
