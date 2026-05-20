/**
 * [EN] Implementation of Histogram by.
 * [ES] Implementación de Histogram by.
 */
export declare const histogramBy: <Value, Key extends string | number>(values: readonly Value[], selectKey: (value: Value, index: number, values: readonly Value[]) => Key) => Record<Key, number>;
