/**
 * [EN] Implementation of Index by.
 * [ES] Implementación de Index by.
 */
export const indexBy = <Value, Key>(
  values: readonly Value[],
  selectKey: (value: Value, index: number, values: readonly Value[]) => Key,
): Map<Key, Value> => {
  return values.reduce((indexMap, value, index) => {
    indexMap.set(selectKey(value, index, values), value);
    return indexMap;
  }, new Map<Key, Value>());
};