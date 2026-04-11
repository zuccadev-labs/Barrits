import type { TimeSeriesPoint } from "../types";
import { sortTimeSeries } from "../sort-time-series";

export type DrawdownPoint = {
  readonly timestamp: number;
  readonly value: number;
  readonly peak: number;
  readonly drawdown: number;
};

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
