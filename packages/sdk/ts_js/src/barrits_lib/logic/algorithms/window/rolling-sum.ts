import { sumBy } from "../aggregate";
import { slidingWindow } from "./sliding-window";

export const rollingSum = (values: readonly number[], size: number): number[] => {
  return slidingWindow(values, size).map((windowValues) => sumBy(windowValues, (value) => value));
};
