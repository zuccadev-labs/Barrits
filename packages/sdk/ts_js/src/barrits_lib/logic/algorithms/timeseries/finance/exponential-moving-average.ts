import type { TimeSeriesPoint } from "../types";
import { sortTimeSeries } from "../sort-time-series";

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
