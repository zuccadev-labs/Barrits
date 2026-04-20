const ACCENT_MAP: Record<string, string> = {
  a: '[aáàäâã]',
  e: '[eéèëê]',
  i: '[iíìïî]',
  o: '[oóòöôõ]',
  u: '[uúùüû]',
  n: '[nñ]',
  c: '[cç]',
};

const ACCENT_PATTERN = new RegExp(Object.keys(ACCENT_MAP).join('|'), 'gi');

export const accentInsensitiveRegex = (input: string): string =>
  input.replace(ACCENT_PATTERN, (char) => ACCENT_MAP[char.toLowerCase()] ?? char);
