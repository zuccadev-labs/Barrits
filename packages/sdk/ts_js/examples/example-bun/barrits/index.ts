import { buildPath, parsePath } from "@zuccadev-labs/barrits";

export const buildBunOperationalPath = (...parts: string[]): string => {
  return buildPath("bun", ...parts);
};

export const inspectBunOperationalPath = (value: string) => {
  return parsePath(value);
};
