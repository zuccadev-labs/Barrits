import { averageBy } from "./average-by";
import { histogramBy } from "./histogram-by";
import { maxBy } from "./max-by";
import { minBy } from "./min-by";
import { sumBy } from "./sum-by";

export { averageBy } from "./average-by";
export { histogramBy } from "./histogram-by";
export { maxBy } from "./max-by";
export { minBy } from "./min-by";
export { sumBy } from "./sum-by";

/**
 * [EN] Collection of data aggregation and statistical algorithms.
 * [ES] Colección de algoritmos de agregación y estadística de datos.
 */
export const aggregateAlgorithms = {
  /** [EN] Calculates the average. [ES] Calcula el promedio. */
  averageBy,
  /** [EN] Generates a frequency histogram. [ES] Genera un histograma de frecuencia. */
  histogramBy,
  /** [EN] Finds the maximum value. [ES] Encuentra el valor máximo. */
  maxBy,
  /** [EN] Finds the minimum value. [ES] Encuentra el valor mínimo. */
  minBy,
  /** [EN] Calculates the sum. [ES] Calcula la suma. */
  sumBy,
};
