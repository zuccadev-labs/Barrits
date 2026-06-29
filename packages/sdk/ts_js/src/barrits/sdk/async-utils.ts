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
    promise.finally(() => executing.delete(promise));

    if (executing.size >= safeConcurrency) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);

  return results;
};
