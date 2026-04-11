const normalizeSeparators = (value: string): string => {
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

export const normalizePath = (value: string): string => {
  const normalized = normalizeSeparators(value.trim());

  if (normalized === "") {
    return ".";
  }

  return trimTrailingSlash(normalized);
};

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

export const basenamePath = (value: string): string => {
  const normalized = normalizePath(value);
  const separatorIndex = normalized.lastIndexOf("/");
  return separatorIndex === -1 ? normalized : normalized.slice(separatorIndex + 1);
};

export const joinPath = (...segments: string[]): string => {
  const filteredSegments = segments.filter(Boolean).map((segment) => normalizeSeparators(segment));

  if (filteredSegments.length === 0) {
    return ".";
  }

  const [firstSegment, ...rest] = filteredSegments;
  const base = trimTrailingSlash(firstSegment);

  return normalizePath([base, ...rest.map((segment) => segment.replace(/^\/+/, ""))].join("/"));
};

export const isRootPath = (value: string): boolean => {
  const normalized = normalizePath(value);
  return normalized === "/" || /^[A-Za-z]:\/$/.test(normalized);
};