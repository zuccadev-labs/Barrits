/**
 * [EN] Type definition for RuntimeName.
 * [ES] Definición de tipo para RuntimeName.
 */
export type RuntimeName = "node" | "deno" | "unknown";
/**
 * [EN] Type definition for PathParts.
 * [ES] Definición de tipo para PathParts.
 */
export type PathParts = {
  readonly segments: string[];
  readonly query: Record<string, string>;
};
