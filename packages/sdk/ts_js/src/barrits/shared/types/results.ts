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
  /** [EN] Path segments. [ES] Segmentos de la ruta. */
  readonly segments: string[];
  /** [EN] Query parameters as key-value pairs. [ES] Parámetros de consulta como pares clave-valor. */
  readonly query: Record<string, string>;
};
