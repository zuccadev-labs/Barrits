/**
 * Barrits orchestration layer for the Deno BaaS example.
 *
 * This barrel provides consumer-facing utilities for building operational
 * paths within the BaaS domain context.
 */
export const buildBaaSPath = (...segments: string[]): string => {
  return ["baas", ...segments].join("/");
};

export const buildApiPath = (resource: string, id?: string): string => {
  return id ? `/api/${resource}/${id}` : `/api/${resource}`;
};
