import type { OrderCriterion } from "../sort";
import { createOrderComparator, orderBy } from "../sort";

export type RankedValue<Value> = {
  readonly value: Value;
  readonly rank: number;
  readonly ordinal: number;
};

export const rankBy = <Value>(
  values: readonly Value[],
  criteria: readonly OrderCriterion<Value>[],
): RankedValue<Value>[] => {
  const sortedValues = orderBy(values, criteria);
  const compare = createOrderComparator(criteria);

  return sortedValues.map((value, index) => {
    if (index === 0) {
      return { value, rank: 1, ordinal: 1 };
    }

    const previousEntry = sortedValues[index - 1];
    const previousRank = compare(previousEntry, value) === 0
      ? undefined
      : index + 1;

    return {
      value,
      rank: previousRank ?? 0,
      ordinal: index + 1,
    };
  }).reduce<RankedValue<Value>[]>((rankedValues, entry) => {
    const previousEntry = rankedValues.at(-1);
    const rank = entry.rank === 0 && previousEntry ? previousEntry.rank : entry.rank;
    rankedValues.push({
      ...entry,
      rank,
    });
    return rankedValues;
  }, []);
};