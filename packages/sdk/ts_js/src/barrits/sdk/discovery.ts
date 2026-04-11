import type { BarritsDiscovery, FindBarritsOptions, RuntimeFileSystemAdapter } from "./contracts";
import { basenamePath, dirnamePath, isRootPath, joinPath, normalizePath } from "./path";

const DEFAULT_MAX_DEPTH = 4;
const DEFAULT_TARGET_NAME = "barrits";
const DEFAULT_IGNORED_DIRECTORIES = [".git", "node_modules", "dist", "build", ".next", ".turbo"];

const findInDescendants = async (
  adapter: RuntimeFileSystemAdapter,
  rootDirectory: string,
  targetName: string,
  maxDepth: number,
  ignoredDirectories: Set<string>,
): Promise<string | null> => {
  const queue: Array<{ path: string; depth: number }> = [{ path: rootDirectory, depth: 0 }];

  while (queue.length > 0) {
    const current = queue.shift();

    if (!current) {
      continue;
    }

    if (current.depth >= maxDepth) {
      continue;
    }

    const directories = await adapter.listDirectories(current.path);

    for (const directoryName of directories) {
      if (ignoredDirectories.has(directoryName)) {
        continue;
      }

      const candidate = joinPath(current.path, directoryName);

      if (directoryName === targetName) {
        return candidate;
      }

      queue.push({ path: candidate, depth: current.depth + 1 });
    }
  }

  return null;
};

export const findBarritsDirectory = async (
  adapter: RuntimeFileSystemAdapter,
  options: FindBarritsOptions = {},
): Promise<BarritsDiscovery | null> => {
  const startDirectory = normalizePath(options.startDirectory ?? (await adapter.cwd()));
  const targetName = options.targetName ?? DEFAULT_TARGET_NAME;
  const maxDepth = options.maxDepth ?? DEFAULT_MAX_DEPTH;
  const ignoredDirectories = new Set(options.ignoredDirectories ?? DEFAULT_IGNORED_DIRECTORIES);

  if (basenamePath(startDirectory) === targetName) {
    const projectRoot = dirnamePath(startDirectory);

    return {
      projectRoot,
      barritsDirectory: startDirectory,
      strategy: "current-directory",
    };
  }

  let cursor = startDirectory;

  while (true) {
    const directChild = joinPath(cursor, targetName);

    if (await adapter.directoryExists(directChild)) {
      return {
        projectRoot: cursor,
        barritsDirectory: directChild,
        strategy: cursor === startDirectory ? "direct-child" : "ancestor-child",
      };
    }

    if (cursor === startDirectory) {
      const descendant = await findInDescendants(adapter, cursor, targetName, maxDepth, ignoredDirectories);

      if (descendant) {
        return {
          projectRoot: cursor,
          barritsDirectory: descendant,
          strategy: "recursive-child",
        };
      }
    }

    if (isRootPath(cursor)) {
      break;
    }

    const parent = dirnamePath(cursor);

    if (parent === cursor) {
      break;
    }

    cursor = parent;
  }

  return null;
};