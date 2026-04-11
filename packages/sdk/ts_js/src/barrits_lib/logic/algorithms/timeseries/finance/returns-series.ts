import type { TimeSeriesPoint } from "../types";
import { sortTimeSeries } from "../sort-time-series";

export const returnsSeries = (
  points: readonly TimeSeriesPoint<number>[],
): TimeSeriesPoint<number>[] => {
  const sortedPoints = sortTimeSeries(points);

  return sortedPoints.slice(1).map((point, index) => ({
    timestamp: point.timestamp,
    value: sortedPoints[index].value === 0 ? 0 : (point.value - sortedPoints[index].value) / sortedPoints[index].value,
  }));
};
