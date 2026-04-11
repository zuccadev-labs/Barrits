import { sortTimeSeries } from "./sort-time-series";
import type { TimeBucket, TimeSeriesPoint } from "./types";

export const bucketByInterval = <Value>(
  points: readonly TimeSeriesPoint<Value>[],
  intervalMs: number,
): TimeBucket<Value>[] => {
  const normalizedInterval = Math.max(1, Math.floor(intervalMs));
  const sortedPoints = sortTimeSeries(points);
  const buckets = new Map<number, TimeSeriesPoint<Value>[]>();

  for (const point of sortedPoints) {
    const bucketStart = Math.floor(point.timestamp / normalizedInterval) * normalizedInterval;
    const bucketPoints = buckets.get(bucketStart);

    if (bucketPoints) {
      bucketPoints.push(point);
      continue;
    }

    buckets.set(bucketStart, [point]);
  }

  return Array.from(buckets.entries()).map(([bucketStart, bucketPoints]) => ({
    bucketStart,
    bucketEnd: bucketStart + normalizedInterval,
    points: bucketPoints,
  }));
};
