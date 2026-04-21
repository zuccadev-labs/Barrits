/**
 * [EN] Converts a string into a URL-friendly slug. Removes special characters,
 * accents, and replaces spaces with hyphens.
 * [ES] Convierte una cadena en un slug apto para URLs. Elimina caracteres especiales,
 * acentos y reemplaza espacios por guiones.
 *
 * @param input [EN] The raw string to slugify. [ES] La cadena original para convertir en slug.
 * @returns [EN] The slugified string. [ES] La cadena convertida en slug.
 */
export declare const slugify: (input: string) => string;
