import type { TimeSeriesPoint } from "../types";
export declare const exponentialMovingAverage: (points: readonly TimeSeriesPoint<number>[], smoothingFactor?: number) => TimeSeriesPoint<number>[];
