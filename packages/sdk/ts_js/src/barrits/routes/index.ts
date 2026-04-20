import { buildPath, parsePath, path } from "./path";

export { buildPath, parsePath, path };

/**
 * Routing helpers namespace exposed under `barrits.routes`.
 */
export const routes = {
  path,
  buildPath,
  parsePath,
};