import type { CompareFunction, SortDirection } from "../internal/compare";
export type OrderCriterion<Value, Result = unknown> = {
    readonly project: (value: Value) => Result;
    readonly direction?: SortDirection;
    readonly compare?: CompareFunction<Result>;
};
export declare const createOrderComparator: <Value>(criteria: readonly OrderCriterion<Value>[]) => CompareFunction<Value>;
export declare const orderBy: <Value>(values: readonly Value[], criteria: readonly OrderCriterion<Value>[]) => Value[];
