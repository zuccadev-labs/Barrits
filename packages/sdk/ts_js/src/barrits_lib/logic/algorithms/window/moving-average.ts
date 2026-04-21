import { averageBy } from "../aggregate";
import { slidingWindow } from "./sliding-window";

/**
 * [EN] Calculates the simple moving average over a sliding window.
 * [ES] Calcula el promedio móvil simple sobre una ventana deslizante.
 * 
 * @param values [EN] Numeric values. [ES] Valores numéricos.
 * @param size [EN] Sliding window size. [ES] Tamaño de la ventana deslizante.
 * @returns [EN] Array of moving averages. [ES] Arreglo de promedios móviles.
 */
export const movingAverage = (values: readonly number[], size: number): number[] => {
  return slidingWindow(values, size).map((windowValues) => averageBy(windowValues, (value) => value));
};
