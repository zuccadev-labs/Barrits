import { expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const rootDir = resolve(import.meta.dirname, "..", "..");

export const run = (script: string): string => {
  const result = spawnSync("bun", ["run", script], {
    cwd: rootDir,
    encoding: "utf-8",
    timeout: 15000,
  });
  expect(result.status).toBe(0);
  return result.stdout;
};
