import type { TimeSeriesPoint } from "../types";
/**
 * [EN] Transforms a price series into a returns series (percentage change).
 * [ES] Transforma una serie de precios en una serie de retornos (cambio porcentual).
 *
 * @param points [EN] Numeric time-series points (e.g., prices). [ES] Puntos numéricos de series temporales (ej., precios).
 * @returns [EN] A time-series of percentage returns. [ES] Una serie temporal de retornos porcentuales.
 */
export declare const returnsSeries: (points: readonly TimeSeriesPoint<number>[]) => TimeSeriesPoint<number>[];
