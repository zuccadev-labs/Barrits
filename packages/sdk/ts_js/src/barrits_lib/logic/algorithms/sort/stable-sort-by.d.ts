import type { CompareFunction, SortDirection } from "../internal/compare";
export declare const stableSortBy: <Value, Result>(values: readonly Value[], rank: (value: Value) => Result, options?: {
    readonly direction?: SortDirection;
    readonly compare?: CompareFunction<Result>;
}) => Value[];
