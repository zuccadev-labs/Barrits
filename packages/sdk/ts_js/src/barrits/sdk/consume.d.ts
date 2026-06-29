/**
 * @module
 * [EN] Build manifest and watch snapshot consumption: parsing, validation, and file reading.
 * [ES] Consumo de manifiestos de compilación y snapshots de observación: análisis, validación y lectura de archivos.
 */
import type { BarritsBuildManifest, BarritsConsumedStateSummary, BarritsLanguageToolSnapshot, BarritsWatchSnapshot } from "./contracts";
type ReadTextFile = (filePath: string) => Promise<string>;
export declare const parseBuildManifest: (source: string) => BarritsBuildManifest;
export declare const parseWatchSnapshot: (source: string) => BarritsWatchSnapshot;
export declare const readBuildManifest: (filePath: string, readTextFile: ReadTextFile) => Promise<BarritsBuildManifest>;
export declare const readBuildManifestSummary: (filePath: string, readTextFile: ReadTextFile) => Promise<BarritsConsumedStateSummary>;
export declare const readWatchSnapshot: (filePath: string, readTextFile: ReadTextFile) => Promise<BarritsWatchSnapshot>;
export declare const readWatchSnapshotSummary: (filePath: string, readTextFile: ReadTextFile) => Promise<BarritsConsumedStateSummary>;
export declare const readLanguageToolSnapshot: (filePath: string, readTextFile: ReadTextFile) => Promise<BarritsLanguageToolSnapshot>;
export {};
