/**
 * [EN] Type definition for NumberInput.
 * [ES] Definición de tipo para NumberInput.
 */
export type NumberInput = number | `${number}`;
/**
 * [EN] Type definition for UnaryFunction.
 * [ES] Definición de tipo para UnaryFunction.
 */
export type UnaryFunction<TInput, TOutput> = (input: TInput) => TOutput;
