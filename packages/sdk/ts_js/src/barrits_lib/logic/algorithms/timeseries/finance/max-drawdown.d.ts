import type { TimeSeriesPoint } from "../types";
/**
 * [EN] Represents a point in a drawdown analysis.
 * [ES] Representa un punto en un análisis de drawdown (caída desde el máximo).
 */
export type DrawdownPoint = {
    readonly timestamp: number;
    readonly value: number;
    readonly peak: number;
    readonly drawdown: number;
};
/**
 * [EN] Finds the maximum drawdown (peak-to-trough decline) in a time-series.
 * [ES] Encuentra el máximo drawdown (caída del pico al valle) en una serie temporal.
 *
 * @param points [EN] Numeric time-series points. [ES] Puntos numéricos de series temporales.
 * @returns [EN] The point with the worst drawdown or null. [ES] El punto con el peor drawdown o null.
 */
export declare const maxDrawdown: (points: readonly TimeSeriesPoint<number>[]) => DrawdownPoint | null;
