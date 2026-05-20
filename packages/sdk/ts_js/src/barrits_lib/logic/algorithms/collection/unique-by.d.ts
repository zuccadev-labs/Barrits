/**
 * [EN] Implementation of Unique by.
 * [ES] Implementación de Unique by.
 */
export declare const uniqueBy: <Value, Key>(values: readonly Value[], selectKey: (value: Value, index: number, values: readonly Value[]) => Key) => Value[];
