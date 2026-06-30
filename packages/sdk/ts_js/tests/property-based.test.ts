import test from "node:test";
import assert from "node:assert/strict";
import fc from "fast-check";
import { isBarritsFileKind, isBarritsExportVisibility } from "../src/barrits/sdk/guards";
import { normalizePath, dirnamePath, basenamePath, joinPath, isRootPath } from "../src/barrits/sdk/path";
import { expectString, expectNumber, expectRecord, expectStringArray, expectEnumValue, DISCOVERY_STRATEGIES, FILE_MODES, SOURCE_LAYERS, BINDING_KINDS, TRAIT_FACTORIES } from "../src/barrits/sdk/validation";

// ── guards.ts ────────────────────────────────────────────────────────────────

test("PBT: isBarritsFileKind returns true for all valid file kinds", () => {
  const validKinds = ["barrel", "internal", "trait", "shared", "domain", "sdk", "root"] as const;
  for (const kind of validKinds) {
    assert.ok(isBarritsFileKind(kind), `expected true for "${kind}"`);
  }
});

test("PBT: isBarritsFileKind returns false for any random string", () => {
  fc.assert(
    fc.property(fc.string(), (value) => {
      if (["barrel", "internal", "trait", "shared", "domain", "sdk", "root"].includes(value)) {
        assert.ok(isBarritsFileKind(value));
      } else {
        assert.equal(isBarritsFileKind(value), false);
      }
    }),
    { numRuns: 500 },
  );
});

test("PBT: isBarritsExportVisibility returns true for public and internal", () => {
  assert.ok(isBarritsExportVisibility("public"));
  assert.ok(isBarritsExportVisibility("internal"));
});

test("PBT: isBarritsExportVisibility returns false for any random string", () => {
  fc.assert(
    fc.property(fc.string(), (value) => {
      if (value === "public" || value === "internal") {
        assert.ok(isBarritsExportVisibility(value));
      } else {
        assert.equal(isBarritsExportVisibility(value), false);
      }
    }),
    { numRuns: 500 },
  );
});

// ── path.ts ──────────────────────────────────────────────────────────────────

test("PBT: normalizePath never throws for any string", () => {
  fc.assert(
    fc.property(fc.string(), (value) => {
      assert.doesNotThrow(() => normalizePath(value));
    }),
  );
});

test("PBT: normalizePath is idempotent", () => {
  fc.assert(
    fc.property(fc.string(), (value) => {
      const once = normalizePath(value);
      const twice = normalizePath(once);
      assert.equal(once, twice);
    }),
  );
});

test("PBT: dirnamePath never throws for any string", () => {
  fc.assert(
    fc.property(fc.string(), (value) => {
      assert.doesNotThrow(() => dirnamePath(value));
    }),
  );
});

test("PBT: basenamePath never throws for any string", () => {
  fc.assert(
    fc.property(fc.string(), (value) => {
      assert.doesNotThrow(() => basenamePath(value));
    }),
  );
});

test("PBT: joinPath never throws for any string array", () => {
  fc.assert(
    fc.property(fc.array(fc.string()), (segments) => {
      assert.doesNotThrow(() => joinPath(...segments));
    }),
  );
});

test("PBT: normalizePath is deterministic", () => {
  fc.assert(
    fc.property(fc.string(), (value) => {
      const a = normalizePath(value);
      const b = normalizePath(value);
      assert.equal(a, b);
    }),
  );
});

test("PBT: isRootPath matches only root patterns", () => {
  fc.assert(
    fc.property(fc.string(), (value) => {
      const result = isRootPath(value);
      if (result) {
        const normalized = normalizePath(value);
        assert.ok(normalized === "/" || /^[A-Za-z]:\/$/.test(normalized));
      }
    }),
  );
});

test("PBT: joinPath with no arguments returns '.'", () => {
  assert.equal(joinPath(), ".");
});

test("PBT: joinPath with single argument normalizes it", () => {
  fc.assert(
    fc.property(fc.string(), (value) => {
      assert.equal(joinPath(value), normalizePath(value));
    }),
  );
});

// ── path.ts: known-output tests for targeted mutant killing ─────────────────

test("PBT: normalizePath normalizes backslashes to forward slashes", () => {
  assert.equal(normalizePath("a\\b\\c"), "a/b/c");
  assert.equal(normalizePath("C:\\Users\\test"), "C:/Users/test");
});

test("PBT: normalizePath collapses duplicate slashes", () => {
  assert.equal(normalizePath("a//b///c"), "a/b/c");
  assert.equal(normalizePath("a////b"), "a/b");
});

test("PBT: normalizePath resolves parent directory references", () => {
  assert.equal(normalizePath("a/b/../c"), "a/c");
  assert.equal(normalizePath("a/b/c/../../d"), "a/d");
  assert.equal(normalizePath("a/../../../b"), "../../b");
});

test("PBT: normalizePath preserves root paths", () => {
  assert.equal(normalizePath("/"), "/");
  assert.equal(normalizePath("C:/"), "C:/");
});

test("PBT: normalizePath collapses single dots", () => {
  assert.equal(normalizePath("a/./b/./c"), "a/b/c");
  assert.equal(normalizePath("./foo"), "foo");
});

test("PBT: normalizePath returns '.' for empty input", () => {
  assert.equal(normalizePath(""), ".");
  assert.equal(normalizePath("   "), ".");
});

test("PBT: normalizePath trims trailing slashes except root", () => {
  assert.equal(normalizePath("a/b/c/"), "a/b/c");
  assert.equal(normalizePath("/"), "/");
  assert.equal(normalizePath("C:/"), "C:/");
});

test("PBT: dirnamePath computes correct parent directory", () => {
  assert.equal(dirnamePath("a/b/c"), "a/b");
  assert.equal(dirnamePath("a/b"), "a");
  assert.equal(dirnamePath("/a/b"), "/a");
  assert.equal(dirnamePath("/a"), "/");
  assert.equal(dirnamePath("/"), "/");
});

test("PBT: basenamePath computes correct file name", () => {
  assert.equal(basenamePath("a/b/c.ts"), "c.ts");
  assert.equal(basenamePath("a/b"), "b");
  assert.equal(basenamePath("a"), "a");
  assert.equal(basenamePath("/a/b.ts"), "b.ts");
  assert.equal(basenamePath("/"), "");
});

test("PBT: joinPath joins segments correctly", () => {
  assert.equal(joinPath("a", "b", "c"), "a/b/c");
  assert.equal(joinPath("/a", "b", "c"), "/a/b/c");
  assert.equal(joinPath("a", "..", "b"), "b");
  assert.equal(joinPath("a", "", "b"), "a/b");
});

test("PBT: isRootPath identifies root paths correctly", () => {
  assert.equal(isRootPath("/"), true);
  assert.equal(isRootPath("C:/"), true);
  assert.equal(isRootPath("/foo"), false);
  assert.equal(isRootPath("C:/foo"), false);
  assert.equal(isRootPath("a/b"), false);
  assert.equal(isRootPath("."), false);
});

// ── path.ts: additional edge cases for mutation coverage ───────────────────

test("PBT: normalizePath handles Windows drive letters correctly", () => {
  assert.equal(normalizePath("C:/"), "C:/");
  assert.equal(normalizePath("d:/foo/bar"), "d:/foo/bar");
  assert.equal(normalizePath("Z:/a/b/c"), "Z:/a/b/c");
  assert.equal(normalizePath("c:\\foo"), "c:/foo");
  assert.equal(normalizePath("D:\\a\\b"), "D:/a/b");
});

test("PBT: normalizePath handles mixed separators", () => {
  assert.equal(normalizePath("a\\b/c\\d"), "a/b/c/d");
  assert.equal(normalizePath("a\\\\b\\/c"), "a/b/c");
  assert.equal(normalizePath("x\\y\\/z"), "x/y/z");
});

test("PBT: normalizePath resolves extreme parent references", () => {
  assert.equal(normalizePath(".."), "..");
  assert.equal(normalizePath("../.."), "../..");
  assert.equal(normalizePath("../../.."), "../../..");
  assert.equal(normalizePath("a/../../.."), "../..");
  assert.equal(normalizePath("a/b/../../../c"), "../c");
  assert.equal(normalizePath("a/./b/../c/../../d"), "d");
});

test("PBT: normalizePath handles absolute paths with parent references", () => {
  assert.equal(normalizePath("/a/../b"), "/b");
  assert.equal(normalizePath("/a/b/../../c"), "/c");
  assert.equal(normalizePath("C:/a/../b"), "C:/b");
  assert.equal(normalizePath("C:/a/b/../../c"), "C:/c");
});

test("PBT: normalizePath handles single dot corner cases", () => {
  assert.equal(normalizePath("."), ".");
  assert.equal(normalizePath("./."), ".");
  assert.equal(normalizePath("./foo/."), "foo");
  assert.equal(normalizePath("/."), "/");
  assert.equal(normalizePath("/./"), "/");
  assert.equal(normalizePath("C:/."), "C:/");
});

test("PBT: normalizePath trims trailing slashes in edge cases", () => {
  assert.equal(normalizePath("/a/b/c///"), "/a/b/c");
  assert.equal(normalizePath("a/b///"), "a/b");
  assert.equal(normalizePath("//"), "/");
  assert.equal(normalizePath("///"), "/");
});

test("PBT: joinPath handles edge segments", () => {
  assert.equal(joinPath("a", "", "b"), "a/b");
  assert.equal(joinPath("", "a", "b"), "a/b");
  assert.equal(joinPath("a", undefined as unknown as string, "b"), "a/b");
  assert.equal(joinPath("/a", "/b"), "/a/b");
  assert.equal(joinPath("C:/a", "b"), "C:/a/b");
});

test("PBT: dirnamePath handles edge cases", () => {
  assert.equal(dirnamePath("."), "/");
  assert.equal(dirnamePath(".."), "/");
  assert.equal(dirnamePath("C:"), "C:/");
  assert.equal(dirnamePath("a"), "/");
  assert.equal(dirnamePath("C:/a"), "C:");
});

test("PBT: basenamePath handles edge cases", () => {
  assert.equal(basenamePath("."), ".");
  assert.equal(basenamePath(".."), "..");
  assert.equal(basenamePath("a"), "a");
  assert.equal(basenamePath("/"), "");
  assert.equal(basenamePath("C:/"), "");
});

// ── validation.ts ────────────────────────────────────────────────────────────

const nonStringArb = fc.oneof(fc.integer(), fc.boolean(), fc.double(), fc.constant(null), fc.constant(undefined));
const nonNumberArb = fc.oneof(fc.string(), fc.boolean(), fc.constant(null), fc.constant(undefined));
const nonObjectArb = fc.oneof(fc.string(), fc.integer(), fc.boolean(), fc.constant(null));
const nonStringArrayArb = fc.oneof(fc.string(), fc.integer(), fc.constant(null), fc.constant(undefined), fc.constant({}));

test("PBT: expectString returns the value unchanged for any string", () => {
  fc.assert(
    fc.property(fc.string(), (value) => {
      assert.equal(expectString(value, "test", "$"), value);
    }),
  );
});

test("PBT: expectString throws TypeError for any non-string", () => {
  fc.assert(
    fc.property(nonStringArb, (value) => {
      assert.throws(() => expectString(value, "test", "$"), TypeError);
    }),
  );
});

test("PBT: expectNumber returns the value for any valid number", () => {
  fc.assert(
    fc.property(fc.double({ noNaN: true }), (value) => {
      assert.equal(expectNumber(value, "test", "$"), value);
    }),
  );
});

test("PBT: expectNumber throws TypeError for NaN", () => {
  assert.throws(() => expectNumber(NaN, "test", "$"), TypeError);
});

test("PBT: expectNumber throws TypeError for any non-number", () => {
  fc.assert(
    fc.property(nonNumberArb, (value) => {
      assert.throws(() => expectNumber(value, "test", "$"), TypeError);
    }),
  );
});

test("PBT: expectRecord returns the value for any object", () => {
  fc.assert(
    fc.property(fc.object(), (value) => {
      assert.equal(expectRecord(value, "test", "$"), value);
    }),
  );
});

test("PBT: expectRecord throws TypeError for null, arrays, and primitives", () => {
  fc.assert(
    fc.property(nonObjectArb, (value) => {
      assert.throws(() => expectRecord(value, "test", "$"), TypeError);
    }),
  );
});

test("PBT: expectStringArray returns string[] for any string array", () => {
  fc.assert(
    fc.property(fc.array(fc.string()), (value) => {
      const result = expectStringArray(value, "test", "$");
      assert.ok(Array.isArray(result));
      assert.equal(result.length, value.length);
      assert.ok(result.every((entry) => typeof entry === "string"));
    }),
  );
});

test("PBT: expectStringArray throws TypeError for non-array values", () => {
  fc.assert(
    fc.property(nonStringArrayArb, (value) => {
      assert.throws(() => expectStringArray(value, "test", "$"), TypeError);
    }),
  );
});

test("PBT: expectEnumValue accepts values in the set", () => {
  const set = new Set(["a", "b", "c"]);
  assert.equal(expectEnumValue("a", set, "test", "$", "a/b/c"), "a");
  assert.equal(expectEnumValue("b", set, "test", "$", "a/b/c"), "b");
  assert.equal(expectEnumValue("c", set, "test", "$", "a/b/c"), "c");
});

test("PBT: expectEnumValue throws TypeError for values not in the set", () => {
  fc.assert(
    fc.property(fc.string(), (value) => {
      fc.pre(value !== "a" && value !== "b" && value !== "c");
      const set = new Set(["a", "b", "c"]);
      assert.throws(() => expectEnumValue(value, set, "test", "$", "a/b/c"), TypeError);
    }),
  );
});

// ── validation constant sets ─────────────────────────────────────────────────

test("PBT: DISCOVERY_STRATEGIES enum values are all strings", () => {
  for (const value of DISCOVERY_STRATEGIES) {
    assert.equal(typeof value, "string");
  }
});

test("PBT: FILE_MODES enum values are all strings", () => {
  for (const value of FILE_MODES) {
    assert.equal(typeof value, "string");
  }
});

test("PBT: SOURCE_LAYERS enum values are all strings", () => {
  for (const value of SOURCE_LAYERS) {
    assert.equal(typeof value, "string");
  }
});

test("PBT: BINDING_KINDS enum values are all strings", () => {
  for (const value of BINDING_KINDS) {
    assert.equal(typeof value, "string");
  }
});

test("PBT: TRAIT_FACTORIES enum values are all strings", () => {
  for (const value of TRAIT_FACTORIES) {
    assert.equal(typeof value, "string");
  }
});

// ── path.ts: targeted tests for mutation killing ─────────────────────────

test("MR: normalizeSeparators collapses multiple backslashes", () => {
  assert.equal(normalizePath("a\\\\\\\\b"), "a/b");
  assert.equal(normalizePath("a\\\\\\\\\\\\b"), "a/b");
  assert.equal(normalizePath("\\\\\\\\server\\\\share"), "/server/share");
});

test("MR: normalizeSeparators collapses mixed backslash and slash sequences", () => {
  assert.equal(normalizePath("a\\\\/\\\\b"), "a/b");
  assert.equal(normalizePath("a\\///b"), "a/b");
});

test("MR: trimTrailingSlash preserves root paths", () => {
  assert.equal(normalizePath("/"), "/");
  assert.equal(normalizePath("//"), "/");
  assert.equal(normalizePath("///"), "/");
  assert.equal(normalizePath("C:/"), "C:/");
});

test("MR: trimTrailingSlash removes trailing slashes from non-root", () => {
  assert.equal(normalizePath("/a/"), "/a");
  assert.equal(normalizePath("/a/b/"), "/a/b");
  assert.equal(normalizePath("a/"), "a");
  assert.equal(normalizePath("a/b/"), "a/b");
  assert.equal(normalizePath("C:/a/"), "C:/a");
});

test("MR: normalizePath isAbsolute detection for drive letters", () => {
  assert.equal(normalizePath("C:"), "C:");
  assert.equal(normalizePath("C:a"), "C:a");
  assert.equal(normalizePath("D:\\\\"), "D:/");
  assert.equal(normalizePath("E:\\\\a"), "E:/a");
});

test("MR: normalizePath segment resolution with only dots", () => {
  assert.equal(normalizePath("."), ".");
  assert.equal(normalizePath("./"), ".");
  assert.equal(normalizePath("./."), ".");
  assert.equal(normalizePath("././."), ".");
});

test("MR: normalizePath segment resolution with empty segments", () => {
  assert.equal(normalizePath("a//b"), "a/b");
  assert.equal(normalizePath("a///b"), "a/b");
  assert.equal(normalizePath("a////b"), "a/b");
});

test("MR: normalizePath resolves parent above root on absolute paths", () => {
  assert.equal(normalizePath("/.."), "/");
  assert.equal(normalizePath("/../.."), "/");
  assert.equal(normalizePath("/a/../.."), "/");
  assert.equal(normalizePath("/a/b/../../.."), "/");
});

test("MR: normalizePath resolves parent above Windows root", () => {
  assert.equal(normalizePath("C:/.."), "C:/");
  assert.equal(normalizePath("C:/../.."), "C:/");
  assert.equal(normalizePath("C:/a/../.."), "C:/");
});

test("MR: normalizePath resolves parent refs with Windows drive letters", () => {
  assert.equal(normalizePath("C:/a/b"), "C:/a/b");
  assert.equal(normalizePath("C:/a/../c"), "C:/c");
  assert.equal(normalizePath("C:/a/b/../c"), "C:/a/c");
  assert.equal(normalizePath("C:/a/b/../c/d"), "C:/a/c/d");
});

test("MR: normalizePath handles empty result after resolution", () => {
  assert.equal(normalizePath(""), ".");
  assert.equal(normalizePath("   "), ".");
  assert.equal(normalizePath("a/.."), ".");
  assert.equal(normalizePath("a/b/.."), "a");
});

test("MR: normalizePath preserves deep nested relative parents", () => {
  assert.equal(normalizePath("a/b/c/d/e/f"), "a/b/c/d/e/f");
  assert.equal(normalizePath("a/b/c/../../../d/e"), "d/e");
  assert.equal(normalizePath("a/b/../../c/d/../../e"), "e");
});

test("MR: normalizePath preserves absolute paths with trailing content", () => {
  assert.equal(normalizePath("/foo/bar"), "/foo/bar");
  assert.equal(normalizePath("/foo/bar/"), "/foo/bar");
  assert.equal(normalizePath("C:/foo/bar"), "C:/foo/bar");
  assert.equal(normalizePath("C:/foo/bar/"), "C:/foo/bar");
});

test("MR: dirnamePath root detection", () => {
  assert.equal(dirnamePath("/"), "/");
  assert.equal(dirnamePath("/a"), "/");
  assert.equal(dirnamePath("/a/b"), "/a");
  assert.equal(dirnamePath("C:/"), "C:/");
  assert.equal(dirnamePath("C:/a"), "C:");
});

test("MR: dirnamePath with separator index edges", () => {
  assert.equal(dirnamePath("a"), "/");
  assert.equal(dirnamePath("."), "/");
  assert.equal(dirnamePath(".."), "/");
  assert.equal(dirnamePath("no separator"), "/");
});

test("MR: dirnamePath with Windows drive edge cases", () => {
  assert.equal(dirnamePath("C:"), "C:/");
  assert.equal(dirnamePath("C:a"), "C:/");
  assert.equal(dirnamePath("C:a/b"), "C:a");
});

test("MR: basenamePath separator index edges", () => {
  assert.equal(basenamePath("a"), "a");
  assert.equal(basenamePath("/a"), "a");
  assert.equal(basenamePath("/a/b"), "b");
  assert.equal(basenamePath("/"), "");
  assert.equal(basenamePath("C:/"), "");
  assert.equal(basenamePath("C:/a"), "a");
});

test("MR: basenamePath with no extension", () => {
  assert.equal(basenamePath("foo"), "foo");
  assert.equal(basenamePath("/path/to/file"), "file");
  assert.equal(basenamePath("relative/path"), "path");
});

test("MR: joinPath filter handles falsy segments", () => {
  assert.equal(joinPath(), ".");
  assert.equal(joinPath("a"), "a");
  assert.equal(joinPath("a", ""), "a");
  assert.equal(joinPath("a", "", "b"), "a/b");
  assert.equal(joinPath("a", undefined as unknown as string), "a");
  assert.equal(joinPath(null as unknown as string, "b"), "b");
});

test("MR: joinPath trimTrailingSlash on first segment", () => {
  assert.equal(joinPath("/a/", "b"), "/a/b");
  assert.equal(joinPath("/a/b/", "c"), "/a/b/c");
  assert.equal(joinPath("C:/a/", "b"), "C:/a/b");
});

test("MR: joinPath removes leading slashes from non-first segments", () => {
  assert.equal(joinPath("a", "/b"), "a/b");
  assert.equal(joinPath("a", "//b"), "a/b");
  assert.equal(joinPath("a", "/b", "/c"), "a/b/c");
  assert.equal(joinPath("/a", "/b"), "/a/b");
});

test("MR: joinPath normalizes result through normalizePath", () => {
  assert.equal(joinPath("a", "b", "..", "c"), "a/c");
  assert.equal(joinPath("/a", "b", "..", "c"), "/a/c");
  assert.equal(joinPath("a", ".", "b"), "a/b");
  assert.equal(joinPath("a", "..", "b"), "b");
});


