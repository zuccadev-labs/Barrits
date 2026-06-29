import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { DEFAULT_AUTOMATION_DIRECTORY, resolveBarritsConfig } from "../config";
import type { BarritsBuildManifest, RuntimeFileSystemAdapter, RuntimeFileSystemEntry } from "../sdk/contracts";

/**
 * [EN] Type definition for BarritsPackageAutomationOptions.
 * [ES] Definición de tipo para BarritsPackageAutomationOptions.
 */
export type BarritsPackageAutomationOptions = {
  projectRoot?: string;
  manifestPath?: string;
  autoManifest?: boolean;
  automationDirectory?: string;
};

type ResolvedBarritsPackageAutomationOptions = {
  projectRoot: string;
  manifestPath?: string;
  autoManifest: boolean;
  automationDirectory: string;
};

const createPluginFileSystemAdapter = (projectRoot: string): RuntimeFileSystemAdapter => {
  return {
    cwd: () => projectRoot,
    directoryExists: async (path) => {
      try {
        return (await stat(path)).isDirectory();
      } catch {
        return false;
      }
    },
    listDirectories: async (path) => {
      try {
        const entries = await readdir(path, { withFileTypes: true });
        return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
      } catch {
        return [];
      }
    },
    listEntries: async (path) => {
      try {
        const entries = await readdir(path, { withFileTypes: true });
        return entries
          .filter((entry) => entry.isDirectory() || entry.isFile())
          .map<RuntimeFileSystemEntry>((entry) => ({
            name: entry.name,
            type: entry.isDirectory() ? "directory" : "file",
          }));
      } catch {
        return [];
      }
    },
    readTextFile: async (path) => readFile(path, "utf8"),
  };
};

const ensureAutomaticManifest = async (
  projectRoot: string,
  automationDirectory = DEFAULT_AUTOMATION_DIRECTORY,
): Promise<BarritsBuildManifest | null> => {
  const [{ findBarritsDirectory }, { inspectBarritsIntegrations }, { createBuildManifest }] = await Promise.all([
    import("../sdk/discovery"),
    import("../sdk/inspect"),
    import("../sdk/manifest"),
  ]);
  const adapter = createPluginFileSystemAdapter(projectRoot);
  const discovery = await findBarritsDirectory(adapter, { startDirectory: projectRoot });

  if (!discovery) {
    return null;
  }

  const graph = await inspectBarritsIntegrations(adapter, discovery);
  const manifest = await createBuildManifest(graph);
  const manifestDirectory = resolve(projectRoot, automationDirectory);
  const manifestPath = resolve(manifestDirectory, "auto-build-manifest.json");
  await mkdir(manifestDirectory, { recursive: true });
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
  return manifest;
};

/**
 * [EN] Implementation of Resolve manifest path.
 * [ES] Implementación de Resolve manifest path.
 */
export const resolveManifestPath = (manifestPath?: string): string | undefined => {
  return manifestPath ?? process.env.BARRITS_BUILD_MANIFEST;
};

/**
 * [EN] Implementation of Resolve package automation options.
 * [ES] Implementación de Resolve package automation options.
 */
export const resolvePackageAutomationOptions = async (
  options: BarritsPackageAutomationOptions | undefined,
  fallbackProjectRoot = process.cwd(),
): Promise<ResolvedBarritsPackageAutomationOptions> => {
  const resolvedConfig = await resolveBarritsConfig(options ?? {}, fallbackProjectRoot);

  return {
    projectRoot: resolvedConfig.projectRoot,
    manifestPath: resolveManifestPath(options?.manifestPath ?? resolvedConfig.manifestPath),
    autoManifest: resolvedConfig.autoManifest,
    automationDirectory: options?.automationDirectory ?? resolvedConfig.automationDirectory,
  };
};

/**
 * [EN] Implementation of Load manifest.
 * [ES] Implementación de Load manifest.
 */
export const loadManifest = async (manifestPath: string): Promise<BarritsBuildManifest> => {
  const content = await readFile(manifestPath, "utf8");
  return JSON.parse(content) as BarritsBuildManifest;
};

/**
 * [EN] Implementation of Load manifest or create.
 * [ES] Implementación de Load manifest or create.
 */
export const loadManifestOrCreate = async (
  manifestPath: string | undefined,
  projectRoot = process.cwd(),
  automationDirectory = DEFAULT_AUTOMATION_DIRECTORY,
): Promise<BarritsBuildManifest | null> => {
  if (manifestPath) {
    return loadManifest(manifestPath);
  }

  return ensureAutomaticManifest(projectRoot, automationDirectory);
};

/**
 * [EN] Implementation of Load manifest for package.
 * [ES] Implementación de Load manifest for package.
 */
export const loadManifestForPackage = async (
  options: BarritsPackageAutomationOptions | undefined,
  fallbackProjectRoot = process.cwd(),
): Promise<BarritsBuildManifest | null> => {
  const resolvedOptions = await resolvePackageAutomationOptions(options, fallbackProjectRoot);

  if (resolvedOptions.manifestPath) {
    return loadManifest(resolvedOptions.manifestPath);
  }

  if (!resolvedOptions.autoManifest) {
    return null;
  }

  return ensureAutomaticManifest(resolvedOptions.projectRoot, resolvedOptions.automationDirectory);
};

/**
 * [EN] Implementation of Create manifest module source.
 * [ES] Implementación de Create manifest module source.
 */
export const createManifestModuleSource = (
  manifest: BarritsBuildManifest | null,
  banner: string,
): string => {
  if (!manifest) {
    return `${banner}\nexport const manifest = null;\nexport default manifest;`;
  }

  return [banner, `export const manifest = ${JSON.stringify(manifest, null, 2)};`, "export default manifest;"].join("\n");
};

/**
 * [EN] Helper to normalize base plugin options to reduce duplication.
 * [ES] Ayudante para normalizar opciones base de plugins para reducir duplicación.
 */
export const createPluginBaseOptions = (options: {
  virtualModuleId?: string;
  manifestPath?: string;
  package?: BarritsPackageAutomationOptions;
  defaultVirtualModuleId: string;
  resolvedPrefix: string;
}) => {
  const virtualModuleId = options.virtualModuleId ?? options.defaultVirtualModuleId;
  const resolvedVirtualModuleId = `${options.resolvedPrefix}:${virtualModuleId}`;
  const manifestPath = resolveManifestPath(options.manifestPath ?? options.package?.manifestPath);
  const packageOptions: BarritsPackageAutomationOptions | undefined = options.package
    ? { ...options.package, manifestPath }
    : manifestPath
      ? { manifestPath }
      : undefined;

  return { virtualModuleId, resolvedVirtualModuleId, manifestPath, packageOptions };
};
