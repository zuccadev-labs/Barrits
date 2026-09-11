import { normalizeWindowSize } from "./sliding-window";

/**
 * [EN] Computes, for every contiguous window of `size` values, the difference between its last and first
 * element (`values[i + size - 1] - values[i]`) in O(n). Returns an empty array when the input is shorter
 * than the window; a window of size 1 yields zeros.
 * [ES] Calcula, para cada ventana contigua de `size` valores, la diferencia entre su último y su primer elemento
 * (`values[i + size - 1] - values[i]`) en O(n). Devuelve un array vacío si la entrada es más corta que la
 * ventana; una ventana de tamaño 1 produce ceros.
 *
 * @param values [EN] Numeric values. [ES] Valores numéricos.
 * @param size [EN] Window size. [ES] Tamaño de la ventana.
 * @returns [EN] One delta per window. [ES] Un delta por ventana.
 */
export const windowDelta = (values: readonly number[], size: number): number[] => {
  const windowSize = normalizeWindowSize(size);

  if (values.length < windowSize) {
    return [];
  }

  const deltas: number[] = [];

  for (let index = 0; index + windowSize <= values.length; index += 1) {
    deltas.push(values[index + windowSize - 1] - values[index]);
  }

  return deltas;
};
