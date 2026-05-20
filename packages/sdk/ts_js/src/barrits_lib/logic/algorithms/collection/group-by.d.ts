/**
 * [EN] Implementation of Group by.
 * [ES] Implementación de Group by.
 */
export declare const groupBy: <Value, Key>(values: readonly Value[], selectKey: (value: Value, index: number, values: readonly Value[]) => Key) => Map<Key, Value[]>;
