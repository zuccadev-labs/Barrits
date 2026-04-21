import type { CompareFunction } from "../internal/compare";
/**
 * [EN] Fast idempotent implementation of the QuickSort algorithm.
 * [ES] Implementación rápida e idempotente del algoritmo QuickSort.
 *
 * @param values [EN] Collection of values to sort. [ES] Colección de valores a ordenar.
 * @param compare [EN] Comparison algorithm (default: ascending). [ES] Algoritmo de comparación (por defecto: ascendente).
 * @returns [EN] A new sorted array. [ES] Un nuevo arreglo ordenado.
 */
export declare const quickSort: <Value>(values: readonly Value[], compare?: CompareFunction<Value>) => Value[];
