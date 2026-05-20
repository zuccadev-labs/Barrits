import type { TimeSeriesPoint } from "./types";
/**
 * [EN] Type definition for TimeGap.
 * [ES] Definición de tipo para TimeGap.
 */
export type TimeGap = {
    readonly from: number;
    readonly to: number;
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
export declare const detectTimeSeriesGaps: <Value>(points: readonly TimeSeriesPoint<Value>[], expectedIntervalMs: number) => TimeGap[];
