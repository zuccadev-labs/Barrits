/**
 * [EN] Implementation of Histogram by.
 * [ES] Implementación de Histogram by.
 */
export const histogramBy = <Value, Key extends string | number>(
  values: readonly Value[],
  selectKey: (value: Value, index: number, values: readonly Value[]) => Key,
): Record<Key, number> => {
  return values.reduce<Record<Key, number>>((histogram, value, index) => {
    const key = selectKey(value, index, values);
    histogram[key] = (histogram[key] ?? 0) + 1;
    return histogram;
  }, {} as Record<Key, number>);
};
