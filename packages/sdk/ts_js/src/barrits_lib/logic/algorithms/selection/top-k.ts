import type { CompareFunction, SortDirection } from "../internal/compare";
import { defaultCompare, reverseCompare } from "../internal/compare";

const swap = <Value>(heap: Value[], leftIndex: number, rightIndex: number): void => {
  [heap[leftIndex], heap[rightIndex]] = [heap[rightIndex], heap[leftIndex]];
};

const siftUp = <Value>(
  heap: Value[],
  index: number,
  compare: CompareFunction<Value>,
): void => {
  let cursor = index;

  while (cursor > 0) {
    const parentIndex = Math.floor((cursor - 1) / 2);

    if (compare(heap[cursor], heap[parentIndex]) >= 0) {
      break;
    }

    swap(heap, cursor, parentIndex);
    cursor = parentIndex;
  }
};

const siftDown = <Value>(
  heap: Value[],
  index: number,
  compare: CompareFunction<Value>,
): void => {
  let cursor = index;

  for (;;) {
    const leftIndex = (cursor * 2) + 1;
    const rightIndex = leftIndex + 1;
    let nextIndex = cursor;

    if (leftIndex < heap.length && compare(heap[leftIndex], heap[nextIndex]) < 0) {
      nextIndex = leftIndex;
    }

    if (rightIndex < heap.length && compare(heap[rightIndex], heap[nextIndex]) < 0) {
      nextIndex = rightIndex;
    }

    if (nextIndex === cursor) {
      break;
    }

    swap(heap, cursor, nextIndex);
    cursor = nextIndex;
  }
};

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
export const topK = <Value>(
  values: readonly Value[],
  k: number,
  compare: CompareFunction<Value> = defaultCompare,
  direction: SortDirection = "asc",
): Value[] => {
  const boundedCount = Math.max(0, Math.floor(k));

  if (boundedCount === 0) {
    return [];
  }

  const worstCompare = direction === "desc" ? compare : reverseCompare(compare);
  const resultCompare = direction === "desc" ? reverseCompare(compare) : compare;
  const heap: Value[] = [];

  for (const value of values) {
    if (heap.length < boundedCount) {
      heap.push(value);
      siftUp(heap, heap.length - 1, worstCompare);
      continue;
    }

    if (worstCompare(value, heap[0]) <= 0) {
      continue;
    }

    heap[0] = value;
    siftDown(heap, 0, worstCompare);
  }

  return [...heap].sort(resultCompare);
};