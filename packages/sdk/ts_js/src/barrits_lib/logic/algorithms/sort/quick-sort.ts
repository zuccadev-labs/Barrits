import type { CompareFunction } from "../internal/compare";
import { defaultCompare } from "../internal/compare";

/**
 * [EN] Fast idempotent implementation of the QuickSort algorithm.
 * [ES] Implementación rápida e idempotente del algoritmo QuickSort.
 * 
 * @param values [EN] Collection of values to sort. [ES] Colección de valores a ordenar.
 * @param compare [EN] Comparison algorithm (default: ascending). [ES] Algoritmo de comparación (por defecto: ascendente).
 * @returns [EN] A new sorted array. [ES] Un nuevo arreglo ordenado.
 */
export const quickSort = <Value>(
  values: readonly Value[],
  compare: CompareFunction<Value> = defaultCompare,
): Value[] => {
  if (values.length <= 1) {
    return [...values];
  }

  const [pivot, ...rest] = values;
  const lowerValues = rest.filter((value) => compare(value, pivot) <= 0);
  const greaterValues = rest.filter((value) => compare(value, pivot) > 0);

  return [
    ...quickSort(lowerValues, compare),
    pivot,
    ...quickSort(greaterValues, compare),
  ];
};
