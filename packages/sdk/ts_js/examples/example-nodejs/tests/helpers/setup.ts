import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const rootDir = resolve(import.meta.dirname, "..", "..");
// Resolve tsx through Node module resolution rather than a literal path: npm
// decides per-tree whether to hoist tsx to the root or keep it workspace-local,
// and a hardcoded path breaks whenever that decision changes.
const require = createRequire(import.meta.url);
const tsx = resolve(dirname(require.resolve("tsx/package.json")), "dist", "cli.mjs");

export const run = (script: string): string => {
  const result = spawnSync(process.execPath, [tsx, script], {
    cwd: rootDir,
    encoding: "utf-8",
    timeout: 15000,
  });
  if (result.status !== 0) {
    throw new Error(`exit ${result.status}: ${result.stderr || result.stdout}`);
  }
  return result.stdout;
};

export const importTs = (relPath: string) =>
  import(pathToFileURL(resolve(rootDir, relPath)).href);
