import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  defineBarritsConfig,
  defineBarritsPackage,
  loadBarritsConfig,
  resolveBarritsConfig,
  toBarritsAutomationOptions,
} from "../src/barrits/package";

test("defineBarritsPackage applies stable defaults for package-first automation", () => {
  const configuration = defineBarritsPackage({ runtime: "react" });

  assert.equal(configuration.runtime, "react");
  assert.equal(configuration.watch, "auto");
  assert.equal(configuration.debugCommands, false);
  assert.equal(configuration.autoManifest, true);
  assert.equal(configuration.automationDirectory, ".barrits");
  assert.equal(typeof configuration.projectRoot, "string");
});

test("toBarritsAutomationOptions disables auto manifest when watch is off", () => {
  const automation = toBarritsAutomationOptions({
    runtime: "node",
    watch: "off",
    projectRoot: "/tmp/project",
    autoManifest: true,
  });

  assert.deepEqual(automation, {
    projectRoot: "/tmp/project",
    manifestPath: undefined,
    autoManifest: false,
    automationDirectory: ".barrits",
  });
});

test("defineBarritsConfig keeps a typed root config contract", () => {
  const configuration = defineBarritsConfig({
    runtime: "node",
    autoManifest: true,
    automationDirectory: ".cache/barrits",
  });

  assert.equal(configuration.runtime, "node");
  assert.equal(configuration.automationDirectory, ".cache/barrits");
});

test("loadBarritsConfig and resolveBarritsConfig read root config files with inline override precedence", async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-config-root-"));
  const configPath = join(projectRoot, "barrits.config.mjs");

  await writeFile(
    configPath,
    [
      "export default {",
      '  runtime: "react",',
      '  watch: "manual",',
      '  autoManifest: true,',
      '  automationDirectory: ".cache/barrits",',
      "};",
      "",
    ].join("\n"),
    "utf8",
  );

  const loadedConfig = await loadBarritsConfig(projectRoot);
  assert.ok(loadedConfig);
  assert.equal(loadedConfig.runtime, "react");
  assert.equal(loadedConfig.automationDirectory, ".cache/barrits");
  assert.equal(loadedConfig.configFilePath, configPath);

  const resolvedConfig = await resolveBarritsConfig({
    projectRoot,
    watch: "off",
  });

  assert.equal(resolvedConfig.runtime, "react");
  assert.equal(resolvedConfig.watch, "off");
  assert.equal(resolvedConfig.autoManifest, true);
  assert.equal(resolvedConfig.automationDirectory, ".cache/barrits");
  assert.equal(resolvedConfig.configFilePath, configPath);
});