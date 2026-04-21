export type SearchPredicate<Value> = (value: Value, index: number, values: readonly Value[]) => boolean;
export declare const linearSearch: <Value>(values: readonly Value[], matcher: SearchPredicate<Value> | Value) => number;
