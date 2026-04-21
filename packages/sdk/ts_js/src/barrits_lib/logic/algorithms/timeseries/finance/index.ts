import { annualizedVolatility } from "./annualized-volatility";
import { exponentialMovingAverage } from "./exponential-moving-average";
import { maxDrawdown } from "./max-drawdown";
import { returnsSeries } from "./returns-series";

export { annualizedVolatility } from "./annualized-volatility";
export { exponentialMovingAverage } from "./exponential-moving-average";
export { maxDrawdown } from "./max-drawdown";
export type { DrawdownPoint } from "./max-drawdown";
export { returnsSeries } from "./returns-series";

/**
 * [EN] Collection of quantitative finance algorithms.
 * [ES] Colección de algoritmos de finanzas cuantitativas.
 */
export const financeTimeSeriesAlgorithms = {
  /** [EN] Annualized volatility calculation. [ES] Cálculo de volatilidad anualizada. */
  annualizedVolatility,
  /** [EN] Exponential smoothing average. [ES] Promedio de suavizado exponencial. */
  exponentialMovingAverage,
  /** [EN] Maximum peak-to-trough decline analysis. [ES] Análisis de la máxima caída de pico a valle. */
  maxDrawdown,
  /** [EN] Returns series generation. [ES] Generación de series de retornos. */
  returnsSeries,
};
