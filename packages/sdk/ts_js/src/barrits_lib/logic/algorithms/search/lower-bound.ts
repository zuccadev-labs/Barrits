import type { CompareFunction } from "../internal/compare";
import { defaultCompare } from "../internal/compare";

export const lowerBound = <Value>(
  values: readonly Value[],
  target: Value,
  compare: CompareFunction<Value> = defaultCompare,
): number => {
  let leftIndex = 0;
  let rightIndex = values.length;

  while (leftIndex < rightIndex) {
    const middleIndex = Math.floor((leftIndex + rightIndex) / 2);

    if (compare(values[middleIndex], target) < 0) {
      leftIndex = middleIndex + 1;
      continue;
    }

    rightIndex = middleIndex;
  }

  return leftIndex;
};