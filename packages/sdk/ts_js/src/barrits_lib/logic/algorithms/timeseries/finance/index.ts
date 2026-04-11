import { annualizedVolatility } from "./annualized-volatility";
import { exponentialMovingAverage } from "./exponential-moving-average";
import { maxDrawdown } from "./max-drawdown";
import { returnsSeries } from "./returns-series";

export { annualizedVolatility } from "./annualized-volatility";
export { exponentialMovingAverage } from "./exponential-moving-average";
export { maxDrawdown } from "./max-drawdown";
export type { DrawdownPoint } from "./max-drawdown";
export { returnsSeries } from "./returns-series";

export const financeTimeSeriesAlgorithms = {
  annualizedVolatility,
  exponentialMovingAverage,
  maxDrawdown,
  returnsSeries,
};
