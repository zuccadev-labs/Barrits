import type { CompareFunction } from "./compare";

/**
 * [EN] Minimal binary heap ordered by a comparator: the element that compares lowest is always at the top.
 * Shared by `topK` and `dijkstraShortestPath` so both stay O(n log k) / O((V + E) log V).
 * [ES] Montículo binario mínimo ordenado por un comparador: el elemento que compara más bajo siempre está en la cima.
 * Compartido por `topK` y `dijkstraShortestPath` para mantenerlos en O(n log k) / O((V + E) log V).
 */
export type BinaryHeap<Value> = {
  /** [EN] Number of stored elements. [ES] Número de elementos almacenados. */
  readonly size: () => number;
  /** [EN] Lowest element without removing it. [ES] Elemento más bajo sin extraerlo. */
  readonly peek: () => Value | undefined;
  /** [EN] Inserts an element. [ES] Inserta un elemento. */
  readonly push: (value: Value) => void;
  /** [EN] Removes and returns the lowest element. [ES] Extrae y devuelve el elemento más bajo. */
  readonly pop: () => Value | undefined;
  /** [EN] Replaces the top element and restores the heap property in one pass. [ES] Reemplaza la cima y restaura la propiedad del montículo en una pasada. */
  readonly replaceTop: (value: Value) => void;
  /** [EN] Snapshot of the stored elements in no particular order. [ES] Copia de los elementos sin orden garantizado. */
  readonly toArray: () => Value[];
};

/**
 * [EN] Creates an empty binary heap for the given comparator.
 * [ES] Crea un montículo binario vacío para el comparador indicado.
 *
 * @param compare - [EN] Comparator defining the priority (lowest first). [ES] Comparador que define la prioridad (el más bajo primero).
 * @returns [EN] Heap operations bound to an internal array. [ES] Operaciones del montículo ligadas a un array interno.
 */
export const createBinaryHeap = <Value>(compare: CompareFunction<Value>): BinaryHeap<Value> => {
  const heap: Value[] = [];

  const swap = (leftIndex: number, rightIndex: number): void => {
    const temporary = heap[leftIndex];
    heap[leftIndex] = heap[rightIndex];
    heap[rightIndex] = temporary;
  };

  const siftUp = (index: number): void => {
    let cursor = index;

    while (cursor > 0) {
      const parentIndex = Math.floor((cursor - 1) / 2);

      if (compare(heap[cursor], heap[parentIndex]) >= 0) {
        break;
      }

      swap(cursor, parentIndex);
      cursor = parentIndex;
    }
  };

  const siftDown = (index: number): void => {
    let cursor = index;

    for (;;) {
      const leftIndex = cursor * 2 + 1;
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

      swap(cursor, nextIndex);
      cursor = nextIndex;
    }
  };

  return {
    size: () => heap.length,
    peek: () => heap[0],
    push: (value) => {
      heap.push(value);
      siftUp(heap.length - 1);
    },
    pop: () => {
      if (heap.length === 0) {
        return undefined;
      }

      const top = heap[0];
      const last = heap.pop() as Value;

      if (heap.length > 0) {
        heap[0] = last;
        siftDown(0);
      }

      return top;
    },
    replaceTop: (value) => {
      if (heap.length === 0) {
        heap.push(value);
        return;
      }

      heap[0] = value;
      siftDown(0);
    },
    toArray: () => [...heap],
  };
};
