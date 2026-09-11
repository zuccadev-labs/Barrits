/**
 * @module
 * [EN] Single source of truth for the package-level configuration vocabulary (runtime kinds, watch modes,
 * defaults). `config.ts` re-exports everything here; nothing else should redeclare these literals.
 * [ES] Fuente única de verdad del vocabulario de configuración a nivel de paquete (tipos de runtime, modos watch,
 * valores por defecto). `config.ts` reexporta todo lo de aquí; nada más debe redeclarar estos literales.
 */

/**
 * [EN] Runtime kinds accepted by `runtime` in `barrits.config.*`, in documentation order.
 * [ES] Tipos de runtime aceptados por `runtime` en `barrits.config.*`, en orden de documentación.
 */
export const BARRITS_RUNTIME_KINDS = ["node", "deno", "bun", "react", "browser", "other"] as const;

/**
 * [EN] Supported runtime identifiers for package-level configuration.
 * [ES] Identificadores de runtime soportados para la configuración a nivel de paquete.
 */
export type BarritsRuntimeKind = (typeof BARRITS_RUNTIME_KINDS)[number];

/**
 * [EN] Watch policies accepted by `watch` in `barrits.config.*`.
 * [ES] Políticas de observación aceptadas por `watch` en `barrits.config.*`.
 */
export const BARRITS_WATCH_MODES = ["auto", "manual", "off"] as const;

/**
 * [EN] Watch policy used by automation and adapter orchestration.
 * [ES] Política de observación (watch) utilizada por la automatización y la orquestación de adaptadores.
 */
export type BarritsWatchMode = (typeof BARRITS_WATCH_MODES)[number];

/**
 * [EN] Default folder where Barrits stores generated automation artifacts.
 * [ES] Carpeta predeterminada donde Barrits almacena los artefactos de automatización generados.
 */
export const DEFAULT_AUTOMATION_DIRECTORY = ".barrits";

/**
 * [EN] Runtime kind assumed when `runtime` is not configured.
 * [ES] Tipo de runtime asumido cuando `runtime` no está configurado.
 */
export const DEFAULT_RUNTIME_KIND: BarritsRuntimeKind = "other";

/**
 * [EN] Watch policy assumed when `watch` is not configured.
 * [ES] Política de observación asumida cuando `watch` no está configurada.
 */
export const DEFAULT_WATCH_MODE: BarritsWatchMode = "auto";

/**
 * [EN] Namespace used by `createBarrits()` when none is configured.
 * [ES] Espacio de nombres usado por `createBarrits()` cuando no se configura ninguno.
 */
export const DEFAULT_BARRITS_NAMESPACE = "barrits";

/**
 * [EN] Keys of the object returned by `createBarrits()` that a custom namespace must not shadow.
 * [ES] Claves del objeto devuelto por `createBarrits()` que un espacio de nombres personalizado no puede pisar.
 */
export const RESERVED_BARRITS_NAMESPACES = ["brt", "config"] as const;

/**
 * [EN] Whether a value is a supported runtime kind.
 * [ES] Indica si un valor es un tipo de runtime soportado.
 */
export const isBarritsRuntimeKind = (value: unknown): value is BarritsRuntimeKind => {
  return typeof value === "string" && (BARRITS_RUNTIME_KINDS as readonly string[]).includes(value);
};

/**
 * [EN] Whether a value is a supported watch mode.
 * [ES] Indica si un valor es un modo de observación soportado.
 */
export const isBarritsWatchMode = (value: unknown): value is BarritsWatchMode => {
  return typeof value === "string" && (BARRITS_WATCH_MODES as readonly string[]).includes(value);
};
