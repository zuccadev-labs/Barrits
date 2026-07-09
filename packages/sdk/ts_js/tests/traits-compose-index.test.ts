import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  compose,
  composePipeline,
  mergeTraits,
} from "../src/barrits/traits/compose";

describe("compose namespace object (barrits.traits.compose)", () => {
  it("is an object", () => {
    assert.equal(typeof compose, "object");
    assert.notEqual(compose, null);
  });

  it("has mergeTraits property", () => {
    assert.ok("mergeTraits" in compose);
    assert.equal(typeof compose.mergeTraits, "function");
  });

  it("has composePipeline property", () => {
    assert.ok("composePipeline" in compose);
    assert.equal(typeof compose.composePipeline, "function");
  });

  it("has exactly two properties", () => {
    assert.equal(Object.keys(compose).length, 2);
  });

  it("references the same mergeTraits function", () => {
    assert.equal(compose.mergeTraits, mergeTraits);
  });

  it("references the same composePipeline function", () => {
    assert.equal(compose.composePipeline, composePipeline);
  });
});
