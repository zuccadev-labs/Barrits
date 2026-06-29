import type { PathParts } from "../../shared";

/**
 * Parses a path string into normalized segments and query parameters.
 *
 * @param value Path string that may include a query string.
 * @returns Structured path parts used by routing helpers.
 */
export const parsePath = (value: string): PathParts => {
  const [pathname, search = ""] = value.split("?");
  const segments = pathname
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean);
  const query = Object.fromEntries(new URLSearchParams(search));

  return {
    segments,
    query,
  };
};
