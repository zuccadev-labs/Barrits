import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { mapConcurrent } from "../src/barrits/sdk/async-utils";

describe("mapConcurrent", () => {
  it("returns empty array for empty input", async () => {
    const result = await mapConcurrent([], 2, async (x: number) => x * 2);
    assert.deepEqual(result, []);
  });

  it("maps all items sequentially with concurrency 1", async () => {
    const order: number[] = [];
    const result = await mapConcurrent([1, 2, 3], 1, async (x) => {
      order.push(x);
      return x * 10;
    });
    assert.deepEqual(result, [10, 20, 30]);
    assert.deepEqual(order, [1, 2, 3]);
  });

  it("completes all items with high concurrency", async () => {
    const items = [1, 2, 3, 4, 5];
    const result = await mapConcurrent(items, 10, async (x) => x * 2);
    assert.deepEqual(result, [2, 4, 6, 8, 10]);
  });

  it("preserves item order with concurrent execution", async () => {
    const delays = [30, 10, 20];
    const result = await mapConcurrent(delays, 3, async (ms) => {
      await new Promise((r) => setTimeout(r, ms as number));
      return ms;
    });
    assert.deepEqual(result, [30, 10, 20]);
  });

  it("handles zero concurrency by defaulting to 1", async () => {
    const order: number[] = [];
    const result = await mapConcurrent([1, 2], 0, async (x) => {
      order.push(x);
      return x;
    });
    assert.deepEqual(result, [1, 2]);
    assert.deepEqual(order, [1, 2]);
  });

  it("handles negative concurrency by defaulting to 1", async () => {
    const result = await mapConcurrent([1, 2, 3], -1, async (x) => x);
    assert.deepEqual(result, [1, 2, 3]);
  });

  it("handles NaN concurrency by defaulting to 1", async () => {
    const result = await mapConcurrent([1], Number.NaN, async (x) => x);
    assert.deepEqual(result, [1]);
  });

  it("handles Infinity concurrency", async () => {
    const result = await mapConcurrent([1, 2], Number.POSITIVE_INFINITY, async (x) => x);
    assert.deepEqual(result, [1, 2]);
  });

  it("limits concurrency when executing many items", async () => {
    let concurrent = 0;
    let maxConcurrent = 0;
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const result = await mapConcurrent(items, 3, async (x) => {
      concurrent++;
      maxConcurrent = Math.max(maxConcurrent, concurrent);
      await new Promise((r) => setTimeout(r, 5));
      concurrent--;
      return x * 2;
    });

    assert.equal(maxConcurrent, 3);
    assert.deepEqual(result, [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]);
  });

  it("propagates errors from async fn", async () => {
    const expected = new Error("fail");
    const result = mapConcurrent([1, 2], 1, async (x) => {
      if (x === 2) throw expected;
      return x;
    });
    await assert.rejects(result, /fail/);
  });

  it("works with non-number items", async () => {
    const result = await mapConcurrent(["a", "b", "c"], 2, async (s) => s.toUpperCase());
    assert.deepEqual(result, ["A", "B", "C"]);
  });
});
