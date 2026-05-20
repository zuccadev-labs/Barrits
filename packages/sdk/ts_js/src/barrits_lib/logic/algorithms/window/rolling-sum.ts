import { sumBy } from "../aggregate";
import { slidingWindow } from "./sliding-window";

/**
 * [EN] Implementation of Rolling sum.
 * [ES] Implementación de Rolling sum.
 */
export const rollingSum = (values: readonly number[], size: number): number[] => {
  return slidingWindow(values, size).map((windowValues) => sumBy(windowValues, (value) => value));
};
