import { orderBy } from "../sort";
import type { TimeSeriesPoint } from "./types";

export const sortTimeSeries = <Value>(points: readonly TimeSeriesPoint<Value>[]): TimeSeriesPoint<Value>[] => {
  return orderBy(points, [{ project: (point) => point.timestamp, direction: "asc" }]);
};
