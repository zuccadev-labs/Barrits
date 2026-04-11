import type { CompareFunction } from "../internal/compare";
import { defaultCompare } from "../internal/compare";
import { lowerBound } from "./lower-bound";
import { upperBound } from "./upper-bound";

export type SortedRangeMatch = {
  readonly found: boolean;
  readonly startIndex: number;
  readonly endIndex: number;
  readonly count: number;
};

export const findSortedRange = <Value>(
  values: readonly Value[],
  target: Value,
  compare: CompareFunction<Value> = defaultCompare,
): SortedRangeMatch => {
  const startIndex = lowerBound(values, target, compare);
  const endIndex = upperBound(values, target, compare);

  return {
    found: startIndex < endIndex,
    startIndex,
    endIndex,
    count: endIndex - startIndex,
  };
};