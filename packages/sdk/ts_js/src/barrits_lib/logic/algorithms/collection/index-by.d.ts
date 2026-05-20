/**
 * [EN] Implementation of Index by.
 * [ES] Implementación de Index by.
 */
export declare const indexBy: <Value, Key>(values: readonly Value[], selectKey: (value: Value, index: number, values: readonly Value[]) => Key) => Map<Key, Value>;
