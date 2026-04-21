export { annualizedVolatility } from "./annualized-volatility";
export { exponentialMovingAverage } from "./exponential-moving-average";
export { maxDrawdown } from "./max-drawdown";
export type { DrawdownPoint } from "./max-drawdown";
export { returnsSeries } from "./returns-series";
export declare const financeTimeSeriesAlgorithms: {
    annualizedVolatility: (points: readonly import("..").TimeSeriesPoint<number>[], periodsPerYear: number) => number;
    exponentialMovingAverage: (points: readonly import("..").TimeSeriesPoint<number>[], smoothingFactor?: number) => import("..").TimeSeriesPoint<number>[];
    maxDrawdown: (points: readonly import("..").TimeSeriesPoint<number>[]) => import("./max-drawdown").DrawdownPoint | null;
    returnsSeries: (points: readonly import("..").TimeSeriesPoint<number>[]) => import("..").TimeSeriesPoint<number>[];
};
