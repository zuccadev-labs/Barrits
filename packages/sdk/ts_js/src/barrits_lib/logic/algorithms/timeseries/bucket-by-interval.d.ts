import type { TimeBucket, TimeSeriesPoint } from "./types";
export declare const bucketByInterval: <Value>(points: readonly TimeSeriesPoint<Value>[], intervalMs: number) => TimeBucket<Value>[];
