/**
 * @module
 * [EN] Build manifest and watch snapshot consumption: parsing, summarization, and diagnostics.
 * [ES] Consumo de manifiestos de compilación y snapshots de observación: análisis, resumen y diagnósticos.
 */
import type { BarritsBuildManifest, BarritsConsumedStateSummary, BarritsLanguageToolSnapshot, BarritsWatchSnapshot } from "./contracts";
type ReadTextFile = (filePath: string) => Promise<string>;
/** [EN] Verifies and parses a JSON source into a validated BarritsBuildManifest.
 *  [ES] Verifica y parsea una fuente JSON en un BarritsBuildManifest validado. */
export declare const parseBuildManifest: (source: string) => BarritsBuildManifest;
/**
 * [EN] Implementation of Parse watch snapshot.
 * [ES] Implementación de Parse watch snapshot.
 */
export declare const parseWatchSnapshot: (source: string) => BarritsWatchSnapshot;
/** [EN] Asynchronously reads and validates a build manifest from the filesystem.
 *  [ES] Lee y valida asíncronamente un manifiesto de build desde el sistema de archivos. */
export declare const readBuildManifest: (filePath: string, readTextFile: ReadTextFile) => Promise<BarritsBuildManifest>;
/** [EN] Reads a manifest and returns a simplified summary for consumer usage.
 *  [ES] Lee un manifiesto y retorna un resumen simplificado para uso del consumidor. */
export declare const readBuildManifestSummary: (filePath: string, readTextFile: ReadTextFile) => Promise<BarritsConsumedStateSummary>;
/**
 * [EN] Implementation of Read watch snapshot.
 * [ES] Implementación de Read watch snapshot.
 */
export declare const readWatchSnapshot: (filePath: string, readTextFile: ReadTextFile) => Promise<BarritsWatchSnapshot>;
/**
 * [EN] Implementation of Read watch snapshot summary.
 * [ES] Implementación de Read watch snapshot summary.
 */
export declare const readWatchSnapshotSummary: (filePath: string, readTextFile: ReadTextFile) => Promise<BarritsConsumedStateSummary>;
/**
 * [EN] Implementation of Read language tool snapshot.
 * [ES] Implementación de Read language tool snapshot.
 */
export declare const readLanguageToolSnapshot: (filePath: string, readTextFile: ReadTextFile) => Promise<BarritsLanguageToolSnapshot>;
/** [EN] Transforms a raw manifest into a high-level summary of domains and traits.
 *  [ES] Transforma un manifiesto crudo en un resumen de alto nivel de dominios y traits. */
/**
 * [EN] Creates a summary of the build manifest for consumption by language tools.
 * [ES] Crea un resumen del manifiesto de construcción para su consumo por herramientas de lenguaje.
 * @param manifest - [EN] The build manifest to summarize. [ES] El manifiesto de construcción que se resumirá.
 * @returns [EN] A summary of the build manifest. [ES] Un resumen del manifiesto de construcción.
 */
export declare const createBuildManifestSummary: (manifest: BarritsBuildManifest | null) => BarritsConsumedStateSummary;
/**
 * [EN] Implementation of Create watch snapshot summary.
 * [ES] Implementación de Create watch snapshot summary.
 */
export declare const createWatchSnapshotSummary: (snapshot: BarritsWatchSnapshot | null) => BarritsConsumedStateSummary;
/**
 * [EN] Implementation of Create language tool snapshot.
 * [ES] Implementación de Create language tool snapshot.
 */
export declare const createLanguageToolSnapshot: (snapshot: BarritsWatchSnapshot) => BarritsLanguageToolSnapshot;
export {};
