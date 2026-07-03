export * from "../../src/index";
export { createNodeFileSystemAdapter } from "../node/filesystem";
export {
  readNodeBuildManifest,
  readNodeBuildManifestSummary,
  readNodeLanguageToolSnapshot,
  readNodeWatchSnapshot,
  readNodeWatchSnapshotSummary,
} from "../node/tooling";

export const runBunCli = async (argumentsList?: string[]): Promise<number> => {
  const cliModule = await import("../node/cli");
  return cliModule.runNodeCli(argumentsList);
};
