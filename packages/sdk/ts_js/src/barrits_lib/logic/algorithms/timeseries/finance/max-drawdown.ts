import type { TimeSeriesPoint } from "../types";
import { sortTimeSeries } from "../sort-time-series";

/**
 * [EN] Represents a point in a drawdown analysis.
 * [ES] Representa un punto en un análisis de drawdown (caída desde el máximo).
 */
export type DrawdownPoint = {
  /** [EN] Point timestamp. [ES] Marca de tiempo del punto. */
  readonly timestamp: number;
  /** [EN] Current value at the point. [ES] Valor actual en el punto. */
  readonly value: number;
  /** [EN] Peak value up to this point. [ES] Valor máximo hasta este punto. */
  readonly peak: number;
  /** [EN] Drawdown percentage (negative or zero). [ES] Porcentaje de drawdown (negativo o cero). */
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
