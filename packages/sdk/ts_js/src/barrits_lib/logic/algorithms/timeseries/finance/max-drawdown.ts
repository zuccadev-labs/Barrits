import type { TimeSeriesPoint } from "../types";
import { sortTimeSeries } from "../sort-time-series";

/**
 * [EN] Represents a point in a drawdown analysis.
 * [ES] Representa un punto en un análisis de drawdown (caída desde el máximo).
 */
export type DrawdownPoint = {
  /** [EN] Point timestamp. [ES] Marca de tiempo del punto. */
  readonly timestamp: number;
  /** [EN] Current value at the point. [ES] Valor actual en el punto. */
  readonly value: number;
  /** [EN] Peak value up to this point. [ES] Valor máximo hasta este punto. */
  readonly peak: number;
  /** [EN] Drawdown ratio (negative or zero, e.g. -0.25 for a 25% decline). [ES] Ratio de drawdown (negativo o cero, p. ej. -0.25 para una caída del 25%). */
  readonly drawdown: number;
};

/**
 * [EN] Finds the maximum drawdown (largest peak-to-trough decline) of a series of positive values such as prices
 * or equity curves. Drawdown is `(value - peak) / peak`, so the input must be strictly positive: with zero or
 * negative values the ratio has no financial meaning and a `RangeError` is thrown. Returns `null` for an empty series.
 * [ES] Encuentra el máximo drawdown (mayor caída de pico a valle) de una serie de valores positivos como precios o curvas
 * de capital. El drawdown es `(valor - pico) / pico`, por lo que la entrada debe ser estrictamente positiva: con
 * valores cero o negativos el ratio no tiene sentido financiero y se lanza `RangeError`. Devuelve `null` para una serie vacía.
 *
 * @param points [EN] Positive numeric time-series points. [ES] Puntos numéricos positivos de series temporales.
 * @returns [EN] The point with the worst drawdown or null. [ES] El punto con el peor drawdown o null.
 * @throws RangeError - [EN] When a value is not a positive finite number. [ES] Cuando un valor no es un número finito positivo.
 */
export const maxDrawdown = (points: readonly TimeSeriesPoint<number>[]): DrawdownPoint | null => {
  const sortedPoints = sortTimeSeries(points);
  let peak = Number.NEGATIVE_INFINITY;
  let worstPoint: DrawdownPoint | null = null;

  for (const point of sortedPoints) {
    if (!Number.isFinite(point.value) || point.value <= 0) {
      throw new RangeError(`maxDrawdown requires strictly positive values (timestamp ${point.timestamp} has ${point.value}).`);
    }

    peak = Math.max(peak, point.value);
    const drawdown = (point.value - peak) / peak;

    if (!worstPoint || drawdown < worstPoint.drawdown) {
      worstPoint = {
        timestamp: point.timestamp,
        value: point.value,
        peak,
        drawdown,
      };
    }
  }

  return worstPoint;
};
