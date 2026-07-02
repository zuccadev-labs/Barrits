import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { RuntimeFileSystemAdapter } from "../src/barrits/sdk/contracts";
import { findBarritsDirectory } from "../src/barrits/sdk/discovery";

const createMockAdapter = (dirs: string[]): RuntimeFileSystemAdapter => {
  const directorySet = new Set(dirs.map((d) => d.replace(/\\/g, "/").replace(/\/$/, "")));

  const listDirectories = async (path: string): Promise<string[]> => {
    const normalized = path.replace(/\\/g, "/").replace(/\/$/, "");
    const parentPrefix = normalized === "/" ? "/" : `${normalized}/`;
    const result: string[] = [];

    for (const dir of directorySet) {
      if (dir.startsWith(parentPrefix) && dir !== normalized) {
        const remainder = dir.slice(parentPrefix.length);
        const childName = remainder.split("/")[0];
        if (childName && !result.includes(childName)) {
          result.push(childName);
        }
      }
    }

    return result.sort();
  };

  return {
    cwd: async () => "/home/project",
    directoryExists: async (path: string) => {
      const normalized = path.replace(/\\/g, "/").replace(/\/$/, "");
      return normalized === "/" || directorySet.has(normalized) || normalized === "/home" || normalized === "/home/project";
    },
    listDirectories,
    listEntries: async () => [],
    readTextFile: async () => "",
  };
};

describe("findBarritsDirectory", () => {
  it("returns current-directory strategy when cwd basename matches target", async () => {
    const adapter = createMockAdapter(["/home/barrits"]);
    const result = await findBarritsDirectory(adapter, { startDirectory: "/home/barrits" });
    assert.ok(result);
    assert.equal(result.strategy, "current-directory");
    assert.equal(result.barritsDirectory, "/home/barrits");
    assert.equal(result.projectRoot, "/home");
  });

  it("returns direct-child strategy when barrits dir is a direct child", async () => {
    const adapter = createMockAdapter(["/home/project/barrits"]);
    const result = await findBarritsDirectory(adapter, { startDirectory: "/home/project" });
    assert.ok(result);
    assert.equal(result.strategy, "direct-child");
    assert.equal(result.barritsDirectory, "/home/project/barrits");
    assert.equal(result.projectRoot, "/home/project");
  });

  it("returns ancestor-child strategy when barrits dir is an ancestor", async () => {
    const adapter = createMockAdapter(["/home/barrits"]);
    const result = await findBarritsDirectory(adapter, { startDirectory: "/home/project" });
    assert.ok(result);
    assert.equal(result.strategy, "ancestor-child");
    assert.equal(result.barritsDirectory, "/home/barrits");
    assert.equal(result.projectRoot, "/home");
  });

  it("returns recursive-child strategy via BFS", async () => {
    const adapter = createMockAdapter([
      "/home/project/src/barrits",
    ]);
    const result = await findBarritsDirectory(adapter, { startDirectory: "/home/project" });
    assert.ok(result);
    assert.equal(result.strategy, "recursive-child");
    assert.equal(result.barritsDirectory, "/home/project/src/barrits");
  });

  it("returns recursive-child strategy with depth-limited BFS", async () => {
    const adapter = createMockAdapter([
      "/home/project/a/b/c/barrits",
    ]);
    const result = await findBarritsDirectory(adapter, { startDirectory: "/home/project" });
    assert.ok(result);
    assert.equal(result.strategy, "recursive-child");
  });

  it("returns null when no barrits directory exists", async () => {
    const adapter = createMockAdapter(["/home/project/src"]);
    const result = await findBarritsDirectory(adapter, { startDirectory: "/home/project" });
    assert.equal(result, null);
  });

  it("ignores node_modules during recursive search", async () => {
    const adapter = createMockAdapter([
      "/home/project/node_modules/barrits",
      "/home/project/src/barrits",
    ]);
    const result = await findBarritsDirectory(adapter, { startDirectory: "/home/project" });
    assert.ok(result);
    assert.equal(result.barritsDirectory, "/home/project/src/barrits");
  });

  it("ignores .git during recursive search", async () => {
    const adapter = createMockAdapter([
      "/home/project/.git/barrits",
      "/home/project/lib/barrits",
    ]);
    const result = await findBarritsDirectory(adapter, { startDirectory: "/home/project" });
    assert.ok(result);
    assert.equal(result.barritsDirectory, "/home/project/lib/barrits");
  });

  it("uses custom targetName when provided", async () => {
    const adapter = createMockAdapter(["/home/project/custom-dir"]);
    const result = await findBarritsDirectory(adapter, {
      startDirectory: "/home/project",
      targetName: "custom-dir",
    });
    assert.ok(result);
    assert.equal(result.strategy, "direct-child");
    assert.equal(result.barritsDirectory, "/home/project/custom-dir");
  });

  it("uses custom maxDepth to limit search", async () => {
    const adapter = createMockAdapter([
      "/home/project/a/b/c/barrits",
    ]);
    const result = await findBarritsDirectory(adapter, {
      startDirectory: "/home/project",
      maxDepth: 2,
    });
    assert.equal(result, null);
  });

  it("returns direct-child over recursive when both exist", async () => {
    const adapter = createMockAdapter([
      "/home/project/barrits",
      "/home/project/deep/barrits",
    ]);
    const result = await findBarritsDirectory(adapter, { startDirectory: "/home/project" });
    assert.ok(result);
    assert.equal(result.strategy, "direct-child");
    assert.equal(result.barritsDirectory, "/home/project/barrits");
  });

  it("direct-child takes priority over ancestor-child", async () => {
    const adapter = createMockAdapter([
      "/home/barrits",
      "/home/project/barrits",
    ]);
    const result = await findBarritsDirectory(adapter, { startDirectory: "/home/project" });
    assert.ok(result);
    assert.equal(result.strategy, "direct-child");
    assert.equal(result.barritsDirectory, "/home/project/barrits");
  });

  it("ignores dist and build directories", async () => {
    const adapter = createMockAdapter([
      "/home/project/dist/barrits",
      "/home/project/build/barrits",
      "/home/project/src/barrits",
    ]);
    const result = await findBarritsDirectory(adapter, { startDirectory: "/home/project" });
    assert.ok(result);
    assert.equal(result.barritsDirectory, "/home/project/src/barrits");
  });
});
