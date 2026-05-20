import type { CompareFunction, SortDirection } from "../internal/compare";
import { defaultCompare, reverseCompare } from "../internal/compare";

/**
 * [EN] Implementation of Stable sort by.
 * [ES] Implementación de Stable sort by.
 */
export const stableSortBy = <Value, Result>(
  values: readonly Value[],
  rank: (value: Value) => Result,
  options: {
    readonly direction?: SortDirection;
    readonly compare?: CompareFunction<Result>;
  } = {},
): Value[] => {
  const compareRank = options.compare ?? defaultCompare;
  const compare = options.direction === "desc" ? reverseCompare(compareRank) : compareRank;

  return values
    .map((value, index) => ({
      value,
      index,
      rank: rank(value),
    }))
    .sort((left, right) => {
      const rankComparison = compare(left.rank, right.rank);

      if (rankComparison === 0) {
        return left.index - right.index;
      }

      return rankComparison;
    })
    .map((entry) => entry.value);
};
