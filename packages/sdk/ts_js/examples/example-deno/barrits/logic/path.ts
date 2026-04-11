import { join, normalize } from "jsr:@std/path@^1.0.8";

export const buildOperationalPath = (...segments: string[]): string => {
  return normalize(join(...segments));
};