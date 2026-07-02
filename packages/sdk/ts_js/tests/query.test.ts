import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { filterIntegrationGraph, resolveProjectFilePath } from "../src/barrits/sdk/query";
import type { BarritsIntegrationGraph, BarritsFileIntegration, BarritsDomainIntegration, BarritsFileExport } from "../src/barrits/sdk/contracts";

const makeExport = (name: string, visibility: "public" | "internal" = "public"): BarritsFileExport => ({
  name, accessPath: name, accessStrategy: "file-system" as const, kind: "const" as const, visibility,
});

const makeFile = (path: string, kind: string = "domain", ...exports: BarritsFileExport[]): BarritsFileIntegration => ({
  path, isIndex: path === "index.ts" || path.endsWith("/index.ts"), kind: kind as any,
  sourceLayer: "barrits", exports, traitDescriptors: [],
});

const makeDomain = (name: string, ...files: BarritsFileIntegration[]): BarritsDomainIntegration => ({
  name, path: `/project/${name}`, files,
});

const makeGraph = (overrides: Partial<BarritsIntegrationGraph> = {}): BarritsIntegrationGraph => ({
  projectRoot: "/project",
  barritsDirectory: "/project/barrits",
  strategy: "current-directory",
  discoveryRoots: ["/project/barrits"],
  filesCount: 0,
  exportsCount: 0,
  publicExportsCount: 0,
  internalExportsCount: 0,
  barrelsCount: 0,
  rootFiles: [],
  domains: [],
  libraryRootFiles: [],
  libraryDomains: [],
  traitDescriptors: [],
  traitDiagnostics: [],
  importActions: [],
  collisions: [],
  ...overrides,
});

describe("filterIntegrationGraph", () => {
  it("returns graph unchanged with no filters", () => {
    const graph = makeGraph();
    const result = filterIntegrationGraph(graph);
    assert.equal(result.projectRoot, "/project");
  });

  it("filters root files when root is not in domains filter", () => {
    const graph = makeGraph({
      rootFiles: [makeFile("index.ts", "root", makeExport("hello", "public"))],
    });
    const result = filterIntegrationGraph(graph, { domains: ["logic"] });
    assert.equal(result.rootFiles.length, 0);
  });

  it("keeps root files when root is in domains filter", () => {
    const graph = makeGraph({
      rootFiles: [makeFile("index.ts", "root", makeExport("hello", "public"))],
    });
    const result = filterIntegrationGraph(graph, { domains: ["root"] });
    assert.equal(result.rootFiles.length, 1);
  });

  it("filters domains by name", () => {
    const graph = makeGraph({
      domains: [
        makeDomain("logic", makeFile("logic/math.ts")),
        makeDomain("api", makeFile("api/flat.ts")),
      ],
    });
    const result = filterIntegrationGraph(graph, { domains: ["logic"] });
    assert.equal(result.domains.length, 1);
    assert.equal(result.domains[0].name, "logic");
  });

  it("filters exports by name", () => {
    const graph = makeGraph({
      rootFiles: [makeFile("index.ts", "root", makeExport("keep", "public"), makeExport("omit", "public"))],
    });
    const result = filterIntegrationGraph(graph, { exports: ["keep"] });
    assert.equal(result.rootFiles[0].exports.length, 1);
    assert.equal(result.rootFiles[0].exports[0].name, "keep");
  });

  it("filters by fileKinds", () => {
    const graph = makeGraph({
      rootFiles: [makeFile("index.ts", "root"), makeFile("extra.ts", "domain")],
    });
    const result = filterIntegrationGraph(graph, { fileKinds: ["root"] });
    assert.equal(result.rootFiles.length, 1);
    assert.equal(result.rootFiles[0].kind, "root");
  });

  it("filters by visibility", () => {
    const graph = makeGraph({
      rootFiles: [makeFile("index.ts", "root", makeExport("pub", "public"), makeExport("priv", "internal"))],
    });
    const result = filterIntegrationGraph(graph, { visibilities: ["public"] });
    assert.equal(result.rootFiles[0].exports.length, 1);
    assert.equal(result.rootFiles[0].exports[0].name, "pub");
  });

  it("removes domains when all files are filtered out", () => {
    const graph = makeGraph({
      domains: [
        makeDomain("logic", makeFile("logic/math.ts", "domain", makeExport("helper", "internal"))),
      ],
    });
    const result = filterIntegrationGraph(graph, { visibilities: ["public"] });
    assert.equal(result.domains.length, 0);
  });

  it("keeps domains when some files survive filtering", () => {
    const graph = makeGraph({
      domains: [
        makeDomain("logic",
          makeFile("logic/math.ts", "domain", makeExport("pub", "public")),
          makeFile("logic/helper.ts", "domain", makeExport("priv", "internal")),
        ),
      ],
    });
    const result = filterIntegrationGraph(graph, { visibilities: ["public"] });
    assert.equal(result.domains.length, 1);
    assert.equal(result.domains[0].files.length, 1);
  });

  it("computes metrics after filtering", () => {
    const graph = makeGraph({
      rootFiles: [makeFile("index.ts", "root", makeExport("hello", "public"), makeExport("hidden", "internal"))],
    });
    const result = filterIntegrationGraph(graph);
    assert.equal(result.filesCount, 1);
    assert.equal(result.exportsCount, 2);
    assert.equal(result.publicExportsCount, 1);
    assert.equal(result.internalExportsCount, 1);
    assert.equal(result.barrelsCount, 1);
  });

  it("filters library domains", () => {
    const graph = makeGraph({
      libraryDomains: [
        makeDomain("lib", makeFile("lib/utils.ts")),
      ],
    });
    const result = filterIntegrationGraph(graph, { domains: ["lib"] });
    assert.equal(result.libraryDomains.length, 1);
  });
});

describe("resolveProjectFilePath", () => {
  it("returns absolute path unchanged", () => {
    assert.equal(resolveProjectFilePath("/project", "/absolute/path.ts"), "/absolute/path.ts");
  });

  it("joins relative path with projectRoot", () => {
    assert.equal(resolveProjectFilePath("/project", "relative/path.ts"), "/project/relative/path.ts");
  });

  it("returns undefined for undefined filePath", () => {
    assert.equal(resolveProjectFilePath("/project", undefined), undefined);
  });

  it("returns undefined for empty string", () => {
    assert.equal(resolveProjectFilePath("/project", ""), undefined);
  });

  it("handles Windows drive letter in absolute path", () => {
    assert.equal(resolveProjectFilePath("/project", "C:/absolute/path.ts"), "C:/absolute/path.ts");
  });
});
