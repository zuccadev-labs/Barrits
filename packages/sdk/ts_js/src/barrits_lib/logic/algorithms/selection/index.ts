import { paginate } from "./paginate";
import { partitionBy } from "./partition-by";
import { rankBy } from "./rank-by";
import { topK } from "./top-k";

export { paginate } from "./paginate";
export type { PaginatedResult, PaginationOptions } from "./paginate";
export { partitionBy } from "./partition-by";
export type { PartitionResult } from "./partition-by";
export { rankBy } from "./rank-by";
export type { RankedValue } from "./rank-by";
export { topK } from "./top-k";

export const selectionAlgorithms = {
  paginate,
  partitionBy,
  rankBy,
  topK,
};