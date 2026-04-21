import type { TimeSeriesPoint } from "../types";
import { sortTimeSeries } from "../sort-time-series";

/**
 * [EN] Computes the Exponential Moving Average (EMA) for a time-series.
 * [ES] Calcula el Promedio Móvil Exponencial (EMA) para una serie temporal.
 * 
 * @param points [EN] Numeric time-series points. [ES] Puntos numéricos de series temporales.
 * @param smoothingFactor [EN] Smoothing factor (defaults to 2). [ES] Factor de suavizado (por defecto 2).
 * @returns [EN] A time-series of EMA values. [ES] Una serie temporal de valores EMA.
 */
export const exponentialMovingAverage = (
  points: readonly TimeSeriesPoint<number>[],
  smoothingFactor = 2,
): TimeSeriesPoint<number>[] => {
  const sortedPoints = sortTimeSeries(points);

  return sortedPoints.reduce<TimeSeriesPoint<number>[]>((series, point, index) => {
    if (index === 0) {
      series.push(point);
      return series;
    }

    const multiplier = smoothingFactor / (series.length + 1);
    const previousPoint = series[index - 1];
    series.push({
      timestamp: point.timestamp,
      value: ((point.value - previousPoint.value) * multiplier) + previousPoint.value,
    });
    return series;
  }, []);
};
