import type { BarritsPackageAutomationOptions } from "./plugins/shared";
import type { BarritsRootConfig, ResolvedBarritsPackageOptions } from "./config";
import { normalizePackageOptions } from "./internal/config_normalization";

export type {
  BarritsContractsConfig,
  BarritsRootConfig,
  BarritsRuntimeKind,
  BarritsTraitConflictStrategy,
  BarritsWatchMode,
  LegacyTraitConflictStrategy,
  ResolvedBarritsConfig,
  ResolvedBarritsPackageOptions,
} from "./config";
export {
  BARRITS_CONFIG_FILENAMES,
  BARRITS_RUNTIME_KINDS,
  BARRITS_WATCH_MODES,
  BarritsConfigError,
  DEFAULT_AUTOMATION_DIRECTORY,
  DEFAULT_BARRITS_NAMESPACE,
  DEFAULT_RUNTIME_KIND,
  DEFAULT_TRAIT_CONFLICT_STRATEGY,
  DEFAULT_WATCH_MODE,
  RESERVED_BARRITS_NAMESPACES,
  TRAIT_CONFLICT_STRATEGIES,
  defineBarritsConfig,
  findBarritsConfigFile,
  isBarritsRuntimeKind,
  isBarritsWatchMode,
  isTraitConflictStrategy,
  loadBarritsConfig,
  normalizeTraitConflictStrategy,
  resolveBarritsConfig,
} from "./config";

/**
 * [EN] Public alias for package-first root configuration accepted by Barrits.
 * [ES] Alias público para la configuración raíz de Barrits basada en paquetes.
 */
export type BarritsPackageOptions = BarritsRootConfig;

/**
 * [EN] Normalizes package-first configuration into a deterministic runtime contract.
 * [ES] Normaliza la configuración basada en paquetes en un contrato de tiempo de ejecución determinista.
 *
 * @param options - [EN] Optional root configuration passed by the consumer project. [ES] Configuración raíz opcional pasada por el proyecto consumidor.
 * @returns [EN] Normalized package options consumed by Barrits automation and adapters. [ES] Opciones de paquete normalizadas consumidas por la automatización y adaptadores de Barrits.
 */
export const defineBarritsPackage = (options: BarritsPackageOptions = {}): ResolvedBarritsPackageOptions => {
  return normalizePackageOptions(options);
};

/**
 * [EN] Converts package-level configuration into automation options for plugins and bundlers.
 * [ES] Convierte la configuración a nivel de paquete en opciones de automatización para plugins y empaquetadores.
 *
 * @param options - [EN] Optional root package options. [ES] Opciones de paquete raíz opcionales.
 * @returns [EN] Automation options with watch-aware manifest behavior. [ES] Opciones de automatización con comportamiento de manifiesto consciente del modo watch.
 */
export const toBarritsAutomationOptions = (options: BarritsPackageOptions = {}): BarritsPackageAutomationOptions => {
  const normalizedOptions = defineBarritsPackage(options);

  return {
    projectRoot: normalizedOptions.projectRoot,
    manifestPath: normalizedOptions.manifestPath,
    autoManifest: normalizedOptions.autoManifest && normalizedOptions.watch !== "off",
    automationDirectory: normalizedOptions.automationDirectory,
  };
};
