/**
 * [EN] Function signature for comparing two values. 
 * Returns < 0 if left < right, 0 if equal, and > 0 if left > right.
 * [ES] Firma de función para comparar dos valores.
 * Devuelve < 0 si left < right, 0 si son iguales, y > 0 si left > right.
 */
export type CompareFunction<Value> = (left: Value, right: Value) => number;

/**
 * [EN] Type definition for SortDirection.
 * [ES] Definición de tipo para SortDirection.
 */
export type SortDirection = "asc" | "desc";

/**
 * [EN] Type definition for Projection.
 * [ES] Definición de tipo para Projection.
 */
export type Projection<Value, Result> = (value: Value) => Result;

/**
 * [EN] The default comparison algorithm. Uses standard operators and Object.is for identity.
 * [ES] El algoritmo de comparación por defecto. Usa operadores estándar y Object.is para identidad.
 * 
 * @param left [EN] Left operand. [ES] Operando izquierdo.
 * @param right [EN] Right operand. [ES] Operando derecho.
 * @returns [EN] Comparison result. [ES] Resultado de la comparación.
 */
export const defaultCompare = <Value>(left: Value, right: Value): number => {
  if (Object.is(left, right)) {
    return 0;
  }

  return left > right ? 1 : -1;
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