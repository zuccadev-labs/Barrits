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

/**
 * [EN] Collection of data selection and partitioning services.
 * [ES] Colección de servicios de selección y partición de datos.
 */
export const selectionAlgorithms = {
  /** [EN] Data pagination service. [ES] Servicio de paginación de datos. */
  paginate,
  /** [EN] Collection partitioning based on predicates. [ES] Partición de colecciones basada en predicados. */
  partitionBy,
  /** [EN] Relative ranking service. [ES] Servicio de clasificación relativa. */
  rankBy,
  /** [EN] High-performance Top-K selection. [ES] Selección Top-K de alto rendimiento. */
  topK,
};