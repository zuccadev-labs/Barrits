/**
 * [EN] Truncates a string to at most `maxLength` code points, appending `ellipsis` when content was removed.
 * The ellipsis counts towards the limit, so the result never exceeds `maxLength`; when the limit is smaller
 * than the ellipsis itself, the ellipsis is truncated too. Surrogate pairs (emoji, astral characters) are
 * never split because the string is measured in code points, not UTF-16 units.
 * [ES] Recorta una cadena a como máximo `maxLength` code points, añadiendo `ellipsis` cuando se eliminó contenido.
 * La elipsis cuenta dentro del límite, por lo que el resultado nunca supera `maxLength`; si el límite es menor que
 * la propia elipsis, también se recorta la elipsis. Los pares sustitutos (emoji, caracteres astrales) nunca se parten
 * porque la cadena se mide en code points, no en unidades UTF-16.
 *
 * @param input [EN] Text to truncate. [ES] Texto a recortar.
 * @param maxLength [EN] Maximum length in code points (values below 0 are treated as 0). [ES] Longitud máxima en code points (valores menores que 0 se tratan como 0).
 * @param ellipsis [EN] Suffix marking the cut (default `…`). [ES] Sufijo que marca el corte (por defecto `…`).
 * @returns [EN] The original text when it fits, otherwise the shortened text. [ES] El texto original cuando cabe; en caso contrario, el texto acortado.
 */
export const truncate = (input: string, maxLength: number, ellipsis = "…"): string => {
  const limit = Number.isFinite(maxLength) ? Math.max(0, Math.floor(maxLength)) : 0;
  const characters = Array.from(input);

  if (characters.length <= limit) {
    return input;
  }

  const ellipsisCharacters = Array.from(ellipsis);

  if (limit <= ellipsisCharacters.length) {
    return ellipsisCharacters.slice(0, limit).join("");
  }

  return (
    characters
      .slice(0, limit - ellipsisCharacters.length)
      .join("")
      .trimEnd() + ellipsis
  );
};
