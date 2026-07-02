import test from "node:test";
import assert from "node:assert/strict";
import {
  parseArguments,
  toSelectionFilters,
  hasCollisions,
  failOnCollisions,
  toGraphFingerprint,
  printCollisions,
  printInfoSummary,
  printGraph,
  printImportActions,
  BUILD_MANIFEST_BASENAME,
  IMPORTS_MANIFEST_BASENAME,
  IMPORTS_MODULE_BASENAME,
  WATCH_SNAPSHOT_BASENAME,
} from "../src/barrits/sdk/cli-parser";

test("parseArguments returns defaults for empty arguments list", () => {
  const options = parseArguments([]);

  assert.equal(options.command, "detect");
  assert.equal(options.json, false);
  assert.equal(options.write, false);
  assert.equal(options.writeSnapshot, false);
  assert.equal(options.mode, "named-import");
  assert.deepEqual(options.domains, []);
  assert.deepEqual(options.exports, []);
  assert.deepEqual(options.kinds, []);
  assert.deepEqual(options.fileKinds, []);
  assert.deepEqual(options.visibilities, []);
  assert.deepEqual(options.childArgs, []);
  assert.equal(options.startDirectory, undefined);
  assert.equal(options.targetFile, undefined);
  assert.equal(options.snapshotFile, undefined);
});

test("parseArguments detects command from first argument", () => {
  assert.equal(parseArguments(["info"]).command, "info");
  assert.equal(parseArguments(["watch"]).command, "watch");
  assert.equal(parseArguments(["dev"]).command, "dev");
  assert.equal(parseArguments(["build"]).command, "build");
  assert.equal(parseArguments(["imports"]).command, "imports");
  assert.equal(parseArguments(["detect"]).command, "detect");
  assert.equal(parseArguments(["help"]).command, "help");
  assert.equal(parseArguments(["--help"]).command, "help");
  assert.equal(parseArguments(["-h"]).command, "help");
});

test("parseArguments handles boolean flags", () => {
  assert.equal(parseArguments(["--json"]).json, true);
  assert.equal(parseArguments(["--write"]).write, true);
  assert.equal(parseArguments(["--write-snapshot"]).writeSnapshot, true);
});

test("parseArguments handles --target flag", () => {
  const options = parseArguments(["--target", "src/main.ts"]);
  assert.equal(options.targetFile, "src/main.ts");
});

test("parseArguments rejects --target with directory traversal", () => {
  const options = parseArguments(["--target", "../../evil.ts"]);
  assert.equal(options.targetFile, undefined);
});

test("parseArguments handles --snapshot flag", () => {
  const options = parseArguments(["--snapshot", "custom-snapshot.json"]);
  assert.equal(options.snapshotFile, "custom-snapshot.json");
});

test("parseArguments rejects --snapshot with directory traversal", () => {
  const options = parseArguments(["--snapshot", "../outside.json"]);
  assert.equal(options.snapshotFile, undefined);
});

test("parseArguments handles --domain flag", () => {
  const options = parseArguments(["--domain", "api", "--domain", "core"]);
  assert.deepEqual(options.domains, ["api", "core"]);
});

test("parseArguments rejects invalid --domain names", () => {
  const options = parseArguments(["--domain", "../../etc"]);
  assert.deepEqual(options.domains, []);
});

test("parseArguments handles --export flag", () => {
  const options = parseArguments(["--export", "fooBar", "--export", "_baz"]);
  assert.deepEqual(options.exports, ["fooBar", "_baz"]);
});

test("parseArguments rejects invalid --export names", () => {
  const options = parseArguments(["--export", "123invalid"]);
  assert.deepEqual(options.exports, []);
});

test("parseArguments handles --kind flag", () => {
  const options = parseArguments(["--kind", "named-import", "--kind", "namespace-access"]);
  assert.deepEqual(options.kinds, ["named-import", "namespace-access"]);
});

test("parseArguments rejects invalid --kind values", () => {
  const options = parseArguments(["--kind", "invalid-kind"]);
  assert.deepEqual(options.kinds, []);
});

test("parseArguments handles --file-kind flag", () => {
  const options = parseArguments(["--file-kind", "trait", "--file-kind", "domain"]);
  assert.deepEqual(options.fileKinds, ["trait", "domain"]);
});

test("parseArguments handles --visibility flag", () => {
  const options = parseArguments(["--visibility", "public", "--visibility", "internal"]);
  assert.deepEqual(options.visibilities, ["public", "internal"]);
});

test("parseArguments handles --mode flag", () => {
  const options = parseArguments(["--mode", "namespace-access"]);
  assert.equal(options.mode, "namespace-access");
});

test("parseArguments rejects invalid --mode values", () => {
  const options = parseArguments(["--mode", "invalid"]);
  assert.equal(options.mode, "named-import");
});

test("parseArguments captures startDirectory as first non-flag argument", () => {
  const options = parseArguments(["/custom/path", "info", "--json"]);
  assert.equal(options.startDirectory, "/custom/path");
});

test("parseArguments separates child args after -- separator", () => {
  const options = parseArguments(["dev", "--", "node", "server.js"]);
  assert.equal(options.command, "dev");
  assert.deepEqual(options.childArgs, ["node", "server.js"]);
});

test("parseArguments handles combined flags with startDirectory", () => {
  const options = parseArguments(["./src", "info", "--json", "--domain", "api", "--", "echo", "done"]);
  assert.equal(options.startDirectory, "./src");
  assert.equal(options.command, "info");
  assert.equal(options.json, true);
  assert.deepEqual(options.domains, ["api"]);
  assert.deepEqual(options.childArgs, ["echo", "done"]);
});

test("toSelectionFilters returns all keys with undefined for empty filters", () => {
  const filter = toSelectionFilters(parseArguments(["--domain", "api"]));
  assert.deepEqual(filter.domains, ["api"]);
  assert.equal(filter.exports, undefined);
  assert.equal(filter.kinds, undefined);
  assert.equal(filter.fileKinds, undefined);
  assert.equal(filter.visibilities, undefined);
});

test("toSelectionFilters populates export filters", () => {
  const filter = toSelectionFilters(parseArguments(["--export", "foo", "--export", "bar"]));
  assert.deepEqual(filter.exports, ["foo", "bar"]);
});

test("toSelectionFilters returns all undefined for empty arguments", () => {
  const filter = toSelectionFilters(parseArguments([]));
  assert.equal(filter.domains, undefined);
  assert.equal(filter.exports, undefined);
});

test("hasCollisions returns true when graph has collisions", () => {
  assert.equal(hasCollisions({ collisions: [{ message: "err" }] } as any), true);
  assert.equal(hasCollisions({ collisions: [] } as any), false);
});

const suppressConsoleError = <TResult>(fn: () => TResult): TResult => {
  const original = console.error;
  console.error = () => {};
  try { return fn(); } finally { console.error = original; }
};

test("failOnCollisions returns 0 when no collisions", () => {
  assert.equal(suppressConsoleError(() => failOnCollisions({ collisions: [] } as any, false)), 0);
});

test("failOnCollisions returns 1 when collisions exist", () => {
  assert.equal(suppressConsoleError(() => failOnCollisions({ collisions: [{ message: "collision detected" }] } as any, false)), 1);
});

test("failOnCollisions prints JSON when json flag is true", () => {
  const calls: unknown[][] = [];
  const original = console.error;
  console.error = (...args: unknown[]) => { calls.push(args); };
  try {
    const result = failOnCollisions({ collisions: [{ message: "test collision" }] } as any, true);
    assert.equal(result, 1);
    assert.equal(calls.length, 1);
    assert.ok(typeof calls[0][0] === "string");
    assert.ok((calls[0][0] as string).includes("test collision"));
  } finally {
    console.error = original;
  }
});

test("toGraphFingerprint produces deterministic JSON output", () => {
  const graph = { barritsDirectory: "/test", collisions: [], filesCount: 0 } as any;
  const fingerprint = toGraphFingerprint(graph);

  assert.equal(typeof fingerprint, "string");
  assert.ok(fingerprint.includes("/test"));
});

test("BUILD_MANIFEST_BASENAME has expected value", () => {
  assert.equal(BUILD_MANIFEST_BASENAME, "build-manifest.json");
});

test("IMPORTS_MANIFEST_BASENAME has expected value", () => {
  assert.equal(IMPORTS_MANIFEST_BASENAME, "import-actions.json");
});

test("IMPORTS_MODULE_BASENAME has expected value", () => {
  assert.equal(IMPORTS_MODULE_BASENAME, "import-actions.generated.ts");
});

test("WATCH_SNAPSHOT_BASENAME has expected value", () => {
  assert.equal(WATCH_SNAPSHOT_BASENAME, "watch-snapshot.json");
});

// ── mutation-targeted edge cases ─────────────────────────────────────────

test("MR: parseArguments handles completion with shell argument", () => {
  const opts = parseArguments(["completion", "zsh"]);
  assert.equal(opts.command, "completion");
  assert.equal(opts.shellType, "zsh");
});

test("MR: parseArguments completion defaults to bash", () => {
  const opts = parseArguments(["completion"]);
  assert.equal(opts.command, "completion");
  assert.equal(opts.shellType, "bash");
});

test("MR: parseArguments completion skips flag-like arg", () => {
  const opts = parseArguments(["completion", "--json"]);
  assert.equal(opts.command, "completion");
  assert.equal(opts.shellType, "bash");
});

test("MR: parseArguments handles empty child args without separator", () => {
  const opts = parseArguments([]);
  assert.deepEqual(opts.childArgs, []);
});

test("MR: parseArguments handles only separator", () => {
  const opts = parseArguments(["--"]);
  assert.equal(opts.command, "detect");
  assert.deepEqual(opts.childArgs, []);
});

test("MR: parseArguments rejects --target with undefined value", () => {
  const opts = parseArguments(["--target"]);
  assert.equal(opts.targetFile, undefined);
});

test("MR: parseArguments rejects --snapshot with undefined value", () => {
  const opts = parseArguments(["--snapshot"]);
  assert.equal(opts.snapshotFile, undefined);
});

test("MR: parseArguments rejects --domain with invalid name", () => {
  const opts = parseArguments(["--domain", "-invalid"]);
  assert.deepEqual(opts.domains, []);
});

test("MR: parseArguments rejects --export with invalid name", () => {
  const opts = parseArguments(["--export", "123abc"]);
  assert.deepEqual(opts.exports, []);
});

test("MR: parseArguments --kind rejects invalid values", () => {
  const opts = parseArguments(["--kind", "invalid"]);
  assert.deepEqual(opts.kinds, []);
});

test("MR: parseArguments --file-kind rejects invalid values", () => {
  const opts = parseArguments(["--file-kind", "invalid"]);
  assert.deepEqual(opts.fileKinds, []);
});

test("MR: parseArguments --visibility rejects invalid values", () => {
  const opts = parseArguments(["--visibility", "invalid"]);
  assert.deepEqual(opts.visibilities, []);
});

test("MR: parseArguments --mode rejects invalid values", () => {
  const opts = parseArguments(["--mode", "named-import"]);
  assert.equal(opts.mode, "named-import");
  const opts2 = parseArguments(["--mode", "namespace-access"]);
  assert.equal(opts2.mode, "namespace-access");
  const opts3 = parseArguments(["--mode", "invalid"]);
  assert.equal(opts3.mode, "named-import");
});

test("MR: parseArguments cascades flags correctly", () => {
  const opts = parseArguments(["info", "--json", "--write", "--domain", "api", "--export", "foo", "--kind", "named-import", "--file-kind", "trait", "--visibility", "public", "--mode", "namespace-access"]);
  assert.equal(opts.command, "info");
  assert.equal(opts.json, true);
  assert.equal(opts.write, true);
  assert.deepEqual(opts.domains, ["api"]);
  assert.deepEqual(opts.exports, ["foo"]);
  assert.deepEqual(opts.kinds, ["named-import"]);
  assert.deepEqual(opts.fileKinds, ["trait"]);
  assert.deepEqual(opts.visibilities, ["public"]);
  assert.equal(opts.mode, "namespace-access");
});

test("MR: toSelectionFilters with empty arrays returns undefined", () => {
  const opts = parseArguments([]);
  const filter = toSelectionFilters(opts);
  assert.equal(filter.domains, undefined);
  assert.equal(filter.exports, undefined);
  assert.equal(filter.kinds, undefined);
  assert.equal(filter.fileKinds, undefined);
  assert.equal(filter.visibilities, undefined);
});

test("MR: toSelectionFilters with all filters populated", () => {
  const opts = parseArguments(["--domain", "api", "--export", "foo", "--kind", "named-import", "--file-kind", "trait", "--visibility", "public"]);
  const filter = toSelectionFilters(opts);
  assert.deepEqual(filter.domains, ["api"]);
  assert.deepEqual(filter.exports, ["foo"]);
  assert.deepEqual(filter.kinds, ["named-import"]);
  assert.deepEqual(filter.fileKinds, ["trait"]);
  assert.deepEqual(filter.visibilities, ["public"]);
});

test("MR: hasCollisions with undefined collision array", () => {
  const graph = {} as any;
  assert.throws(() => hasCollisions(graph));
});

test("MR: hasCollisions returns false for null graph", () => {
  assert.throws(() => hasCollisions(null as any));
});

test("MR: failOnCollisions handles json output", () => {
  const graph = { collisions: [{ message: "err" }] } as any;
  const result = suppressConsoleError(() => failOnCollisions(graph, true));
  assert.equal(result, 1);
});

test("MR: toGraphFingerprint handles complex graph", () => {
  const graph = {
    barritsDirectory: "/project",
    projectRoot: "/project",
    strategy: "current-directory",
    filesCount: 10,
    exportsCount: 20,
    publicExportsCount: 15,
    internalExportsCount: 5,
    barrelsCount: 2,
    collisions: [{ message: "collision-1" }, { message: "collision-2" }],
    traitDescriptors: [],
    traitDiagnostics: [],
    rootFiles: [],
    domains: [],
    importActions: [],
    traitDiagnosticCounts: { total: 0, errorCount: 0, warningCount: 0 },
    traitDiagnosticCategoryCounts: { drift: 0, impossible: 0, "non-verifiable": 0 },
    traitDiagnosticCodeCounts: {},
  } as any;
  const fp = toGraphFingerprint(graph);
  assert.ok(fp.includes("collision-1"));
  assert.ok(fp.includes("collision-2"));
  assert.ok(fp.includes("/project"));
});

// ── mutation-targeted: killable covered survivors ─────────────────────

test("MR: parseArguments separates childArgs after -- separator", () => {
  const opts = parseArguments(["--", "foo"]);
  assert.equal(opts.command, "detect");
  assert.deepEqual(opts.childArgs, ["foo"]);
  assert.equal(opts.startDirectory, undefined);
});

test("MR: parseArguments childArgs empty without separator", () => {
  const opts = parseArguments(["info", "--json"]);
  assert.deepEqual(opts.childArgs, []);
  assert.equal(opts.startDirectory, undefined);
});

test("MR: parseArguments --target accepts value ending in --", () => {
  const opts = parseArguments(["--target", "foo--"]);
  assert.equal(opts.targetFile, "foo--");
});

test("MR: parseArguments --snapshot accepts value ending in --", () => {
  const opts = parseArguments(["--snapshot", "foo--"]);
  assert.equal(opts.snapshotFile, "foo--");
});

test("MR: parseArguments --domain rejects flag-like value (|| mutant)", () => {
  const opts = parseArguments(["--domain", "--flag"]);
  assert.deepEqual(opts.domains, []);
});

test("MR: parseArguments --domain accepts value ending in --", () => {
  const opts = parseArguments(["--domain", "foo--"]);
  assert.deepEqual(opts.domains, ["foo--"]);
});

test("MR: parseArguments --domain rejects value ending with invalid char", () => {
  const opts = parseArguments(["--domain", "foo!"]);
  assert.deepEqual(opts.domains, []);
});

test("MR: parseArguments --export rejects flag-like value (|| mutant)", () => {
  const opts = parseArguments(["--export", "--flag"]);
  assert.deepEqual(opts.exports, []);
});

test("MR: parseArguments --export validates against regex", () => {
  assert.deepEqual(parseArguments(["--export", "validName"]).exports, ["validName"]);
  assert.deepEqual(parseArguments(["--export", "$dollar"]).exports, ["$dollar"]);
  assert.deepEqual(parseArguments(["--export", "_underscore"]).exports, ["_underscore"]);
  assert.deepEqual(parseArguments(["--export", "has-dash"]).exports, []);
  assert.deepEqual(parseArguments(["--export", "has space"]).exports, []);
  assert.deepEqual(parseArguments(["--export", "123abc"]).exports, []);
});

test("MR: parseArguments --export rejects value ending with invalid char", () => {
  const opts = parseArguments(["--export", "foo!"]);
  assert.deepEqual(opts.exports, []);
});

test("MR: parseArguments --kind alias-namespace-access", () => {
  const opts = parseArguments(["--kind", "alias-namespace-access"]);
  assert.deepEqual(opts.kinds, ["alias-namespace-access"]);
});

test("MR: parseArguments --mode alias-namespace-access", () => {
  const opts = parseArguments(["--mode", "alias-namespace-access"]);
  assert.equal(opts.mode, "alias-namespace-access");
});

test("MR: parseArguments startDirectory not overwritten when already set", () => {
  const opts = parseArguments(["./src", "info", "extra"]);
  assert.equal(opts.startDirectory, "./src");
});

test("MR: parseArguments startDirectory rejects flag-like argument", () => {
  const opts = parseArguments(["--json"]);
  assert.equal(opts.startDirectory, undefined);
});

test("MR: parseArguments startDirectory accepts path ending in --", () => {
  const opts = parseArguments(["foo--", "info"]);
  assert.equal(opts.startDirectory, "foo--");
});

// ── capture console helpers ──────────────────────────────────────────

const captureConsoleLog = <TResult>(fn: () => TResult): { output: string[]; result: TResult } => {
  const lines: string[] = [];
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args: unknown[]) => { lines.push(args.map(String).join(" ")); };
  console.error = (...args: unknown[]) => { lines.push(args.map(String).join(" ")); };
  try {
    const result = fn();
    return { output: lines, result };
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }
};

// ── NoCoverage: printCollisions ──────────────────────────────────────

test("MR: printCollisions outputs collision messages", () => {
  const graph = { collisions: [{ message: "collision-msg" }] } as any;
  const { output } = captureConsoleLog(() => printCollisions(graph));
  assert.ok(output.some((l) => l.includes("collision-msg")));
});

test("MR: printCollisions outputs nothing for empty collisions", () => {
  const graph = { collisions: [] } as any;
  const { output } = captureConsoleLog(() => printCollisions(graph));
  assert.equal(output.length, 0);
});

// ── NoCoverage: failOnCollisions additional coverage ─────────────────

test("MR: failOnCollisions prints JSON when json=true", () => {
  const graph = { collisions: [{ message: "c1" }, { message: "c2" }] } as any;
  const { output, result } = captureConsoleLog(() => failOnCollisions(graph, true));
  assert.equal(result, 1);
  assert.ok(output.some((l) => l.includes("c1")));
  assert.ok(output.some((l) => l.includes("c2")));
});

test("MR: failOnCollisions prints console.error when json=false", () => {
  const graph = { collisions: [{ message: "err-msg" }] } as any;
  const { output, result } = captureConsoleLog(() => failOnCollisions(graph, false));
  assert.equal(result, 1);
  assert.ok(output.some((l) => l.includes("err-msg")));
});

// ── NoCoverage: printInfoSummary ─────────────────────────────────────

const MINIMAL_GRAPH = {
  barritsDirectory: "/test/barrits",
  projectRoot: "/test",
  strategy: "current-directory",
  discoveryRoots: [],
  filesCount: 5,
  exportsCount: 10,
  publicExportsCount: 7,
  internalExportsCount: 3,
  barrelsCount: 2,
  rootFiles: [{ path: "index.ts", isIndex: true, kind: "barrel", sourceLayer: "barrits", exports: [], traitDescriptors: [] }],
  domains: [],
  libraryRootFiles: [],
  libraryDomains: [],
  traitDescriptors: [],
  traitDiagnostics: [],
  importActions: [],
  collisions: [],
};

test("MR: printInfoSummary outputs basic fields", () => {
  const { output } = captureConsoleLog(() => printInfoSummary(MINIMAL_GRAPH as any));
  assert.ok(output.some((l) => l.includes("/test/barrits")));
  assert.ok(output.some((l) => l.includes("current-directory")));
  assert.ok(output.some((l) => l.includes("5")));
  assert.ok(output.some((l) => l.includes("rootFiles:")));
});

test("MR: printInfoSummary with domains and collisions", () => {
  const graph = {
    ...MINIMAL_GRAPH,
    domains: [{
      name: "core",
      path: "core",
      files: [{ path: "core/helper.ts", isIndex: false, kind: "internal", sourceLayer: "barrits", exports: [{ name: "helperFn", visibility: "public", bindingName: "helperFn", bindingKind: "function", accessStrategy: "export-name", sourceLayer: "barrits" }], traitDescriptors: [] }],
    }],
    collisions: [{ type: "project-project", namespace: "core", exportName: "helperFn", projectSourceFile: "core/helper.ts", conflictSourceFile: "lib/helper.ts", message: "collision-detail" }],
    importActions: [{ exportName: "helperFn", domain: "core", sourceFile: "core/helper.ts", kind: "named-import", statement: "import { helperFn } from './core/helper'" }],
  };
  const { output } = captureConsoleLog(() => printInfoSummary(graph as any));
  assert.ok(output.some((l) => l.includes("core")));
  assert.ok(output.some((l) => l.includes("collision-detail")));
  assert.ok(output.some((l) => l.includes("helperFn")));
});

test("MR: printInfoSummary with 13+ importActions shows truncation", () => {
  const actions = Array.from({ length: 15 }, (_, i) => ({
    exportName: `exp${i}`, domain: "core", sourceFile: `f${i}.ts`, kind: "named-import" as const, statement: `import { exp${i} }`,
  }));
  const graph = { ...MINIMAL_GRAPH, rootFiles: [], importActions: actions };
  const { output } = captureConsoleLog(() => printInfoSummary(graph as any));
  assert.ok(output.some((l) => l.includes("3 more")));
});

// ── NoCoverage: printGraph ───────────────────────────────────────────

test("MR: printGraph with json=true outputs JSON", () => {
  const graph = { ...MINIMAL_GRAPH, barritsDirectory: "/json-test" };
  const { output } = captureConsoleLog(() => printGraph(graph as any, true));
  assert.ok(output.some((l) => l.includes("/json-test")));
});

test("MR: printGraph with json=false delegates to printInfoSummary", () => {
  const graph = { ...MINIMAL_GRAPH, barritsDirectory: "/summary-test" };
  const { output } = captureConsoleLog(() => printGraph(graph as any, false));
  assert.ok(output.some((l) => l.includes("/summary-test")));
});

// ── NoCoverage: printImportActions ───────────────────────────────────

test("MR: printImportActions with json=true outputs JSON", () => {
  const graph = { ...MINIMAL_GRAPH, importActions: [{ exportName: "foo", domain: "core", sourceFile: "f.ts", kind: "named-import", statement: "import { foo }" }] };
  const { output } = captureConsoleLog(() => printImportActions(graph as any, true));
  assert.ok(output.some((l) => l.includes("foo")));
});

test("MR: printImportActions with json=false outputs formatted lines", () => {
  const graph = { ...MINIMAL_GRAPH, importActions: [{ exportName: "bar", domain: "core", sourceFile: "f.ts", kind: "named-import", statement: "import { bar }" }] };
  const { output } = captureConsoleLog(() => printImportActions(graph as any, false));
  assert.ok(output.some((l) => l.includes("bar")));
});
