import { chunk } from "./chunk";
import { groupBy } from "./group-by";
import { indexBy } from "./index-by";
import { uniqueBy } from "./unique-by";

export { chunk } from "./chunk";
export { groupBy } from "./group-by";
export { indexBy } from "./index-by";
export { uniqueBy } from "./unique-by";

/**
 * [EN] Implementation of Collection algorithms.
 * [ES] Implementación de Collection algorithms.
 */
export const collectionAlgorithms = {
  /** [EN] Splits a list into consecutive chunks of the given size. [ES] Divide una lista en fragmentos consecutivos del tamaño indicado. */
  chunk,
  /** [EN] Groups elements into a Map keyed by the selected key. [ES] Agrupa elementos en un Map indexado por la clave seleccionada. */
  groupBy,
  /** [EN] Indexes elements into a Map by the selected key (last occurrence wins). [ES] Indexa elementos en un Map por la clave seleccionada (la última ocurrencia prevalece). */
  indexBy,
  /** [EN] Returns elements keeping only the first occurrence of each selected key. [ES] Devuelve elementos conservando solo la primera ocurrencia de cada clave seleccionada. */
  uniqueBy,
};