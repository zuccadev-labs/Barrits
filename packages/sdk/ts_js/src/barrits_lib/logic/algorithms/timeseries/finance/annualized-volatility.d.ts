import type { TimeSeriesPoint } from "../types";
/**
 * [EN] Calculates the annualized volatility (standard deviation of returns) for a time-series.
 * [ES] Calcula la volatilidad anualizada (desviación estándar de retornos) para una serie temporal.
 *
 * @param points [EN] Numeric time-series points. [ES] Puntos numéricos de series temporales.
 * @param periodsPerYear [EN] Number of observation periods in a year (e.g., 252 for daily stocks). [ES] Número de períodos de observación en un año (ej., 252 para acciones diarias).
 * @returns [EN] The annualized volatility value. [ES] El valor de la volatilidad anualizada.
 */
export declare const annualizedVolatility: (points: readonly TimeSeriesPoint<number>[], periodsPerYear: number) => number;
