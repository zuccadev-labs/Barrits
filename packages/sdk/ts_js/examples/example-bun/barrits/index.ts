import { buildPath, parsePath } from "@zuccadev-labs/barrits";

export const buildBunOperationalPath = (...parts: string[]): string => {
  return buildPath("bun", ...parts);
};

export const inspectBunOperationalPath = (value: string) => {
  return parsePath(value);
};

export { bunRuntimeTrait, queueServiceTrait, httpHandlerTrait } from "./traits";
export { parseBunUser } from "./validation";
export { duplicar, triplicar } from "./logic/math";
