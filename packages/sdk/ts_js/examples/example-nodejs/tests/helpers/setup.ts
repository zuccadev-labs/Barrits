import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const rootDir = resolve(import.meta.dirname, "..", "..");
const tsx = resolve(rootDir, "..", "..", "node_modules", "tsx", "dist", "cli.mjs");

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
