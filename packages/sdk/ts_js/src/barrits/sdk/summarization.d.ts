/**
 * @module
 * [EN] Build manifest and watch snapshot summarization: aggregate diagnostics and compact summaries.
 * [ES] Resumen de manifiestos de compilación y snapshots de observación: agregación de diagnósticos y resúmenes compactos.
 */
import type { BarritsBuildManifest, BarritsConsumedStateSummary, BarritsConsumedTraitDescriptor, BarritsLanguageToolSnapshot, BarritsTraitDiagnostic, BarritsTraitDiagnosticAggregate, BarritsWatchSnapshot, BarritsImportAction } from "./contracts";
export declare const mapImportStatements: (importActions: readonly BarritsImportAction[]) => string[];
export declare const mapTraitDescriptors: (descriptors: readonly BarritsConsumedTraitDescriptor[] | undefined) => BarritsConsumedTraitDescriptor[];
export declare const mapTraitDiagnostics: (diagnostics: readonly BarritsTraitDiagnostic[] | undefined) => BarritsTraitDiagnostic[];
export declare const createTraitDiagnosticAggregate: (diagnostics: readonly BarritsTraitDiagnostic[] | undefined) => BarritsTraitDiagnosticAggregate | undefined;
export declare const createBuildManifestSummary: (manifest: BarritsBuildManifest | null) => BarritsConsumedStateSummary;
export declare const createWatchSnapshotSummary: (snapshot: BarritsWatchSnapshot | null) => BarritsConsumedStateSummary;
export declare const createLanguageToolSnapshot: (snapshot: BarritsWatchSnapshot) => BarritsLanguageToolSnapshot;
