import { buildPath } from "./build";
import { parsePath } from "./parse";

export { buildPath, parsePath };

/**
 * Path helper namespace exposed under `barrits.routes.path`.
 */
export const path = {
  buildPath,
  parsePath,
};
