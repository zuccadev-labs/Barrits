import type { BarritsRuntimeKind } from "../../internal/config_defaults";

/**
 * [EN] Host runtime detected at execution time (`detectRuntime()`): a JavaScript engine from the configuration
 * vocabulary, or `unknown` (browsers, workers, exotic hosts).
 * [ES] Runtime anfitrión detectado en ejecución (`detectRuntime()`): un motor JavaScript del vocabulario de
 * configuración, o `unknown` (navegadores, workers, hosts exóticos).
 */
export type RuntimeName = Extract<BarritsRuntimeKind, "node" | "deno" | "bun"> | "unknown";

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
