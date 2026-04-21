import type { CompareFunction } from "../internal/compare";
import { defaultCompare } from "../internal/compare";
import { lowerBound } from "./lower-bound";

/**
 * [EN] Performs a binary search on a sorted collection. 
 * Returns the index of the element if found, or -1 otherwise.
 * [ES] Realiza una búsqueda binaria en una colección ordenada.
 * Devuelve el índice del elemento si se encuentra, o -1 en caso contrario.
 * 
 * @param values [EN] Sorted collection of values. [ES] Colección de valores ordenada.
 * @param target [EN] The value to search for. [ES] El valor a buscar.
 * @param compare [EN] Comparison function (default: ascending). [ES] Función de comparación (por defecto: ascendente).
 * @returns [EN] Index of target or -1. [ES] Índice del objetivo o -1.
 */
export const binarySearch = <Value>(
  values: readonly Value[],
  target: Value,
  compare: CompareFunction<Value> = defaultCompare,
): number => {
  const matchIndex = lowerBound(values, target, compare);

  if (matchIndex >= values.length) {
    return -1;
  }

  return compare(values[matchIndex], target) === 0 ? matchIndex : -1;
};
