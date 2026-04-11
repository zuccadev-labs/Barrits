import { averageBy, bucketByInterval, detectTimeSeriesGaps, differenceSeries, movingAverageSeries, resampleSeries } from "barrits";

const latencySeries = [
  { timestamp: 1_710_000_000_000, value: 120 },
  { timestamp: 1_710_000_060_000, value: 140 },
  { timestamp: 1_710_000_120_000, value: 180 },
  { timestamp: 1_710_000_300_000, value: 150 },
  { timestamp: 1_710_000_360_000, value: 170 },
];

export const createTimeSeriesExamples = () => {
  return {
    aggregate: {
      averageLatency: averageBy(latencySeries, (point) => point.value),
      sampledBuckets: bucketByInterval(latencySeries, 120_000).length,
    },
    timeseries: {
      buckets: bucketByInterval(latencySeries, 120_000),
      gaps: detectTimeSeriesGaps(latencySeries, 60_000),
      derivatives: differenceSeries(latencySeries),
      movingAverage: movingAverageSeries(latencySeries, 2),
      resampled: resampleSeries(latencySeries, 120_000),
    },
  };
};
