export type CompareFunction<Value> = (left: Value, right: Value) => number;
export type SortDirection = "asc" | "desc";
export type Projection<Value, Result> = (value: Value) => Result;
export declare const defaultCompare: <Value>(left: Value, right: Value) => number;
export declare const reverseCompare: <Value>(compare: CompareFunction<Value>) => CompareFunction<Value>;
export declare const createCompareBy: <Value, Result>(project: Projection<Value, Result>, direction?: SortDirection, compare?: CompareFunction<Result>) => CompareFunction<Value>;
export declare const chainComparators: <Value>(comparators: readonly CompareFunction<Value>[]) => CompareFunction<Value>;
