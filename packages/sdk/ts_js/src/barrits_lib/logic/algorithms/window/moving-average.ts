import { normalizeWindowSize } from "./sliding-window";
import { rollingSum } from "./rolling-sum";

/**
 * [EN] Computes the simple moving average of every contiguous window of `size` values in O(n)
 * (`rollingSum` divided by the window size). Returns an empty array when the input is shorter than the window.
 * [ES] Calcula el promedio móvil simple de cada ventana contigua de `size` valores en O(n) (`rollingSum`
 * dividido por el tamaño de la ventana). Devuelve un array vacío si la entrada es más corta que la ventana.
 *
 * @param values [EN] Numeric values. [ES] Valores numéricos.
 * @param size [EN] Sliding window size. [ES] Tamaño de la ventana deslizante.
 * @returns [EN] Array of moving averages. [ES] Arreglo de promedios móviles.
 */
export const movingAverage = (values: readonly number[], size: number): number[] => {
  const windowSize = normalizeWindowSize(size);
  return rollingSum(values, windowSize).map((sum) => sum / windowSize);
};
