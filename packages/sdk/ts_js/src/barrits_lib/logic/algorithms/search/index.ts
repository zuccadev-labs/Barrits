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

export const searchAlgorithms = {
  binarySearch,
  findSortedRange,
  linearSearch,
  lowerBound,
  upperBound,
};
