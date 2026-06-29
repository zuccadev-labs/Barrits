import type { RuntimeFileSystemAdapter } from "../../src/barrits/sdk";

type DenoRuntime = {
  cwd: () => string;
  stat: (path: string) => Promise<{ isDirectory: boolean }>;
  readDir: (path: string) => AsyncIterable<{ name: string; isDirectory: boolean }>;
  readTextFile: (path: string) => Promise<string>;
};

const getDenoRuntime = (): DenoRuntime => {
  const runtime = (globalThis as { Deno?: DenoRuntime }).Deno;

  if (!runtime) {
    throw new Error("Deno runtime is not available.");
  }

  return runtime;
};

export const createDenoFileSystemAdapter = (): RuntimeFileSystemAdapter => {
  const runtime = getDenoRuntime();

  return {
    cwd: () => runtime.cwd(),
    directoryExists: async (path) => {
      try {
        return (await runtime.stat(path)).isDirectory;
      } catch {
        return false;
      }
    },
    listDirectories: async (path) => {
      try {
        const directories: string[] = [];

        for await (const entry of runtime.readDir(path)) {
          if (entry.isDirectory) {
            directories.push(entry.name);
          }
        }

        return directories;
      } catch {
        return [];
      }
    },
    listEntries: async (path) => {
      try {
        const entries: Array<{ name: string; type: "file" | "directory" }> = [];

        for await (const entry of runtime.readDir(path)) {
          entries.push({
            name: entry.name,
            type: entry.isDirectory ? "directory" : "file",
          });
        }

        return entries;
      } catch {
        return [];
      }
    },
    readTextFile: async (path) => {
      return runtime.readTextFile(path);
    },
  };
};
