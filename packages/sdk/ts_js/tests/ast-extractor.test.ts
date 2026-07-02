import { describe, it } from "node:test";
import assert from "node:assert/strict";
import ts from "typescript";
import {
  relativeFromBase,
  isInternalPath,
  splitPathSegments,
  resolveRelativeModulePath,
  stripSourceExtension,
  toAccessSegments,
  deriveExportAccessPath,
  extractAttachedJsDoc,
  parseJsDocAccessPath,
  hasExportModifier,
  collectDirectExports,
  extractExports,
} from "../src/barrits/sdk/ast/extractor";
import { createRuntimeFileSystemAdapter } from "../src/barrits/sdk/adapters";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

describe("relativeFromBase", () => {
  it("returns empty string when paths are equal", () => {
    assert.equal(relativeFromBase("/a/b", "/a/b"), "");
  });

  it("returns relative sub-path when target is inside base", () => {
    assert.equal(relativeFromBase("/a/b", "/a/b/c/d.ts"), "c/d.ts");
  });

  it("returns normalized target when not inside base", () => {
    assert.equal(relativeFromBase("/a/b", "/x/y.ts"), "/x/y.ts");
  });
});

describe("isInternalPath", () => {
  it("returns true for internal.ts", () => {
    assert.ok(isInternalPath("internal.ts"));
  });

  it("returns true for paths containing /internal/", () => {
    assert.ok(isInternalPath("logic/internal/foo.ts"));
  });

  it("returns true for paths ending with /internal.ts", () => {
    assert.ok(isInternalPath("logic/internal.ts"));
  });

  it("returns true for paths starting with internal/", () => {
    assert.ok(isInternalPath("internal/foo.ts"));
  });

  it("returns false for non-internal paths", () => {
    assert.equal(isInternalPath("index.ts"), false);
    assert.equal(isInternalPath("api/flat.ts"), false);
    assert.equal(isInternalPath("shared/utils.ts"), false);
  });
});

describe("splitPathSegments", () => {
  it("splits a simple path into segments", () => {
    assert.deepEqual(splitPathSegments("a/b/c.ts"), ["a", "b", "c.ts"]);
  });

  it("normalizes and filters empty segments", () => {
    assert.deepEqual(splitPathSegments("a//b/.//c.ts"), ["a", "b", "c.ts"]);
  });

  it("handles single segment", () => {
    assert.deepEqual(splitPathSegments("index.ts"), ["index.ts"]);
  });
});

describe("resolveRelativeModulePath", () => {
  it("resolves a relative specifier", () => {
    const result = resolveRelativeModulePath("logic/foo.ts", "./bar");
    assert.equal(result, "logic/bar.ts");
  });

  it("returns null for non-relative specifiers", () => {
    assert.equal(resolveRelativeModulePath("foo.ts", "bar"), null);
    assert.equal(resolveRelativeModulePath("foo.ts", "@scope/pkg"), null);
  });

  it("resolves parent directory references", () => {
    const result = resolveRelativeModulePath("a/b/c.ts", "../d");
    assert.equal(result, "a/d.ts");
  });

  it("preserves existing extension", () => {
    const result = resolveRelativeModulePath("a/b.ts", "./c.js");
    assert.equal(result, "a/c.js");
  });

  it("handles . segment", () => {
    const result = resolveRelativeModulePath("a/b.ts", "././c");
    assert.equal(result, "a/c.ts");
  });

  it("returns null for unresolved empty path", () => {
    const result = resolveRelativeModulePath("a.ts", "./..");
    assert.equal(result, null);
  });
});

describe("stripSourceExtension", () => {
  it("removes .ts extension", () => {
    assert.equal(stripSourceExtension("foo.ts"), "foo");
  });

  it("removes .tsx extension", () => {
    assert.equal(stripSourceExtension("foo.tsx"), "foo");
  });

  it("removes .mjs extension", () => {
    assert.equal(stripSourceExtension("foo.mjs"), "foo");
  });

  it("removes .cjs extension", () => {
    assert.equal(stripSourceExtension("foo.cjs"), "foo");
  });

  it("returns unchanged when no source extension", () => {
    assert.equal(stripSourceExtension("foo.json"), "foo.json");
  });
});

describe("toAccessSegments", () => {
  it("splits path into segments", () => {
    assert.deepEqual(toAccessSegments("logic/math/sumar.ts"), ["logic", "math", "sumar"]);
  });

  it("removes trailing index segment", () => {
    assert.deepEqual(toAccessSegments("api/index.ts"), ["api"]);
  });

  it("handles root index", () => {
    assert.deepEqual(toAccessSegments("index.ts"), []);
  });
});

describe("deriveExportAccessPath", () => {
  it("uses exportName for top-level paths", () => {
    assert.equal(deriveExportAccessPath("index.ts", "fooBar"), "fooBar");
  });

  it("joins domain segments without exportName suffix", () => {
    assert.equal(deriveExportAccessPath("logic/math/sumar.ts", "sumar"), "math.sumar");
  });

  it("appends exportName when different from last segment", () => {
    assert.equal(deriveExportAccessPath("logic/math.ts", "extra"), "math.extra");
  });
});

describe("extractAttachedJsDoc", () => {
  it("extracts JSDoc content when present before matchIndex", () => {
    const source = "/** @barrits-trait */\nexport const foo = 1;";
    const matchIndex = source.indexOf("export");
    const result = extractAttachedJsDoc(source, matchIndex)!;
    assert.ok(result.includes("@barrits-trait"));
  });

  it("returns undefined when no JSDoc block precedes matchIndex", () => {
    const source = "export const foo = 1;";
    const matchIndex = source.indexOf("export");
    assert.equal(extractAttachedJsDoc(source, matchIndex), undefined);
  });

  it("returns undefined when block does not end with */", () => {
    const source = "/** incomplete\nexport const foo = 1;";
    const matchIndex = source.indexOf("export");
    assert.equal(extractAttachedJsDoc(source, matchIndex), undefined);
  });
});

describe("parseJsDocAccessPath", () => {
  it("parses @barrits-path tag", () => {
    const source = "/** @barrits-path math.custom */\nexport const sumar = 1;";
    const matchIndex = source.indexOf("export");
    assert.equal(parseJsDocAccessPath(source, matchIndex), "math.custom");
  });

  it("returns undefined when no @barrits-path tag", () => {
    const source = "/** some comment */\nexport const foo = 1;";
    const matchIndex = source.indexOf("export");
    assert.equal(parseJsDocAccessPath(source, matchIndex), undefined);
  });

  it("returns undefined when no JSDoc block", () => {
    assert.equal(parseJsDocAccessPath("export const foo = 1;", 0), undefined);
  });
});

describe("hasExportModifier", () => {
  it("returns true for exported statement", () => {
    const sf = ts.createSourceFile("test.ts", "export const x = 1;", 99, true);
    const stmt = sf.statements[0];
    assert.ok(hasExportModifier(stmt));
  });

  it("returns false for non-exported statement", () => {
    const sf = ts.createSourceFile("test.ts", "const x = 1;", 99, true);
    const stmt = sf.statements[0];
    assert.equal(hasExportModifier(stmt), false);
  });
});

describe("collectDirectExports", () => {
  it("collects exported const declarations", () => {
    const { exportsMap } = collectDirectExports("export const foo = 1;\nexport const bar = 2;", "index.ts");
    assert.ok(exportsMap.has("foo"));
    assert.ok(exportsMap.has("bar"));
    assert.equal(exportsMap.get("foo")?.kind, "const");
    assert.equal(exportsMap.get("foo")?.visibility, "public");
  });

  it("flags internal exports", () => {
    const { exportsMap } = collectDirectExports("export const foo = 1;", "internal.ts");
    assert.equal(exportsMap.get("foo")?.visibility, "internal");
  });

  it("collects exported function declarations", () => {
    const { exportsMap } = collectDirectExports("export function doStuff() {}", "index.ts");
    assert.ok(exportsMap.has("doStuff"));
    assert.equal(exportsMap.get("doStuff")?.kind, "function");
  });

  it("collects re-exports", () => {
    const { exportsMap } = collectDirectExports("export { Foo, Bar } from './types';", "index.ts");
    assert.ok(exportsMap.has("Foo"));
    assert.ok(exportsMap.has("Bar"));
    assert.equal(exportsMap.get("Foo")?.kind, "reexport");
  });

  it("collects export * specifiers", () => {
    const { exportAllSpecifiers } = collectDirectExports("export * from './logic';", "index.ts");
    assert.deepEqual(exportAllSpecifiers, ["./logic"]);
  });

  it("skips non-const variable declarations", () => {
    const { exportsMap } = collectDirectExports("export let x = 1;", "index.ts");
    assert.equal(exportsMap.size, 0);
  });

  it("skips non-exported statements", () => {
    const { exportsMap } = collectDirectExports("const x = 1;\nfunction y() {}", "index.ts");
    assert.equal(exportsMap.size, 0);
  });

  it("computes accessPath from JSDoc override", () => {
    const source = "/** @barrits-path custom.path */\nexport const foo = 1;";
    const { exportsMap } = collectDirectExports(source, "logic/foo.ts");
    assert.equal(exportsMap.get("foo")?.accessPath, "custom.path");
    assert.equal(exportsMap.get("foo")?.accessStrategy, "jsdoc");
  });
});

describe("extractExports", () => {
  it("resolves re-exports recursively", async () => {
    const dir = join(tmpdir(), `barrits-extract-test-${Date.now()}`);
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, "index.ts"), "export * from './internal';");
    await writeFile(join(dir, "internal.ts"), "export const resolvedExport = 42;");

    const adapter = createRuntimeFileSystemAdapter();
    try {
      const result = await extractExports(adapter, dir, "index.ts", "export * from './internal';");
      assert.ok(result.find((e) => e.name === "resolvedExport"));
      assert.equal(result.find((e) => e.name === "resolvedExport")?.kind, "reexport");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("handles missing re-export targets gracefully", async () => {
    const adapter = createRuntimeFileSystemAdapter();
    const result = await extractExports(adapter, "/nonexistent", "index.ts", "export * from './missing';");
    assert.ok(Array.isArray(result));
  });
});
