export { bucketByInterval } from "./bucket-by-interval";
export { detectTimeSeriesGaps } from "./detect-gaps";
export type { TimeGap } from "./detect-gaps";
export { differenceSeries } from "./difference-series";
export { annualizedVolatility, exponentialMovingAverage, financeTimeSeriesAlgorithms, maxDrawdown, returnsSeries } from "./finance";
export type { DrawdownPoint } from "./finance";
export { movingAverageSeries } from "./moving-average-series";
export { resampleSeries } from "./resample-series";
export { sortTimeSeries } from "./sort-time-series";
export type { TimeBucket, TimeSeriesPoint } from "./types";
export declare const timeSeriesAlgorithms: {
    bucketByInterval: <Value>(points: readonly import("./types").TimeSeriesPoint<Value>[], intervalMs: number) => import("./types").TimeBucket<Value>[];
    detectTimeSeriesGaps: <Value>(points: readonly import("./types").TimeSeriesPoint<Value>[], expectedIntervalMs: number) => import("./detect-gaps").TimeGap[];
    differenceSeries: (points: readonly import("./types").TimeSeriesPoint<number>[]) => import("./types").TimeSeriesPoint<number>[];
    finance: {
        annualizedVolatility: (points: readonly import("./types").TimeSeriesPoint<number>[], periodsPerYear: number) => number;
        exponentialMovingAverage: (points: readonly import("./types").TimeSeriesPoint<number>[], smoothingFactor?: number) => import("./types").TimeSeriesPoint<number>[];
        maxDrawdown: (points: readonly import("./types").TimeSeriesPoint<number>[]) => import("./finance").DrawdownPoint | null;
        returnsSeries: (points: readonly import("./types").TimeSeriesPoint<number>[]) => import("./types").TimeSeriesPoint<number>[];
    };
    movingAverageSeries: (points: readonly import("./types").TimeSeriesPoint<number>[], size: number) => import("./types").TimeSeriesPoint<number>[];
    resampleSeries: (points: readonly import("./types").TimeSeriesPoint<number>[], intervalMs: number) => import("./types").TimeSeriesPoint<number>[];
    sortTimeSeries: <Value>(points: readonly import("./types").TimeSeriesPoint<Value>[]) => import("./types").TimeSeriesPoint<Value>[];
};
