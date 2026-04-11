import { sortTimeSeries } from "./sort-time-series";
import type { TimeSeriesPoint } from "./types";

export type TimeGap = {
  readonly from: number;
  readonly to: number;
  readonly durationMs: number;
};

export const detectTimeSeriesGaps = <Value>(
  points: readonly TimeSeriesPoint<Value>[],
  expectedIntervalMs: number,
): TimeGap[] => {
  const sortedPoints = sortTimeSeries(points);
  const normalizedExpectedInterval = Math.max(1, Math.floor(expectedIntervalMs));
  const gaps: TimeGap[] = [];

  for (let index = 1; index < sortedPoints.length; index += 1) {
    const previousPoint = sortedPoints[index - 1];
    const currentPoint = sortedPoints[index];
    const delta = currentPoint.timestamp - previousPoint.timestamp;

    if (delta > normalizedExpectedInterval) {
      gaps.push({
        from: previousPoint.timestamp,
        to: currentPoint.timestamp,
        durationMs: delta,
      });
    }
  }

  return gaps;
};
