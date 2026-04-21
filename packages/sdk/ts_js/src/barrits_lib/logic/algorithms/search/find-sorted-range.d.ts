import type { CompareFunction } from "../internal/compare";
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
export declare const findSortedRange: <Value>(values: readonly Value[], target: Value, compare?: CompareFunction<Value>) => SortedRangeMatch;
