export const maxBy = <Value>(
  values: readonly Value[],
  project: (value: Value, index: number, values: readonly Value[]) => number,
): Value | undefined => {
  return values.reduce<Value | undefined>((currentMax, value, index) => {
    if (!currentMax) {
      return value;
    }

    return project(value, index, values) > project(currentMax, index, values) ? value : currentMax;
  }, undefined);
};
