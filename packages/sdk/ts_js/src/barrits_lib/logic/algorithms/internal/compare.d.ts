/**
 * [EN] Function signature for comparing two values.
 * Returns < 0 if left < right, 0 if equal, and > 0 if left > right.
 * [ES] Firma de función para comparar dos valores.
 * Devuelve < 0 si left < right, 0 si son iguales, y > 0 si left > right.
 */
export type CompareFunction<Value> = (left: Value, right: Value) => number;
export type SortDirection = "asc" | "desc";
export type Projection<Value, Result> = (value: Value) => Result;
/**
 * [EN] The default comparison algorithm. Uses standard operators and Object.is for identity.
 * [ES] El algoritmo de comparación por defecto. Usa operadores estándar y Object.is para identidad.
 *
 * @param left [EN] Left operand. [ES] Operando izquierdo.
 * @param right [EN] Right operand. [ES] Operando derecho.
 * @returns [EN] Comparison result. [ES] Resultado de la comparación.
 */
export declare const defaultCompare: <Value>(left: Value, right: Value) => number;
/**
 * [EN] Inverts a comparison function's logic (ASC <=> DESC).
 * [ES] Invierte la lógica de una función de comparación (ASC <=> DESC).
 *
 * @param compare [EN] Original comparison function. [ES] Función de comparación original.
 * @returns [EN] Inverted comparison function. [ES] Función de comparación invertida.
 */
export declare const reverseCompare: <Value>(compare: CompareFunction<Value>) => CompareFunction<Value>;
/**
 * [EN] Higher-order function to create a comparator based on a property projection.
 * [ES] Función de orden superior para crear un comparador basado en una proyección de propiedad.
 *
 * @param project [EN] Mapping function for the target property. [ES] Función de mapeo para la propiedad objetivo.
 * @param direction [EN] Sort direction (default: 'asc'). [ES] Dirección de ordenamiento.
 * @param compare [EN] Base comparison algorithm. [ES] Algoritmo de comparación base.
 * @returns [EN] A domain-specific comparator. [ES] Un comparador específico del dominio.
 */
export declare const createCompareBy: <Value, Result>(project: Projection<Value, Result>, direction?: SortDirection, compare?: CompareFunction<Result>) => CompareFunction<Value>;
/**
 * [EN] Combines multiple comparators into a single prioritized chain.
 * [ES] Combina múltiples comparadores en una sola cadena de prioridad.
 *
 * @param comparators [EN] Ordered list of comparators. [ES] Lista ordenada de comparadores.
 * @returns [EN] A composite comparator. [ES] Un comparador compuesto.
 */
export declare const chainComparators: <Value>(comparators: readonly CompareFunction<Value>[]) => CompareFunction<Value>;
