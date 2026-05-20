/**
 * [EN] Implementation of Unique by.
 * [ES] Implementación de Unique by.
 */
export const uniqueBy = <Value, Key>(
  values: readonly Value[],
  selectKey: (value: Value, index: number, values: readonly Value[]) => Key,
): Value[] => {
  const seenKeys = new Set<Key>();

  return values.filter((value, index) => {
    const key = selectKey(value, index, values);

    if (seenKeys.has(key)) {
      return false;
    }

    seenKeys.add(key);
    return true;
  });
};