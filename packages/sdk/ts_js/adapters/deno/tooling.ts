import {
  readBuildManifest,
  readBuildManifestSummary,
  readLanguageToolSnapshot,
  readWatchSnapshot,
  readWatchSnapshotSummary,
} from "../../src/barrits/sdk/consume";
import type {
  BarritsBuildManifest,
  BarritsConsumedStateSummary,
  BarritsLanguageToolSnapshot,
  BarritsWatchSnapshot,
} from "../../src/barrits/sdk/contracts";

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

/**
 * [EN] Reads and parses a build manifest from disk using Deno's native file system.
 * [ES] Lee y analiza un manifiesto de compilación desde el disco usando el sistema de archivos nativo de Deno.
 *
 * @param filePath - [EN] Absolute path to the manifest file. [ES] Ruta absoluta al archivo de manifiesto.
 * @returns [EN] A validated build manifest. [ES] Un manifiesto de compilación validado.
 */
export const readDenoBuildManifest = async (filePath: string): Promise<BarritsBuildManifest> => {
  return readBuildManifest(filePath, (path) => getDenoRuntime().readTextFile(path));
};

/**
 * [EN] Reads a build manifest from disk and produces a consumed state summary using Deno's file system.
 * [ES] Lee un manifiesto de compilación desde el disco y produce un resumen de estado consumido usando el sistema de archivos de Deno.
 *
 * @param filePath - [EN] Absolute path to the manifest file. [ES] Ruta absoluta al archivo de manifiesto.
 * @returns [EN] A consumed state summary with aggregated diagnostics. [ES] Un resumen de estado consumido con diagnósticos agregados.
 */
export const readDenoBuildManifestSummary = async (filePath: string): Promise<BarritsConsumedStateSummary> => {
  return readBuildManifestSummary(filePath, (path) => getDenoRuntime().readTextFile(path));
};

/**
 * [EN] Reads and parses a watch snapshot from disk using Deno's native file system.
 * [ES] Lee y analiza un snapshot de observación desde el disco usando el sistema de archivos nativo de Deno.
 *
 * @param filePath - [EN] Absolute path to the snapshot file. [ES] Ruta absoluta al archivo de snapshot.
 * @returns [EN] A validated watch snapshot. [ES] Un snapshot de observación validado.
 */
export const readDenoWatchSnapshot = async (filePath: string): Promise<BarritsWatchSnapshot> => {
  return readWatchSnapshot(filePath, (path) => getDenoRuntime().readTextFile(path));
};

/**
 * [EN] Reads a watch snapshot from disk and produces a consumed state summary using Deno's file system.
 * [ES] Lee un snapshot de observación desde el disco y produce un resumen de estado consumido usando el sistema de archivos de Deno.
 *
 * @param filePath - [EN] Absolute path to the snapshot file. [ES] Ruta absoluta al archivo de snapshot.
 * @returns [EN] A consumed state summary with aggregated diagnostics. [ES] Un resumen de estado consumido con diagnósticos agregados.
 */
export const readDenoWatchSnapshotSummary = async (filePath: string): Promise<BarritsConsumedStateSummary> => {
  return readWatchSnapshotSummary(filePath, (path) => getDenoRuntime().readTextFile(path));
};

/**
 * [EN] Reads a watch snapshot from disk and produces a detailed language tool snapshot using Deno's file system.
 * [ES] Lee un snapshot de observación desde el disco y produce un snapshot detallado de herramienta de lenguaje usando el sistema de archivos de Deno.
 *
 * @param filePath - [EN] Absolute path to the snapshot file. [ES] Ruta absoluta al archivo de snapshot.
 * @returns [EN] A language tool snapshot with full domain, diagnostic, and collision data. [ES] Un snapshot de herramienta de lenguaje con datos completos de dominio, diagnóstico y colisión.
 */
export const readDenoLanguageToolSnapshot = async (filePath: string): Promise<BarritsLanguageToolSnapshot> => {
  return readLanguageToolSnapshot(filePath, (path) => getDenoRuntime().readTextFile(path));
};
