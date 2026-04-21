import { averageBy } from "../aggregate";
import { bucketByInterval } from "./bucket-by-interval";
import type { TimeSeriesPoint } from "./types";

/**
 * [EN] Resamples a time-series by averaging values within time buckets.
 * [ES] Remuestrea una serie temporal promediando valores dentro de cubetas de tiempo.
 * 
 * @param points [EN] Numeric time-series points. [ES] Puntos numéricos de series temporales.
 * @param intervalMs [EN] New resampling interval. [ES] Nuevo intervalo de remuestreo.
 * @returns [EN] A resampled time-series. [ES] Una serie temporal remuestreada.
 */
export const resampleSeries = (
  points: readonly TimeSeriesPoint<number>[],
  intervalMs: number,
): TimeSeriesPoint<number>[] => {
  return bucketByInterval(points, intervalMs).map((bucket) => ({
    timestamp: bucket.bucketStart,
    value: averageBy(bucket.points, (point) => point.value),
  }));
};
