export { insertSorted } from "./insert-sorted";
export { createOrderComparator, orderBy } from "./order-by";
export type { OrderCriterion } from "./order-by";
export { quickSort } from "./quick-sort";
export { stableSortBy } from "./stable-sort-by";
export declare const sortAlgorithms: {
    insertSorted: <Value>(values: readonly Value[], value: Value, compare?: import("..").CompareFunction<Value>) => Value[];
    orderBy: <Value>(values: readonly Value[], criteria: readonly import("./order-by").OrderCriterion<Value>[]) => Value[];
    quickSort: <Value>(values: readonly Value[], compare?: import("..").CompareFunction<Value>) => Value[];
    stableSortBy: <Value, Result>(values: readonly Value[], rank: (value: Value) => Result, options?: {
        readonly direction?: import("..").SortDirection;
        readonly compare?: import("..").CompareFunction<Result>;
    }) => Value[];
};
