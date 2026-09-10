import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  annualizedVolatility,
  breadthFirstSearch,
  bucketByInterval,
  capitalizeWords,
  chunk,
  CircuitOpenError,
  createCircuitBreaker,
  depthFirstSearch,
  detectDirectedCycle,
  dijkstraShortestPath,
  exponentialMovingAverage,
  isIsoDate,
  maxBy,
  maxDrawdown,
  maxFlow,
  minBy,
  movingAverage,
  murmurHash3,
  paginate,
  quickSort,
  rollingSum,
  slugify,
  slidingWindow,
  TimeoutError,
  toRelativeTime,
  topK,
  topologicalSort,
  truncate,
  windowDelta,
  withTimeout,
} from "../src/barrits_lib/logic";
import { defaultCompare } from "../src/barrits_lib/logic/algorithms/internal/compare";
import { toNonNegativeInteger, toPositiveInteger } from "../src/barrits_lib/logic/algorithms/internal/normalize";

describe("defaultCompare", () => {
  it("is antisymmetric with NaN and sorts NaN last", () => {
    assert.equal(defaultCompare(NaN, 1), 1);
    assert.equal(defaultCompare(1, NaN), -1);
    assert.equal(defaultCompare(NaN, NaN), 0);
    assert.deepEqual([3, NaN, 1, 2].sort(defaultCompare), [1, 2, 3, NaN]);
  });

  it("treats 0 and -0 as equal", () => {
    assert.equal(defaultCompare(0, -0), 0);
    assert.equal(defaultCompare(-0, 0), 0);
  });

  it("compares strings lexicographically by code unit", () => {
    assert.equal(defaultCompare("a", "b"), -1);
    assert.equal(defaultCompare("b", "a"), 1);
    assert.equal(defaultCompare("B", "a"), -1);
  });
});

describe("normalize helpers", () => {
  it("toPositiveInteger falls back on NaN, Infinity, negatives and non-numbers", () => {
    assert.equal(toPositiveInteger(NaN), 1);
    assert.equal(toPositiveInteger(Number.POSITIVE_INFINITY, 7), 7);
    assert.equal(toPositiveInteger(-3), 1);
    assert.equal(toPositiveInteger("4" as unknown as number), 1);
    assert.equal(toPositiveInteger(3.9), 3);
  });

  it("toNonNegativeInteger accepts zero", () => {
    assert.equal(toNonNegativeInteger(0), 0);
    assert.equal(toNonNegativeInteger(-1, 5), 5);
    assert.equal(toNonNegativeInteger(2.5), 2);
  });
});

describe("minBy / maxBy", () => {
  it("keep falsy elements and zero projections as valid candidates", () => {
    assert.equal(
      minBy([0, 5, 3], (value) => value),
      0,
    );
    assert.equal(
      maxBy([-5, 0, -1], (value) => value),
      0,
    );
    assert.equal(
      minBy(["", "a"], (value) => value.length),
      "",
    );
  });

  it("return undefined only for empty input and keep the first tie", () => {
    assert.equal(
      minBy([], (value: number) => value),
      undefined,
    );
    const items = [
      { id: "a", score: 1 },
      { id: "b", score: 1 },
    ];
    assert.equal(minBy(items, (item) => item.score)?.id, "a");
    assert.equal(maxBy(items, (item) => item.score)?.id, "a");
  });

  it("ignore NaN projections when a comparable projection exists", () => {
    assert.equal(
      minBy([NaN, 2, 1], (value) => value),
      1,
    );
    assert.equal(
      maxBy([NaN, 2, 1], (value) => value),
      2,
    );
  });
});

describe("strings", () => {
  it("slugify transliterates accents instead of deleting letters", () => {
    assert.equal(slugify("café"), "cafe");
    assert.equal(slugify("niño"), "nino");
    assert.equal(slugify("Ação São Paulo"), "acao-sao-paulo");
    assert.equal(slugify("  Hello,   World!  "), "hello-world");
    assert.equal(slugify("straße"), "strasse");
    assert.equal(slugify("___"), "");
  });

  it("slugify is idempotent", () => {
    const once = slugify("Ünïcödé — Test_Case");
    assert.equal(slugify(once), once);
  });

  it("truncate never exceeds maxLength and never splits surrogate pairs", () => {
    assert.equal(truncate("hello", 0), "");
    assert.equal(truncate("hello", 1), "…");
    assert.equal(truncate("hello world", 7), "hello…");
    assert.equal(truncate("hello", 5), "hello");
    assert.equal(truncate("😀😀😀😀", 3), "😀😀…");
    assert.equal(truncate("abcdef", 4, "..."), "a...");
    assert.equal(truncate("abcdef", 2, "..."), "..");
  });

  it("capitalizeWords understands Unicode letters", () => {
    assert.equal(capitalizeWords("élan vital"), "Élan Vital");
    assert.equal(capitalizeWords("hello-world foo_bar"), "Hello-World Foo_Bar");
    assert.equal(capitalizeWords("already Capitalized"), "Already Capitalized");
  });
});

describe("exponentialMovingAverage", () => {
  it("uses a constant alpha derived from the period", () => {
    const points = Array.from({ length: 20 }, (_, index) => ({ timestamp: index, value: index === 19 ? 100 : 0 }));
    const ema = exponentialMovingAverage(points, 9);
    const alpha = 2 / 10;
    assert.equal(ema.length, 20);
    assert.equal(ema[0].value, 0);
    assert.ok(Math.abs(ema[19].value - alpha * 100) < 1e-12);
  });

  it("converges towards a constant series", () => {
    const points = Array.from({ length: 200 }, (_, index) => ({ timestamp: index, value: index === 0 ? 0 : 50 }));
    const ema = exponentialMovingAverage(points, 5);
    assert.ok(Math.abs((ema.at(-1)?.value ?? 0) - 50) < 1e-9);
  });
});

describe("graph", () => {
  const edges = [
    { from: "a", to: "b" },
    { from: "c", to: "a" },
  ];

  it("BFS and DFS honour the directed option", () => {
    assert.deepEqual(breadthFirstSearch(edges, "a"), ["a", "b", "c"]);
    assert.deepEqual(breadthFirstSearch(edges, "a", { directed: true }), ["a", "b"]);
    assert.deepEqual(depthFirstSearch(edges, "a", { directed: true }), ["a", "b"]);
    assert.deepEqual(depthFirstSearch(edges, "c", { directed: true }), ["c", "a", "b"]);
  });

  it("BFS handles a large star graph in linear time", () => {
    const star = Array.from({ length: 100_000 }, (_, index) => ({ from: "center", to: `leaf-${index}` }));
    const started = Date.now();
    const order = breadthFirstSearch(star, "center");
    assert.equal(order.length, 100_001);
    assert.ok(Date.now() - started < 2_000);
  });

  it("maxFlow accumulates parallel edges and keeps identifiers intact", () => {
    const parallel = maxFlow(
      [
        { from: "s", to: "t", weight: 1 },
        { from: "s", to: "t", weight: 2 },
      ],
      "s",
      "t",
    );
    assert.equal(parallel.value, 3);

    const suspicious = maxFlow(
      [
        { from: "a=>b", to: "c", weight: 5 },
        { from: "a", to: "b=>c", weight: 1 },
      ],
      "a=>b",
      "c",
    );
    assert.equal(suspicious.value, 5);
    assert.equal(maxFlow([{ from: "s", to: "t" }], "s", "s").value, 0);
    assert.throws(() => maxFlow([{ from: "s", to: "t", weight: -1 }], "s", "t"), RangeError);
  });

  it("maxFlow solves a classic network", () => {
    const network = [
      { from: "s", to: "a", weight: 10 },
      { from: "s", to: "b", weight: 5 },
      { from: "a", to: "b", weight: 15 },
      { from: "a", to: "t", weight: 5 },
      { from: "b", to: "t", weight: 10 },
    ];
    assert.equal(maxFlow(network, "s", "t").value, 15);
  });

  it("detectDirectedCycle returns a closed path and survives deep chains", () => {
    assert.deepEqual(
      detectDirectedCycle([
        { from: 1, to: 2 },
        { from: 2, to: 3 },
        { from: 3, to: 1 },
      ]),
      [1, 2, 3, 1],
    );
    assert.equal(
      detectDirectedCycle([
        { from: 1, to: 2 },
        { from: 2, to: 3 },
      ]),
      null,
    );

    const chain = Array.from({ length: 50_000 }, (_, index) => ({ from: index, to: index + 1 }));
    assert.equal(detectDirectedCycle(chain), null);
    assert.deepEqual(detectDirectedCycle([...chain, { from: 50_000, to: 0 }])?.length, 50_002);
  });

  it("topologicalSort keeps first-appearance order and rejects cycles", () => {
    assert.deepEqual(
      topologicalSort([
        { from: "a", to: "b" },
        { from: "c", to: "b" },
      ]),
      ["a", "c", "b"],
    );
    assert.throws(
      () =>
        topologicalSort([
          { from: "a", to: "b" },
          { from: "b", to: "a" },
        ]),
      /acyclic/,
    );
  });

  it("dijkstraShortestPath is directional by default, supports undirected graphs and rejects negative weights", () => {
    const weighted = [
      { from: "a", to: "b", weight: 1 },
      { from: "b", to: "c", weight: 1 },
      { from: "a", to: "c", weight: 5 },
    ];
    assert.deepEqual(dijkstraShortestPath(weighted, "a", "c").path, ["a", "b", "c"]);
    assert.equal(dijkstraShortestPath(weighted, "c", "a").distance, Number.POSITIVE_INFINITY);
    assert.deepEqual(dijkstraShortestPath(weighted, "c", "a", { directed: false }).path, ["c", "b", "a"]);
    assert.throws(() => dijkstraShortestPath([{ from: "a", to: "b", weight: -1 }], "a", "b"), RangeError);
  });

  it("dijkstraShortestPath scales to a long chain", () => {
    const chain = Array.from({ length: 50_000 }, (_, index) => ({ from: index, to: index + 1, weight: 1 }));
    const started = Date.now();
    const result = dijkstraShortestPath(chain, 0, 50_000);
    assert.equal(result.distance, 50_000);
    assert.ok(Date.now() - started < 3_000);
  });
});

describe("quickSort", () => {
  it("sorts already sorted, reversed and duplicate-heavy inputs without overflowing", () => {
    const sorted = Array.from({ length: 50_000 }, (_, index) => index);
    assert.deepEqual(quickSort(sorted), sorted);
    assert.deepEqual(quickSort([...sorted].reverse()), sorted);
    assert.deepEqual(quickSort(Array.from({ length: 30_000 }, () => 7)).length, 30_000);
  });

  it("does not mutate its input and puts NaN last", () => {
    const input = [3, NaN, 1, 2];
    const output = quickSort(input);
    assert.deepEqual(input, [3, NaN, 1, 2]);
    assert.deepEqual(output, [1, 2, 3, NaN]);
  });

  it("honours a custom comparator", () => {
    assert.deepEqual(
      quickSort(["bb", "a", "ccc"], (left, right) => right.length - left.length),
      ["ccc", "bb", "a"],
    );
  });
});

describe("selection and windows", () => {
  it("topK returns everything when k exceeds the size and nothing for invalid k", () => {
    assert.deepEqual(topK([3, 1, 2], 10), [1, 2, 3]);
    assert.deepEqual(topK([3, 1, 2], 2, undefined, "desc"), [3, 2]);
    assert.deepEqual(topK([3, 1, 2], NaN), []);
    assert.deepEqual(topK([3, 1, 2], -1), []);
  });

  it("paginate and chunk neutralize NaN inputs", () => {
    const page = paginate([1, 2, 3], { page: NaN, pageSize: NaN });
    assert.equal(page.page, 1);
    assert.equal(page.pageSize, 1);
    assert.equal(page.totalPages, 3);
    assert.deepEqual(chunk([1, 2, 3], NaN), [[1], [2], [3]]);
    assert.deepEqual(slidingWindow([1, 2, 3], Number.POSITIVE_INFINITY), [[1], [2], [3]]);
  });

  it("rollingSum, movingAverage and windowDelta match the naive definitions", () => {
    const values = [100, 150, 200, 250, 175];
    assert.deepEqual(rollingSum(values, 2), [250, 350, 450, 425]);
    assert.deepEqual(movingAverage(values, 2), [125, 175, 225, 212.5]);
    assert.deepEqual(windowDelta(values, 3), [100, 100, -25]);
    assert.deepEqual(windowDelta(values, 1), [0, 0, 0, 0, 0]);
    assert.deepEqual(rollingSum([1, 2], 3), []);
  });

  it("window helpers stay linear for large inputs", () => {
    const values = Array.from({ length: 200_000 }, (_, index) => index % 17);
    const started = Date.now();
    assert.equal(rollingSum(values, 1_000).length, 199_001);
    assert.equal(movingAverage(values, 1_000).length, 199_001);
    assert.equal(windowDelta(values, 1_000).length, 199_001);
    assert.ok(Date.now() - started < 2_000);
  });

  it("bucketByInterval neutralizes NaN intervals", () => {
    const buckets = bucketByInterval(
      [
        { timestamp: 5, value: 1 },
        { timestamp: 6, value: 2 },
      ],
      NaN,
    );
    assert.deepEqual(
      buckets.map((bucket) => bucket.bucketStart),
      [5, 6],
    );
  });
});

describe("finance", () => {
  it("annualizedVolatility supports the sample estimator", () => {
    const points = [1, 2, 4, 2, 3].map((value, index) => ({ timestamp: index, value }));
    const population = annualizedVolatility(points, 252);
    const sample = annualizedVolatility(points, 252, { sample: true });
    assert.ok(sample > population);
    assert.equal(annualizedVolatility([{ timestamp: 0, value: 1 }], 252), 0);
    assert.equal(
      annualizedVolatility(
        [
          { timestamp: 0, value: 1 },
          { timestamp: 1, value: 2 },
        ],
        252,
        { sample: true },
      ),
      0,
    );
  });

  it("maxDrawdown rejects non-positive values and reports the deepest decline", () => {
    const result = maxDrawdown([100, 120, 60, 90].map((value, index) => ({ timestamp: index, value })));
    assert.equal(result?.drawdown, -0.5);
    assert.equal(result?.peak, 120);
    assert.throws(() => maxDrawdown([{ timestamp: 0, value: -10 }]), RangeError);
    assert.equal(maxDrawdown([]), null);
  });
});

describe("hashing", () => {
  it("murmurHash3 hashes UTF-8 bytes and matches reference vectors", () => {
    assert.equal(murmurHash3(""), 0);
    assert.equal(murmurHash3("", 1), 0x514e28b7);
    assert.equal(murmurHash3("test"), 0xba6bd213);
    assert.equal(murmurHash3("Hello, world!", 0), 0xc0363e43);
    assert.notEqual(murmurHash3("é"), murmurHash3("ǩ"));
  });
});

describe("validation", () => {
  it("isIsoDate rejects calendar overflow that Date.parse would normalize", () => {
    assert.equal(isIsoDate("2026-02-30"), false);
    assert.equal(isIsoDate("2026-04-31"), false);
    assert.equal(isIsoDate("2024-02-29"), true);
    assert.equal(isIsoDate("2023-02-29"), false);
    assert.equal(isIsoDate("2026-04-21T24:00:00Z"), false);
    assert.equal(isIsoDate("2026-04-21T14:30:00.000+05:30"), true);
    assert.equal(isIsoDate("2026-04-21T14:30:00+25:00"), false);
    assert.equal(isIsoDate("21/04/2026"), false);
  });
});

describe("resilience", () => {
  it("withTimeout rejects with TimeoutError and accepts thunks", async () => {
    await assert.rejects(
      () => withTimeout(() => new Promise<never>(() => undefined), 10, "never"),
      (error: unknown) =>
        error instanceof TimeoutError && error.name === "TimeoutError" && error.timeoutMs === 10 && error.label === "never",
    );
    assert.equal(await withTimeout(Promise.resolve("ok"), 50), "ok");
    assert.equal(await withTimeout(() => Promise.resolve("thunk"), 50), "thunk");
  });

  it("circuit breaker rejects with CircuitOpenError while open", async () => {
    const breaker = createCircuitBreaker({ failureThreshold: 1, resetTimeoutMs: 60_000 });
    await assert.rejects(() => breaker.call(() => Promise.reject(new Error("boom"))), /boom/);
    assert.equal(breaker.getState(), "open");
    await assert.rejects(
      () => breaker.call(() => Promise.resolve(1)),
      (error: unknown) => error instanceof CircuitOpenError,
    );
  });
});

describe("datetime", () => {
  it("toRelativeTime rounds before choosing the unit", () => {
    const almostAMinuteAgo = new Date(Date.now() - 59_600);
    const text = toRelativeTime(almostAMinuteAgo, "en");
    assert.doesNotMatch(text, /60 seconds/);
    assert.match(text, /minute/);
  });
});
