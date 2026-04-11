import type { CompareFunction } from "../internal/compare";
import { defaultCompare } from "../internal/compare";
import { lowerBound } from "../search";

export const insertSorted = <Value>(
  values: readonly Value[],
  value: Value,
  compare: CompareFunction<Value> = defaultCompare,
): Value[] => {
  const insertionIndex = lowerBound(values, value, compare);

  return [
    ...values.slice(0, insertionIndex),
    value,
    ...values.slice(insertionIndex),
  ];
};