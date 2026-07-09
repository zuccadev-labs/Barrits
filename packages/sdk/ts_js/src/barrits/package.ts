import type { BarritsPackageAutomationOptions } from "./plugins/shared";
import { type BarritsRootConfig, type BarritsRuntimeKind, type BarritsWatchMode } from "./config";
import { normalizePackageOptions } from "./internal/config_normalization";

export type { BarritsContractsConfig, BarritsRootConfig, BarritsRuntimeKind, BarritsTraitConflictStrategy, BarritsWatchMode, ResolvedBarritsConfig } from "./config";
export {
  BARRITS_CONFIG_FILENAMES,
  DEFAULT_AUTOMATION_DIRECTORY,
  defineBarritsConfig,
  findBarritsConfigFile,
  loadBarritsConfig,
  resolveBarritsConfig,
} from "./config";

/**
 * [EN] Public alias for package-first root configuration accepted by Barrits.
 * [ES] Alias público para la configuración raíz de Barrits basada en paquetes.
 */
export type BarritsPackageOptions = BarritsRootConfig;

/**
 * [EN] Resolved package configuration consumed internally by automation layers.
 * [ES] Configuración de paquete resuelta consumida internamente por las capas de automatización.
 */
type ResolvedBarritsPackageOptions = {
  /** [EN] Runtime kind (node, deno, etc.). [ES] Tipo de tiempo de ejecución. */
  runtime: BarritsRuntimeKind;
  /** [EN] Watch mode policy. [ES] Política de modo de observación. */
  watch: BarritsWatchMode;
  /** [EN] Enable debug output. [ES] Habilitar salida de depuración. */
  debugCommands: boolean;
  /** [EN] Resolved project absolute path. [ES] Ruta absoluta resuelta del proyecto. */
  projectRoot: string;
  /** [EN] Path to store/load the manifest. [ES] Ruta para almacenar/cargar el manifiesto. */
  manifestPath?: string;
  /** [EN] Automatically sync manifest changes. [ES] Sincronizar automáticamente los cambios del manifiesto. */
  autoManifest: boolean;
  /** [EN] Local automation directory (.barrits). [ES] Directorio local de automatización (.barrits). */
  automationDirectory: string;
};

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
