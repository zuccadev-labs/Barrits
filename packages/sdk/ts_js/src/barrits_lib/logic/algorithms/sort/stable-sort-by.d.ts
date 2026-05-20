import type { CompareFunction, SortDirection } from "../internal/compare";
/**
 * [EN] Implementation of Stable sort by.
 * [ES] Implementación de Stable sort by.
 */
export declare const stableSortBy: <Value, Result>(values: readonly Value[], rank: (value: Value) => Result, options?: {
    readonly direction?: SortDirection;
    readonly compare?: CompareFunction<Result>;
}) => Value[];
