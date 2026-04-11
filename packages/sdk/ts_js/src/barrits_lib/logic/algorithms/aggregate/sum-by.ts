export const sumBy = <Value>(
  values: readonly Value[],
  project: (value: Value, index: number, values: readonly Value[]) => number,
): number => {
  return values.reduce((total, value, index) => total + project(value, index, values), 0);
};
