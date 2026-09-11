/**
 * @module
 * [EN] Deno manifest readers: the runtime-agnostic readers bound to `Deno.readTextFile`.
 * [ES] Lectores de manifiestos para Deno: los lectores agnósticos ligados a `Deno.readTextFile`.
 */
import { createManifestReaders, type BarritsManifestReaders } from "../../src/barrits/sdk/tooling";

type DenoReadRuntime = {
  readTextFile: (path: string) => Promise<string>;
};

const getDenoRuntime = (): DenoReadRuntime => {
  const runtime = (globalThis as { Deno?: DenoReadRuntime }).Deno;

  if (!runtime) {
    throw new Error("Deno runtime is not available.");
  }

  return runtime;
};

const readers: BarritsManifestReaders = createManifestReaders((filePath) => getDenoRuntime().readTextFile(filePath));

/**
 * [EN] Reads and parses a build manifest from disk using Deno's native file system.
 * [ES] Lee y analiza un manifiesto de compilación desde el disco usando el sistema de archivos nativo de Deno.
 */
export const readDenoBuildManifest: BarritsManifestReaders["readBuildManifest"] = readers.readBuildManifest;

/**
 * [EN] Reads a build manifest from disk and produces a consumed state summary using Deno's file system.
 * [ES] Lee un manifiesto de compilación desde el disco y produce un resumen de estado consumido usando el sistema de archivos de Deno.
 */
export const readDenoBuildManifestSummary: BarritsManifestReaders["readBuildManifestSummary"] = readers.readBuildManifestSummary;

/**
 * [EN] Reads and parses a watch snapshot from disk using Deno's native file system.
 * [ES] Lee y analiza un snapshot de observación desde el disco usando el sistema de archivos nativo de Deno.
 */
export const readDenoWatchSnapshot: BarritsManifestReaders["readWatchSnapshot"] = readers.readWatchSnapshot;

/**
 * [EN] Reads a watch snapshot from disk and produces a consumed state summary using Deno's file system.
 * [ES] Lee un snapshot de observación desde el disco y produce un resumen de estado consumido usando el sistema de archivos de Deno.
 */
export const readDenoWatchSnapshotSummary: BarritsManifestReaders["readWatchSnapshotSummary"] = readers.readWatchSnapshotSummary;

/**
 * [EN] Reads a watch snapshot from disk and produces a detailed language tool snapshot using Deno's file system.
 * [ES] Lee un snapshot de observación desde el disco y produce un snapshot detallado de herramienta de lenguaje usando el sistema de archivos de Deno.
 */
export const readDenoLanguageToolSnapshot: BarritsManifestReaders["readLanguageToolSnapshot"] = readers.readLanguageToolSnapshot;
