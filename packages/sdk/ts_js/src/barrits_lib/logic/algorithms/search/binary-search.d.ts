import type { CompareFunction } from "../internal/compare";
export declare const binarySearch: <Value>(values: readonly Value[], target: Value, compare?: CompareFunction<Value>) => number;
