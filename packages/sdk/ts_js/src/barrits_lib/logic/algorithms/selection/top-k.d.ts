import type { CompareFunction, SortDirection } from "../internal/compare";
/**
 * [EN] Efficiently extracts the top K elements from a collection based on a comparison function.
 * [ES] Extrae eficientemente los primeros K elementos de una colección basado en una función de comparación.
 *
 * @param values [EN] The collection of values. [ES] La colección de valores.
 * @param k [EN] Number of elements to extract. [ES] Número de elementos a extraer.
 * @param compare [EN] Comparison algorithm. [ES] Algoritmo de comparación.
 * @param direction [EN] Sorting direction (default: 'asc'). [ES] Dirección de ordenamiento.
 * @returns [EN] The top K elements. [ES] Los primeros K elementos.
 */
export declare const topK: <Value>(values: readonly Value[], k: number, compare?: CompareFunction<Value>, direction?: SortDirection) => Value[];
