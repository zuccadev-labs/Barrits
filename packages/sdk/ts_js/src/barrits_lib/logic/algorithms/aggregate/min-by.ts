/**
 * [EN] Returns the element whose projected value is the smallest. Ties keep the first occurrence.
 * Falsy elements (`0`, `""`, `false`, `null`) are valid candidates; only an empty collection yields `undefined`.
 * `NaN` projections are ignored unless every projection is `NaN`, in which case the first element is returned.
 * [ES] Devuelve el elemento cuyo valor proyectado es el menor. En caso de empate se conserva la primera aparición.
 * Los elementos falsy (`0`, `""`, `false`, `null`) son candidatos válidos; solo una colección vacía devuelve `undefined`.
 * Las proyecciones `NaN` se ignoran salvo que todas lo sean, en cuyo caso se devuelve el primer elemento.
 *
 * @param values [EN] The collection of values. [ES] La colección de valores.
 * @param project [EN] Function to project each element to a number. [ES] Función para proyectar cada elemento a un número.
 * @returns [EN] The element with the minimum value, or undefined if empty. [ES] El elemento con el valor mínimo, o undefined si está vacía.
 */
export const minBy = <Value>(
  values: readonly Value[],
  project: (value: Value, index: number, values: readonly Value[]) => number,
): Value | undefined => {
  if (values.length === 0) {
    return undefined;
  }

  let bestValue = values[0];
  let bestKey = project(values[0], 0, values);

  for (let index = 1; index < values.length; index += 1) {
    const key = project(values[index], index, values);

    if (key < bestKey || Number.isNaN(bestKey)) {
      bestValue = values[index];
      bestKey = key;
    }
  }

  return bestValue;
};
