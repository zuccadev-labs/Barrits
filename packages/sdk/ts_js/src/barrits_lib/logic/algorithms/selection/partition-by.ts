export type PartitionResult<Value> = {
  readonly matched: Value[];
  readonly rejected: Value[];
};

export const partitionBy = <Value>(
  values: readonly Value[],
  predicate: (value: Value, index: number, values: readonly Value[]) => boolean,
): PartitionResult<Value> => {
  const matched: Value[] = [];
  const rejected: Value[] = [];

  values.forEach((value, index) => {
    if (predicate(value, index, values)) {
      matched.push(value);
      return;
    }

    rejected.push(value);
  });

  return { matched, rejected };
};