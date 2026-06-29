import type {
  BarritsFileKind,
  BarritsFileIntegration,
  BarritsDomainIntegration,
  BarritsSourceLayer,
  RuntimeFileSystemAdapter,
} from "../contracts";
/**
 * Assesses the logical classification of a physical file path within the Barrits architecture.
 *
 * @param relativePath - Relative path string representation evaluated.
 * @returns The classified architecture semantic identifier block logic root path.
 */
export declare const classifyFileKind: (relativePath: string) => BarritsFileKind;
/**
 * [EN] Implementation of To relative file path.
 * [ES] Implementación de To relative file path.
 */
export declare const toRelativeFilePath: (barritsDirectory: string, filePath: string) => string;
/**
 * Collects a recursive inventory of applicable module paths bypassing ignored sub-directories.
 */
export declare const collectFiles: (adapter: RuntimeFileSystemAdapter, rootDirectory: string) => Promise<string[]>;
/**
 * Inspects an individual file to gather exports and extract trait semantic metadata bindings.
 */
export declare const inspectFile: (
  adapter: RuntimeFileSystemAdapter,
  barritsDirectory: string,
  filePath: string,
  sourceLayer: BarritsSourceLayer,
) => Promise<BarritsFileIntegration>;
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
export declare const buildLayer: (
  directory: string,
  files: readonly BarritsFileIntegration[],
  sourceLayer: BarritsSourceLayer,
) => InspectedLayer;
/**
 * Discovers explicitly the physical structural logic file mapping targeting abstract integration layer payloads.
 */
export declare const inspectLayer: (
  adapter: RuntimeFileSystemAdapter,
  directory: string | undefined,
  sourceLayer: BarritsSourceLayer,
) => Promise<InspectedLayer>;
