import { sortTimeSeries } from "./sort-time-series";
import { toPositiveInteger } from "../internal/normalize";
import type { TimeBucket, TimeSeriesPoint } from "./types";

/**
 * [EN] Groups time-series points into fixed-width buckets aligned to multiples of `intervalMs` (bucket start =
 * `floor(timestamp / interval) * interval`). Points are sorted by timestamp first, so buckets come back in
 * chronological order. `intervalMs` is normalized to a positive integer (`NaN`/`Infinity`/values below 1 become 1).
 * [ES] Agrupa puntos de series temporales en cubetas de ancho fijo alineadas a múltiplos de `intervalMs` (inicio de
 * cubeta = `floor(timestamp / intervalo) * intervalo`). Los puntos se ordenan primero por marca de tiempo, por lo que
 * las cubetas vuelven en orden cronológico. `intervalMs` se normaliza a un entero positivo (`NaN`/`Infinity`/valores
 * menores que 1 pasan a 1).
 *
 * @param points [EN] Time-series points with timestamps. [ES] Puntos de series temporales con marcas de tiempo.
 * @param intervalMs [EN] Interval duration in milliseconds. [ES] Duración del intervalo en milisegundos.
 * @returns [EN] Array of time buckets. [ES] Arreglo de cubetas de tiempo.
 */
export const bucketByInterval = <Value>(points: readonly TimeSeriesPoint<Value>[], intervalMs: number): TimeBucket<Value>[] => {
  const normalizedInterval = toPositiveInteger(intervalMs, 1);
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
