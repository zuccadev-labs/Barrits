import type { TimeSeriesPoint } from "./types";
export declare const movingAverageSeries: (points: readonly TimeSeriesPoint<number>[], size: number) => TimeSeriesPoint<number>[];
