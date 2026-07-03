import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  isAggregatorFile,
  collectPublicNamespaceEntries,
  collectCollisions,
} from "../src/barrits/sdk/graph/collisions";
import type { BarritsFileIntegration, BarritsDomainIntegration, BarritsFileExport } from "../src/barrits/sdk/contracts";

const makeExport = (name: string, accessPath: string, visibility: "public" | "internal" = "public"): BarritsFileExport => ({
  name, accessPath, accessStrategy: "file-system", kind: "const", visibility,
});

const makeFile = (path: string, ...exports: BarritsFileExport[]): BarritsFileIntegration => ({
  path, isIndex: path === "index.ts" || path.endsWith("/index.ts"), kind: "domain",
  sourceLayer: "barrits", exports, traitDescriptors: [],
});

const makeDomain = (name: string, ...files: BarritsFileIntegration[]): BarritsDomainIntegration => ({
  name, path: `/project/${name}`, files,
});

describe("isAggregatorFile", () => {
  it("returns true for index.ts", () => {
    assert.ok(isAggregatorFile("index.ts"));
  });

  it("returns true for */index.ts", () => {
    assert.ok(isAggregatorFile("logic/index.ts"));
  });

  it("returns true for api/flat.ts", () => {
    assert.ok(isAggregatorFile("api/flat.ts"));
  });

  it("returns false for other files", () => {
    assert.equal(isAggregatorFile("logic/math.ts"), false);
    assert.equal(isAggregatorFile("traits/myTrait.ts"), false);
  });
});

describe("collectPublicNamespaceEntries", () => {
  it("collects entries from root index", () => {
    const entries = collectPublicNamespaceEntries(
      [makeFile("index.ts", makeExport("sumar", "sumar"))],
      [],
    );
    assert.equal(entries.length, 1);
    assert.equal(entries[0].namespace, "root");
    assert.equal(entries[0].exportName, "sumar");
  });

  it("collects entries from domain files", () => {
    const entries = collectPublicNamespaceEntries(
      [],
      [makeDomain("logic", makeFile("logic/math.ts", makeExport("sumar", "math.sumar")))],
    );
    assert.equal(entries.length, 1);
    assert.equal(entries[0].namespace, "logic");
    assert.equal(entries[0].exportName, "math.sumar");
  });

  it("filters only api/flat.ts from api domain", () => {
    const entries = collectPublicNamespaceEntries(
      [],
      [makeDomain("api",
        makeFile("api/flat.ts", makeExport("hello", "hello")),
        makeFile("api/internal.ts", makeExport("secret", "secret")),
      )],
    );
    assert.equal(entries.length, 1);
    assert.equal(entries[0].sourceFile, "api/flat.ts");
  });

  it("uses exportName for api domain entries", () => {
    const entries = collectPublicNamespaceEntries(
      [],
      [makeDomain("api", makeFile("api/flat.ts", makeExport("hello", "api.hello")))],
    );
    assert.equal(entries[0].exportName, "hello");
  });

  it("filters non-public exports", () => {
    const entries = collectPublicNamespaceEntries(
      [makeFile("index.ts", makeExport("hidden", "hidden", "internal"))],
      [],
    );
    assert.equal(entries.length, 0);
  });

  it("sorts entries by namespace, exportName, then sourceFile", () => {
    const entries = collectPublicNamespaceEntries(
      [makeFile("index.ts", makeExport("beta", "beta"), makeExport("alpha", "alpha"))],
      [makeDomain("logic", makeFile("logic/math.ts", makeExport("sumar", "math.sumar")))],
    );
    assert.equal(entries[0].namespace, "logic");
    assert.equal(entries[1].namespace, "root");
  });
});

describe("collectCollisions", () => {
  it("detects project-project collisions", () => {
    const collisions = collectCollisions(
      [makeFile("index.ts", makeExport("shared", "domain.shared"))],
      [makeDomain("domain", makeFile("domain/a.ts", makeExport("shared", "domain.shared")),
        makeFile("domain/b.ts", makeExport("shared", "domain.shared")))],
      [],
      [],
    );
    assert.ok(collisions.some((c) => c.type === "project-project"));
  });

  it("detects project-library collisions", () => {
    const collisions = collectCollisions(
      [makeFile("index.ts", makeExport("shared", "shared"))],
      [],
      [makeFile("index.ts", makeExport("shared", "shared"))],
      [],
    );
    assert.ok(collisions.some((c) => c.type === "project-library"));
  });

  it("returns empty for non-overlapping namespaces", () => {
    const collisions = collectCollisions(
      [makeFile("index.ts", makeExport("onlyProject", "onlyProject"))],
      [],
      [makeFile("index.ts", makeExport("onlyLibrary", "onlyLibrary"))],
      [],
    );
    assert.equal(collisions.length, 0);
  });

  it("returns empty for no root files or domains", () => {
    const collisions = collectCollisions([], [], [], []);
    assert.equal(collisions.length, 0);
  });

  it("prefers non-aggregator files in project-project collisions", () => {
    const collisions = collectCollisions(
      [makeFile("index.ts", makeExport("shared", "shared"))],
      [makeDomain("logic", makeFile("logic/detail.ts", makeExport("shared", "shared")))],
      [],
      [],
    );
    const projectProject = collisions.filter((c) => c.type === "project-project");
    assert.equal(projectProject.length, 0);
  });
});
