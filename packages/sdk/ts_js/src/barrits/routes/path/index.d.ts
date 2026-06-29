import { buildPath } from "./build";
import { parsePath } from "./parse";
export { buildPath, parsePath };
/**
 * Path helper namespace exposed under `barrits.routes.path`.
 */
export declare const path: {
  buildPath: (...segments: string[]) => string;
  parsePath: (value: string) => import("../..").PathParts;
};
