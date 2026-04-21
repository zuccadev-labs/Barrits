import type { CompareFunction, SortDirection } from "../internal/compare";
export declare const topK: <Value>(values: readonly Value[], count: number, compare?: CompareFunction<Value>, direction?: SortDirection) => Value[];
