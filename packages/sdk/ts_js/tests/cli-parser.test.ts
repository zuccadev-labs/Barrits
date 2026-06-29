import test from "node:test";
import assert from "node:assert/strict";
import {
  parseArguments,
  toSelectionFilters,
  hasCollisions,
  failOnCollisions,
  toGraphFingerprint,
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
