import { detectRuntime, getCurrentWorkingDirectory } from "./internal/runtime";
import { normalizeResolvedConfig } from "./internal/config_normalization";

/**
 * @module
 * [EN] Configuration engine for Barrits orchestrations. Handles file discovery,
 * normalization, and runtime state resolution.
 * [ES] Motor de configuración para orquestaciones de Barrits. Maneja el descubrimiento de archivos,
 * la normalización y la resolución del estado en tiempo de ejecución.
 */

/**
 * [EN] Supported runtime identifiers for package-level configuration.
 * [ES] Identificadores de tiempo de ejecución soportados para la configuración a nivel de paquete.
 */
export type BarritsRuntimeKind = "node" | "deno" | "bun" | "react" | "browser" | "other";

/** [EN] Strategy for resolving trait composition conflicts.
 *  [ES] Estrategia para resolver conflictos de composición de traits. */
export type BarritsTraitConflictStrategy = "error" | "override" | "merge";

/**
 * [EN] Watch policy used by automation and adapter orchestration.
 * [ES] Política de observación (watch) utilizada por la automatización y la orquestación de adaptadores.
 */
export type BarritsWatchMode = "auto" | "manual" | "off";

/**
 * [EN] Default folder where Barrits stores generated automation artifacts.
 * [ES] Carpeta predeterminada donde Barrits almacena los artefactos de automatización generados.
 */
export const DEFAULT_AUTOMATION_DIRECTORY = ".barrits";

/**
 * [EN] Candidate config filenames resolved in project root order.
 * [ES] Nombres de archivos de configuración candidatos resueltos en orden desde la raíz del proyecto.
 */
export const BARRITS_CONFIG_FILENAMES = ["barrits.config.ts", "barrits.config.mts", "barrits.config.js", "barrits.config.mjs"] as const;

/**
 * [EN] Manual trait contract entry used when declarative JSDoc is not present in the source file.
 * [ES] Entrada manual de contrato de trait utilizada cuando JSDoc declarativo no está presente en el archivo fuente.
 */
export type BarritsTraitContractConfig = {
  /** [EN] Unique name for the trait. [ES] Nombre único para el trait. */
  name: string;
  /** [EN] Source file path relative to project root. [ES] Ruta del archivo fuente relativa a la raíz del proyecto. */
  sourceFile: string;
  /** [EN] Name of the exported binding. [ES] Nombre del binding exportado. */
  bindingName: string;
  /** [EN] Kind of binding. [ES] Tipo de binding. */
  bindingKind?: "const" | "function" | "class";
  /** [EN] Factory method to use for discovery. [ES] Método de factoría a utilizar para el descubrimiento. */
  factory?: "createTraitDescriptor" | "createTraitDescriptorFromJsDoc";
  /** [EN] Brief summary. [ES] Breve resumen. */
  summary?: string;
  /** [EN] List of required traits. [ES] Lista de traits requeridos. */
  requires?: readonly string[];
  /** [EN] List of conflicting traits. [ES] Lista de traits en conflicto. */
  conflicts?: readonly string[];
  /** [EN] List of state keys provided. [ES] Lista de claves de estado proporcionadas. */
  state?: readonly string[];
  /** [EN] Traits consumed. [ES] Traits consumidos. */
  consumes?: readonly string[];
  /** [EN] Traits provided. [ES] Traits proporcionados. */
  provides?: readonly string[];
  /** [EN] Custom organizational tags. [ES] Etiquetas organizativas personalizadas. */
  tags?: readonly string[];
  /** [EN] Target runtimes. [ES] Tiempos de ejecución objetivo. */
  runtimes?: readonly string[];
};

/**
 * [EN] Manual export visibility override entry used to manage public/internal visibility.
 * [ES] Entrada manual de anulación de visibilidad de exportación utilizada para gestionar la visibilidad pública/interna.
 */
export type BarritsExportContractConfig = {
  /** [EN] Target source file. [ES] Archivo fuente objetivo. */
  sourceFile: string;
  /** [EN] Specific export name. [ES] Nombre de exportación específico. */
  exportName?: string;
  /** [EN] Logical access path in the proxy. [ES] Ruta de acceso lógica en el proxy. */
  accessPath?: string;
  /** [EN] Visibility level. [ES] Nivel de visibilidad. */
  visibility?: "public" | "internal";
};

/**
 * [EN] Optional contract-level overrides loaded from config files.
 * [ES] Anulaciones opcionales a nivel de contrato cargadas desde archivos de configuración.
 */
export type BarritsContractsConfig = {
  /** [EN] Manual trait definitions. [ES] Definiciones de traits manuales. */
  traits?: readonly BarritsTraitContractConfig[];
  /** [EN] Export visibility overrides. [ES] Anulaciones de visibilidad de exportación. */
  exports?: readonly BarritsExportContractConfig[];
};

/**
 * [EN] Root configuration schema accepted by `barrits.config.*` files.
 * [ES] Esquema de configuración raíz aceptado por los archivos `barrits.config.*`.
 */
export type BarritsRootConfig = {
  /** [EN] Target runtime kind. [ES] Tipo de tiempo de ejecución objetivo. */
  runtime?: BarritsRuntimeKind;
  /** [EN] Watch policy for automation. [ES] Política de observación para la automatización. */
  watch?: BarritsWatchMode;
  /** [EN] Enable debug logs for CLI commands. [ES] Habilitar logs de depuración para comandos CLI. */
  debugCommands?: boolean;
  /** [EN] Set project root (defaults to CWD). [ES] Establecer la raíz del proyecto (predeterminado a CWD). */
  projectRoot?: string;
  /** [EN] Explicit path to the build manifest. [ES] Ruta explícita a el manifiesto de build. */
  manifestPath?: string;
  /** [EN] Enable automatic manifest generation. [ES] Habilitar generación automática de manifiesto. */
  autoManifest?: boolean;
  /** [EN] Override automation storage directory. [ES] Anular el directorio de almacenamiento de automatización. */
  automationDirectory?: string;
  /** [EN] Optional roots to scan for JSDoc contracts (e.g. ["src"]). [ES] Raíces opcionales para escanear contratos JSDoc. */
  discoveryRoots?: readonly string[];
  /** [EN] Strategy for handling trait conflicts (default: "error"). [ES] Estrategia para manejar conflictos de traits. */
  traitConflictStrategy?: BarritsTraitConflictStrategy;
  /** [EN] Manual contract definitions. [ES] Definiciones manuales de contratos. */
  contracts?: BarritsContractsConfig;
  /**
   * [EN] Optional main method to override default bootstrap.
   * [ES] Método principal opcional para anular el bootstrap predeterminado.
   */
  main?: () => Promise<void> | void;
  /**
   * [EN] Optional custom namespace injected when creating abstract factories.
   * [ES] Espacio de nombres personalizado inyectado al crear factorías abstractas.
   */
  namespace?: string;
};

/**
 * [EN] Fully resolved runtime configuration consumed internally by Barrits.
 * [ES] Configuración de tiempo de ejecución completamente resuelta consumida internamente por Barrits.
 */
export type ResolvedBarritsConfig = {
  runtime: BarritsRuntimeKind;
  watch: BarritsWatchMode;
  debugCommands: boolean;
  projectRoot: string;
  manifestPath?: string;
  autoManifest: boolean;
  automationDirectory: string;
  discoveryRoots: readonly string[];
  traitConflictStrategy: BarritsTraitConflictStrategy;
  contracts?: BarritsContractsConfig;
  configFilePath?: string;
  main?: () => Promise<void> | void;
  namespace?: string;
};

type RuntimeGlobals = typeof globalThis & {
  Deno?: {
    stat?: (path: string) => Promise<unknown>;
  };
};

const runtimeImport = <TModule>(specifier: string): Promise<TModule> => {
  return import(specifier) as Promise<TModule>;
};

const toRuntimeModuleSpecifier = (filePath: string): string => {
  const normalizedPath = filePath.replace(/\\/g, "/");

  if (/^[A-Za-z]:\//.test(normalizedPath)) {
    return `file:///${normalizedPath}`;
  }

  if (normalizedPath.startsWith("/")) {
    return `file://${normalizedPath}`;
  }

  return normalizedPath;
};

const fileExists = async (filePath: string): Promise<boolean> => {
  const runtime = detectRuntime();

  if (runtime === "deno") {
    const runtimeGlobals = globalThis as RuntimeGlobals;

    try {
      await runtimeGlobals.Deno?.stat?.(filePath);
      return true;
    } catch {
      return false;
    }
  }

  if (runtime === "node") {
    const filesystem = await runtimeImport<typeof import("node:fs/promises")>("node:fs/promises");

    try {
      await filesystem.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  return false;
};

const isObjectRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

/**
 * [EN] Defines a typed Barrits root configuration object.
 * [ES] Define un objeto de configuración raíz de Barrits tipado.
 *
 * @example
 * ```ts
 * export default defineBarritsConfig({
 *   runtime: "deno",
 *   watch: "auto"
 * });
 * ```
 *
 * @param config - [EN] Root config authored by the consumer project. [ES] Configuración raíz escrita por el proyecto consumidor.
 * @returns [EN] The same config with preserved generic typing. [ES] La misma configuración con tipado genérico preservado.
 */
export const defineBarritsConfig = <TConfig extends BarritsRootConfig>(config: TConfig): TConfig => {
  return config;
};

/**
 * [EN] Finds the first matching Barrits config file in the project root.
 * [ES] Encuentra el primer archivo de configuración de Barrits coincidente en la raíz del proyecto.
 *
 * @param projectRoot - [EN] Root folder to inspect. [ES] Carpeta raíz a inspeccionar.
 * @returns [EN] Absolute config path when found, otherwise undefined. [ES] Ruta absoluta de configuración cuando se encuentra, de lo contrario undefined.
 */
export const findBarritsConfigFile = async (projectRoot: string = getCurrentWorkingDirectory()): Promise<string | undefined> => {
  const runtime = detectRuntime();

  if (runtime !== "node" && runtime !== "deno") {
    return undefined;
  }

  const pathModule = await runtimeImport<typeof import("node:path")>("node:path");

  for (const fileName of BARRITS_CONFIG_FILENAMES) {
    const filePath = pathModule.resolve(projectRoot, fileName);

    if (await fileExists(filePath)) {
      return filePath;
    }
  }

  return undefined;
};

/**
 * [EN] Loads and validates the Barrits config object from disk.
 * [ES] Carga y valida el objeto de configuración de Barrits desde el disco.
 *
 * @param projectRoot - [EN] Root folder where config file is expected. [ES] Carpeta raíz donde se espera el archivo de configuración.
 * @returns [EN] Config object plus source path, or null when no config file exists. [ES] Objeto de configuración más ruta de origen, o null cuando no existe el archivo.
 * @throws Error - [EN] When the loaded module does not export an object config. [ES] Cuando el módulo cargado no exporta un objeto de configuración.
 */
export const loadBarritsConfig = async (
  projectRoot: string = getCurrentWorkingDirectory(),
): Promise<(BarritsRootConfig & { configFilePath?: string }) | null> => {
  const configFilePath = await findBarritsConfigFile(projectRoot);

  if (!configFilePath) {
    return null;
  }

  const importedModule = await runtimeImport<Record<string, unknown>>(toRuntimeModuleSpecifier(configFilePath));
  const candidate = importedModule.default ?? importedModule.barritsConfig ?? importedModule.config;

  if (!isObjectRecord(candidate)) {
    throw new Error(`Barrits config at "${configFilePath}" must export an object.`);
  }

  return {
    ...(candidate as BarritsRootConfig),
    configFilePath,
  };
};

/**
 * [EN] Resolves final runtime config by merging file config and explicit options.
 * [ES] Resuelve la configuración final de tiempo de ejecución fusionando la configuración de archivo y las opciones explícitas.
 *
 * [EN] Explicit `options` values override values loaded from config file.
 * [ES] Los valores de `options` explícitos anulan los valores cargados desde el archivo de configuración.
 *
 * @param options - [EN] Explicit runtime options. [ES] Opciones explícitas de tiempo de ejecución.
 * @param fallbackProjectRoot - [EN] Default project root when none is provided. [ES] Raíz del proyecto por defecto cuando no se proporciona ninguna.
 * @returns [EN] Fully resolved config used by automation and adapters. [ES] Configuración completamente resuelta utilizada por la automatización y los adaptadores.
 */
export const resolveBarritsConfig = async (
  options: BarritsRootConfig = {},
  fallbackProjectRoot: string = getCurrentWorkingDirectory(),
): Promise<ResolvedBarritsConfig> => {
  const initialProjectRoot = options.projectRoot ?? fallbackProjectRoot;
  const loadedConfig = await loadBarritsConfig(initialProjectRoot);

  const mergedConfig = {
    ...(loadedConfig ?? {}),
    ...options,
  } satisfies BarritsRootConfig;

  return normalizeResolvedConfig(mergedConfig, initialProjectRoot, loadedConfig?.configFilePath);
};
