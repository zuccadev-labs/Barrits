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

  while (true) {
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

export const topK = <Value>(
  values: readonly Value[],
  count: number,
  compare: CompareFunction<Value> = defaultCompare,
  direction: SortDirection = "desc",
): Value[] => {
  const boundedCount = Math.max(0, Math.floor(count));

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