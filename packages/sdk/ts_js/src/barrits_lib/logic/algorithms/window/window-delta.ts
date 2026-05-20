import { slidingWindow } from "./sliding-window";

/**
 * [EN] Implementation of Window delta.
 * [ES] Implementación de Window delta.
 */
export const windowDelta = (values: readonly number[], size: number): number[] => {
  return slidingWindow(values, size).map((windowValues) => windowValues.at(-1)! - windowValues[0]);
};
