import { detectRuntime, getCurrentWorkingDirectory } from "./internal/runtime";
import { normalizeResolvedConfig } from "./internal/config_normalization";

/**
 * @module
 * [EN] Configuration engine for Barrits orchestrations. Handles file discovery,
 * loading (with a TypeScript fallback for plain Node.js), normalization, and runtime state resolution.
 * [ES] Motor de configuración para orquestaciones de Barrits. Maneja el descubrimiento de archivos,
 * la carga (con respaldo de TypeScript para Node.js sin loader), la normalización y la resolución del estado.
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
  /** [EN] Source file path relative to the barrits directory. [ES] Ruta del archivo fuente relativa al directorio barrits. */
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
  /** [EN] Capabilities consumed. [ES] Capacidades consumidas. */
  consumes?: readonly string[];
  /** [EN] Capabilities provided. [ES] Capacidades proporcionadas. */
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
  /** [EN] Target runtime kind. [ES] Tipo de runtime objetivo. */
  runtime: BarritsRuntimeKind;
  /** [EN] Watch policy for automation. [ES] Política de observación para automatización. */
  watch: BarritsWatchMode;
  /** [EN] Enable debug logs. [ES] Habilitar logs de depuración. */
  debugCommands: boolean;
  /** [EN] Project root directory. [ES] Directorio raíz del proyecto. */
  projectRoot: string;
  /** [EN] Explicit path to build manifest (optional). [ES] Ruta explícita al manifiesto de build (opcional). */
  manifestPath?: string;
  /** [EN] Enable automatic manifest generation. [ES] Habilitar generación automática de manifiesto. */
  autoManifest: boolean;
  /** [EN] Automation storage directory. [ES] Directorio de almacenamiento de automatización. */
  automationDirectory: string;
  /** [EN] Roots to scan for JSDoc contracts. [ES] Raíces para escanear contratos JSDoc. */
  discoveryRoots: readonly string[];
  /** [EN] Strategy for trait conflict resolution. [ES] Estrategia para resolución de conflictos de traits. */
  traitConflictStrategy: BarritsTraitConflictStrategy;
  /** [EN] Manual contract definitions (optional). [ES] Definiciones manuales de contratos (opcional). */
  contracts?: BarritsContractsConfig;
  /** [EN] Path to the resolved config file (optional). [ES] Ruta al archivo de configuración resuelto (opcional). */
  configFilePath?: string;
  /** [EN] Optional custom namespace. [ES] Espacio de nombres personalizado opcional. */
  namespace?: string;
};

/**
 * [EN] Error raised when a `barrits.config.*` file cannot be imported, transpiled or validated.
 * Carries the offending path and the underlying cause so CLI and tooling can report an actionable message.
 * [ES] Error lanzado cuando un archivo `barrits.config.*` no puede importarse, transpilarse o validarse.
 * Transporta la ruta implicada y la causa subyacente para que CLI y herramientas informen de forma accionable.
 */
export class BarritsConfigError extends Error {
  /** [EN] Absolute path of the config file involved. [ES] Ruta absoluta del archivo de configuración implicado. */
  readonly configFilePath: string;

  /**
   * [EN] Creates a config error bound to a file path.
   * [ES] Crea un error de configuración asociado a una ruta de archivo.
   */
  constructor(message: string, configFilePath: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "BarritsConfigError";
    this.configFilePath = configFilePath;
  }
}

/**
 * [EN] Module importer used to load config files. Injectable for tests and custom loaders.
 * [ES] Importador de módulos usado para cargar archivos de configuración. Inyectable para tests y loaders personalizados.
 */
export type BarritsConfigModuleImporter = (specifier: string) => Promise<Record<string, unknown>>;

/**
 * [EN] Options accepted by `loadBarritsConfig`.
 * [ES] Opciones aceptadas por `loadBarritsConfig`.
 */
export type LoadBarritsConfigOptions = {
  /** [EN] Custom module importer (defaults to dynamic `import()`). [ES] Importador personalizado (por defecto `import()` dinámico). */
  readonly importModule?: BarritsConfigModuleImporter;
};

type RuntimeGlobals = typeof globalThis & {
  Deno?: {
    stat?: (path: string) => Promise<unknown>;
  };
};

const TYPESCRIPT_CONFIG_PATTERN = /\.[cm]?ts$/iu;

const NATIVE_TYPESCRIPT_LOADER_ERROR_CODES = new Set([
  "ERR_UNKNOWN_FILE_EXTENSION",
  "ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX",
  "ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING",
]);

const runtimeImport = <TModule>(specifier: string): Promise<TModule> => {
  return import(specifier) as Promise<TModule>;
};

const defaultImportModule: BarritsConfigModuleImporter = (specifier) => runtimeImport<Record<string, unknown>>(specifier);

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

const describeError = (error: unknown): string => {
  return error instanceof Error ? error.message : String(error);
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
 * [EN] Decides whether a native import failure means "this runtime cannot load TypeScript",
 * as opposed to an error thrown by the config module itself (which must never be retried).
 * [ES] Decide si un fallo de importación nativa significa "este runtime no puede cargar TypeScript",
 * en contraposición a un error lanzado por el propio módulo de configuración (que nunca debe reintentarse).
 */
const isNativeTypeScriptLoaderFailure = (configFilePath: string, error: unknown): boolean => {
  if (detectRuntime() !== "node" || !TYPESCRIPT_CONFIG_PATTERN.test(configFilePath)) {
    return false;
  }

  if (error instanceof SyntaxError) {
    return true;
  }

  const code = (error as { code?: unknown } | null)?.code;
  return typeof code === "string" && NATIVE_TYPESCRIPT_LOADER_ERROR_CODES.has(code);
};

const transpileTypeScriptConfig = async (configFilePath: string, source: string): Promise<string> => {
  const ts = await runtimeImport<typeof import("typescript")>("typescript").catch((error: unknown) => {
    throw new BarritsConfigError(
      `Barrits config "${configFilePath}" is written in TypeScript but the current runtime cannot import it natively and the "typescript" peer dependency is not installed. Install "typescript" or author the config as barrits.config.mjs.`,
      configFilePath,
      { cause: error },
    );
  });

  const output = ts.transpileModule(source, {
    fileName: configFilePath,
    reportDiagnostics: true,
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
      isolatedModules: true,
      sourceMap: false,
    },
  });

  const diagnostic = output.diagnostics?.[0];

  if (diagnostic) {
    throw new BarritsConfigError(
      `Barrits config "${configFilePath}" could not be transpiled: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`,
      configFilePath,
    );
  }

  return output.outputText;
};

/**
 * [EN] Transpiles a TypeScript config to ESM next to the original file (so relative imports keep resolving)
 * and imports the temporary module. The temporary file is always removed.
 * [ES] Transpila una configuración TypeScript a ESM junto al archivo original (para que los imports relativos
 * sigan resolviendo) e importa el módulo temporal. El archivo temporal se elimina siempre.
 */
const importTranspiledConfig = async (
  configFilePath: string,
  importModule: BarritsConfigModuleImporter,
): Promise<Record<string, unknown>> => {
  const [filesystem, pathModule] = await Promise.all([
    runtimeImport<typeof import("node:fs/promises")>("node:fs/promises"),
    runtimeImport<typeof import("node:path")>("node:path"),
  ]);
  const source = await filesystem.readFile(configFilePath, "utf8");
  const outputText = await transpileTypeScriptConfig(configFilePath, source);
  const baseName = pathModule.basename(configFilePath).replace(TYPESCRIPT_CONFIG_PATTERN, "");
  const uniqueSuffix = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  const temporaryPath = pathModule.join(pathModule.dirname(configFilePath), `.${baseName}.${uniqueSuffix}.tmp.mjs`);

  await filesystem.writeFile(temporaryPath, outputText, "utf8");

  try {
    return await importModule(toRuntimeModuleSpecifier(temporaryPath));
  } finally {
    await filesystem.rm(temporaryPath, { force: true });
  }
};

const importConfigModule = async (configFilePath: string, importModule: BarritsConfigModuleImporter): Promise<Record<string, unknown>> => {
  let nativeError: unknown;

  try {
    return await importModule(toRuntimeModuleSpecifier(configFilePath));
  } catch (error) {
    nativeError = error;
  }

  if (!isNativeTypeScriptLoaderFailure(configFilePath, nativeError)) {
    throw new BarritsConfigError(`Unable to load Barrits config "${configFilePath}": ${describeError(nativeError)}`, configFilePath, {
      cause: nativeError,
    });
  }

  try {
    return await importTranspiledConfig(configFilePath, importModule);
  } catch (fallbackError) {
    if (fallbackError instanceof BarritsConfigError) {
      throw fallbackError;
    }

    throw new BarritsConfigError(
      `Unable to load Barrits config "${configFilePath}". Native import failed (${describeError(nativeError)}) and the transpiled fallback failed too (${describeError(fallbackError)}). Relative imports inside the config must be resolvable by the host runtime.`,
      configFilePath,
      { cause: fallbackError },
    );
  }
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
 * On plain Node.js (no TypeScript loader) a `.ts`/`.mts` config is transpiled with the `typescript`
 * peer dependency next to the original file and imported from there.
 * [ES] Carga y valida el objeto de configuración de Barrits desde el disco.
 * En Node.js sin loader de TypeScript, una configuración `.ts`/`.mts` se transpila con la dependencia
 * peer `typescript` junto al archivo original y se importa desde ahí.
 *
 * @param projectRoot - [EN] Root folder where config file is expected. [ES] Carpeta raíz donde se espera el archivo de configuración.
 * @param options - [EN] Loader options (custom importer). [ES] Opciones del cargador (importador personalizado).
 * @returns [EN] Config object plus source path, or null when no config file exists. [ES] Objeto de configuración más ruta de origen, o null cuando no existe el archivo.
 * @throws BarritsConfigError - [EN] When the file cannot be imported or does not export an object. [ES] Cuando el archivo no puede importarse o no exporta un objeto.
 */
export const loadBarritsConfig = async (
  projectRoot: string = getCurrentWorkingDirectory(),
  options: LoadBarritsConfigOptions = {},
): Promise<(BarritsRootConfig & { configFilePath?: string }) | null> => {
  const configFilePath = await findBarritsConfigFile(projectRoot);

  if (!configFilePath) {
    return null;
  }

  const importedModule = await importConfigModule(configFilePath, options.importModule ?? defaultImportModule);
  const candidate = importedModule.default ?? importedModule.barritsConfig ?? importedModule.config;

  if (!isObjectRecord(candidate)) {
    throw new BarritsConfigError(`Barrits config at "${configFilePath}" must export an object.`, configFilePath);
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
