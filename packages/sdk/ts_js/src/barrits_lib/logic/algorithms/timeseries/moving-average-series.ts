import { averageBy } from "../aggregate";
import { slidingWindow } from "../window";
import { sortTimeSeries } from "./sort-time-series";
import type { TimeSeriesPoint } from "./types";

export const movingAverageSeries = (
  points: readonly TimeSeriesPoint<number>[],
  size: number,
): TimeSeriesPoint<number>[] => {
  const sortedPoints = sortTimeSeries(points);
  const windowPoints = slidingWindow(sortedPoints, size);

  return windowPoints.map((windowSeries) => ({
    timestamp: windowSeries.at(-1)!.timestamp,
    value: averageBy(windowSeries, (point) => point.value),
  }));
};
