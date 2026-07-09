/**
 * @module
 * [EN] Public SDK barrel module re-exporting all Barrits primitives, types, and adapters for consumer use.
 * [ES] Módulo barrel público del SDK que re-exporta todos los primitivos, tipos y adaptadores de Barrits para uso del consumidor.
 */
export type {
  BarritsBaseContext,
  BarritsConsumedTraitDescriptor,
  BarritsConsumedStateSummary,
  BarritsDiscovery,
  BarritsDiscoveryStrategy,
  BarritsBuildManifest,
  BarritsDomainIntegration,
  BarritsExportAccessStrategy,
  BarritsExportCollision,
  BarritsExportKind,
  BarritsExportVisibility,
  BarritsFileExport,
  BarritsFileKind,
  BarritsFileIntegration,
  BarritsGraphFilters,
  BarritsIntegrationGraph,
  BarritsImportAction,
  BarritsImportActionKind,
  BarritsImportFilters,
  BarritsTraitDescriptorInspection,
  BarritsTraitDiagnostic,
  BarritsTraitDiagnosticAggregate,
  BarritsSourceLayer,
  BarritsLanguageToolDomain,
  BarritsLanguageToolSnapshot,
  BarritsSelectionFilters,
  BarritsImportWriteMode,
  BarritsWatchSnapshot,
  FindBarritsOptions,
  RuntimeFileSystemAdapter,
  RuntimeFileSystemEntry,
  RuntimeFileSystemEntryType,
} from "./contracts";
export { findBarritsDirectory } from "./discovery";
export { isBarritsExportVisibility, isBarritsFileKind } from "./guards";
export { inspectBarritsIntegrations } from "./inspect";
export { createBuildManifestSummary, createLanguageToolSnapshot, createWatchSnapshotSummary } from "./summarization";
export {
  parseBuildManifest,
  parseWatchSnapshot,
  readBuildManifest,
  readBuildManifestSummary,
  readLanguageToolSnapshot,
  readWatchSnapshot,
  readWatchSnapshotSummary,
} from "./consume";
export { applyManagedImports, createImportBlock, createImportsModuleSource, filterImportActions } from "./imports";
export { createBuildManifest, createProjectedGraph, createWatchSnapshot, stringifyBuildManifest, stringifyWatchSnapshot } from "./manifest";
export { filterIntegrationGraph, resolveProjectFilePath } from "./query";
