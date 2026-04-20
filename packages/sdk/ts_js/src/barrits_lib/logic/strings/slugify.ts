import { accentInsensitiveRegex } from './accent-insensitive-regex';

export const slugify = (input: string): string =>
  accentInsensitiveRegex(input)
    .replace(/[^a-z0-9\s-]/gi, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
