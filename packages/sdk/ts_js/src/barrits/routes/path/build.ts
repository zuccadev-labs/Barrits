export const buildPath = (...segments: string[]): string => {
  return segments
    .flatMap((segment) => segment.split("/"))
    .map((segment) => segment.trim())
    .filter(Boolean)
    .join("/")
    .replace(/^/, "/");
};