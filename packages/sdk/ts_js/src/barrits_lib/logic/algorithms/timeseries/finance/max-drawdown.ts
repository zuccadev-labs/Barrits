import type { TimeSeriesPoint } from "../types";
import { sortTimeSeries } from "../sort-time-series";

/**
 * [EN] Represents a point in a drawdown analysis.
 * [ES] Representa un punto en un análisis de drawdown (caída desde el máximo).
 */
export type DrawdownPoint = {
  readonly timestamp: number;
  readonly value: number;
  readonly peak: number;
  readonly drawdown: number;
};

/**
 * [EN] Finds the maximum drawdown (peak-to-trough decline) in a time-series.
 * [ES] Encuentra el máximo drawdown (caída del pico al valle) en una serie temporal.
 * 
 * @param points [EN] Numeric time-series points. [ES] Puntos numéricos de series temporales.
 * @returns [EN] The point with the worst drawdown or null. [ES] El punto con el peor drawdown o null.
 */
export const maxDrawdown = (
  points: readonly TimeSeriesPoint<number>[],
): DrawdownPoint | null => {
  const sortedPoints = sortTimeSeries(points);
  let peak = Number.NEGATIVE_INFINITY;
  let worstPoint: DrawdownPoint | null = null;

  for (const point of sortedPoints) {
    peak = Math.max(peak, point.value);
    const drawdown = peak === 0 ? 0 : (point.value - peak) / peak;

    if (!worstPoint || drawdown < worstPoint.drawdown) {
      worstPoint = {
        timestamp: point.timestamp,
        value: point.value,
        peak,
        drawdown,
      };
    }
  }

  return worstPoint;
};
