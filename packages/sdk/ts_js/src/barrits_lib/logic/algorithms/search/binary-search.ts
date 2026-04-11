import type { CompareFunction } from "../internal/compare";
import { defaultCompare } from "../internal/compare";
import { lowerBound } from "./lower-bound";

export const binarySearch = <Value>(
  values: readonly Value[],
  target: Value,
  compare: CompareFunction<Value> = defaultCompare,
): number => {
  const matchIndex = lowerBound(values, target, compare);

  if (matchIndex >= values.length) {
    return -1;
  }

  return compare(values[matchIndex], target) === 0 ? matchIndex : -1;
};
