import type { TimeSeriesPoint } from "./types";
export declare const resampleSeries: (points: readonly TimeSeriesPoint<number>[], intervalMs: number) => TimeSeriesPoint<number>[];
