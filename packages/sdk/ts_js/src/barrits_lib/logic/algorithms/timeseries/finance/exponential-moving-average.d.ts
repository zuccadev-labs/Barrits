import type { TimeSeriesPoint } from "../types";
/**
 * [EN] Computes the Exponential Moving Average (EMA) for a time-series.
 * [ES] Calcula el Promedio Móvil Exponencial (EMA) para una serie temporal.
 *
 * @param points [EN] Numeric time-series points. [ES] Puntos numéricos de series temporales.
 * @param smoothingFactor [EN] Smoothing factor (defaults to 2). [ES] Factor de suavizado (por defecto 2).
 * @returns [EN] A time-series of EMA values. [ES] Una serie temporal de valores EMA.
 */
export declare const exponentialMovingAverage: (points: readonly TimeSeriesPoint<number>[], smoothingFactor?: number) => TimeSeriesPoint<number>[];
