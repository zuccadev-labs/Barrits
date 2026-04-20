export { accentInsensitiveRegex } from './accent-insensitive-regex';
export { capitalize, capitalizeWords } from './capitalize';
export { slugify } from './slugify';
export { truncate } from './truncate';

import { accentInsensitiveRegex } from './accent-insensitive-regex';
import { capitalize, capitalizeWords } from './capitalize';
import { slugify } from './slugify';
import { truncate } from './truncate';

export const stringAlgorithms = {
  accentInsensitiveRegex,
  capitalize,
  capitalizeWords,
  slugify,
  truncate,
} as const;
