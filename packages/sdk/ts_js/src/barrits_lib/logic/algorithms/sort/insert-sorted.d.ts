import type { CompareFunction } from "../internal/compare";
export declare const insertSorted: <Value>(values: readonly Value[], value: Value, compare?: CompareFunction<Value>) => Value[];
