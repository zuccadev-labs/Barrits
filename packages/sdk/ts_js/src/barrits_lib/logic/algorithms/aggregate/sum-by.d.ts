/**
 * [EN] Calculates the sum of a collection based on a projection function.
 * [ES] Calcula la suma de una colección basado en una función de proyección.
 *
 * @param values [EN] The collection of values. [ES] La colección de valores.
 * @param project [EN] Function to project each element to a number. [ES] Función para proyectar cada elemento a un número.
 * @returns [EN] The total sum. [ES] La suma total.
 */
export declare const sumBy: <Value>(values: readonly Value[], project: (value: Value, index: number, values: readonly Value[]) => number) => number;
