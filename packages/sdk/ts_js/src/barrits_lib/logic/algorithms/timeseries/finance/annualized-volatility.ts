import { averageBy } from "../../aggregate";
import { returnsSeries } from "./returns-series";
import type { TimeSeriesPoint } from "../types";

/**
 * [EN] Options for `annualizedVolatility`.
 * [ES] Opciones de `annualizedVolatility`.
 */
export type AnnualizedVolatilityOptions = {
  /**
   * [EN] Use the unbiased sample variance (divide by `n - 1`, the convention in finance) instead of the population
   * variance (divide by `n`). Defaults to `false` to preserve the historical behaviour of this function.
   * [ES] Usar la varianza muestral insesgada (dividir por `n - 1`, la convención en finanzas) en lugar de la varianza
   * poblacional (dividir por `n`). Por defecto `false` para preservar el comportamiento histórico de esta función.
   */
  readonly sample?: boolean;
};

/**
 * [EN] Calculates the annualized volatility of a price series: the standard deviation of its simple returns
 * (see `returnsSeries`) scaled by `sqrt(periodsPerYear)`. Returns `0` when fewer than two prices are available
 * (or fewer than three with `sample: true`).
 * [ES] Calcula la volatilidad anualizada de una serie de precios: la desviación estándar de sus retornos simples
 * (ver `returnsSeries`) escalada por `sqrt(periodsPerYear)`. Devuelve `0` cuando hay menos de dos precios (o menos de
 * tres con `sample: true`).
 *
 * @param points [EN] Numeric time-series points (prices). [ES] Puntos numéricos de series temporales (precios).
 * @param periodsPerYear [EN] Number of observation periods in a year (e.g. 252 for daily stocks). [ES] Número de períodos de observación en un año (ej., 252 para acciones diarias).
 * @param options [EN] Variance estimator selection. [ES] Selección del estimador de varianza.
 * @returns [EN] The annualized volatility value. [ES] El valor de la volatilidad anualizada.
 */
export const annualizedVolatility = (
  points: readonly TimeSeriesPoint<number>[],
  periodsPerYear: number,
  options: AnnualizedVolatilityOptions = {},
): number => {
  const returns = returnsSeries(points);
  const divisor = options.sample ? returns.length - 1 : returns.length;

  if (returns.length === 0 || divisor <= 0) {
    return 0;
  }

  const mean = averageBy(returns, (point) => point.value);
  const squaredDeviations = returns.reduce((total, point) => total + (point.value - mean) ** 2, 0);

  return Math.sqrt(squaredDeviations / divisor) * Math.sqrt(periodsPerYear);
};
