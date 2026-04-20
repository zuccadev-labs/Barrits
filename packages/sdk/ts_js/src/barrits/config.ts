import { detectRuntime, getCurrentWorkingDirectory } from "./internal/runtime";

/** Supported runtime identifiers for package-level configuration. */
export type BarritsRuntimeKind = "node" | "deno" | "react" | "browser" | "other";

/** Watch policy used by automation and adapter orchestration. */
export type BarritsWatchMode = "auto" | "manual" | "off";

/** Default folder where Barrits stores generated automation artifacts. */
export const DEFAULT_AUTOMATION_DIRECTORY = ".barrits";

/** Candidate config filenames resolved in project root order. */
export const BARRITS_CONFIG_FILENAMES = [
  "barrits.config.ts",
  "barrits.config.mts",
  "barrits.config.js",
  "barrits.config.mjs",
] as const;

/**
 * Manual trait contract entry used when declarative JSDoc is not present in the source file.
 */
export type BarritsTraitContractConfig = {
  name: string;
  sourceFile: string;
  bindingName: string;
  bindingKind?: "const" | "function" | "class";
  factory?: "createTraitDescriptor" | "createTraitDescriptorFromJsDoc";
  summary?: string;
  requires?: readonly string[];
  conflicts?: readonly string[];
  state?: readonly string[];
  consumes?: readonly string[];
  provides?: readonly string[];
  tags?: readonly string[];
  runtimes?: readonly string[];
};

/**
 * Manual export visibility override entry used to keep most methods public by default
 * and mark only selected methods as internal/private.
 */
export type BarritsExportContractConfig = {
  sourceFile: string;
  exportName?: string;
  accessPath?: string;
  visibility?: "public" | "internal";
};

/**
 * Optional contract-level overrides loaded from `barrits.config.*`.
 */
export type BarritsContractsConfig = {
  traits?: readonly BarritsTraitContractConfig[];
  exports?: readonly BarritsExportContractConfig[];
};

/** Root configuration schema accepted by `barrits.config.*` files. */
export type BarritsRootConfig = {
  runtime?: BarritsRuntimeKind;
  watch?: BarritsWatchMode;
  debugCommands?: boolean;
  projectRoot?: string;
  manifestPath?: string;
  autoManifest?: boolean;
  automationDirectory?: string;
  contracts?: BarritsContractsConfig;
  /** Optional main method to override the default bootstrap behavior */
  main?: () => Promise<void> | void;
};

/** Fully resolved runtime configuration consumed internally by Barrits. */
export type ResolvedBarritsConfig = {
  runtime: BarritsRuntimeKind;
  watch: BarritsWatchMode;
  debugCommands: boolean;
  projectRoot: string;
  manifestPath?: string;
  autoManifest: boolean;
  automationDirectory: string;
  contracts?: BarritsContractsConfig;
  configFilePath?: string;
  /** Resolved main method from configuration */
  main?: () => Promise<void> | void;
};

type RuntimeGlobals = typeof globalThis & {
  Deno?: {
    stat?: (path: string) => Promise<unknown>;
  };
};

const runtimeImport = <TModule>(specifier: string): Promise<TModule> => {
  const importModule = Function("specifier", "return import(specifier);") as (specifier: string) => Promise<TModule>;
  return importModule(specifier);
};

const normalizeAutomationDirectory = (value: string | undefined): string => {
  const normalizedValue = value?.trim().replace(/[\\/]+$/g, "");
  return normalizedValue || DEFAULT_AUTOMATION_DIRECTORY;
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
 * Defines a typed Barrits root configuration object.
 *
 * @param config Root config authored by the consumer project.
 * @returns The same config with preserved generic typing.
 */
export const defineBarritsConfig = <TConfig extends BarritsRootConfig>(config: TConfig): TConfig => {
  return config;
};

/**
 * Finds the first matching Barrits config file in the project root.
 *
 * @param projectRoot Root folder to inspect.
 * @returns Absolute config path when found, otherwise undefined.
 */
export const findBarritsConfigFile = async (
  projectRoot: string = getCurrentWorkingDirectory(),
): Promise<string | undefined> => {
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
 * Loads and validates the Barrits config object from disk.
 *
 * @param projectRoot Root folder where config file is expected.
 * @returns Config object plus source path, or null when no config file exists.
 * @throws Error when the loaded module does not export an object config.
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
 * Resolves final runtime config by merging file config and explicit options.
 *
 * Explicit `options` values override values loaded from config file.
 *
 * @param options Explicit runtime options.
 * @param fallbackProjectRoot Default project root when none is provided.
 * @returns Fully resolved config used by automation and adapters.
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
   const projectRoot = mergedConfig.projectRoot ?? initialProjectRoot;

   return {
     runtime: mergedConfig.runtime ?? "other",
     watch: mergedConfig.watch ?? "auto",
     debugCommands: mergedConfig.debugCommands ?? false,
     projectRoot,
     manifestPath: mergedConfig.manifestPath,
     autoManifest: mergedConfig.autoManifest ?? true,
     automationDirectory: normalizeAutomationDirectory(mergedConfig.automationDirectory),
     contracts: mergedConfig.contracts,
     configFilePath: loadedConfig?.configFilePath,
     main: mergedConfig.main,
   };
 };