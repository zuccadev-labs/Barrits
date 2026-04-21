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
/**
 * [EN] Collection of advanced time-series analysis and financial algorithms.
 * [ES] Colección de algoritmos avanzados de análisis de series temporales y finanzas.
 */
export declare const timeSeriesAlgorithms: {
    /** [EN] Time-based bucketing service. [ES] Servicio de agrupación por tiempo. */
    bucketByInterval: <Value>(points: readonly import("./types").TimeSeriesPoint<Value>[], intervalMs: number) => import("./types").TimeBucket<Value>[];
    /** [EN] Data gap detection service. [ES] Servicio de detección de brechas en datos. */
    detectTimeSeriesGaps: <Value>(points: readonly import("./types").TimeSeriesPoint<Value>[], expectedIntervalMs: number) => import("./detect-gaps").TimeGap[];
    /** [EN] Delta calculation between points. [ES] Cálculo de delta entre puntos. */
    differenceSeries: (points: readonly import("./types").TimeSeriesPoint<number>[]) => import("./types").TimeSeriesPoint<number>[];
    /** [EN] Specialized financial algorithms. [ES] Algoritmos financieros especializados. */
    finance: {
        annualizedVolatility: (points: readonly import("./types").TimeSeriesPoint<number>[], periodsPerYear: number) => number;
        exponentialMovingAverage: (points: readonly import("./types").TimeSeriesPoint<number>[], smoothingFactor?: number) => import("./types").TimeSeriesPoint<number>[];
        maxDrawdown: (points: readonly import("./types").TimeSeriesPoint<number>[]) => import("./finance").DrawdownPoint | null;
        returnsSeries: (points: readonly import("./types").TimeSeriesPoint<number>[]) => import("./types").TimeSeriesPoint<number>[];
    };
    /** [EN] Historical moving average. [ES] Promedio móvil histórico. */
    movingAverageSeries: (points: readonly import("./types").TimeSeriesPoint<number>[], size: number) => import("./types").TimeSeriesPoint<number>[];
    /** [EN] Resampling of irregular series. [ES] Remuestreo de series irregulares. */
    resampleSeries: (points: readonly import("./types").TimeSeriesPoint<number>[], intervalMs: number) => import("./types").TimeSeriesPoint<number>[];
    /** [EN] Chronological ordering service. [ES] Servicio de ordenamiento cronológico. */
    sortTimeSeries: <Value>(points: readonly import("./types").TimeSeriesPoint<Value>[]) => import("./types").TimeSeriesPoint<Value>[];
};
