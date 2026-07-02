import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { assertFiniteNumber } from "../src/barrits/internal/runtime/assertions";

describe("assertFiniteNumber", () => {
  it("passes for zero", () => {
    assertFiniteNumber(0, "value");
  });

  it("passes for positive integer", () => {
    assertFiniteNumber(42, "value");
  });

  it("passes for negative integer", () => {
    assertFiniteNumber(-1, "value");
  });

  it("passes for decimal", () => {
    assertFiniteNumber(3.14, "value");
  });

  it("passes for Number.MAX_VALUE", () => {
    assertFiniteNumber(Number.MAX_VALUE, "value");
  });

  it("passes for Number.MIN_VALUE", () => {
    assertFiniteNumber(Number.MIN_VALUE, "value");
  });

  it("throws for NaN", () => {
    assert.throws(() => assertFiniteNumber(NaN, "count"), TypeError);
  });

  it("throws for Infinity", () => {
    assert.throws(() => assertFiniteNumber(Infinity, "count"), TypeError);
  });

  it("throws for -Infinity", () => {
    assert.throws(() => assertFiniteNumber(-Infinity, "count"), TypeError);
  });

  it("includes label in error message", () => {
    try {
      assertFiniteNumber(NaN, "myParam");
      assert.fail("should have thrown");
    } catch (err) {
      assert.ok(err instanceof TypeError);
      assert.match((err as TypeError).message, /myParam/);
    }
  });
});
