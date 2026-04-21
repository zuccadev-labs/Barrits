import { insertSorted } from "./insert-sorted";
import { orderBy } from "./order-by";
import { quickSort } from "./quick-sort";
import { stableSortBy } from "./stable-sort-by";

export { insertSorted } from "./insert-sorted";
export { createOrderComparator, orderBy } from "./order-by";
export type { OrderCriterion } from "./order-by";
export { quickSort } from "./quick-sort";
export { stableSortBy } from "./stable-sort-by";

/**
 * [EN] Collection of sorting and ordering services.
 * [ES] Colección de servicios de ordenamiento.
 */
export const sortAlgorithms = {
  /** [EN] Inserts into a sorted array. [ES] Inserta en un arreglo ordenado. */
  insertSorted,
  /** [EN] Multi-level stable sort. [ES] Ordenamiento estable multinivel. */
  orderBy,
  /** [EN] Fast recursive sort. [ES] Ordenamiento recursivo rápido. */
  quickSort,
  /** [EN] Native-compatible stable sort. [ES] Ordenamiento estable compatible con nativo. */
  stableSortBy,
};
