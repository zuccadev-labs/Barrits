/**
 * [EN] Type definition for SearchPredicate.
 * [ES] Definición de tipo para SearchPredicate.
 */
export type SearchPredicate<Value> = (value: Value, index: number, values: readonly Value[]) => boolean;
/**
 * [EN] Implementation of Linear search.
 * [ES] Implementación de Linear search.
 */
export declare const linearSearch: <Value>(values: readonly Value[], matcher: SearchPredicate<Value> | Value) => number;
