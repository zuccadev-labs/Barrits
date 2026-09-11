import type { UnaryFunction } from "../../shared";

/**
 * Executes unary trait-compatible steps in sequence over an initial value.
 *
 * Pipes an initial trait through a series of transformation functions.
 * Each step receives the output of the previous step as input, enabling
 * fluent trait composition without nested function calls.
 *
 * @template TValue The trait or capability type being transformed through the pipeline
 * @param initialValue Starting value (typically a trait descriptor)
 * @param steps Transformation functions, each accepting and returning TValue, executed left-to-right
 * @returns Final value after all transformations applied
 * @throws Error if any step function throws
 *
 * @example
 * ```typescript
 * const baseTrait = createTraitDescriptor({
 *   name: "base",
 *   provides: ["core:service"]
 * });
 *
 * const withLogging = (trait: typeof baseTrait) => ({
 *   ...trait,
 *   provides: [...trait.provides, "logging:enabled"]
 * });
 *
 * const withMonitoring = (trait: typeof baseTrait) => ({
 *   ...trait,
 *   provides: [...trait.provides, "monitoring:enabled"]
 * });
 *
 * // Compose pipeline: base → logging → monitoring
 * const enhanced = composePipeline(baseTrait, withLogging, withMonitoring);
 * // enhanced.provides = ["core:service", "logging:enabled", "monitoring:enabled"]
 * ```
 */
export const composePipeline = <TValue>(initialValue: TValue, ...steps: UnaryFunction<TValue, TValue>[]): TValue => {
  return steps.reduce((value, step) => step(value), initialValue);
};
