export * from "../../src/index";
export { createNodeFileSystemAdapter } from "./filesystem";
export {
  readNodeBuildManifest,
  readNodeBuildManifestSummary,
  readNodeLanguageToolSnapshot,
  readNodeWatchSnapshot,
  readNodeWatchSnapshotSummary,
} from "./tooling";

export const runNodeCli = async (argumentsList?: string[]): Promise<number> => {
  const cliModule = await import("./cli");
  return cliModule.runNodeCli(argumentsList);
};
