import type { OrderCriterion } from "../sort";
import { createOrderComparator, orderBy } from "../sort";

export type RankedValue<Value> = {
  readonly value: Value;
  readonly rank: number;
  readonly ordinal: number;
};

/**
 * [EN] Ranks a collection based on ordering criteria, providing rank and ordinal metadata.
 * [ES] Clasifica una colección basada en criterios de ordenamiento, proporcionando metadatos de rango y ordinal.
 * 
 * @param values [EN] Collection to rank. [ES] Colección a clasificar.
 * @param criteria [EN] Ordering criteria for ranking. [ES] Criterios de ordenamiento para la clasificación.
 * @returns [EN] List of ranked values with metadata. [ES] Lista de valores clasificados con metadatos.
 */
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