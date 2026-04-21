import type { BarritsBuildManifest, BarritsConsumedStateSummary, BarritsLanguageToolSnapshot, BarritsWatchSnapshot } from "./contracts";
type ReadTextFile = (filePath: string) => Promise<string>;
/** [EN] Verifies and parses a JSON source into a validated BarritsBuildManifest.
 *  [ES] Verifica y parsea una fuente JSON en un BarritsBuildManifest validado. */
export declare const parseBuildManifest: (source: string) => BarritsBuildManifest;
export declare const parseWatchSnapshot: (source: string) => BarritsWatchSnapshot;
/** [EN] Asynchronously reads and validates a build manifest from the filesystem.
 *  [ES] Lee y valida asíncronamente un manifiesto de build desde el sistema de archivos. */
export declare const readBuildManifest: (filePath: string, readTextFile: ReadTextFile) => Promise<BarritsBuildManifest>;
/** [EN] Reads a manifest and returns a simplified summary for consumer usage.
 *  [ES] Lee un manifiesto y retorna un resumen simplificado para uso del consumidor. */
export declare const readBuildManifestSummary: (filePath: string, readTextFile: ReadTextFile) => Promise<BarritsConsumedStateSummary>;
export declare const readWatchSnapshot: (filePath: string, readTextFile: ReadTextFile) => Promise<BarritsWatchSnapshot>;
export declare const readWatchSnapshotSummary: (filePath: string, readTextFile: ReadTextFile) => Promise<BarritsConsumedStateSummary>;
export declare const readLanguageToolSnapshot: (filePath: string, readTextFile: ReadTextFile) => Promise<BarritsLanguageToolSnapshot>;
/** [EN] Transforms a raw manifest into a high-level summary of domains and traits.
 *  [ES] Transforma un manifiesto crudo en un resumen de alto nivel de dominios y traits. */
export declare const createBuildManifestSummary: (manifest: BarritsBuildManifest | null) => BarritsConsumedStateSummary;
export declare const createWatchSnapshotSummary: (snapshot: BarritsWatchSnapshot | null) => BarritsConsumedStateSummary;
export declare const createLanguageToolSnapshot: (snapshot: BarritsWatchSnapshot) => BarritsLanguageToolSnapshot;
export {};
