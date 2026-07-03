import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { buildPath } from "../src/barrits/routes/path/build";

describe("buildPath", () => {
  it("returns root for empty string segment", () => {
    assert.equal(buildPath(""), "/");
  });

  it("builds path from single segment", () => {
    assert.equal(buildPath("users"), "/users");
  });

  it("builds path from multiple segments", () => {
    assert.equal(buildPath("users", "123", "posts"), "/users/123/posts");
  });

  it("splits segments containing slashes", () => {
    assert.equal(buildPath("users/123", "posts/456"), "/users/123/posts/456");
  });

  it("trims whitespace from segments", () => {
    assert.equal(buildPath("  users  ", "  posts  "), "/users/posts");
  });

  it("filters out empty segments", () => {
    assert.equal(buildPath("users", "", "posts"), "/users/posts");
  });

  it("filters out whitespace-only segments", () => {
    assert.equal(buildPath("users", "   ", "posts"), "/users/posts");
  });

  it("handles no arguments", () => {
    assert.equal(buildPath(), "/");
  });

  it("handles deeply nested paths", () => {
    assert.equal(buildPath("a", "b", "c", "d", "e"), "/a/b/c/d/e");
  });

  it("handles segments with leading slash", () => {
    assert.equal(buildPath("/users"), "/users");
  });
});
