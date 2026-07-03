/**
 * @module
 * [EN] Path manipulation utilities for Barrits.
 * [ES] Utilidades de manipulación de rutas para Barrits.
 */ const normalizeSeparators = (value: string): string => {
  return value.replace(/\\+/g, "/").replace(/\/+/g, "/");
};

const trimTrailingSlash = (value: string): string => {
  const trimmed = value.trimEnd();

  if (trimmed === "/") {
    return trimmed;
  }

  if (/^[A-Za-z]:\/$/.test(trimmed)) {
    return trimmed;
  }

  return trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;
};

const canPopSegment = (resolved: string[], isAbsolute: boolean): boolean => {
  if (resolved.length === 0) return false;
  if (resolved[resolved.length - 1] === "..") return false;
  if (isAbsolute && /^[A-Za-z]:$/.test(resolved[resolved.length - 1])) return false;
  return true;
};

const resolvePathSegments = (normalized: string): { isAbsolute: boolean; resolved: string[] } => {
  const isAbsolute = normalized.startsWith("/") || /^[A-Za-z]:\//.test(normalized);
  const resolved: string[] = [];

  for (const segment of normalized.split("/")) {
    if (segment === "." || segment === "") continue;

    if (segment === "..") {
      if (canPopSegment(resolved, isAbsolute)) {
        resolved.pop();
      } else if (!isAbsolute) {
        resolved.push("..");
      }
      continue;
    }

    resolved.push(segment);
  }

  return { isAbsolute, resolved };
};

const reconstructAbsolutePath = (result: string): string => {
  if (!result.startsWith("/") && !/^[A-Za-z]:/.test(result)) {
    result = "/" + result;
  }

  if (/^[A-Za-z]:$/.test(result)) {
    result = result + "/";
  }

  return result;
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

  const { isAbsolute, resolved } = resolvePathSegments(normalized);
  let result = resolved.join("/");

  if (isAbsolute) {
    result = reconstructAbsolutePath(result);
  }

  if (result === "") {
    result = ".";
  }

  return trimTrailingSlash(result);
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
