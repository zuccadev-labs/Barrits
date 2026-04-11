import { slidingWindow } from "./sliding-window";

export const windowDelta = (values: readonly number[], size: number): number[] => {
  return slidingWindow(values, size).map((windowValues) => windowValues.at(-1)! - windowValues[0]);
};
