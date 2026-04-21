export { averageBy } from "./average-by";
export { histogramBy } from "./histogram-by";
export { maxBy } from "./max-by";
export { minBy } from "./min-by";
export { sumBy } from "./sum-by";
/**
 * [EN] Collection of data aggregation and statistical algorithms.
 * [ES] Colección de algoritmos de agregación y estadística de datos.
 */
export declare const aggregateAlgorithms: {
    /** [EN] Calculates the average. [ES] Calcula el promedio. */
    averageBy: <Value>(values: readonly Value[], project: (value: Value, index: number, values: readonly Value[]) => number) => number;
    /** [EN] Generates a frequency histogram. [ES] Genera un histograma de frecuencia. */
    histogramBy: <Value, Key extends string | number>(values: readonly Value[], selectKey: (value: Value, index: number, values: readonly Value[]) => Key) => Record<Key, number>;
    /** [EN] Finds the maximum value. [ES] Encuentra el valor máximo. */
    maxBy: <Value>(values: readonly Value[], project: (value: Value, index: number, values: readonly Value[]) => number) => Value | undefined;
    /** [EN] Finds the minimum value. [ES] Encuentra el valor mínimo. */
    minBy: <Value>(values: readonly Value[], project: (value: Value, index: number, values: readonly Value[]) => number) => Value | undefined;
    /** [EN] Calculates the sum. [ES] Calcula la suma. */
    sumBy: <Value>(values: readonly Value[], project: (value: Value, index: number, values: readonly Value[]) => number) => number;
};
