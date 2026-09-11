import { toPositiveInteger } from "../internal/normalize";

/**
 * [EN] Normalizes a window size shared by the window family (`slidingWindow`, `rollingSum`, `movingAverage`,
 * `windowDelta`): positive integer, with `NaN`/`Infinity`/values below 1 resolving to 1.
 * [ES] Normaliza el tamaño de ventana compartido por la familia window (`slidingWindow`, `rollingSum`,
 * `movingAverage`, `windowDelta`): entero positivo, con `NaN`/`Infinity`/valores menores que 1 resolviendo a 1.
 */
export const normalizeWindowSize = (size: number): number => toPositiveInteger(size, 1);

/**
 * [EN] Materializes every contiguous window of `size` elements. Returns an empty array when the collection is
 * shorter than the window. Materializing windows costs O(n · size); prefer `rollingSum`, `movingAverage` or
 * `windowDelta` for numeric aggregates, which run in O(n).
 * [ES] Materializa todas las ventanas contiguas de `size` elementos. Devuelve un array vacío si la colección es
 * más corta que la ventana. Materializar ventanas cuesta O(n · size); para agregados numéricos prefiere
 * `rollingSum`, `movingAverage` o `windowDelta`, que se ejecutan en O(n).
 *
 * @param values [EN] Collection of values. [ES] Colección de valores.
 * @param size [EN] Size of each window. [ES] Tamaño de cada ventana.
 * @returns [EN] Array of windows, each containing 'size' elements. [ES] Arreglo de ventanas, cada una con 'size' elementos.
 */
export const slidingWindow = <Value>(values: readonly Value[], size: number): Value[][] => {
  const windowSize = normalizeWindowSize(size);

  if (values.length < windowSize) {
    return [];
  }

  const windows: Value[][] = [];

  for (let index = 0; index <= values.length - windowSize; index += 1) {
    windows.push(values.slice(index, index + windowSize));
  }

  return windows;
};
