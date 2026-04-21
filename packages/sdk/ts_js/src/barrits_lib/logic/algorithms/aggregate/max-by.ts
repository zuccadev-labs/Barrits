/**
 * [EN] Returns the element in a collection that has the maximum projected value.
 * [ES] Devuelve el elemento de una colección que tiene el valor proyectado máximo.
 * 
 * @param values [EN] The collection of values. [ES] La colección de valores.
 * @param project [EN] Function to project each element to a number. [ES] Función para proyectar cada elemento a un número.
 * @returns [EN] The element with the maximum value, or undefined if empty. 
 * [ES] El elemento con el valor máximo, o undefined si está vacía.
 */
export const maxBy = <Value>(
  values: readonly Value[],
  project: (value: Value, index: number, values: readonly Value[]) => number,
): Value | undefined => {
  return values.reduce<Value | undefined>((currentMax, value, index) => {
    if (!currentMax) {
      return value;
    }

    return project(value, index, values) > project(currentMax, index, values) ? value : currentMax;
  }, undefined);
};
