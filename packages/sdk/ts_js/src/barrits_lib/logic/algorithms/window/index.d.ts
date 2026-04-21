export { movingAverage } from "./moving-average";
export { rollingSum } from "./rolling-sum";
export { slidingWindow } from "./sliding-window";
export { windowDelta } from "./window-delta";
export declare const windowAlgorithms: {
    movingAverage: (values: readonly number[], size: number) => number[];
    rollingSum: (values: readonly number[], size: number) => number[];
    slidingWindow: <Value>(values: readonly Value[], size: number) => Value[][];
    windowDelta: (values: readonly number[], size: number) => number[];
};
