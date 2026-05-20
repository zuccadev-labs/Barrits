import { joinPath } from "../path";
import { isInternalPath, relativeFromBase, extractExports } from "../ast/extractor";
import { collectTraitDescriptorMetadata } from "../ast/traits";
import type { 
  BarritsFileKind, 
  BarritsFileIntegration, 
  BarritsDomainIntegration, 
  BarritsSourceLayer, 
  RuntimeFileSystemAdapter 
} from "../contracts";

const IGNORED_DIRECTORIES = new Set([".git", "node_modules", "dist", "build", ".next", ".turbo"]);
const SUPPORTED_SOURCE_FILE = /\.(?:[cm]?[jt]s|[jt]sx)$/i;

/**
 * Assesses the logical classification of a physical file path within the Barrits architecture.
 *
 * @param relativePath - Relative path string representation evaluated.
 * @returns The classified architecture semantic identifier block logic root path.
 */
export const classifyFileKind = (relativePath: string): BarritsFileKind => {
  if (relativePath === "index.ts") {
    return "root";
  }

  if (relativePath.startsWith("traits/")) {
    return "trait";
  }

  if (relativePath.endsWith("/index.ts")) {
    return "barrel";
  }

  if (isInternalPath(relativePath)) {
    return "internal";
  }

  if (relativePath.startsWith("shared/")) {
    return "shared";
  }

  if (relativePath.startsWith("sdk/")) {
    return "sdk";
  }

  return "domain";
};

/**
 * [EN] Implementation of To relative file path.
 * [ES] Implementación de To relative file path.
 */
export const toRelativeFilePath = (barritsDirectory: string, filePath: string): string => {
  return relativeFromBase(barritsDirectory, filePath);
};

/**
 * Collects a recursive inventory of applicable module paths bypassing ignored sub-directories.
 */
export const collectFiles = async (
  adapter: RuntimeFileSystemAdapter,
  rootDirectory: string,
): Promise<string[]> => {
  const files: string[] = [];
  const queue: string[] = [rootDirectory];

  while (queue.length > 0) {
    const currentDirectory = queue.shift();

    if (!currentDirectory) {
      continue;
    }

    const entries = await adapter.listEntries(currentDirectory);

    for (const entry of entries) {
      if (entry.type === "directory") {
        if (!IGNORED_DIRECTORIES.has(entry.name)) {
          queue.push(joinPath(currentDirectory, entry.name));
        }

        continue;
      }

      if (SUPPORTED_SOURCE_FILE.test(entry.name)) {
        files.push(joinPath(currentDirectory, entry.name));
      }
    }
  }

  return files.sort((left, right) => left.localeCompare(right));
};

/**
 * Inspects an individual file to gather exports and extract trait semantic metadata bindings.
 */
export const inspectFile = async (
  adapter: RuntimeFileSystemAdapter,
  barritsDirectory: string,
  filePath: string,
  sourceLayer: BarritsSourceLayer,
): Promise<BarritsFileIntegration> => {
  const source = await adapter.readTextFile(filePath);
  const relativePath = toRelativeFilePath(barritsDirectory, filePath);

  return {
    path: relativePath,
    isIndex: relativePath.endsWith("/index.ts") || relativePath === "index.ts",
    kind: classifyFileKind(relativePath),
    sourceLayer,
    exports: await extractExports(adapter, barritsDirectory, relativePath, source),
    traitDescriptors: classifyFileKind(relativePath) === "trait"
      ? collectTraitDescriptorMetadata(source, relativePath)
      : [],
  };
};

/**
 * [EN] Type definition for InspectedLayer.
 * [ES] Definición de tipo para InspectedLayer.
 */
export type InspectedLayer = {
  readonly sourceLayer: BarritsSourceLayer;
  readonly rootFiles: readonly BarritsFileIntegration[];
  readonly domains: readonly BarritsDomainIntegration[];
  readonly files: readonly BarritsFileIntegration[];
};

/**
 * Validates, structures and builds the domain layers mapping domains systematically.
 */
export const buildLayer = (
  directory: string,
  files: readonly BarritsFileIntegration[],
  sourceLayer: BarritsSourceLayer,
): InspectedLayer => {
  const domainsMap = new Map<string, { path: string; files: BarritsFileIntegration[] }>();
  const rootFiles: BarritsFileIntegration[] = [];

  for (const file of files) {
    const [domainName] = file.path.split("/");

    if (!file.path.includes("/")) {
      rootFiles.push(file);
      continue;
    }

    const existingDomain = domainsMap.get(domainName);

    if (existingDomain) {
      existingDomain.files.push(file);
      continue;
    }

    domainsMap.set(domainName, {
      path: joinPath(directory, domainName),
      files: [file],
    });
  }

  return {
    rootFiles: rootFiles.sort((left, right) => {
      if (left.path === right.path) {
        return left.sourceLayer.localeCompare(right.sourceLayer);
      }

      return left.path.localeCompare(right.path);
    }),
    domains: Array.from(domainsMap.entries())
      .sort(([leftName], [rightName]) => leftName.localeCompare(rightName))
      .map(([name, value]) => ({
        name,
        path: value.path,
        files: value.files.sort((left, right) => {
          if (left.path === right.path) {
            return left.sourceLayer.localeCompare(right.sourceLayer);
          }

          return left.path.localeCompare(right.path);
        }),
      })),
    files,
    sourceLayer,
  };
};

/**
 * Discovers explicitly the physical structural logic file mapping targeting abstract integration layer payloads.
 */
export const inspectLayer = async (
  adapter: RuntimeFileSystemAdapter,
  directory: string | undefined,
  sourceLayer: BarritsSourceLayer,
): Promise<InspectedLayer> => {
  if (!directory) {
    return {
      sourceLayer,
      rootFiles: [],
      domains: [],
      files: [],
    };
  }

  const files = await collectFiles(adapter, directory);
  const inspectedFiles = await Promise.all(
    files.map((filePath) => inspectFile(adapter, directory, filePath, sourceLayer)),
  );

  return buildLayer(directory, inspectedFiles, sourceLayer);
};
