import { describe, it, mock } from "node:test";
import assert from "node:assert/strict";

import { detectRuntime, getCurrentWorkingDirectory } from "../src/barrits/internal/runtime/env";

describe("detectRuntime", () => {
  it("returns 'node' in Node.js environment", () => {
    assert.equal(detectRuntime(), "node");
  });
});

describe("getCurrentWorkingDirectory", () => {
  it("returns a non-empty string", () => {
    const cwd = getCurrentWorkingDirectory();
    assert.ok(typeof cwd === "string");
    assert.ok(cwd.length > 0);
  });

  it("returns the same as process.cwd()", () => {
    assert.equal(getCurrentWorkingDirectory(), process.cwd());
  });
});
