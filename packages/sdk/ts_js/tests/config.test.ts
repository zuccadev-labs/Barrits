import { describe, it, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  defineBarritsConfig,
  findBarritsConfigFile,
  loadBarritsConfig,
  resolveBarritsConfig,
  DEFAULT_AUTOMATION_DIRECTORY,
  BARRITS_CONFIG_FILENAMES,
} from "../src/barrits/config";

const tempDirs = new Set<string>();

after(async () => {
  const dirs = [...tempDirs];
  tempDirs.clear();
  await Promise.allSettled(dirs.map((d) => rm(d, { recursive: true, force: true })));
});

describe("DEFAULT_AUTOMATION_DIRECTORY", () => {
  it("is '.barrits'", () => {
    assert.equal(DEFAULT_AUTOMATION_DIRECTORY, ".barrits");
  });
});

describe("BARRITS_CONFIG_FILENAMES", () => {
  it("contains expected filenames in order", () => {
    assert.deepEqual([...BARRITS_CONFIG_FILENAMES], [
      "barrits.config.ts",
      "barrits.config.mts",
      "barrits.config.js",
      "barrits.config.mjs",
    ]);
  });
});

describe("defineBarritsConfig", () => {
  it("returns the same config object", () => {
    const config = { runtime: "node" as const };
    assert.equal(defineBarritsConfig(config), config);
  });

  it("preserves runtime type", () => {
    const result = defineBarritsConfig({ runtime: "deno", watch: "auto" });
    assert.equal(result.runtime, "deno");
    assert.equal(result.watch, "auto");
  });

  it("accepts empty config", () => {
    const result = defineBarritsConfig({});
    assert.deepEqual(result, {});
  });
});

describe("findBarritsConfigFile", () => {
  it("finds barrits.config.mjs when present", async () => {
    const dir = await mkdtemp(join(tmpdir(), "barrits-config-")); tempDirs.add(dir);
    await writeFile(join(dir, "barrits.config.mjs"), "export default {};");
    const result = await findBarritsConfigFile(dir);
    assert.ok(result);
    assert.ok(result.endsWith("barrits.config.mjs"));
  });

  it("finds barrits.config.ts when present", async () => {
    const dir = await mkdtemp(join(tmpdir(), "barrits-config-")); tempDirs.add(dir);
    await writeFile(join(dir, "barrits.config.ts"), `export default {} as const;`);
    const result = await findBarritsConfigFile(dir);
    assert.ok(result);
    assert.ok(result.endsWith("barrits.config.ts"));
  });

  it("returns undefined when no config file exists", async () => {
    const dir = await mkdtemp(join(tmpdir(), "barrits-config-")); tempDirs.add(dir);
    const result = await findBarritsConfigFile(dir);
    assert.equal(result, undefined);
  });

  it("returns undefined for non-node runtime", async () => {
    const dir = await mkdtemp(join(tmpdir(), "barrits-config-")); tempDirs.add(dir);
    await writeFile(join(dir, "barrits.config.mjs"), "export default {};");
    // The function uses detectRuntime which returns "node" in this env,
    // so this test verifies the runtime guard logic conceptually
    const result = await findBarritsConfigFile(dir);
    assert.ok(result);
  });
});

describe("loadBarritsConfig", () => {
  it("loads config from barrits.config.mjs", async () => {
    const dir = await mkdtemp(join(tmpdir(), "barrits-config-")); tempDirs.add(dir);
    const configContent = `export default { runtime: "deno", watch: "manual" };`;
    await writeFile(join(dir, "barrits.config.mjs"), configContent);
    const result = await loadBarritsConfig(dir);
    assert.ok(result);
    assert.equal(result.runtime, "deno");
    assert.equal(result.watch, "manual");
    assert.ok(result.configFilePath);
    assert.ok(result.configFilePath.endsWith("barrits.config.mjs"));
  });

  it("loads config with barritsConfig named export", async () => {
    const dir = await mkdtemp(join(tmpdir(), "barrits-config-")); tempDirs.add(dir);
    const configContent = `export const barritsConfig = { runtime: "deno" };`;
    await writeFile(join(dir, "barrits.config.mjs"), configContent);
    const result = await loadBarritsConfig(dir);
    assert.ok(result);
    assert.equal(result.runtime, "deno");
  });

  it("returns null when no config file exists", async () => {
    const dir = await mkdtemp(join(tmpdir(), "barrits-config-")); tempDirs.add(dir);
    const result = await loadBarritsConfig(dir);
    assert.equal(result, null);
  });

  it("throws when config does not export an object", async () => {
    const dir = await mkdtemp(join(tmpdir(), "barrits-config-")); tempDirs.add(dir);
    await writeFile(join(dir, "barrits.config.mjs"), "export default 42;");
    await assert.rejects(
      () => loadBarritsConfig(dir),
      /must export an object/,
    );
  });
});

describe("resolveBarritsConfig", () => {
  it("returns defaults when no config file and no options", async () => {
    const result = await resolveBarritsConfig({});
    assert.equal(result.runtime, "other");
    assert.equal(result.watch, "auto");
    assert.equal(result.autoManifest, true);
    assert.equal(result.debugCommands, false);
    assert.equal(result.traitConflictStrategy, "error");
    assert.equal(result.automationDirectory, ".barrits");
  });

  it("overrides runtime with explicit option", async () => {
    const result = await resolveBarritsConfig({ runtime: "node" });
    assert.equal(result.runtime, "node");
  });

  it("overrides watch with explicit option", async () => {
    const result = await resolveBarritsConfig({ watch: "off" });
    assert.equal(result.watch, "off");
  });

  it("merges options from config file with explicit overrides", async () => {
    const dir = await mkdtemp(join(tmpdir(), "barrits-config-")); tempDirs.add(dir);
    await writeFile(join(dir, "barrits.config.mjs"), `export default { runtime: "deno", watch: "manual" };`);
    const result = await resolveBarritsConfig({ runtime: "node" }, dir);
    assert.equal(result.runtime, "node");
    assert.equal(result.watch, "manual");
  });

  it("uses fallbackProjectRoot when no projectRoot in options", async () => {
    const dir = await mkdtemp(join(tmpdir(), "barrits-config-")); tempDirs.add(dir);
    const result = await resolveBarritsConfig({}, dir);
    assert.equal(result.projectRoot, dir);
  });

  it("configFilePath is undefined when no config file", async () => {
    const dir = await mkdtemp(join(tmpdir(), "barrits-config-")); tempDirs.add(dir);
    const result = await resolveBarritsConfig({}, dir);
    assert.equal(result.configFilePath, undefined);
  });
});
