/**
 * [EN] Creates a sliding window across a collection of values.
 * [ES] Crea una ventana deslizante a través de una colección de valores.
 * 
 * @param values [EN] Collection of values. [ES] Colección de valores.
 * @param size [EN] Size of each window. [ES] Tamaño de cada ventana.
 * @returns [EN] Array of windows, each containing 'size' elements. [ES] Arreglo de ventanas, cada una con 'size' elementos.
 */
export const slidingWindow = <Value>(values: readonly Value[], size: number): Value[][] => {
  const windowSize = Math.max(1, Math.floor(size));

  if (values.length < windowSize) {
    return [];
  }

  const windows: Value[][] = [];

  for (let index = 0; index <= values.length - windowSize; index += 1) {
    windows.push(values.slice(index, index + windowSize));
  }

  return windows;
};
