/**
 * @module
 * [EN] Bun adapter entrypoint. Bun is Node-compatible, so it reuses the Node.js filesystem adapter and
 * manifest readers; Bun-named aliases are exposed so consumers can write runtime-specific code without
 * referring to Node identifiers.
 * [ES] Punto de entrada del adaptador Bun. Bun es compatible con Node, por lo que reutiliza el adaptador de
 * filesystem y los lectores de manifiestos de Node.js; se exponen alias con nombre Bun para que los consumidores
 * escriban código específico del runtime sin referirse a identificadores de Node.
 */
export * from "../../src/index";
export { createNodeFileSystemAdapter, createNodeFileSystemAdapter as createBunFileSystemAdapter } from "../node/filesystem";
export {
  readNodeBuildManifest,
  readNodeBuildManifest as readBunBuildManifest,
  readNodeBuildManifestSummary,
  readNodeBuildManifestSummary as readBunBuildManifestSummary,
  readNodeLanguageToolSnapshot,
  readNodeLanguageToolSnapshot as readBunLanguageToolSnapshot,
  readNodeWatchSnapshot,
  readNodeWatchSnapshot as readBunWatchSnapshot,
  readNodeWatchSnapshotSummary,
  readNodeWatchSnapshotSummary as readBunWatchSnapshotSummary,
} from "../node/tooling";

/** [EN] Hashing utilities. [ES] Utilidades de hashing. */
export { sha256Hex, deterministicStringify, murmurHash3 } from "../../src/barrits_lib/logic/hashing";

/** [EN] Resilience patterns. [ES] Patrones de resiliencia. */
export { retryWithBackoff, withTimeout, createCircuitBreaker } from "../../src/barrits_lib/logic/resilience";

/** [EN] Datetime utilities. [ES] Utilidades de fecha y hora. */
export { toIsoString, toRelativeTime } from "../../src/barrits_lib/logic/datetime";

/**
 * [EN] Lazy CLI runner for Bun (delegates to the Node.js command pipeline).
 * [ES] Ejecutor perezoso de la CLI para Bun (delega en el pipeline de comandos de Node.js).
 */
export const runBunCli = async (argumentsList?: string[]): Promise<number> => {
  const cliModule = await import("../node/cli");
  return cliModule.runNodeCli(argumentsList);
};
