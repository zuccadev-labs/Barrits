import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildPath,
  parsePath,
  path,
  routes,
} from "../src/barrits/routes";

describe("routes namespace object (barrits.routes)", () => {
  it("is an object", () => {
    assert.equal(typeof routes, "object");
    assert.notEqual(routes, null);
  });

  it("has path property", () => {
    assert.ok("path" in routes);
    assert.equal(typeof routes.path, "object");
    assert.notEqual(routes.path, null);
  });

  it("has buildPath property", () => {
    assert.ok("buildPath" in routes);
    assert.equal(typeof routes.buildPath, "function");
  });

  it("has parsePath property", () => {
    assert.ok("parsePath" in routes);
    assert.equal(typeof routes.parsePath, "function");
  });

  it("has exactly three properties", () => {
    assert.equal(Object.keys(routes).length, 3);
  });

  it("references the same path namespace", () => {
    assert.equal(routes.path, path);
  });

  it("references the same buildPath function", () => {
    assert.equal(routes.buildPath, buildPath);
  });

  it("references the same parsePath function", () => {
    assert.equal(routes.parsePath, parsePath);
  });
});
