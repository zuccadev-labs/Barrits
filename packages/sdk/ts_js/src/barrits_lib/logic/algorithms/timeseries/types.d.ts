export type TimeSeriesPoint<Value = number> = {
    readonly timestamp: number;
    readonly value: Value;
};
export type TimeBucket<Value = number> = {
    readonly bucketStart: number;
    readonly bucketEnd: number;
    readonly points: TimeSeriesPoint<Value>[];
};
