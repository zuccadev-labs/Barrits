import { sumBy } from "./sum-by";

/**
 * [EN] Calculates the average value of a collection based on a projection function.
 * [ES] Calcula el valor promedio de una colección basado en una función de proyección.
 * 
 * @param values [EN] The collection of values. [ES] La colección de valores.
 * @param project [EN] Function to project each element to a number. [ES] Función para proyectar cada elemento a un número.
 * @returns [EN] The calculated average. [ES] El promedio calculado.
 */
export const averageBy = <Value>(
  values: readonly Value[],
  project: (value: Value, index: number, values: readonly Value[]) => number,
): number => {
  if (values.length === 0) {
    return 0;
  }

  return sumBy(values, project) / values.length;
};
