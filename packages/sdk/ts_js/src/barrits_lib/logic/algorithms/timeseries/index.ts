import { bucketByInterval } from "./bucket-by-interval";
import { detectTimeSeriesGaps } from "./detect-gaps";
import { differenceSeries } from "./difference-series";
import { financeTimeSeriesAlgorithms } from "./finance";
import { movingAverageSeries } from "./moving-average-series";
import { resampleSeries } from "./resample-series";
import { sortTimeSeries } from "./sort-time-series";

export { bucketByInterval } from "./bucket-by-interval";
export { detectTimeSeriesGaps } from "./detect-gaps";
export type { TimeGap } from "./detect-gaps";
export { differenceSeries } from "./difference-series";
export { annualizedVolatility, exponentialMovingAverage, financeTimeSeriesAlgorithms, maxDrawdown, returnsSeries } from "./finance";
export type { DrawdownPoint } from "./finance";
export { movingAverageSeries } from "./moving-average-series";
export { resampleSeries } from "./resample-series";
export { sortTimeSeries } from "./sort-time-series";
export type { TimeBucket, TimeSeriesPoint } from "./types";

export const timeSeriesAlgorithms = {
  bucketByInterval,
  detectTimeSeriesGaps,
  differenceSeries,
  finance: financeTimeSeriesAlgorithms,
  movingAverageSeries,
  resampleSeries,
  sortTimeSeries,
};
