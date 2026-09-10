/**
 * @module
 * [EN] Node.js manifest readers: the runtime-agnostic readers bound to `node:fs/promises`.
 * [ES] Lectores de manifiestos para Node.js: los lectores agnósticos ligados a `node:fs/promises`.
 */
import { readFile } from "node:fs/promises";

import { createManifestReaders, type BarritsManifestReaders } from "../../src/barrits/sdk/tooling";

const readers: BarritsManifestReaders = createManifestReaders((filePath) => readFile(filePath, "utf8"));

/** [EN] Reads and validates a build manifest from disk. [ES] Lee y valida un manifiesto de build desde el disco. */
export const readNodeBuildManifest: BarritsManifestReaders["readBuildManifest"] = readers.readBuildManifest;
/** [EN] Reads a build manifest and summarizes it. [ES] Lee un manifiesto de build y lo resume. */
export const readNodeBuildManifestSummary: BarritsManifestReaders["readBuildManifestSummary"] = readers.readBuildManifestSummary;
/** [EN] Reads and validates a watch snapshot from disk. [ES] Lee y valida un snapshot de observación desde el disco. */
export const readNodeWatchSnapshot: BarritsManifestReaders["readWatchSnapshot"] = readers.readWatchSnapshot;
/** [EN] Reads a watch snapshot and summarizes it. [ES] Lee un snapshot de observación y lo resume. */
export const readNodeWatchSnapshotSummary: BarritsManifestReaders["readWatchSnapshotSummary"] = readers.readWatchSnapshotSummary;
/** [EN] Reads a watch snapshot as a language tool snapshot. [ES] Lee un snapshot de observación como snapshot de herramienta de lenguaje. */
export const readNodeLanguageToolSnapshot: BarritsManifestReaders["readLanguageToolSnapshot"] = readers.readLanguageToolSnapshot;
