import type { CompareFunction } from "../internal/compare";
/**
 * [EN] Finds the upper bound (first element greater than target) in a sorted collection.
 * [ES] Encuentra el límite superior (primer elemento mayor que el objetivo) en una colección ordenada.
 *
 * @param values [EN] Sorted collection of values. [ES] Colección de valores ordenada.
 * @param target [EN] The value to search for. [ES] El valor a buscar.
 * @param compare [EN] Comparison function. [ES] Función de comparación.
 * @returns [EN] The upper bound index. [ES] El índice del límite superior.
 */
export declare const upperBound: <Value>(values: readonly Value[], target: Value, compare?: CompareFunction<Value>) => number;
