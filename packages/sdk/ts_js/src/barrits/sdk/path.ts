/**
 * @module
 * [EN] Path manipulation utilities for Barrits.
 * [ES] Utilidades de manipulación de rutas para Barrits.
 */ const normalizeSeparators = (value: string): string => {
  return value.replace(/\\+/g, "/").replace(/\/+/g, "/");
};

const trimTrailingSlash = (value: string): string => {
  if (value === "/") {
    return value;
  }

  if (/^[A-Za-z]:\/$/.test(value)) {
    return value;
  }

  return value.endsWith("/") ? value.slice(0, -1) : value;
};

/**
 * [EN] Implementation of Normalize path.
 * [ES] Implementación de Normalize path.
 */
export const normalizePath = (value: string): string => {
  const normalized = normalizeSeparators(value.trim());

  if (normalized === "") {
    return ".";
  }

  const isAbsolute = normalized.startsWith("/") || /^[A-Za-z]:\//.test(normalized);
  const segments = normalized.split("/");
  const resolved: string[] = [];

  for (const segment of segments) {
    if (segment === "." || segment === "") continue;
    if (segment === "..") {
      if (resolved.length > 0 && resolved[resolved.length - 1] !== "..") {
        const lastSegment = resolved[resolved.length - 1];
        if (isAbsolute && /^[A-Za-z]:$/.test(lastSegment)) continue;
        resolved.pop();
      } else if (!isAbsolute) {
        resolved.push("..");
      }
      continue;
    }
    resolved.push(segment);
  }

  const result = resolved.join("/");
  return trimTrailingSlash(result || ".");
};

/**
 * [EN] Implementation of Dirname path.
 * [ES] Implementación de Dirname path.
 */
export const dirnamePath = (value: string): string => {
  const normalized = normalizePath(value);

  if (normalized === "/" || /^[A-Za-z]:\/$/.test(normalized)) {
    return normalized;
  }

  const separatorIndex = normalized.lastIndexOf("/");

  if (separatorIndex <= 0) {
    return normalized.includes(":") ? `${normalized.slice(0, 2)}/` : "/";
  }

  return normalized.slice(0, separatorIndex);
};

/**
 * [EN] Implementation of Basename path.
 * [ES] Implementación de Basename path.
 */
export const basenamePath = (value: string): string => {
  const normalized = normalizePath(value);
  const separatorIndex = normalized.lastIndexOf("/");
  return separatorIndex === -1 ? normalized : normalized.slice(separatorIndex + 1);
};

/**
 * [EN] Implementation of Join path.
 * [ES] Implementación de Join path.
 */
export const joinPath = (...segments: string[]): string => {
  const filteredSegments = segments.filter(Boolean).map((segment) => normalizeSeparators(segment));

  if (filteredSegments.length === 0) {
    return ".";
  }

  const [firstSegment, ...rest] = filteredSegments;
  const base = trimTrailingSlash(firstSegment);

  return normalizePath([base, ...rest.map((segment) => segment.replace(/^\/+/, ""))].join("/"));
};

/**
 * [EN] Implementation of Is root path.
 * [ES] Implementación de Is root path.
 */
export const isRootPath = (value: string): boolean => {
  const normalized = normalizePath(value);
  return normalized === "/" || /^[A-Za-z]:\/$/.test(normalized);
};
