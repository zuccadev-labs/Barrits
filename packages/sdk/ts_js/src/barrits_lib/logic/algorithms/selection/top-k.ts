import type { CompareFunction, SortDirection } from "../internal/compare";
import { defaultCompare, reverseCompare } from "../internal/compare";
import { createBinaryHeap } from "../internal/binary-heap";
import { toNonNegativeInteger } from "../internal/normalize";

/**
 * [EN] Selects the K best elements of a collection in O(n log k) with a bounded binary heap, then returns
 * them sorted. With `direction: "asc"` (default) the K smallest elements come back ascending; with `"desc"`
 * the K largest come back descending. When `k` exceeds the collection size every element is returned.
 * The relative order of equal elements is not guaranteed.
 * [ES] Selecciona los K mejores elementos de una colección en O(n log k) con un montículo binario acotado y los
 * devuelve ordenados. Con `direction: "asc"` (por defecto) vuelven los K menores en orden ascendente; con
 * `"desc"`, los K mayores en orden descendente. Si `k` supera el tamaño de la colección se devuelven todos.
 * El orden relativo de elementos iguales no está garantizado.
 *
 * @param values [EN] The collection of values. [ES] La colección de valores.
 * @param k [EN] Number of elements to extract (values below 0 or non-finite yield an empty result). [ES] Número de elementos a extraer (valores menores que 0 o no finitos devuelven vacío).
 * @param compare [EN] Comparison algorithm. [ES] Algoritmo de comparación.
 * @param direction [EN] Sorting direction (default: 'asc'). [ES] Dirección de ordenamiento.
 * @returns [EN] The top K elements. [ES] Los primeros K elementos.
 */
export const topK = <Value>(
  values: readonly Value[],
  k: number,
  compare: CompareFunction<Value> = defaultCompare,
  direction: SortDirection = "asc",
): Value[] => {
  const boundedCount = toNonNegativeInteger(k, 0);

  if (boundedCount === 0) {
    return [];
  }

  const worstCompare = direction === "desc" ? compare : reverseCompare(compare);
  const resultCompare = direction === "desc" ? reverseCompare(compare) : compare;
  const heap = createBinaryHeap(worstCompare);

  for (const value of values) {
    if (heap.size() < boundedCount) {
      heap.push(value);
      continue;
    }

    const worst = heap.peek() as Value;

    if (worstCompare(value, worst) > 0) {
      heap.replaceTop(value);
    }
  }

  return heap.toArray().sort(resultCompare);
};
