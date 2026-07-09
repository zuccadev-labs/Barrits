import { sortTimeSeries } from "./sort-time-series";
import type { TimeSeriesPoint } from "./types";

/**
 * [EN] Type definition for TimeGap.
 * [ES] Definición de tipo para TimeGap.
 */
export type TimeGap = {
  /** [EN] From. [ES] Desde. */
  readonly from: number;
  /** [EN] To. [ES] Hasta. */
  readonly to: number;
  /** [EN] Duration ms. [ES] Duración ms. */
  readonly durationMs: number;
};

/**
 * [EN] Detects gaps in a time-series based on an expected interval.
 * [ES] Detecta brechas en una serie temporal basada en un intervalo esperado.
 * 
 * @param points [EN] Time-series points. [ES] Puntos de series temporales.
 * @param expectedIntervalMs [EN] Maximum allowed interval between points. [ES] Intervalo máximo permitido entre puntos.
 * @returns [EN] List of detected time gaps with duration metadata. [ES] Lista de brechas de tiempo detectadas con metadatos.
 */
export const detectTimeSeriesGaps = <Value>(
  points: readonly TimeSeriesPoint<Value>[],
  expectedIntervalMs: number,
): TimeGap[] => {
  const sortedPoints = sortTimeSeries(points);
  const normalizedExpectedInterval = Math.max(1, Math.floor(expectedIntervalMs));
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
