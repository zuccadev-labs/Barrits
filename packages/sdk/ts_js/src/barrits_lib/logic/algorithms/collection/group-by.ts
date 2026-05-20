/**
 * [EN] Implementation of Group by.
 * [ES] Implementación de Group by.
 */
export const groupBy = <Value, Key>(
  values: readonly Value[],
  selectKey: (value: Value, index: number, values: readonly Value[]) => Key,
): Map<Key, Value[]> => {
  return values.reduce((groups, value, index) => {
    const key = selectKey(value, index, values);
    const existingGroup = groups.get(key);

    if (existingGroup) {
      existingGroup.push(value);
      return groups;
    }

    groups.set(key, [value]);
    return groups;
  }, new Map<Key, Value[]>());
};