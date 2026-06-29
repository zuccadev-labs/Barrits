import { readFile } from "node:fs/promises";

import {
  readBuildManifest,
  readBuildManifestSummary,
  readLanguageToolSnapshot,
  readWatchSnapshot,
  readWatchSnapshotSummary,
} from "../../src/barrits/sdk/consume";

export const readNodeBuildManifest = async (filePath: string) => {
  return readBuildManifest(filePath, (path) => readFile(path, "utf8"));
};

export const readNodeBuildManifestSummary = async (filePath: string) => {
  return readBuildManifestSummary(filePath, (path) => readFile(path, "utf8"));
};

export const readNodeWatchSnapshot = async (filePath: string) => {
  return readWatchSnapshot(filePath, (path) => readFile(path, "utf8"));
};

export const readNodeWatchSnapshotSummary = async (filePath: string) => {
  return readWatchSnapshotSummary(filePath, (path) => readFile(path, "utf8"));
};

export const readNodeLanguageToolSnapshot = async (filePath: string) => {
  return readLanguageToolSnapshot(filePath, (path) => readFile(path, "utf8"));
};
