/**
 * [EN] Capitalizes the first letter of a string and lowercases the rest.
 * [ES] Pone en mayúscula la primera letra de una cadena y el resto en minúscula.
 *
 * @param input [EN] The string to capitalize. [ES] La cadena a capitalizar.
 * @returns [EN] The capitalized string. [ES] La cadena capitalizada.
 */
export const capitalize = (input: string): string => {
  if (input.length === 0) {
    return input;
  }

  const [first, ...rest] = Array.from(input);
  return first.toUpperCase() + rest.join("").toLowerCase();
};

/**
 * [EN] Upper-cases the first letter of every word. A word starts at the beginning of the string or after any
 * character that is neither a letter nor a digit (spaces, hyphens, punctuation), and letters are detected with
 * Unicode properties, so `élan vital` becomes `Élan Vital`. The remaining characters are left untouched.
 * [ES] Pone en mayúscula la primera letra de cada palabra. Una palabra empieza al inicio de la cadena o tras cualquier
 * carácter que no sea letra ni dígito (espacios, guiones, puntuación), y las letras se detectan con propiedades
 * Unicode, de modo que `élan vital` se convierte en `Élan Vital`. El resto de caracteres no se modifica.
 *
 * @param input [EN] The string to process. [ES] La cadena a procesar.
 * @returns [EN] The string with capitalized words. [ES] La cadena con palabras capitalizadas.
 */
export const capitalizeWords = (input: string): string =>
  input.replace(/(^|[^\p{L}\p{N}])(\p{L})/gu, (_match, separator: string, letter: string) => separator + letter.toUpperCase());
