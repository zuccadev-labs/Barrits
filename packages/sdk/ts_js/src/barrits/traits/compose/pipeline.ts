import type { UnaryFunction } from "../../shared";

export const composePipeline = <TValue>(
  initialValue: TValue,
  ...steps: Array<UnaryFunction<TValue, TValue>>
): TValue => {
  return steps.reduce((value, step) => step(value), initialValue);
};