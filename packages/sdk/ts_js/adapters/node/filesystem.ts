import { readFile, readdir, stat } from "node:fs/promises";

import type { RuntimeFileSystemAdapter } from "../../src/barrits/sdk";

export const createNodeFileSystemAdapter = (): RuntimeFileSystemAdapter => {
  return {
    cwd: () => process.cwd(),
    directoryExists: async (path) => {
      try {
        return (await stat(path)).isDirectory();
      } catch {
        return false;
      }
    },
    listDirectories: async (path) => {
      try {
        const entries = await readdir(path, { withFileTypes: true });
        return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
      } catch {
        return [];
      }
    },
    listEntries: async (path) => {
      try {
        const entries = await readdir(path, { withFileTypes: true });
        return entries
          .filter((entry) => entry.isDirectory() || entry.isFile())
          .map((entry) => ({
            name: entry.name,
            type: entry.isDirectory() ? "directory" : "file",
          }));
      } catch {
        return [];
      }
    },
    readTextFile: async (path) => {
      return readFile(path, "utf8");
    },
  };
};