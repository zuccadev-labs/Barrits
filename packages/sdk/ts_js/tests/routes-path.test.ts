import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildPath, parsePath, path } from "../src/barrits/routes/path";

describe("path namespace object (barrits.routes.path)", () => {
  it("is an object", () => {
    assert.equal(typeof path, "object");
    assert.notEqual(path, null);
  });

  it("has buildPath property", () => {
    assert.ok("buildPath" in path);
    assert.equal(typeof path.buildPath, "function");
  });

  it("has parsePath property", () => {
    assert.ok("parsePath" in path);
    assert.equal(typeof path.parsePath, "function");
  });

  it("has exactly two properties", () => {
    assert.equal(Object.keys(path).length, 2);
  });

  it("references the same buildPath function", () => {
    assert.equal(path.buildPath, buildPath);
  });

  it("references the same parsePath function", () => {
    assert.equal(path.parsePath, parsePath);
  });
});
