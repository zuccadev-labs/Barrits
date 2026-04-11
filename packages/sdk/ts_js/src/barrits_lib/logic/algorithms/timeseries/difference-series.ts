import { sortTimeSeries } from "./sort-time-series";
import type { TimeSeriesPoint } from "./types";

export const differenceSeries = (
  points: readonly TimeSeriesPoint<number>[],
): TimeSeriesPoint<number>[] => {
  const sortedPoints = sortTimeSeries(points);

  return sortedPoints.slice(1).map((point, index) => ({
    timestamp: point.timestamp,
    value: point.value - sortedPoints[index].value,
  }));
};
