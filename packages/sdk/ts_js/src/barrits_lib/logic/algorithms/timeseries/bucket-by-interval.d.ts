import type { TimeBucket, TimeSeriesPoint } from "./types";
/**
 * [EN] Groups time-series points into buckets based on a time interval.
 * [ES] Agrupa puntos de series temporales en cubetas basadas en un intervalo de tiempo.
 *
 * @param points [EN] Time-series points with timestamps. [ES] Puntos de series temporales con marcas de tiempo.
 * @param intervalMs [EN] Interval duration in milliseconds. [ES] Duración del intervalo en milisegundos.
 * @returns [EN] Array of time buckets. [ES] Arreglo de cubetas de tiempo.
 */
export declare const bucketByInterval: <Value>(points: readonly TimeSeriesPoint<Value>[], intervalMs: number) => TimeBucket<Value>[];
