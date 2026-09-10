import { normalizeWindowSize } from "./sliding-window";

/**
 * [EN] Computes the sum of every contiguous window of `size` values in O(n) with a running total
 * (add the incoming value, subtract the outgoing one). Returns an empty array when the input is shorter
 * than the window. Because the total is carried across windows, results for non-integer inputs may differ
 * from a fresh per-window sum by floating-point rounding.
 * [ES] Calcula la suma de cada ventana contigua de `size` valores en O(n) con un total acumulado (se suma el
 * valor entrante y se resta el saliente). Devuelve un array vacío si la entrada es más corta que la ventana.
 * Como el total se arrastra entre ventanas, para entradas no enteras el resultado puede diferir de una suma
 * independiente por ventana por redondeo en coma flotante.
 *
 * @param values [EN] Numeric values. [ES] Valores numéricos.
 * @param size [EN] Window size. [ES] Tamaño de la ventana.
 * @returns [EN] One sum per window. [ES] Una suma por ventana.
 */
export const rollingSum = (values: readonly number[], size: number): number[] => {
  const windowSize = normalizeWindowSize(size);

  if (values.length < windowSize) {
    return [];
  }

  const sums: number[] = [];
  let total = 0;

  for (let index = 0; index < values.length; index += 1) {
    total += values[index];

    if (index >= windowSize) {
      total -= values[index - windowSize];
    }

    if (index >= windowSize - 1) {
      sums.push(total);
    }
  }

  return sums;
};
