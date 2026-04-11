import { detectRuntime, getCurrentWorkingDirectory } from "./internal/runtime";

export type BarritsRuntimeKind = "node" | "deno" | "react" | "browser" | "other";
export type BarritsWatchMode = "auto" | "manual" | "off";

export const DEFAULT_AUTOMATION_DIRECTORY = ".barrits";
export const BARRITS_CONFIG_FILENAMES = [
  "barrits.config.ts",
  "barrits.config.mts",
  "barrits.config.js",
  "barrits.config.mjs",
] as const;

export type BarritsRootConfig = {
  runtime?: BarritsRuntimeKind;
  watch?: BarritsWatchMode;
  debugCommands?: boolean;
  projectRoot?: string;
  manifestPath?: string;
  autoManifest?: boolean;
  automationDirectory?: string;
};

export type ResolvedBarritsConfig = {
  runtime: BarritsRuntimeKind;
  watch: BarritsWatchMode;
  debugCommands: boolean;
  projectRoot: string;
  manifestPath?: string;
  autoManifest: boolean;
  automationDirectory: string;
  configFilePath?: string;
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

export const defineBarritsConfig = <TConfig extends BarritsRootConfig>(config: TConfig): TConfig => {
  return config;
};

export const findBarritsConfigFile = async (
  projectRoot: string = getCurrentWorkingDirectory(),
): Promise<string | undefined> => {
  const runtime = detectRuntime();

  if (runtime !== "node" && runtime !== "deno") {
    return undefined;
  }

  for (const fileName of BARRITS_CONFIG_FILENAMES) {
    const filePath = runtime === "deno"
      ? `${projectRoot.replace(/[\\/]+$/g, "")}/${fileName}`
      : (await runtimeImport<typeof import("node:path")>("node:path")).resolve(projectRoot, fileName);

    if (await fileExists(filePath)) {
      return filePath;
    }
  }

  return undefined;
};

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
    configFilePath: loadedConfig?.configFilePath,
  };
};