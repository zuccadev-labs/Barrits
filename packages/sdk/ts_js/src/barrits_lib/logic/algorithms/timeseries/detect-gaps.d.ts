import type { TimeSeriesPoint } from "./types";
export type TimeGap = {
    readonly from: number;
    readonly to: number;
    readonly durationMs: number;
};
export declare const detectTimeSeriesGaps: <Value>(points: readonly TimeSeriesPoint<Value>[], expectedIntervalMs: number) => TimeGap[];
