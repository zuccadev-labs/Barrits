import type { CompareFunction } from "../internal/compare";
import { defaultCompare } from "../internal/compare";

const INSERTION_SORT_THRESHOLD = 16;

const insertionSort = <Value>(values: Value[], low: number, high: number, compare: CompareFunction<Value>): void => {
  for (let index = low + 1; index <= high; index += 1) {
    const current = values[index];
    let cursor = index - 1;

    while (cursor >= low && compare(values[cursor], current) > 0) {
      values[cursor + 1] = values[cursor];
      cursor -= 1;
    }

    values[cursor + 1] = current;
  }
};

const swap = <Value>(values: Value[], left: number, right: number): void => {
  const temporary = values[left];
  values[left] = values[right];
  values[right] = temporary;
};

const medianOfThree = <Value>(values: Value[], low: number, high: number, compare: CompareFunction<Value>): number => {
  const middle = low + ((high - low) >> 1);

  if (compare(values[middle], values[low]) < 0) swap(values, middle, low);
  if (compare(values[high], values[low]) < 0) swap(values, high, low);
  if (compare(values[high], values[middle]) < 0) swap(values, high, middle);

  return middle;
};

const partition = <Value>(values: Value[], low: number, high: number, compare: CompareFunction<Value>): number => {
  const pivotIndex = medianOfThree(values, low, high, compare);
  const pivot = values[pivotIndex];
  swap(values, pivotIndex, high);
  let store = low;

  for (let index = low; index < high; index += 1) {
    if (compare(values[index], pivot) < 0) {
      swap(values, index, store);
      store += 1;
    }
  }

  swap(values, store, high);
  return store;
};

/**
 * [EN] Sorts a copy of `values` with an in-place, iterative QuickSort: median-of-three pivot selection,
 * insertion sort for small partitions and an explicit stack that always recurses into the smaller side,
 * so sorted, reversed and duplicate-heavy inputs stay O(n log n) without ever overflowing the call stack.
 * The sort is **not stable**; use `stableSortBy` or `orderBy` when equal elements must keep their order.
 * [ES] Ordena una copia de `values` con un QuickSort iterativo in-place: pivote por mediana de tres, inserción
 * para particiones pequeñas y una pila explícita que siempre desciende por el lado menor, de modo que entradas
 * ordenadas, invertidas o con muchos duplicados se mantienen en O(n log n) sin desbordar la pila de llamadas.
 * El ordenamiento **no es estable**; usa `stableSortBy` u `orderBy` cuando los elementos iguales deban conservar su orden.
 *
 * @param values [EN] Collection of values to sort (not mutated). [ES] Colección de valores a ordenar (no se modifica).
 * @param compare [EN] Comparison algorithm (default: total-order ascending). [ES] Algoritmo de comparación (por defecto: orden total ascendente).
 * @returns [EN] A new sorted array. [ES] Un nuevo arreglo ordenado.
 */
export const quickSort = <Value>(values: readonly Value[], compare: CompareFunction<Value> = defaultCompare): Value[] => {
  const sorted = [...values];

  if (sorted.length <= 1) {
    return sorted;
  }

  const ranges: [number, number][] = [[0, sorted.length - 1]];

  while (ranges.length > 0) {
    const [low, high] = ranges.pop()!;

    if (high - low < INSERTION_SORT_THRESHOLD) {
      insertionSort(sorted, low, high, compare);
      continue;
    }

    const pivotIndex = partition(sorted, low, high, compare);
    const leftSize = pivotIndex - low;
    const rightSize = high - pivotIndex;

    if (leftSize > rightSize) {
      if (leftSize > 1) ranges.push([low, pivotIndex - 1]);
      if (rightSize > 1) ranges.push([pivotIndex + 1, high]);
    } else {
      if (rightSize > 1) ranges.push([pivotIndex + 1, high]);
      if (leftSize > 1) ranges.push([low, pivotIndex - 1]);
    }
  }

  return sorted;
};
