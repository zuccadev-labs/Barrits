import type { CompareFunction } from "../internal/compare";
/**
 * [EN] Finds the lower bound (first occurrence or insertion point) for a target in a sorted collection.
 * [ES] Encuentra el límite inferior (primera coincidencia o punto de inserción) para un objetivo en una colección ordenada.
 *
 * @param values [EN] Sorted collection of values. [ES] Colección de valores ordenada.
 * @param target [EN] The value to search for. [ES] El valor a buscar.
 * @param compare [EN] Comparison function. [ES] Función de comparación.
 * @returns [EN] The lower bound index. [ES] El índice del límite inferior.
 */
export declare const lowerBound: <Value>(values: readonly Value[], target: Value, compare?: CompareFunction<Value>) => number;
