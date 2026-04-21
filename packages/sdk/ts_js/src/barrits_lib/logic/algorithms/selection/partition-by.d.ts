export type PartitionResult<Value> = {
    readonly matched: Value[];
    readonly rejected: Value[];
};
export declare const partitionBy: <Value>(values: readonly Value[], predicate: (value: Value, index: number, values: readonly Value[]) => boolean) => PartitionResult<Value>;
