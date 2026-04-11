export type NumberInput = number | `${number}`;

export type UnaryFunction<TInput, TOutput> = (input: TInput) => TOutput;