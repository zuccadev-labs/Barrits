import type { TimeSeriesPoint } from "../types";
import { sortTimeSeries } from "../sort-time-series";

/**
 * [EN] Transforms a price series into a returns series (percentage change).
 * [ES] Transforma una serie de precios en una serie de retornos (cambio porcentual).
 * 
 * @param points [EN] Numeric time-series points (e.g., prices). [ES] Puntos numéricos de series temporales (ej., precios).
 * @returns [EN] A time-series of percentage returns. [ES] Una serie temporal de retornos porcentuales.
 */
export const returnsSeries = (
  points: readonly TimeSeriesPoint<number>[],
): TimeSeriesPoint<number>[] => {
  const sortedPoints = sortTimeSeries(points);

  return sortedPoints.slice(1).map((point, index) => ({
    timestamp: point.timestamp,
    value: sortedPoints[index].value === 0 ? 0 : (point.value - sortedPoints[index].value) / sortedPoints[index].value,
  }));
};
