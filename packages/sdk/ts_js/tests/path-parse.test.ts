import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { parsePath } from "../src/barrits/routes/path/parse";

describe("parsePath", () => {
  it("parses simple path into segments", () => {
    const result = parsePath("/users/123/posts");
    assert.deepEqual(result.segments, ["users", "123", "posts"]);
    assert.deepEqual(result.query, {});
  });

  it("parses path with query parameters", () => {
    const result = parsePath("/search?q=hello&page=1");
    assert.deepEqual(result.segments, ["search"]);
    assert.deepEqual(result.query, { q: "hello", page: "1" });
  });

  it("handles root path", () => {
    const result = parsePath("/");
    assert.deepEqual(result.segments, []);
    assert.deepEqual(result.query, {});
  });

  it("handles empty string", () => {
    const result = parsePath("");
    assert.deepEqual(result.segments, []);
    assert.deepEqual(result.query, {});
  });

  it("trims whitespace from segments", () => {
    const result = parsePath("/  users  /  posts  ");
    assert.deepEqual(result.segments, ["users", "posts"]);
  });

  it("handles path with no leading slash", () => {
    const result = parsePath("users/posts");
    assert.deepEqual(result.segments, ["users", "posts"]);
  });

  it("handles multiple query parameters", () => {
    const result = parsePath("/items?color=red&size=l&sort=asc");
    assert.equal(result.segments.length, 1);
    assert.equal(result.query.color, "red");
    assert.equal(result.query.size, "l");
    assert.equal(result.query.sort, "asc");
  });

  it("handles query with no value", () => {
    const result = parsePath("/page?debug");
    assert.equal(result.query.debug, "");
  });
});
