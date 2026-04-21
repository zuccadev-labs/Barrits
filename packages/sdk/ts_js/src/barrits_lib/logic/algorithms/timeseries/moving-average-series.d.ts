import type { TimeSeriesPoint } from "./types";
/**
 * [EN] Calculates the moving average for a numeric time-series.
 * [ES] Calcula el promedio móvil para una serie temporal numérica.
 *
 * @param points [EN] Numeric time-series points. [ES] Puntos numéricos de series temporales.
 * @param size [EN] Sliding window size. [ES] Tamaño de la ventana deslizante.
 * @returns [EN] A time-series of moving averages. [ES] Una serie temporal de promedios móviles.
 */
export declare const movingAverageSeries: (points: readonly TimeSeriesPoint<number>[], size: number) => TimeSeriesPoint<number>[];
