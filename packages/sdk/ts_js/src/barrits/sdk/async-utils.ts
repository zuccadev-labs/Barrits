/**
 * [EN] Maps an array of items concurrently with a bounded concurrency limit.
 * [ES] Mapea un array de elementos de forma concurrente con un límite de concurrencia acotado.
 */
export const mapConcurrent = async <T, U>(
  items: readonly T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<U>,
): Promise<U[]> => {
  const safeConcurrency = concurrency > 0 && Number.isFinite(concurrency) ? concurrency : 1;
  const results: U[] = [];
  const executing = new Set<Promise<void>>();

  for (let index = 0; index < items.length; index++) {
    const promise = fn(items[index], index).then((result) => {
      results[index] = result;
    });

    executing.add(promise);
    promise.finally(() => executing.delete(promise)).catch(() => undefined);

    if (executing.size >= safeConcurrency) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);

  return results;
};
