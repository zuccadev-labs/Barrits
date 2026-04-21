import { orderBy } from "../sort";
import type { TimeSeriesPoint } from "./types";

/**
 * [EN] Orders a time-series collection by timestamp in ascending order.
 * [ES] Ordena una colección de series temporales por marca de tiempo en orden ascendente.
 * 
 * @param points [EN] Collection of time-series points. [ES] Colección de puntos de series temporales.
 * @returns [EN] A new sorted time-series. [ES] Una nueva serie temporal ordenada.
 */
export const sortTimeSeries = <Value>(points: readonly TimeSeriesPoint<Value>[]): TimeSeriesPoint<Value>[] => {
  return orderBy(points, [{ project: (point) => point.timestamp, direction: "asc" }]);
};
