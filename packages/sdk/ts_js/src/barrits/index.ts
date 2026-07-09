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

/**
 * [EN] Re-exports all SDK contract types for deno doc --lint compliance.
 * [ES] Re-exporta todos los tipos de contrato del SDK para conformidad con deno doc --lint.
 */
export type * from "./sdk/contracts";

/**
 * [EN] Re-exports config types referenced by BarritsContractsConfig (not re-exported by ./package).
 * [ES] Re-exporta tipos de configuración referenciados por BarritsContractsConfig (no re-exportados por ./package).
 */
export type { BarritsTraitContractConfig, BarritsExportContractConfig } from "./config";
