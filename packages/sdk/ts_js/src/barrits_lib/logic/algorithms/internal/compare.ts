export type CompareFunction<Value> = (left: Value, right: Value) => number;

export type SortDirection = "asc" | "desc";

export type Projection<Value, Result> = (value: Value) => Result;

export const defaultCompare = <Value>(left: Value, right: Value): number => {
  if (Object.is(left, right)) {
    return 0;
  }

  return left > right ? 1 : -1;
};

export const reverseCompare = <Value>(compare: CompareFunction<Value>): CompareFunction<Value> => {
  return (left, right) => compare(right, left);
};

export const createCompareBy = <Value, Result>(
  project: Projection<Value, Result>,
  direction: SortDirection = "asc",
  compare: CompareFunction<Result> = defaultCompare,
): CompareFunction<Value> => {
  const baseCompare: CompareFunction<Value> = (left, right) => compare(project(left), project(right));
  return direction === "desc" ? reverseCompare(baseCompare) : baseCompare;
};

export const chainComparators = <Value>(comparators: readonly CompareFunction<Value>[]): CompareFunction<Value> => {
  return (left, right) => {
    for (const compare of comparators) {
      const result = compare(left, right);

      if (result !== 0) {
        return result;
      }
    }

    return 0;
  };
};