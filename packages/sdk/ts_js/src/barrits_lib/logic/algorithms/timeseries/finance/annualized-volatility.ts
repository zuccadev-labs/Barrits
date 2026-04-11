import { averageBy } from "../../aggregate";
import { returnsSeries } from "./returns-series";
import type { TimeSeriesPoint } from "../types";

export const annualizedVolatility = (
  points: readonly TimeSeriesPoint<number>[],
  periodsPerYear: number,
): number => {
  const returns = returnsSeries(points);

  if (returns.length === 0) {
    return 0;
  }

  const mean = averageBy(returns, (point) => point.value);
  const variance = averageBy(returns, (point) => (point.value - mean) ** 2);

  return Math.sqrt(variance) * Math.sqrt(periodsPerYear);
};
