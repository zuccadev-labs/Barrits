import { sumBy } from "./sum-by";

/**
 * [EN] Calculates the arithmetic mean of the projected values. An empty collection returns `0` by contract
 * (callers that need to distinguish "no data" from "mean of zero" should check `values.length` first).
 * [ES] Calcula la media aritmética de los valores proyectados. Una colección vacía devuelve `0` por contrato
 * (quien necesite distinguir "sin datos" de "media cero" debe comprobar `values.length` antes).
 *
 * @param values [EN] The collection of values. [ES] La colección de valores.
 * @param project [EN] Function to project each element to a number. [ES] Función para proyectar cada elemento a un número.
 * @returns [EN] The calculated average, or 0 for an empty collection. [ES] El promedio calculado, o 0 para una colección vacía.
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
