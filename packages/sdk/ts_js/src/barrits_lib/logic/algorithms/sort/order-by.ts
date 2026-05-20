import type { CompareFunction, SortDirection } from "../internal/compare";
import { chainComparators, createCompareBy, defaultCompare } from "../internal/compare";

/**
 * [EN] Type definition for OrderCriterion.
 * [ES] Definición de tipo para OrderCriterion.
 */
export type OrderCriterion<Value, Result = unknown> = {
  readonly project: (value: Value) => Result;
  readonly direction?: SortDirection;
  readonly compare?: CompareFunction<Result>;
};

/**
 * [EN] Creates a complex comparison function by chaining multiple criteria.
 * [ES] Crea una función de comparación compleja encadenando múltiples criterios.
 * 
 * @param criteria [EN] List of ordering criteria. [ES] Lista de criterios de ordenamiento.
 * @returns [EN] A composite comparator function. [ES] Una función de comparación compuesta.
 */
export const createOrderComparator = <Value>(
  criteria: readonly OrderCriterion<Value>[],
): CompareFunction<Value> => {
  if (criteria.length === 0) {
    return () => 0;
  }

  return chainComparators(criteria.map((criterion) => {
    return createCompareBy(
      criterion.project,
      criterion.direction ?? "asc",
      criterion.compare ?? (defaultCompare as CompareFunction<unknown>),
    ) as CompareFunction<Value>;
  }));
};

/**
 * [EN] High-level stable ordering service based on multiple projection criteria.
 * [ES] Servicio de ordenamiento estable de alto nivel basado en múltiples criterios de proyección.
 * 
 * @param values [EN] Collection to sort. [ES] Colección a ordenar.
 * @param criteria [EN] List of ordering criteria. [ES] Lista de criterios de ordenamiento.
 * @returns [EN] A new ordered array. [ES] Un nuevo arreglo ordenado.
 */
export const orderBy = <Value>(
  values: readonly Value[],
  criteria: readonly OrderCriterion<Value>[],
): Value[] => {
  const compare = createOrderComparator(criteria);
  return [...values].sort(compare);
};