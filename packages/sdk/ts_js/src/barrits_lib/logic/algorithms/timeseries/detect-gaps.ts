import { sortTimeSeries } from "./sort-time-series";
import { toPositiveInteger } from "../internal/normalize";
import type { TimeSeriesPoint } from "./types";

/**
 * [EN] Interval between two consecutive points whose distance exceeded the expected cadence.
 * [ES] Intervalo entre dos puntos consecutivos cuya distancia superó la cadencia esperada.
 */
export type TimeGap = {
  /** [EN] Timestamp of the point before the gap. [ES] Marca de tiempo del punto anterior a la brecha. */
  readonly from: number;
  /** [EN] Timestamp of the point after the gap. [ES] Marca de tiempo del punto posterior a la brecha. */
  readonly to: number;
  /** [EN] Gap duration in milliseconds (`to - from`). [ES] Duración de la brecha en milisegundos (`to - from`). */
  readonly durationMs: number;
};

/**
 * [EN] Detects gaps in a time-series: any pair of chronologically consecutive points separated by more than
 * `expectedIntervalMs`. Points are sorted first; `expectedIntervalMs` is normalized to a positive integer
 * (`NaN`/`Infinity`/values below 1 become 1).
 * [ES] Detecta brechas en una serie temporal: cualquier par de puntos cronológicamente consecutivos separados por más de
 * `expectedIntervalMs`. Los puntos se ordenan primero; `expectedIntervalMs` se normaliza a un entero positivo
 * (`NaN`/`Infinity`/valores menores que 1 pasan a 1).
 *
 * @param points [EN] Time-series points. [ES] Puntos de series temporales.
 * @param expectedIntervalMs [EN] Maximum allowed interval between points. [ES] Intervalo máximo permitido entre puntos.
 * @returns [EN] List of detected time gaps with duration metadata. [ES] Lista de brechas de tiempo detectadas con metadatos.
 */
export const detectTimeSeriesGaps = <Value>(points: readonly TimeSeriesPoint<Value>[], expectedIntervalMs: number): TimeGap[] => {
  const sortedPoints = sortTimeSeries(points);
  const normalizedExpectedInterval = toPositiveInteger(expectedIntervalMs, 1);
  const gaps: TimeGap[] = [];

  for (let index = 1; index < sortedPoints.length; index += 1) {
    const previousPoint = sortedPoints[index - 1];
    const currentPoint = sortedPoints[index];
    const delta = currentPoint.timestamp - previousPoint.timestamp;

    if (delta > normalizedExpectedInterval) {
      gaps.push({
        from: previousPoint.timestamp,
        to: currentPoint.timestamp,
        durationMs: delta,
      });
    }
  }

  return gaps;
};
