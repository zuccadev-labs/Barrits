export { annualizedVolatility } from "./annualized-volatility";
export { exponentialMovingAverage } from "./exponential-moving-average";
export { maxDrawdown } from "./max-drawdown";
export type { DrawdownPoint } from "./max-drawdown";
export { returnsSeries } from "./returns-series";
/**
 * [EN] Collection of quantitative finance algorithms.
 * [ES] Colección de algoritmos de finanzas cuantitativas.
 */
export declare const financeTimeSeriesAlgorithms: {
    /** [EN] Annualized volatility calculation. [ES] Cálculo de volatilidad anualizada. */
    annualizedVolatility: (points: readonly import("..").TimeSeriesPoint<number>[], periodsPerYear: number) => number;
    /** [EN] Exponential smoothing average. [ES] Promedio de suavizado exponencial. */
    exponentialMovingAverage: (points: readonly import("..").TimeSeriesPoint<number>[], smoothingFactor?: number) => import("..").TimeSeriesPoint<number>[];
    /** [EN] Maximum peak-to-trough decline analysis. [ES] Análisis de la máxima caída de pico a valle. */
    maxDrawdown: (points: readonly import("..").TimeSeriesPoint<number>[]) => import("./max-drawdown").DrawdownPoint | null;
    /** [EN] Returns series generation. [ES] Generación de series de retornos. */
    returnsSeries: (points: readonly import("..").TimeSeriesPoint<number>[]) => import("..").TimeSeriesPoint<number>[];
};
