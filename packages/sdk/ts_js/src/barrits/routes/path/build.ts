/**
 * Builds a normalized operational path from arbitrary path segments.
 *
 * @param segments Path segments that may include slashes or whitespace.
 * @returns Absolute-like normalized path using forward slashes.
 */
export const buildPath = (...segments: string[]): string => {
  return segments
    .flatMap((segment) => segment.split("/"))
    .map((segment) => segment.trim())
    .filter(Boolean)
    .join("/")
    .replace(/^/, "/");
};
