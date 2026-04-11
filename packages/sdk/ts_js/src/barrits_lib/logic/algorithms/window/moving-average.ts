import { averageBy } from "../aggregate";
import { slidingWindow } from "./sliding-window";

export const movingAverage = (values: readonly number[], size: number): number[] => {
  return slidingWindow(values, size).map((windowValues) => averageBy(windowValues, (value) => value));
};
