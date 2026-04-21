export { chunk } from "./chunk";
export { groupBy } from "./group-by";
export { indexBy } from "./index-by";
export { uniqueBy } from "./unique-by";
export declare const collectionAlgorithms: {
    chunk: <Value>(values: readonly Value[], size: number) => Value[][];
    groupBy: <Value, Key>(values: readonly Value[], selectKey: (value: Value, index: number, values: readonly Value[]) => Key) => Map<Key, Value[]>;
    indexBy: <Value, Key>(values: readonly Value[], selectKey: (value: Value, index: number, values: readonly Value[]) => Key) => Map<Key, Value>;
    uniqueBy: <Value, Key>(values: readonly Value[], selectKey: (value: Value, index: number, values: readonly Value[]) => Key) => Value[];
};
