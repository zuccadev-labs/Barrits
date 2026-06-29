/**
 * @module
 * [EN] Main package-first Barrits entrypoint used by the root module export.
 * [ES] Punto de entrada principal de Barrits (package-first) utilizado por la exportación raíz del módulo.
 */

/**
 * [EN] Re-exports flat and hybrid API surfaces from the API module.
 * [ES] Re-exporta las superficies de API plana e híbrida desde el módulo API.
 */
export * from "./api";

/**
 * [EN] Re-exports package configuration helpers and related runtime types.
 * [ES] Re-exporta los ayudantes de configuración de paquetes y los tipos de tiempo de ejecución relacionados.
 */
export * from "./package";

/**
 * [EN] Re-exports industrial platform adapters and telemetry services.
 * [ES] Re-exporta los adaptadores de plataforma industrial y servicios de telemetría.
 */
export * from "./sdk/adapters";
export * from "./sdk/logger";
