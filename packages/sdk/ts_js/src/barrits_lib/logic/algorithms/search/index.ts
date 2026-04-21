import { binarySearch } from "./binary-search";
import { findSortedRange } from "./find-sorted-range";
import { linearSearch } from "./linear-search";
import { lowerBound } from "./lower-bound";
import { upperBound } from "./upper-bound";

export { binarySearch } from "./binary-search";
export type { CompareFunction } from "../internal/compare";
export { findSortedRange } from "./find-sorted-range";
export type { SortedRangeMatch } from "./find-sorted-range";
export { linearSearch } from "./linear-search";
export type { SearchPredicate } from "./linear-search";
export { lowerBound } from "./lower-bound";
export { upperBound } from "./upper-bound";

/**
 * [EN] Collection of high-performance search algorithms.
 * [ES] Colección de algoritmos de búsqueda de alto rendimiento.
 */
export const searchAlgorithms = {
  /** [EN] Binary search for sorted collections. [ES] Búsqueda binaria para colecciones ordenadas. */
  binarySearch,
  /** [EN] Finds a range of matching elements. [ES] Encuentra un rango de elementos coincidentes. */
  findSortedRange,
  /** [EN] Linear search for unsorted collections. [ES] Búsqueda lineal para colecciones no ordenadas. */
  linearSearch,
  /** [EN] Finds the inclusive lower bound. [ES] Encuentra el límite inferior inclusivo. */
  lowerBound,
  /** [EN] Finds the exclusive upper bound. [ES] Encuentra el límite superior exclusivo. */
  upperBound,
};
