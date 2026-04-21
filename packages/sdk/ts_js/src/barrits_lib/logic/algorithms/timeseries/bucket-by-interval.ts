import { sortTimeSeries } from "./sort-time-series";
import type { TimeBucket, TimeSeriesPoint } from "./types";

/**
 * [EN] Groups time-series points into buckets based on a time interval.
 * [ES] Agrupa puntos de series temporales en cubetas basadas en un intervalo de tiempo.
 * 
 * @param points [EN] Time-series points with timestamps. [ES] Puntos de series temporales con marcas de tiempo.
 * @param intervalMs [EN] Interval duration in milliseconds. [ES] Duración del intervalo en milisegundos.
 * @returns [EN] Array of time buckets. [ES] Arreglo de cubetas de tiempo.
 */
export const bucketByInterval = <Value>(
  points: readonly TimeSeriesPoint<Value>[],
  intervalMs: number,
): TimeBucket<Value>[] => {
  const normalizedInterval = Math.max(1, Math.floor(intervalMs));
  const sortedPoints = sortTimeSeries(points);
  const buckets = new Map<number, TimeSeriesPoint<Value>[]>();

  for (const point of sortedPoints) {
    const bucketStart = Math.floor(point.timestamp / normalizedInterval) * normalizedInterval;
    const bucketPoints = buckets.get(bucketStart);

    if (bucketPoints) {
      bucketPoints.push(point);
      continue;
    }

    buckets.set(bucketStart, [point]);
  }

  return Array.from(buckets.entries()).map(([bucketStart, bucketPoints]) => ({
    bucketStart,
    bucketEnd: bucketStart + normalizedInterval,
    points: bucketPoints,
  }));
};
