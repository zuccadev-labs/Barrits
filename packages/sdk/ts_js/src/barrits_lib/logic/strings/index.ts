/** 
 * [EN] Regular expression builder for matching text regardless of accents.
 * [ES] Constructor de expresiones regulares para coincidir con texto sin importar los acentos.
 */
export { accentInsensitiveRegex } from './accent-insensitive-regex';

/** 
 * [EN] String casing utilities for capitalization.
 * [ES] Utilidades de formato de texto para capitalización.
 */
export { capitalize, capitalizeWords } from './capitalize';

/** 
 * [EN] URL-friendly slug generator.
 * [ES] Generador de slugs aptos para URLs.
 */
export { slugify } from './slugify';

/** 
 * [EN] Text pruning utility with ellipsis support.
 * [ES] Utilidad de recorte de texto con soporte para elipsis (...).
 */
export { truncate } from './truncate';

import { accentInsensitiveRegex } from './accent-insensitive-regex';
import { capitalize, capitalizeWords } from './capitalize';
import { slugify } from './slugify';
import { truncate } from './truncate';

/**
 * [EN] Aggregated string manipulation algorithm family.
 * [ES] Familia de algoritmos agregados de manipulación de strings.
 */
export const stringAlgorithms = {
  accentInsensitiveRegex,
  capitalize,
  capitalizeWords,
  slugify,
  truncate,
} as const;
