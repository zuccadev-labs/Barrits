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

export const readDenoBuildManifest = async (filePath: string): Promise<BarritsBuildManifest> => {
  return readBuildManifest(filePath, (path) => getDenoRuntime().readTextFile(path));
};

export const readDenoBuildManifestSummary = async (filePath: string): Promise<BarritsConsumedStateSummary> => {
  return readBuildManifestSummary(filePath, (path) => getDenoRuntime().readTextFile(path));
};

export const readDenoWatchSnapshot = async (filePath: string): Promise<BarritsWatchSnapshot> => {
  return readWatchSnapshot(filePath, (path) => getDenoRuntime().readTextFile(path));
};

export const readDenoWatchSnapshotSummary = async (filePath: string): Promise<BarritsConsumedStateSummary> => {
  return readWatchSnapshotSummary(filePath, (path) => getDenoRuntime().readTextFile(path));
};

export const readDenoLanguageToolSnapshot = async (filePath: string): Promise<BarritsLanguageToolSnapshot> => {
  return readLanguageToolSnapshot(filePath, (path) => getDenoRuntime().readTextFile(path));
};