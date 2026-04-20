export const capitalize = (input: string): string =>
  input.length === 0 ? input : input[0]!.toUpperCase() + input.slice(1).toLowerCase();

export const capitalizeWords = (input: string): string =>
  input.replace(/\b\w/g, (char) => char.toUpperCase());
