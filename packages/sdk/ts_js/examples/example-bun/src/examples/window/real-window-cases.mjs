import { movingAverage, rollingSum, slidingWindow, windowDelta } from "@zuccadev-labs/barrits";

const throughputPerMinute = [120, 132, 140, 138, 155, 160, 172];

export const createWindowExamples = () => {
  return {
    slidingPairs: slidingWindow(throughputPerMinute, 2),
    movingAverage3: movingAverage(throughputPerMinute, 3),
    rollingSum3: rollingSum(throughputPerMinute, 3),
    windowDelta4: windowDelta(throughputPerMinute, 4),
  };
};
