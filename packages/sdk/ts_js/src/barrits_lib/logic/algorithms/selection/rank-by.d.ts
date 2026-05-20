import type { OrderCriterion } from "../sort";
/**
 * [EN] Type definition for RankedValue.
 * [ES] Definición de tipo para RankedValue.
 */
export type RankedValue<Value> = {
    readonly value: Value;
    readonly rank: number;
    readonly ordinal: number;
};
/**
 * [EN] Ranks a collection based on ordering criteria, providing rank and ordinal metadata.
 * [ES] Clasifica una colección basada en criterios de ordenamiento, proporcionando metadatos de rango y ordinal.
 *
 * @param values [EN] Collection to rank. [ES] Colección a clasificar.
 * @param criteria [EN] Ordering criteria for ranking. [ES] Criterios de ordenamiento para la clasificación.
 * @returns [EN] List of ranked values with metadata. [ES] Lista de valores clasificados con metadatos.
 */
export declare const rankBy: <Value>(values: readonly Value[], criteria: readonly OrderCriterion<Value>[]) => RankedValue<Value>[];
