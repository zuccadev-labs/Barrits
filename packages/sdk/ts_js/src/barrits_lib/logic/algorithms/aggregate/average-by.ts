import { sumBy } from "./sum-by";

export const averageBy = <Value>(
  values: readonly Value[],
  project: (value: Value, index: number, values: readonly Value[]) => number,
): number => {
  if (values.length === 0) {
    return 0;
  }

  return sumBy(values, project) / values.length;
};
