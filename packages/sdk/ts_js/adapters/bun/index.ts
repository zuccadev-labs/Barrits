export * from "../../src/index";
export { createNodeFileSystemAdapter } from "../node/filesystem";
export {
  readNodeBuildManifest,
  readNodeBuildManifestSummary,
  readNodeLanguageToolSnapshot,
  readNodeWatchSnapshot,
  readNodeWatchSnapshotSummary,
} from "../node/tooling";

/** Hashing utilities */
export {
  sha256Hex,
  deterministicStringify,
  murmurHash3,
} from "../../src/barrits_lib/logic/hashing";

/** Resilience patterns */
export {
  retryWithBackoff,
  withTimeout,
  createCircuitBreaker,
} from "../../src/barrits_lib/logic/resilience";

/** Datetime utilities */
export {
  toIsoString,
  toRelativeTime,
} from "../../src/barrits_lib/logic/datetime";

export const runBunCli = async (argumentsList?: string[]): Promise<number> => {
  const cliModule = await import("../node/cli");
  return cliModule.runNodeCli(argumentsList);
};
