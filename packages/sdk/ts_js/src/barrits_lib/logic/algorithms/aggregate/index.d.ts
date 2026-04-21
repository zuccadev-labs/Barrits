export { averageBy } from "./average-by";
export { histogramBy } from "./histogram-by";
export { maxBy } from "./max-by";
export { minBy } from "./min-by";
export { sumBy } from "./sum-by";
export declare const aggregateAlgorithms: {
    averageBy: <Value>(values: readonly Value[], project: (value: Value, index: number, values: readonly Value[]) => number) => number;
    histogramBy: <Value, Key extends string | number>(values: readonly Value[], selectKey: (value: Value, index: number, values: readonly Value[]) => Key) => Record<Key, number>;
    maxBy: <Value>(values: readonly Value[], project: (value: Value, index: number, values: readonly Value[]) => number) => Value | undefined;
    minBy: <Value>(values: readonly Value[], project: (value: Value, index: number, values: readonly Value[]) => number) => Value | undefined;
    sumBy: <Value>(values: readonly Value[], project: (value: Value, index: number, values: readonly Value[]) => number) => number;
};
