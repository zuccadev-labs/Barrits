/**
 * [EN] Converts a string into a URL-friendly slug: accented letters are transliterated to their base
 * letter (`café` → `cafe`, `São` → `sao`) via Unicode NFKD decomposition, the result is lower-cased,
 * every run of characters outside `a-z0-9` becomes a single hyphen, and leading/trailing hyphens are removed.
 * The function is idempotent: `slugify(slugify(x)) === slugify(x)`.
 * [ES] Convierte una cadena en un slug apto para URLs: las letras acentuadas se transliteran a su letra base
 * (`café` → `cafe`, `São` → `sao`) mediante descomposición Unicode NFKD, el resultado pasa a minúsculas, cada
 * secuencia de caracteres fuera de `a-z0-9` se convierte en un único guion y se eliminan los guiones extremos.
 * La función es idempotente: `slugify(slugify(x)) === slugify(x)`.
 *
 * @param input [EN] The raw string to slugify. [ES] La cadena original para convertir en slug.
 * @returns [EN] The slugified string (may be empty when no alphanumeric character survives). [ES] La cadena convertida en slug (puede ser vacía si no sobrevive ningún carácter alfanumérico).
 */
export const slugify = (input: string): string =>
  input
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .replace(/ß/g, "ss")
    .replace(/æ/gi, "ae")
    .replace(/ø/gi, "o")
    .replace(/œ/gi, "oe")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
