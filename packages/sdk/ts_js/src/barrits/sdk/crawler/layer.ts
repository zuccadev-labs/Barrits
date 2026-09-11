import { joinPath } from "../path";
import { isInternalPath, relativeFromBase, extractExports } from "../ast/extractor";
import { collectTraitDescriptorMetadata } from "../ast/traits";
import { loadTypeScript } from "../ast/cache";
import { mapConcurrent } from "../async-utils";
import type {
  BarritsFileKind,
  BarritsFileIntegration,
  BarritsDomainIntegration,
  BarritsSourceLayer,
  RuntimeFileSystemAdapter,
} from "../contracts";

const IGNORED_DIRECTORIES = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".next",
  ".turbo",
  ".barrits",
  ".cache",
  "__tests__",
  "__mocks__",
]);
const SUPPORTED_SOURCE_FILE = /.(?:[cm]?[jt]s|[jt]sx)$/i;
const EXCLUDED_SOURCE_FILE = /(?:.d.[cm]?ts|.(?:test|spec).(?:[cm]?[jt]s|[jt]sx))$/i;
const INDEX_FILE = /^index.(?:[cm]?[jt]s|[jt]sx)$/i;

/**
 * Whether a relative path is the root index module (`index.ts`, `index.js`, `index.mts`...).
 *
 * @param relativePath Path to check (e.g., "index.ts", "src/index.js")
 * @returns true if path basename matches index pattern
 *
 * @example
 * ```typescript
 * isRootIndexPath("index.ts") // true
 * isRootIndexPath("src/index.mts") // true (checks basename only)
 * isRootIndexPath("index.test.ts") // false
 * ```
 */
export const isRootIndexPath = (relativePath: string): boolean => INDEX_FILE.test(relativePath);

/**
 * Whether a relative path is a barrel (`<domain>/.../index.<ext>`).
 * Barrel files re-export multiple exports for aggregation.
 * @param relativePath Path to check
 * @returns true if path contains "/" and basename is index file
 * @example isBarrelIndexPath("domain/index.ts") // true
 */
export const isBarrelIndexPath = (relativePath: string): boolean =>
  relativePath.includes("/") && INDEX_FILE.test(relativePath.slice(relativePath.lastIndexOf("/") + 1));

/**
 * Whether a file name is a crawlable source module: TypeScript/JavaScript, excluding declaration files and tests.
 * Filters out `.d.ts` (declaration) and `.test/.spec` files automatically.
 * @param fileName File to check (e.g., "trait.ts", "index.js")
 * @returns true if valid crawlable source file
 * @example
 * isCrawlableSourceFile("trait.ts") // true
 * isCrawlableSourceFile("trait.d.ts") // false (declaration)
 * isCrawlableSourceFile("trait.test.ts") // false (test)
 */
export const isCrawlableSourceFile = (fileName: string): boolean =>
  SUPPORTED_SOURCE_FILE.test(fileName) && !EXCLUDED_SOURCE_FILE.test(fileName);

/**
 * Assesses the logical classification of a physical file path within the Barrits architecture.
 *
 * @param relativePath - Relative path string representation evaluated.
 * @returns The classified architecture semantic identifier block logic root path.
 */
export const classifyFileKind = (relativePath: string): BarritsFileKind => {
  if (isRootIndexPath(relativePath)) {
    return "root";
  }

  if (relativePath.startsWith("traits/")) {
    return "trait";
  }

  if (isBarrelIndexPath(relativePath)) {
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
export const collectFiles = async (adapter: RuntimeFileSystemAdapter, rootDirectory: string): Promise<string[]> => {
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

      if (isCrawlableSourceFile(entry.name)) {
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
  await loadTypeScript();
  const source = await adapter.readTextFile(filePath);
  const relativePath = toRelativeFilePath(barritsDirectory, filePath);

  return {
    path: relativePath,
    isIndex: isRootIndexPath(relativePath) || isBarrelIndexPath(relativePath),
    kind: classifyFileKind(relativePath),
    sourceLayer,
    exports: await extractExports(adapter, barritsDirectory, relativePath, source),
    traitDescriptors: classifyFileKind(relativePath) === "trait" ? collectTraitDescriptorMetadata(source, relativePath) : [],
  };
};

/**
 * [EN] Type definition for InspectedLayer.
 * [ES] Definición de tipo para InspectedLayer.
 */
export type InspectedLayer = {
  /** [EN] Absolute directory the layer was crawled from (empty when the layer is absent). [ES] Directorio absoluto desde el que se rastreó la capa (vacío si la capa no existe). */
  readonly directory: string;
  /** [EN] Source layer. [ES] Fuente capa. */
  readonly sourceLayer: BarritsSourceLayer;
  /** [EN] Root files. [ES] Raíz archivos. */
  readonly rootFiles: readonly BarritsFileIntegration[];
  /** [EN] Domains. [ES] Dominios. */
  readonly domains: readonly BarritsDomainIntegration[];
  /** [EN] Files. [ES] Archivos. */
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
    directory,
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
  if (!directory || !(await adapter.directoryExists(directory))) {
    return {
      directory: directory ?? "",
      sourceLayer,
      rootFiles: [],
      domains: [],
      files: [],
    };
  }

  const files = await collectFiles(adapter, directory);
  const inspectedFiles = await mapConcurrent(files, 10, (filePath) => inspectFile(adapter, directory, filePath, sourceLayer));

  return buildLayer(directory, inspectedFiles, sourceLayer);
};
