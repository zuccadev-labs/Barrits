import { averageBy } from "../aggregate";
import { bucketByInterval } from "./bucket-by-interval";
import type { TimeSeriesPoint } from "./types";

export const resampleSeries = (
  points: readonly TimeSeriesPoint<number>[],
  intervalMs: number,
): TimeSeriesPoint<number>[] => {
  return bucketByInterval(points, intervalMs).map((bucket) => ({
    timestamp: bucket.bucketStart,
    value: averageBy(bucket.points, (point) => point.value),
  }));
};
