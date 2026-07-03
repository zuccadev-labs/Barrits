import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  classifyFileKind,
  toRelativeFilePath,
  collectFiles,
  inspectFile,
  buildLayer,
  inspectLayer,
} from "../src/barrits/sdk/crawler/layer";
import type { RuntimeFileSystemAdapter, BarritsFileIntegration, BarritsSourceLayer } from "../src/barrits/sdk/contracts";
import { createRuntimeFileSystemAdapter } from "../src/barrits/sdk/adapters";

const makeRelative = (p: string) => toRelativeFilePath("/project/barrits", `/project/barrits/${p}`);

describe("classifyFileKind", () => {
  it("classifies index.ts as root", () => {
    assert.equal(classifyFileKind("index.ts"), "root");
  });

  it("classifies traits/ files as trait", () => {
    assert.equal(classifyFileKind("traits/myTrait.ts"), "trait");
    assert.equal(classifyFileKind("traits/index.ts"), "trait");
  });

  it("classifies */index.ts as barrel", () => {
    assert.equal(classifyFileKind("logic/index.ts"), "barrel");
    assert.equal(classifyFileKind("a/b/index.ts"), "barrel");
  });

  it("classifies internal files", () => {
    assert.equal(classifyFileKind("logic/internal.ts"), "internal");
    assert.equal(classifyFileKind("logic/internal/helper.ts"), "internal");
  });

  it("classifies shared files", () => {
    assert.equal(classifyFileKind("shared/utils.ts"), "shared");
  });

  it("classifies sdk files", () => {
    assert.equal(classifyFileKind("sdk/client.ts"), "sdk");
  });

  it("classifies remaining as domain", () => {
    assert.equal(classifyFileKind("api/flat.ts"), "domain");
    assert.equal(classifyFileKind("logic/math/sumar.ts"), "domain");
  });
});

describe("toRelativeFilePath", () => {
  it("returns relative path from barritsDirectory", () => {
    assert.equal(makeRelative("logic/math.ts"), "logic/math.ts");
  });
});

describe("collectFiles", () => {
  it("collects all supported files recursively", async () => {
    const adapter: RuntimeFileSystemAdapter = {
      cwd: async () => "/project/barrits",
      directoryExists: async () => true,
      listDirectories: async () => [],
      listEntries: async (path: string) => {
        if (path === "/project/barrits") {
          return [
            { name: "index.ts", type: "file" },
            { name: "logic", type: "directory" },
            { name: "node_modules", type: "directory" },
          ];
        }
        if (path === "/project/barrits/logic") {
          return [
            { name: "math.ts", type: "file" },
            { name: "internal", type: "directory" },
          ];
        }
        if (path === "/project/barrits/logic/internal") {
          return [
            { name: "helper.ts", type: "file" },
            { name: "data.json", type: "file" },
          ];
        }
        return [];
      },
      readTextFile: async () => "",
    };
    const files = await collectFiles(adapter, "/project/barrits");
    assert.deepEqual(files, [
      "/project/barrits/index.ts",
      "/project/barrits/logic/internal/helper.ts",
      "/project/barrits/logic/math.ts",
    ]);
  });

  it("filters out IGNORED_DIRECTORIES", async () => {
    const adapter: RuntimeFileSystemAdapter = {
      cwd: async () => "/project/barrits",
      directoryExists: async () => true,
      listDirectories: async () => [],
      listEntries: async (path: string) => {
        if (path === "/project/barrits") {
          return [
            { name: "index.ts", type: "file" },
            { name: "node_modules", type: "directory" },
            { name: ".git", type: "directory" },
            { name: "dist", type: "directory" },
            { name: "src", type: "directory" },
          ];
        }
        if (path === "/project/barrits/src") {
          return [
            { name: "main.ts", type: "file" },
          ];
        }
        return [];
      },
      readTextFile: async () => "",
    };
    const files = await collectFiles(adapter, "/project/barrits");
    assert.ok(files.includes("/project/barrits/index.ts"));
    assert.ok(files.includes("/project/barrits/src/main.ts"));
    assert.equal(files.filter((f) => f.includes("node_modules")).length, 0);
    assert.equal(files.filter((f) => f.includes(".git")).length, 0);
    assert.equal(files.filter((f) => f.includes("dist")).length, 0);
  });

  it("returns empty array for empty directory", async () => {
    const adapter: RuntimeFileSystemAdapter = {
      cwd: async () => "",
      directoryExists: async () => true,
      listDirectories: async () => [],
      listEntries: async () => [],
      readTextFile: async () => "",
    };
    assert.deepEqual(await collectFiles(adapter, "/project/empty"), []);
  });
});

describe("inspectFile", () => {
  it("inspects a file returning its integration metadata", async () => {
    const adapter: RuntimeFileSystemAdapter = {
      cwd: async () => "/project",
      directoryExists: async () => true,
      listDirectories: async () => [],
      listEntries: async () => [],
      readTextFile: async () => "export const hello = 42;",
    };
    const result = await inspectFile(adapter, "/project/barrits", "/project/barrits/index.ts", "barrits");
    assert.equal(result.path, "index.ts");
    assert.equal(result.kind, "root");
    assert.equal(result.isIndex, true);
    assert.equal(result.sourceLayer, "barrits");
    assert.ok(result.exports.length > 0);
  });
});

describe("buildLayer", () => {
  it("groups files into root files and domains", () => {
    const files: BarritsFileIntegration[] = [
      { path: "index.ts", isIndex: true, kind: "root", sourceLayer: "barrits", exports: [], traitDescriptors: [] },
      { path: "logic/math.ts", isIndex: false, kind: "domain", sourceLayer: "barrits", exports: [], traitDescriptors: [] },
      { path: "logic/internal.ts", isIndex: false, kind: "internal", sourceLayer: "barrits", exports: [], traitDescriptors: [] },
    ];
    const layer = buildLayer("/project/barrits", files, "barrits");
    assert.equal(layer.sourceLayer, "barrits");
    assert.equal(layer.rootFiles.length, 1);
    assert.equal(layer.rootFiles[0].path, "index.ts");
    assert.equal(layer.domains.length, 1);
    assert.equal(layer.domains[0].name, "logic");
    assert.equal(layer.domains[0].files.length, 2);
    assert.equal(layer.files.length, 3);
  });

  it("handles empty file list", () => {
    const layer = buildLayer("/project/barrits", [], "barrits");
    assert.equal(layer.domains.length, 0);
    assert.equal(layer.rootFiles.length, 0);
  });
});

describe("inspectLayer", () => {
  it("returns empty for undefined directory", async () => {
    const adapter: RuntimeFileSystemAdapter = {
      cwd: async () => "",
      directoryExists: async () => true,
      listDirectories: async () => [],
      listEntries: async () => [],
      readTextFile: async () => "",
    };
    const layer = await inspectLayer(adapter, undefined, "barrits_lib");
    assert.equal(layer.sourceLayer, "barrits_lib");
    assert.equal(layer.files.length, 0);
  });

  it("inspects a real directory with source files", async () => {
    const dir = join(tmpdir(), `barrits-layer-test-${Date.now()}`);
    try {
      await mkdir(dir, { recursive: true });
      await mkdir(join(dir, "logic"), { recursive: true });
      await writeFile(join(dir, "index.ts"), "export const root = 1;");
      await writeFile(join(dir, "logic", "math.ts"), "export const sumar = (a: number, b: number) => a + b;");

      const adapter = createRuntimeFileSystemAdapter();
      const layer = await inspectLayer(adapter, dir, "barrits_lib");
      assert.equal(layer.sourceLayer, "barrits_lib");
      assert.ok(layer.files.length > 0);
      assert.ok(layer.rootFiles.length > 0);
      assert.equal(layer.rootFiles[0].path, "index.ts");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
