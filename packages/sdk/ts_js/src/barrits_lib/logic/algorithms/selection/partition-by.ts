export type PartitionResult<Value> = {
  readonly matched: Value[];
  readonly rejected: Value[];
};

/**
 * [EN] Partitions a collection into two groups based on a predicate function.
 * [ES] Particiona una colección en dos grupos basado en una función de predicado.
 * 
 * @param values [EN] Collection to partition. [ES] Colección a particionar.
 * @param predicate [EN] Function to test each element. [ES] Función para probar cada elemento.
 * @returns [EN] Object containing matched and rejected elements. [ES] Objeto con elementos aceptados y rechazados.
 */
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