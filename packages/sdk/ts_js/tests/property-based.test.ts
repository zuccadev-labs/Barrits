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
