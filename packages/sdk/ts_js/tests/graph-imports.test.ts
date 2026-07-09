import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  collectMergedExports,
  planImportActions,
} from "../src/barrits/sdk/graph/imports";
import type { BarritsFileIntegration, BarritsDomainIntegration, BarritsFileExport } from "../src/barrits/sdk/contracts";

const makeExport = (name: string, accessPath: string, visibility: "public" | "internal" = "public"): BarritsFileExport => ({
  name, accessPath, accessStrategy: "file-system", kind: "const", visibility,
});

const makeFile = (path: string, kind: string = "domain", ...exports: BarritsFileExport[]): BarritsFileIntegration => ({
  path, isIndex: path === "index.ts" || path.endsWith("/index.ts"), kind: kind as any,
  sourceLayer: "barrits", exports, traitDescriptors: [],
});

const makeDomain = (name: string, ...files: BarritsFileIntegration[]): BarritsDomainIntegration => ({
  name, path: `/project/${name}`, files,
});

describe("collectMergedExports", () => {
  const fileA = makeFile("a.ts", "domain", makeExport("hello", "hello"));
  const fileB = makeFile("b.ts", "domain", makeExport("hello", "hello"));
  const fileC = makeFile("c.ts", "domain", makeExport("world", "world", "internal"));

  it("collects unique public exports matching matcher", () => {
    const exports = collectMergedExports([fileA, fileB, fileC], () => true);
    assert.equal(exports.length, 1);
    assert.equal(exports[0].name, "hello");
  });

  it("respects matcher filter", () => {
    const exports = collectMergedExports([fileA, fileB, fileC], (f) => f.path === "a.ts");
    assert.equal(exports.length, 1);
  });

  it("returns empty for no matches", () => {
    const exports = collectMergedExports([fileA, fileB], () => false);
    assert.equal(exports.length, 0);
  });
});

describe("planImportActions", () => {
  it("plans named imports from root index.ts", () => {
    const actions = planImportActions(
      [makeFile("index.ts", "root", makeExport("hello", "hello"))],
      [],
    );
    assert.ok(actions.some((a) => a.exportName === "hello" && a.kind === "named-import"));
  });

  it("plans named imports from api/flat.ts", () => {
    const actions = planImportActions(
      [],
      [makeDomain("api", makeFile("api/flat.ts", "domain", makeExport("apiFunc", "apiFunc")))],
    );
    assert.ok(actions.some((a) => a.exportName === "apiFunc" && a.kind === "named-import"));
  });

  it("plans named imports for unique non-root domain exports", () => {
    const actions = planImportActions(
      [],
      [makeDomain("logic", makeFile("logic/math.ts", "domain", makeExport("sumar", "sumar")))],
    );
    assert.ok(actions.some((a) => a.exportName === "sumar" && a.kind === "named-import"));
  });

  it("skips named imports for exports also in root", () => {
    const actions = planImportActions(
      [makeFile("index.ts", "root", makeExport("shared", "shared"))],
      [makeDomain("logic", makeFile("logic/math.ts", "domain", makeExport("shared", "shared")))],
    );
    const namedActions = actions.filter((a) => a.kind === "named-import" && a.exportName === "shared");
    assert.equal(namedActions.length, 1);
  });

  it("skips named imports for duplicate domain export names", () => {
    const actions = planImportActions(
      [],
      [makeDomain("logic", makeFile("logic/a.ts", "domain", makeExport("dupName", "dupName")),
        makeFile("logic/b.ts", "domain", makeExport("dupName", "dupName")))],
    );
    const namedActions = actions.filter((a) => a.kind === "named-import" && a.exportName === "dupName");
    assert.equal(namedActions.length, 0);
  });

  it("skips named imports for internal files", () => {
    const actions = planImportActions(
      [],
      [makeDomain("logic", makeFile("logic/internal.ts", "internal", makeExport("helper", "helper")))],
    );
    const namedActions = actions.filter((a) => a.kind === "named-import" && a.exportName === "helper");
    assert.equal(namedActions.length, 0);
  });

  it("plans namespace access for domain exports", () => {
    const actions = planImportActions(
      [],
      [makeDomain("logic", makeFile("logic/math.ts", "domain", makeExport("sumar", "math.sumar")))],
    );
    const nsActions = actions.filter((a) => a.kind === "namespace-access");
    assert.ok(nsActions.some((a) => a.exportName === "math.sumar" && a.statement.includes("barrits.logic.math.sumar")));
  });

  it("plans alias namespace access", () => {
    const actions = planImportActions(
      [],
      [makeDomain("logic", makeFile("logic/math.ts", "domain", makeExport("sumar", "math.sumar")))],
    );
    const aliasActions = actions.filter((a) => a.kind === "alias-namespace-access");
    assert.ok(aliasActions.some((a) => a.statement.includes("brt.logic.math.sumar")));
  });

  it("skips namespace access when accessPath equals domain name", () => {
    const actions = planImportActions(
      [],
      [makeDomain("logic", makeFile("logic/index.ts", "barrel", makeExport("logic", "logic")))],
    );
    const nsActions = actions.filter((a) => a.kind === "namespace-access");
    assert.equal(nsActions.length, 0);
  });

  it("skips namespace access for api domain", () => {
    const actions = planImportActions(
      [],
      [makeDomain("api", makeFile("api/flat.ts", "domain", makeExport("hello", "hello")))],
    );
    const nsActions = actions.filter((a) => a.kind === "namespace-access");
    assert.equal(nsActions.length, 0);
  });

  it("handles file without exports", () => {
    const actions = planImportActions(
      [makeFile("empty.ts", "domain")],
      [],
    );
    assert.equal(actions.length, 0);
  });

  it("returns empty for no root files or domains", () => {
    const actions = planImportActions([], []);
    assert.equal(actions.length, 0);
  });

  it("sorts actions by exportName then kind", () => {
    const actions = planImportActions(
      [makeFile("index.ts", "root", makeExport("alpha", "alpha"), makeExport("beta", "beta"))],
      [],
    );
    assert.ok(actions[0].exportName <= actions[actions.length - 1].exportName);
  });
});
