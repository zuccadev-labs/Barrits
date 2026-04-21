/**
 * [EN] Capitalizes the first letter of a string and lowercases the rest.
 * [ES] Pone en mayúscula la primera letra de una cadena y el resto en minúscula.
 * 
 * @param input [EN] The string to capitalize. [ES] La cadena a capitalizar.
 * @returns [EN] The capitalized string. [ES] La cadena capitalizada.
 */
export const capitalize = (input: string): string =>
  input.length === 0 ? input : input[0]!.toUpperCase() + input.slice(1).toLowerCase();

/**
 * [EN] Capitalizes each word in a given string.
 * [ES] Pone en mayúscula cada palabra de una cadena dada.
 * 
 * @param input [EN] The string to process. [ES] La cadena a procesar.
 * @returns [EN] The string with capitalized words. [ES] La cadena con palabras capitalizadas.
 */
export const capitalizeWords = (input: string): string =>
  input.replace(/\b\w/g, (char) => char.toUpperCase());
