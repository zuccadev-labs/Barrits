import { describe, it, afterEach } from "node:test";
import assert from "node:assert/strict";
import { createCachedSourceFile, clearAstCache } from "../src/barrits/sdk/ast/cache";

afterEach(() => {
  clearAstCache();
});

describe("createCachedSourceFile", () => {
  it("returns a SourceFile for valid source code", () => {
    const sf = createCachedSourceFile("test.ts", "export const x = 1;");
    assert.ok(sf.kind);
    assert.equal(sf.statements.length, 1);
  });

  it("returns the same cached instance for identical path and source", () => {
    const a = createCachedSourceFile("same.ts", "const a = 1;");
    const b = createCachedSourceFile("same.ts", "const a = 1;");
    assert.equal(a, b);
  });

  it("returns a new instance when source changes for same path", () => {
    const a = createCachedSourceFile("change.ts", "const a = 1;");
    const b = createCachedSourceFile("change.ts", "const a = 2;");
    assert.notEqual(a, b);
  });

  it("does not share cache across different paths", () => {
    const a = createCachedSourceFile("path-a.ts", "const x = 1;");
    const b = createCachedSourceFile("path-b.ts", "const x = 1;");
    assert.notEqual(a, b);
  });

  it("handles empty source", () => {
    const sf = createCachedSourceFile("empty.ts", "");
    assert.equal(sf.statements.length, 0);
  });

  it("handles empty relativePath", () => {
    const sf = createCachedSourceFile("", "const x = 1;");
    assert.equal(sf.statements.length, 1);
  });

  it("handles syntactically invalid source without throwing", () => {
    const sf = createCachedSourceFile("invalid.ts", "const = 1;");
    assert.ok(sf);
  });
});

describe("clearAstCache", () => {
  it("forces re-parse after clear for same path and source", () => {
    const a = createCachedSourceFile("clear-test.ts", "const x = 1;");
    clearAstCache();
    const b = createCachedSourceFile("clear-test.ts", "const x = 1;");
    assert.notEqual(a, b);
  });

  it("is idempotent", () => {
    clearAstCache();
    clearAstCache();
    const sf = createCachedSourceFile("idempotent.ts", "const x = 1;");
    assert.ok(sf);
  });
});
