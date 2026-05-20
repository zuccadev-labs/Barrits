/**
 * [EN] Type definition for SearchPredicate.
 * [ES] Definición de tipo para SearchPredicate.
 */
export type SearchPredicate<Value> = (value: Value, index: number, values: readonly Value[]) => boolean;

/**
 * [EN] Implementation of Linear search.
 * [ES] Implementación de Linear search.
 */
export const linearSearch = <Value>(
  values: readonly Value[],
  matcher: SearchPredicate<Value> | Value,
): number => {
  const predicate: SearchPredicate<Value> = typeof matcher === "function"
    ? matcher as SearchPredicate<Value>
    : (value) => Object.is(value, matcher);

  for (const [index, value] of values.entries()) {
    if (predicate(value, index, values)) {
      return index;
    }
  }

  return -1;
};
