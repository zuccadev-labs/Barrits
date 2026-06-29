/**
 * @module
 * [EN] Build manifest and watch snapshot summarization: aggregate diagnostics and compact summaries.
 * [ES] Resumen de manifiestos de compilación y snapshots de observación: agregación de diagnósticos y resúmenes compactos.
 */
import type { BarritsBuildManifest, BarritsConsumedStateSummary, BarritsWatchSnapshot, BarritsLanguageToolSnapshot } from "./contracts";
export declare const createBuildManifestSummary: (manifest: BarritsBuildManifest | null) => BarritsConsumedStateSummary;
export declare const createWatchSnapshotSummary: (snapshot: BarritsWatchSnapshot | null) => BarritsConsumedStateSummary;
export declare const createLanguageToolSnapshot: (snapshot: BarritsWatchSnapshot) => BarritsLanguageToolSnapshot;
export {};
