import type { UnaryFunction } from "../../shared";

/**
 * Executes unary trait-compatible steps in sequence over an initial value.
 *
 * @param initialValue Initial pipeline value.
 * @param steps Unary steps executed left-to-right.
 * @returns Final value produced by the last step.
 */
export const composePipeline = <TValue>(initialValue: TValue, ...steps: UnaryFunction<TValue, TValue>[]): TValue => {
  return steps.reduce((value, step) => step(value), initialValue);
};
