import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  normalizeAutomationDirectory,
  normalizePackageOptions,
  normalizeResolvedConfig,
} from "../src/barrits/internal/config_normalization";

import type {
  BarritsRootConfig,
  BarritsRuntimeKind,
  BarritsWatchMode,
} from "../src/barrits/config";

describe("normalizeAutomationDirectory", () => {
  it("returns default for undefined", () => {
    assert.equal(normalizeAutomationDirectory(undefined), ".barrits");
  });

  it("returns default for empty string", () => {
    assert.equal(normalizeAutomationDirectory(""), ".barrits");
  });

  it("returns default for whitespace-only string", () => {
    assert.equal(normalizeAutomationDirectory("   "), ".barrits");
  });

  it("trims whitespace", () => {
    assert.equal(normalizeAutomationDirectory("  custom-dir  "), "custom-dir");
  });

  it("removes trailing slashes", () => {
    assert.equal(normalizeAutomationDirectory("my-dir///"), "my-dir");
  });

  it("removes trailing backslashes", () => {
    assert.equal(normalizeAutomationDirectory("my-dir\\\\\\"), "my-dir");
  });

  it("preserves value without trailing slashes", () => {
    assert.equal(normalizeAutomationDirectory("my-dir"), "my-dir");
  });

  it("preserves nested path", () => {
    assert.equal(normalizeAutomationDirectory("deep/path/dir"), "deep/path/dir");
  });
});

describe("normalizePackageOptions", () => {
  it("returns defaults for empty options", () => {
    const result = normalizePackageOptions({}, "/fallback/project");
    assert.equal(result.runtime, "other");
    assert.equal(result.watch, "auto");
    assert.equal(result.debugCommands, false);
    assert.equal(result.projectRoot, "/fallback/project");
    assert.equal(result.manifestPath, undefined);
    assert.equal(result.autoManifest, true);
    assert.equal(result.automationDirectory, ".barrits");
    assert.deepEqual(result.discoveryRoots, []);
    assert.equal(result.traitConflictStrategy, "error");
  });

  it("uses provided runtime", () => {
    const result = normalizePackageOptions({ runtime: "deno" } as BarritsRootConfig, "/p");
    assert.equal(result.runtime, "deno");
  });

  it("uses provided watch mode", () => {
    const result = normalizePackageOptions({ watch: "manual" } as BarritsRootConfig, "/p");
    assert.equal(result.watch, "manual");
  });

  it("uses provided debugCommands", () => {
    const result = normalizePackageOptions({ debugCommands: true } as BarritsRootConfig, "/p");
    assert.equal(result.debugCommands, true);
  });

  it("uses provided projectRoot", () => {
    const result = normalizePackageOptions({ projectRoot: "/custom/root" } as BarritsRootConfig, "/fallback");
    assert.equal(result.projectRoot, "/custom/root");
  });

  it("uses fallbackProjectRoot when no projectRoot set", () => {
    const result = normalizePackageOptions({}, "/fallback/project");
    assert.equal(result.projectRoot, "/fallback/project");
  });

  it("uses provided manifestPath", () => {
    const result = normalizePackageOptions({ manifestPath: "/path/to/manifest.json" } as BarritsRootConfig, "/p");
    assert.equal(result.manifestPath, "/path/to/manifest.json");
  });

  it("leaves manifestPath undefined when not provided", () => {
    const result = normalizePackageOptions({}, "/p");
    assert.equal(result.manifestPath, undefined);
  });

  it("uses provided autoManifest", () => {
    const result = normalizePackageOptions({ autoManifest: false } as BarritsRootConfig, "/p");
    assert.equal(result.autoManifest, false);
  });

  it("normalizes automationDirectory", () => {
    const result = normalizePackageOptions({ automationDirectory: "  custom/path/  " } as BarritsRootConfig, "/p");
    assert.equal(result.automationDirectory, "custom/path");
  });

  it("uses provided discoveryRoots", () => {
    const result = normalizePackageOptions({ discoveryRoots: ["src", "lib"] } as BarritsRootConfig, "/p");
    assert.deepEqual(result.discoveryRoots, ["src", "lib"]);
  });

  it("uses provided traitConflictStrategy", () => {
    const result = normalizePackageOptions({ traitConflictStrategy: "merge" } as BarritsRootConfig, "/p");
    assert.equal(result.traitConflictStrategy, "merge");
  });

  it("returns discoveryRoots as array", () => {
    const result = normalizePackageOptions({ discoveryRoots: ["src"] } as BarritsRootConfig, "/p");
    assert.ok(Array.isArray(result.discoveryRoots));
  });

  it("returns readonly traitConflictStrategy", () => {
    const result = normalizePackageOptions({ traitConflictStrategy: "override" } as BarritsRootConfig, "/p");
    assert.equal(result.traitConflictStrategy, "override");
  });
});

describe("normalizeResolvedConfig", () => {
  it("extends normalized options with optional fields", () => {
    const result = normalizeResolvedConfig(
      {
        runtime: "node",
        contracts: { traits: [{ name: "test", sourceFile: "test.ts", bindingName: "test" }] },
        configFilePath: "/project/barrits.config.ts",
        main: () => undefined,
        namespace: "custom",
      } as BarritsRootConfig,
      "/project",
      "/project/barrits.config.ts",
    );

    assert.equal(result.runtime, "node");
    assert.equal(result.projectRoot, "/project");
    assert.equal(result.configFilePath, "/project/barrits.config.ts");
    assert.ok(result.contracts);
    assert.equal(result.contracts!.traits!.length, 1);
    assert.equal(result.contracts!.traits![0].name, "test");
    assert.equal(typeof result.main, "function");
    assert.equal(result.namespace, "custom");
  });

  it("allows configFilePath undefined", () => {
    const result = normalizeResolvedConfig({}, "/project");
    assert.equal(result.configFilePath, undefined);
  });
});
