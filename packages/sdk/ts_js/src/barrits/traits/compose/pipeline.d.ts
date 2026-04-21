import type { UnaryFunction } from "../../shared";
/**
 * Executes unary trait-compatible steps in sequence over an initial value.
 *
 * @param initialValue Initial pipeline value.
 * @param steps Unary steps executed left-to-right.
 * @returns Final value produced by the last step.
 */
export declare const composePipeline: <TValue>(initialValue: TValue, ...steps: Array<UnaryFunction<TValue, TValue>>) => TValue;
