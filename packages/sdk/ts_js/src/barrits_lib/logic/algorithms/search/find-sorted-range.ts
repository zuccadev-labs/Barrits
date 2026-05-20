import type { CompareFunction } from "../internal/compare";
import { defaultCompare } from "../internal/compare";
import { lowerBound } from "./lower-bound";
import { upperBound } from "./upper-bound";

/**
 * [EN] Type definition for SortedRangeMatch.
 * [ES] Definición de tipo para SortedRangeMatch.
 */
export type SortedRangeMatch = {
  readonly found: boolean;
  readonly startIndex: number;
  readonly endIndex: number;
  readonly count: number;
};

/**
 * [EN] Finds the range of elements matching a value in a sorted collection.
 * [ES] Encuentra el rango de elementos que coinciden con un valor en una colección ordenada.
 * 
 * @param values [EN] Sorted collection of values. [ES] Colección de valores ordenada.
 * @param target [EN] The value to match. [ES] El valor a coincidir.
 * @param compare [EN] Comparison function. [ES] Función de comparación.
 * @returns [EN] Match statistics (found, startIndex, endIndex, count). 
 * [ES] Estadísticas de coincidencia (encontrado, índice inicial, índice final, cuenta).
 */
export const findSortedRange = <Value>(
  values: readonly Value[],
  target: Value,
  compare: CompareFunction<Value> = defaultCompare,
): SortedRangeMatch => {
  const startIndex = lowerBound(values, target, compare);
  const endIndex = upperBound(values, target, compare);

  return {
    found: startIndex < endIndex,
    startIndex,
    endIndex,
    count: endIndex - startIndex,
  };
};