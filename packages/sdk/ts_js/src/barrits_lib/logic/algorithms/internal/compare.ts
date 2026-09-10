/**
 * [EN] Function signature for comparing two values.
 * Returns < 0 if left < right, 0 if equal, and > 0 if left > right.
 * [ES] Firma de función para comparar dos valores.
 * Devuelve < 0 si left < right, 0 si son iguales, y > 0 si left > right.
 */
export type CompareFunction<Value> = (left: Value, right: Value) => number;

/**
 * [EN] Sort direction accepted by ordering helpers (`asc` ascending, `desc` descending).
 * [ES] Dirección de ordenación aceptada por los helpers (`asc` ascendente, `desc` descendente).
 */
export type SortDirection = "asc" | "desc";

/**
 * [EN] Function that projects a value to the key used for comparison or grouping.
 * [ES] Función que proyecta un valor a la clave usada para comparación o agrupación.
 */
export type Projection<Value, Result> = (value: Value) => Result;

const isNaNValue = (value: unknown): boolean => {
  return typeof value === "number" && Number.isNaN(value);
};

/**
 * [EN] Default comparison algorithm defining a total order compatible with `Array.prototype.sort`:
 * - equal values (including `0` and `-0`) compare as `0`;
 * - `NaN` is treated as greater than every number and equal to itself, so it always sorts last
 *   and the comparator stays antisymmetric;
 * - values that are neither `<` nor `>` each other (incomparable objects) compare as `0`.
 * [ES] Algoritmo de comparación por defecto que define un orden total compatible con `Array.prototype.sort`:
 * - los valores iguales (incluidos `0` y `-0`) comparan como `0`;
 * - `NaN` se trata como mayor que cualquier número e igual a sí mismo, de modo que siempre queda al final
 *   y el comparador se mantiene antisimétrico;
 * - los valores que no son ni `<` ni `>` entre sí (objetos incomparables) comparan como `0`.
 *
 * @param left [EN] Left operand. [ES] Operando izquierdo.
 * @param right [EN] Right operand. [ES] Operando derecho.
 * @returns [EN] Negative, zero or positive comparison result. [ES] Resultado negativo, cero o positivo.
 */
export const defaultCompare = <Value>(left: Value, right: Value): number => {
  if (left === right) {
    return 0;
  }

  const leftIsNaN = isNaNValue(left);
  const rightIsNaN = isNaNValue(right);

  if (leftIsNaN || rightIsNaN) {
    if (leftIsNaN && rightIsNaN) {
      return 0;
    }

    return leftIsNaN ? 1 : -1;
  }

  if (left < right) {
    return -1;
  }

  if (left > right) {
    return 1;
  }

  return 0;
};

/**
 * [EN] Inverts a comparison function's logic (ASC <=> DESC).
 * [ES] Invierte la lógica de una función de comparación (ASC <=> DESC).
 *
 * @param compare [EN] Original comparison function. [ES] Función de comparación original.
 * @returns [EN] Inverted comparison function. [ES] Función de comparación invertida.
 */
export const reverseCompare = <Value>(compare: CompareFunction<Value>): CompareFunction<Value> => {
  return (left, right) => compare(right, left);
};

/**
 * [EN] Higher-order function to create a comparator based on a property projection.
 * [ES] Función de orden superior para crear un comparador basado en una proyección de propiedad.
 *
 * @param project [EN] Mapping function for the target property. [ES] Función de mapeo para la propiedad objetivo.
 * @param direction [EN] Sort direction (default: 'asc'). [ES] Dirección de ordenamiento.
 * @param compare [EN] Base comparison algorithm. [ES] Algoritmo de comparación base.
 * @returns [EN] A domain-specific comparator. [ES] Un comparador específico del dominio.
 */
export const createCompareBy = <Value, Result>(
  project: Projection<Value, Result>,
  direction: SortDirection = "asc",
  compare: CompareFunction<Result> = defaultCompare,
): CompareFunction<Value> => {
  const baseCompare: CompareFunction<Value> = (left, right) => compare(project(left), project(right));
  return direction === "desc" ? reverseCompare(baseCompare) : baseCompare;
};

/**
 * [EN] Combines multiple comparators into a single prioritized chain.
 * [ES] Combina múltiples comparadores en una sola cadena de prioridad.
 *
 * @param comparators [EN] Ordered list of comparators. [ES] Lista ordenada de comparadores.
 * @returns [EN] A composite comparator. [ES] Un comparador compuesto.
 */
export const chainComparators = <Value>(comparators: readonly CompareFunction<Value>[]): CompareFunction<Value> => {
  return (left, right) => {
    for (const compare of comparators) {
      const result = compare(left, right);

      if (result !== 0) {
        return result;
      }
    }

    return 0;
  };
};

/**
 * [EN] Comparator helpers exposed as a family so consumers can build comparators consistent with the library.
 * [ES] Helpers de comparación expuestos como familia para que los consumidores construyan comparadores coherentes con la librería.
 */
export const comparators = {
  /** [EN] Total-order default comparator. [ES] Comparador por defecto de orden total. */
  defaultCompare,
  /** [EN] Inverts a comparator. [ES] Invierte un comparador. */
  reverseCompare,
  /** [EN] Builds a comparator from a projection. [ES] Construye un comparador a partir de una proyección. */
  createCompareBy,
  /** [EN] Chains comparators by priority. [ES] Encadena comparadores por prioridad. */
  chainComparators,
} as const;
