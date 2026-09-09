import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { createAutomationProjectFixture, writeProjectFile } from "./helpers/fixtures";
import { runCommand } from "./helpers/process";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const builtBinaryPath = join(repositoryRoot, "dist", "adapters", "node", "bin.js");

const [nodeMajor, nodeMinor] = process.versions.node.split(".").map(Number);
const supportsStripTypesFlag = nodeMajor > 22 || (nodeMajor === 22 && nodeMinor >= 6);
const withoutTypeStripping = supportsStripTypesFlag ? ["--no-experimental-strip-types"] : [];

test("built CLI binary exists (run `npm run build` before the test suite)", () => {
  assert.ok(existsSync(builtBinaryPath), `missing ${builtBinaryPath}`);
});

test("built CLI binary prints usage when invoked with plain node", async () => {
  const result = await runCommand(process.execPath, [builtBinaryPath, "help"], repositoryRoot);

  assert.equal(result.exitCode, 0);
  assert.match(result.stdout, /Usage:/);
  assert.match(result.stdout, /barrits detect \[path\]/);
});

test("built CLI binary loads a TypeScript config without a TypeScript loader", async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-dist-cli-"));

  try {
    await createAutomationProjectFixture(projectRoot);
    await writeProjectFile(
      projectRoot,
      "barrits.config.ts",
      [
        "type TraitContract = { name: string; sourceFile: string; bindingName: string; provides: string[] };",
        "type RootConfig = { automationDirectory: string; contracts: { traits: TraitContract[] } };",
        "const config: RootConfig = {",
        '  automationDirectory: ".barrits",',
        "  contracts: {",
        '    traits: [{ name: "duplicar-trait", sourceFile: "logic/duplicar.ts", bindingName: "duplicar", provides: ["duplicar"] }],',
        "  },",
        "};",
        "export default config;",
        "",
      ].join("\n"),
    );

    const result = await runCommand(process.execPath, [...withoutTypeStripping, builtBinaryPath, "info", projectRoot], repositoryRoot);

    assert.equal(result.exitCode, 0, result.stderr);
    assert.match(result.stdout, /traits: 1/);
    assert.doesNotMatch(result.stderr, /ERR_UNKNOWN_FILE_EXTENSION/);

    const detect = await runCommand(process.execPath, [builtBinaryPath, "detect", projectRoot, "--json"], repositoryRoot);
    assert.equal(detect.exitCode, 0, detect.stderr);
    assert.equal((JSON.parse(detect.stdout) as { found: boolean }).found, true);
  } finally {
    await rm(projectRoot, { recursive: true, force: true });
  }
});
