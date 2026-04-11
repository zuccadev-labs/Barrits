import type { CompareFunction } from "../internal/compare";
import { defaultCompare } from "../internal/compare";

export const quickSort = <Value>(
  values: readonly Value[],
  compare: CompareFunction<Value> = defaultCompare,
): Value[] => {
  if (values.length <= 1) {
    return [...values];
  }

  const [pivot, ...rest] = values;
  const lowerValues = rest.filter((value) => compare(value, pivot) <= 0);
  const greaterValues = rest.filter((value) => compare(value, pivot) > 0);

  return [
    ...quickSort(lowerValues, compare),
    pivot,
    ...quickSort(greaterValues, compare),
  ];
};
