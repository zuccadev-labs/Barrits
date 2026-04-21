import type { PathParts } from "../../shared";
/**
 * Parses a path string into normalized segments and query parameters.
 *
 * @param value Path string that may include a query string.
 * @returns Structured path parts used by routing helpers.
 */
export declare const parsePath: (value: string) => PathParts;
