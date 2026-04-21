import { sortTimeSeries } from "./sort-time-series";
import type { TimeSeriesPoint } from "./types";

/**
 * [EN] Computes the differences between consecutive points in a numeric time-series.
 * [ES] Calcula las diferencias entre puntos consecutivos en una serie temporal numérica.
 * 
 * @param points [EN] Numeric time-series points. [ES] Puntos numéricos de series temporales.
 * @returns [EN] A time-series of deltas. [ES] Una serie temporal de deltas.
 */
export const differenceSeries = (
  points: readonly TimeSeriesPoint<number>[],
): TimeSeriesPoint<number>[] => {
  const sortedPoints = sortTimeSeries(points);

  return sortedPoints.slice(1).map((point, index) => ({
    timestamp: point.timestamp,
    value: point.value - sortedPoints[index].value,
  }));
};
