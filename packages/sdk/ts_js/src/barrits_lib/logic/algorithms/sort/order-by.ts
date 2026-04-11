import type { CompareFunction, SortDirection } from "../internal/compare";
import { chainComparators, createCompareBy, defaultCompare } from "../internal/compare";

export type OrderCriterion<Value, Result = unknown> = {
  readonly project: (value: Value) => Result;
  readonly direction?: SortDirection;
  readonly compare?: CompareFunction<Result>;
};

export const createOrderComparator = <Value>(
  criteria: readonly OrderCriterion<Value>[],
): CompareFunction<Value> => {
  if (criteria.length === 0) {
    return () => 0;
  }

  return chainComparators(criteria.map((criterion) => {
    return createCompareBy(
      criterion.project,
      criterion.direction ?? "asc",
      criterion.compare ?? (defaultCompare as CompareFunction<unknown>),
    ) as CompareFunction<Value>;
  }));
};

export const orderBy = <Value>(
  values: readonly Value[],
  criteria: readonly OrderCriterion<Value>[],
): Value[] => {
  const compare = createOrderComparator(criteria);
  return [...values].sort(compare);
};