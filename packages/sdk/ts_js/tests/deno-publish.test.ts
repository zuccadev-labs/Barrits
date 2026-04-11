import test from "node:test";
import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { runCommand } from "./helpers/process";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

test("deno publish dry-run validates the JSR package surface", { concurrency: false }, async () => {
  const result = await runCommand(
    "deno",
    ["publish", "--dry-run", "--allow-dirty", "--config", "jsr.json"],
    repositoryRoot,
    process.env,
  );

  assert.equal(result.exitCode, 0, `deno publish dry-run failed\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
});