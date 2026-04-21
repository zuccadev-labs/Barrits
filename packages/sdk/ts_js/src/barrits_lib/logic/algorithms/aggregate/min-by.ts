/**
 * [EN] Returns the element in a collection that has the minimum projected value.
 * [ES] Devuelve el elemento de una colección que tiene el valor proyectado mínimo.
 * 
 * @param values [EN] The collection of values. [ES] La colección de valores.
 * @param project [EN] Function to project each element to a number. [ES] Función para proyectar cada elemento a un número.
 * @returns [EN] The element with the minimum value, or undefined if empty. 
 * [ES] El elemento con el valor mínimo, o undefined si está vacía.
 */
export const minBy = <Value>(
  values: readonly Value[],
  project: (value: Value, index: number, values: readonly Value[]) => number,
): Value | undefined => {
  return values.reduce<Value | undefined>((currentMin, value, index) => {
    if (!currentMin) {
      return value;
    }

    return project(value, index, values) < project(currentMin, index, values) ? value : currentMin;
  }, undefined);
};
