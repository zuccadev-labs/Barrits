import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { composePipeline } from "../src/barrits/traits/compose/pipeline";

describe("composePipeline", () => {
  it("returns initial value with no steps", () => {
    assert.equal(composePipeline(42), 42);
  });

  it("applies a single step", () => {
    const double = (x: number) => x * 2;
    assert.equal(composePipeline(5, double), 10);
  });

  it("applies multiple steps left-to-right", () => {
    const add = (x: number) => x + 1;
    const double = (x: number) => x * 2;
    const square = (x: number) => x * x;
    assert.equal(composePipeline(3, add, double, square), 64);
  });

  it("works with string transformations", () => {
    const upper = (s: string) => s.toUpperCase();
    const exclaim = (s: string) => s + "!";
    assert.equal(composePipeline("hello", upper, exclaim), "HELLO!");
  });

  it("works with object transformations", () => {
    type Obj = { count: number };
    const inc = (o: Obj) => ({ count: o.count + 1 });
    const double = (o: Obj) => ({ count: o.count * 2 });
    assert.deepEqual(composePipeline({ count: 1 }, inc, double), { count: 4 });
  });

  it("preserves order of steps", () => {
    const log: number[] = [];
    const track = (x: number) => { log.push(x); return x; };
    composePipeline(0, track, track, track);
    assert.deepEqual(log, [0, 0, 0]);
  });
});
