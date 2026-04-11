import { insertSorted } from "./insert-sorted";
import { orderBy } from "./order-by";
import { quickSort } from "./quick-sort";
import { stableSortBy } from "./stable-sort-by";

export { insertSorted } from "./insert-sorted";
export { createOrderComparator, orderBy } from "./order-by";
export type { OrderCriterion } from "./order-by";
export { quickSort } from "./quick-sort";
export { stableSortBy } from "./stable-sort-by";

export const sortAlgorithms = {
  insertSorted,
  orderBy,
  quickSort,
  stableSortBy,
};
