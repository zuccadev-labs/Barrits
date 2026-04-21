export { movingAverage } from "./moving-average";
export { rollingSum } from "./rolling-sum";
export { slidingWindow } from "./sliding-window";
export { windowDelta } from "./window-delta";
/**
 * [EN] Collection of window-based data processing algorithms.
 * [ES] Colección de algoritmos de procesamiento de datos por ventanas.
 */
export declare const windowAlgorithms: {
    /** [EN] Calculation of moving averages. [ES] Cálculo de promedios móviles. */
    movingAverage: (values: readonly number[], size: number) => number[];
    /** [EN] Real-time rolling sum calculation. [ES] Cálculo de suma acumulada en tiempo real. */
    rollingSum: (values: readonly number[], size: number) => number[];
    /** [EN] Sliding window generator. [ES] Generador de ventanas deslizantes. */
    slidingWindow: <Value>(values: readonly Value[], size: number) => Value[][];
    /** [EN] Delta calculation within a window. [ES] Cálculo de delta dentro de una ventana. */
    windowDelta: (values: readonly number[], size: number) => number[];
};
