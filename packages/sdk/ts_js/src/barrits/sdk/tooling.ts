/**
 * @module
 * [EN] Runtime-agnostic manifest readers bound to a text reader. Runtime adapters (Node, Bun, Deno) expose
 * these readers under runtime-specific names instead of re-implementing them.
 * [ES] Lectores de manifiestos agnósticos del runtime ligados a un lector de texto. Los adaptadores de runtime
 * (Node, Bun, Deno) exponen estos lectores con nombres específicos en lugar de reimplementarlos.
 */
import type { BarritsBuildManifest, BarritsConsumedStateSummary, BarritsLanguageToolSnapshot, BarritsWatchSnapshot } from "./contracts";
import {
  readBuildManifest,
  readBuildManifestSummary,
  readLanguageToolSnapshot,
  readWatchSnapshot,
  readWatchSnapshotSummary,
} from "./consume";

/**
 * [EN] Manifest and snapshot readers bound to a runtime text reader.
 * [ES] Lectores de manifiestos y snapshots ligados a un lector de texto del runtime.
 */
export type BarritsManifestReaders = {
  /** [EN] Reads and validates a build manifest. [ES] Lee y valida un manifiesto de build. */
  readonly readBuildManifest: (filePath: string) => Promise<BarritsBuildManifest>;
  /** [EN] Reads a build manifest and summarizes it. [ES] Lee un manifiesto de build y lo resume. */
  readonly readBuildManifestSummary: (filePath: string) => Promise<BarritsConsumedStateSummary>;
  /** [EN] Reads and validates a watch snapshot. [ES] Lee y valida un snapshot de observación. */
  readonly readWatchSnapshot: (filePath: string) => Promise<BarritsWatchSnapshot>;
  /** [EN] Reads a watch snapshot and summarizes it. [ES] Lee un snapshot de observación y lo resume. */
  readonly readWatchSnapshotSummary: (filePath: string) => Promise<BarritsConsumedStateSummary>;
  /** [EN] Reads a watch snapshot as an editor-oriented language tool snapshot. [ES] Lee un snapshot de observación como snapshot de herramienta de lenguaje. */
  readonly readLanguageToolSnapshot: (filePath: string) => Promise<BarritsLanguageToolSnapshot>;
};

/**
 * [EN] Binds the manifest readers to a runtime text reader.
 * [ES] Liga los lectores de manifiestos a un lector de texto del runtime.
 *
 * @param readTextFile - [EN] Runtime function that reads a UTF-8 file. [ES] Función del runtime que lee un archivo UTF-8.
 * @returns [EN] Readers that only need a file path. [ES] Lectores que solo necesitan una ruta de archivo.
 */
export const createManifestReaders = (readTextFile: (filePath: string) => Promise<string>): BarritsManifestReaders => {
  return {
    readBuildManifest: (filePath) => readBuildManifest(filePath, readTextFile),
    readBuildManifestSummary: (filePath) => readBuildManifestSummary(filePath, readTextFile),
    readWatchSnapshot: (filePath) => readWatchSnapshot(filePath, readTextFile),
    readWatchSnapshotSummary: (filePath) => readWatchSnapshotSummary(filePath, readTextFile),
    readLanguageToolSnapshot: (filePath) => readLanguageToolSnapshot(filePath, readTextFile),
  };
};
