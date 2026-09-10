import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { deterministicStringify, sha256Hex } from "../src/barrits_lib/logic/hashing";

describe("sha256Hex", () => {
  it('matches the FIPS 180-4 test vector for "abc"', async () => {
    assert.equal(await sha256Hex("abc"), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  });

  it("hashes the empty string", async () => {
    assert.equal(await sha256Hex(""), "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
  });

  it("hashes UTF-8 bytes, not UTF-16 code units", async () => {
    assert.notEqual(await sha256Hex("é"), await sha256Hex("ǩ"));
  });
});

describe("deterministicStringify", () => {
  it("sorts keys by code unit so uppercase, underscore and lowercase order is locale independent", () => {
    assert.equal(deterministicStringify({ a: 1, _: 2, B: 3, "1": 4 }), '{"1":4,"B":3,"_":2,"a":1}');
  });

  it("produces identical output for different insertion orders, recursively", () => {
    const left = { z: 1, a: 2, m: { b: 3, a: [{ y: 1, x: 2 }] } };
    const right = { a: 2, m: { a: [{ x: 2, y: 1 }], b: 3 }, z: 1 };
    assert.equal(deterministicStringify(left), deterministicStringify(right));
  });

  it("preserves array order and omits undefined properties", () => {
    assert.equal(deterministicStringify({ list: [3, 1, 2], skip: undefined }), '{"list":[3,1,2]}');
  });

  it("serializes dates as ISO strings", () => {
    assert.equal(deterministicStringify({ at: new Date(Date.UTC(2026, 0, 1)) }), '{"at":"2026-01-01T00:00:00.000Z"}');
  });

  it("supports indentation", () => {
    assert.equal(deterministicStringify({ b: 1, a: 2 }, 2), '{\n  "a": 2,\n  "b": 1\n}');
  });
});
