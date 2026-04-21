import type { CompareFunction } from "../internal/compare";
import { defaultCompare } from "../internal/compare";
import { lowerBound } from "../search";

/**
 * [EN] Inserts a value into a sorted collection while maintaining the order.
 * [ES] Inserta un valor en una colección ordenada manteniendo el orden.
 * 
 * @param values [EN] Sorted collection. [ES] Colección ordenada.
 * @param value [EN] Value to insert. [ES] Valor a insertar.
 * @param compare [EN] Comparison function. [ES] Función de comparación.
 * @returns [EN] A new sorted array with the value inserted. [ES] Un nuevo arreglo ordenado con el valor insertado.
 */
export const insertSorted = <Value>(
  values: readonly Value[],
  value: Value,
  compare: CompareFunction<Value> = defaultCompare,
): Value[] => {
  const insertionIndex = lowerBound(values, value, compare);

  return [
    ...values.slice(0, insertionIndex),
    value,
    ...values.slice(insertionIndex),
  ];
};