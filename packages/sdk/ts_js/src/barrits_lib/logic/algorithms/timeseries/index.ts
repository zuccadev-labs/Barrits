import { bucketByInterval } from "./bucket-by-interval";
import { detectTimeSeriesGaps } from "./detect-gaps";
import { differenceSeries } from "./difference-series";
import { financeTimeSeriesAlgorithms } from "./finance";
import { movingAverageSeries } from "./moving-average-series";
import { resampleSeries } from "./resample-series";
import { sortTimeSeries } from "./sort-time-series";

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
export const timeSeriesAlgorithms = {
  /** [EN] Time-based bucketing service. [ES] Servicio de agrupación por tiempo. */
  bucketByInterval,
  /** [EN] Data gap detection service. [ES] Servicio de detección de brechas en datos. */
  detectTimeSeriesGaps,
  /** [EN] Delta calculation between points. [ES] Cálculo de delta entre puntos. */
  differenceSeries,
  /** [EN] Specialized financial algorithms. [ES] Algoritmos financieros especializados. */
  finance: financeTimeSeriesAlgorithms,
  /** [EN] Historical moving average. [ES] Promedio móvil histórico. */
  movingAverageSeries,
  /** [EN] Resampling of irregular series. [ES] Remuestreo de series irregulares. */
  resampleSeries,
  /** [EN] Chronological ordering service. [ES] Servicio de ordenamiento cronológico. */
  sortTimeSeries,
};
