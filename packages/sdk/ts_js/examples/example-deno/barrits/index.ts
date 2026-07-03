export const buildOperationalPath = (...segments: string[]): string => {
  return segments.join("/");
};