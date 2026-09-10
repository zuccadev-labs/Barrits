import type { TimeSeriesPoint } from "../types";
import { sortTimeSeries } from "../sort-time-series";
import { toPositiveInteger } from "../../internal/normalize";

/**
 * [EN] Computes the Exponential Moving Average (EMA) of a time-series with a constant smoothing
 * coefficient `alpha = smoothing / (period + 1)`, the standard definition used in technical analysis.
 * The first point seeds the series; every following value is `alpha * value + (1 - alpha) * previousEma`.
 * Points are sorted by timestamp before the computation.
 * [ES] Calcula la Media Móvil Exponencial (EMA) de una serie temporal con un coeficiente de suavizado constante
 * `alpha = smoothing / (period + 1)`, la definición estándar del análisis técnico. El primer punto inicializa la
 * serie; cada valor siguiente es `alpha * valor + (1 - alpha) * emaAnterior`. Los puntos se ordenan por
 * marca de tiempo antes del cálculo.
 *
 * @param points [EN] Numeric time-series points. [ES] Puntos numéricos de series temporales.
 * @param period [EN] Look-back period in observations (e.g. 12 or 26 for daily prices; default 10). [ES] Periodo en observaciones (p. ej. 12 o 26 para precios diarios; por defecto 10).
 * @param smoothing [EN] Smoothing constant (default 2). [ES] Constante de suavizado (por defecto 2).
 * @returns [EN] A time-series of EMA values aligned with the input timestamps. [ES] Una serie temporal de valores EMA alineada con las marcas de tiempo de entrada.
 */
export const exponentialMovingAverage = (
  points: readonly TimeSeriesPoint<number>[],
  period = 10,
  smoothing = 2,
): TimeSeriesPoint<number>[] => {
  const normalizedPeriod = toPositiveInteger(period, 10);
  const alpha = smoothing / (normalizedPeriod + 1);
  const sortedPoints = sortTimeSeries(points);
  const series: TimeSeriesPoint<number>[] = [];

  for (const point of sortedPoints) {
    const previous = series.at(-1);

    if (!previous) {
      series.push(point);
      continue;
    }

    series.push({
      timestamp: point.timestamp,
      value: alpha * point.value + (1 - alpha) * previous.value,
    });
  }

  return series;
};
