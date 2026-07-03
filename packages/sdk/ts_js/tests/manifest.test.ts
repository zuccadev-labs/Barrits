import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  createProjectedGraph,
  createBuildManifest,
  stringifyBuildManifest,
  createWatchSnapshot,
  stringifyWatchSnapshot,
} from "../src/barrits/sdk/manifest";
import type { BarritsIntegrationGraph } from "../src/barrits/sdk/contracts";

const makeGraph = (overrides: Partial<BarritsIntegrationGraph> = {}): BarritsIntegrationGraph => ({
  projectRoot: "/project",
  barritsDirectory: "/project/barrits",
  strategy: "current-directory",
  discoveryRoots: ["/project/barrits"],
  filesCount: 0,
  exportsCount: 0,
  rootFiles: [],
  domains: [],
  libraryRootFiles: [],
  libraryDomains: [],
  publicExportsCount: 0,
  internalExportsCount: 0,
  barrelsCount: 0,
  traitDescriptors: [],
  traitDiagnostics: [],
  importActions: [],
  collisions: [],
  ...overrides,
});

describe("createProjectedGraph", () => {
  it("returns the graph unchanged without filters", () => {
    const graph = makeGraph();
    const result = createProjectedGraph(graph);
    assert.equal(result.projectRoot, graph.projectRoot);
  });

  it("filters by domains", () => {
    const graph = makeGraph();
    const result = createProjectedGraph(graph, { domains: ["logic"] });
    assert.ok(result);
  });

  it("filters by exports", () => {
    const graph = makeGraph();
    const result = createProjectedGraph(graph, { exports: ["hello"] });
    assert.ok(result);
  });

  it("filters by visibilities", () => {
    const graph = makeGraph();
    const result = createProjectedGraph(graph, { visibilities: ["public"] });
    assert.ok(result);
  });

  it("filters by fileKinds", () => {
    const graph = makeGraph();
    const result = createProjectedGraph(graph, { fileKinds: ["domain"] });
    assert.ok(result);
  });
});

describe("createBuildManifest", () => {
  it("creates manifest with checksum", async () => {
    const manifest = await createBuildManifest(makeGraph());
    assert.ok(manifest.generatedAt);
    assert.ok(manifest.checksum.startsWith("sha256-barrits-"));
    assert.equal(manifest.projectRoot, "/project");
  });

  it("includes filters when provided", async () => {
    const manifest = await createBuildManifest(makeGraph(), { domains: ["logic"] });
    assert.ok(manifest.filters);
    assert.deepEqual((manifest.filters as any).domains, ["logic"]);
  });

  it("excludes filters when not provided", async () => {
    const manifest = await createBuildManifest(makeGraph());
    assert.equal(manifest.filters, undefined);
  });

  it("sorts trait descriptors and import actions", async () => {
    const graph = makeGraph({
      traitDescriptors: [
        { name: "zTrait", sourceFile: "z.ts", bindingName: "z", bindingKind: "const", requires: [], conflicts: [], state: [], consumes: [], provides: [], tags: [], runtimes: [] },
        { name: "aTrait", sourceFile: "a.ts", bindingName: "a", bindingKind: "const", requires: [], conflicts: [], state: [], consumes: [], provides: [], tags: [], runtimes: [] },
      ],
      importActions: [
        { exportName: "zExport", domain: "logic", sourceFile: "z.ts", kind: "named-import", statement: "import { zExport } from 'x';" },
        { exportName: "aExport", domain: "logic", sourceFile: "a.ts", kind: "named-import", statement: "import { aExport } from 'x';" },
      ],
    });
    const manifest = await createBuildManifest(graph);
    assert.equal(manifest.traitDescriptors[0].name, "aTrait");
    assert.equal(manifest.importActions[0].exportName, "aExport");
  });

  it("includes domain names from graph", async () => {
    const graph = makeGraph({
      domains: [{ name: "logic", path: "/project/logic", files: [] }],
    });
    const manifest = await createBuildManifest(graph);
    assert.deepEqual(manifest.domains, ["logic"]);
  });
});

describe("stringifyBuildManifest", () => {
  it("produces valid JSON with top-level keys", async () => {
    const json = await stringifyBuildManifest(makeGraph());
    const parsed = JSON.parse(json);
    assert.ok(parsed.checksum);
    assert.ok(parsed.generatedAt);
    assert.ok(parsed.projectRoot);
    assert.ok(Array.isArray(parsed.domains));
    assert.ok(Array.isArray(parsed.traitDescriptors));
    assert.ok(Array.isArray(parsed.importActions));
    assert.ok(Array.isArray(parsed.collisions));
  });

  it("pretty-prints with 2-space indent", async () => {
    const json = await stringifyBuildManifest(makeGraph());
    const lines = json.split("\n");
    assert.ok(lines.some((l) => l.startsWith("  ")));
  });

  it("includes filters in JSON when provided", async () => {
    const json = await stringifyBuildManifest(makeGraph(), { exports: ["hello"] });
    const parsed = JSON.parse(json);
    assert.ok(parsed.filters);
    assert.deepEqual(parsed.filters.exports, ["hello"]);
  });
});

describe("createWatchSnapshot", () => {
  it("creates snapshot with mode", () => {
    const snapshot = createWatchSnapshot(makeGraph(), "watch");
    assert.equal(snapshot.mode, "watch");
    assert.equal(snapshot.graph.projectRoot, "/project");
  });

  it("includes filters when provided", () => {
    const snapshot = createWatchSnapshot(makeGraph(), "dev", { exports: ["hello"] });
    assert.ok(snapshot.filters);
  });
});

describe("stringifyWatchSnapshot", () => {
  it("produces valid JSON", () => {
    const json = stringifyWatchSnapshot(makeGraph(), "watch");
    const parsed = JSON.parse(json);
    assert.equal(parsed.mode, "watch");
  });
});
