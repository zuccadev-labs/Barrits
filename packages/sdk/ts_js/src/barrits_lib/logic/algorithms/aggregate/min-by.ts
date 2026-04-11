export const minBy = <Value>(
  values: readonly Value[],
  project: (value: Value, index: number, values: readonly Value[]) => number,
): Value | undefined => {
  return values.reduce<Value | undefined>((currentMin, value, index) => {
    if (!currentMin) {
      return value;
    }

    return project(value, index, values) < project(currentMin, index, values) ? value : currentMin;
  }, undefined);
};
