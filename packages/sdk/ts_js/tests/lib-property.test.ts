import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fc from "fast-check";

import {
  breadthFirstSearch,
  chunk,
  depthFirstSearch,
  dijkstraShortestPath,
  maxBy,
  minBy,
  murmurHash3,
  paginate,
  quickSort,
  rollingSum,
  slugify,
  topK,
  truncate,
  windowDelta,
} from "../src/barrits_lib/logic";
import { defaultCompare } from "../src/barrits_lib/logic/algorithms/internal/compare";

const finiteDouble = fc.double({ noNaN: true, noDefaultInfinity: true });
const anyDouble = fc.double({ noDefaultInfinity: true });

describe("property: defaultCompare", () => {
  it("is antisymmetric and consistent with equality for every double, NaN included", () => {
    fc.assert(
      fc.property(anyDouble, anyDouble, (left, right) => {
        const forward = Math.sign(defaultCompare(left, right));
        const backward = Math.sign(defaultCompare(right, left));
        assert.equal(forward + backward, 0);
        if (forward === 0) {
          assert.ok(Object.is(left, right) || left === right || (Number.isNaN(left) && Number.isNaN(right)));
        }
      }),
    );
  });

  it("is transitive", () => {
    fc.assert(
      fc.property(anyDouble, anyDouble, anyDouble, (a, b, c) => {
        if (defaultCompare(a, b) <= 0 && defaultCompare(b, c) <= 0) {
          assert.ok(defaultCompare(a, c) <= 0);
        }
      }),
    );
  });
});

describe("property: sorting and selection", () => {
  it("quickSort agrees with Array.prototype.sort under the same comparator", () => {
    fc.assert(
      fc.property(fc.array(anyDouble, { maxLength: 300 }), (values) => {
        assert.deepEqual(quickSort(values), [...values].sort(defaultCompare));
      }),
    );
  });

  it("topK agrees with sort + slice in both directions", () => {
    fc.assert(
      fc.property(fc.array(fc.integer(), { maxLength: 200 }), fc.integer({ min: 0, max: 250 }), (values, k) => {
        const ascending = [...values].sort((a, b) => a - b);
        assert.deepEqual(topK(values, k), ascending.slice(0, k));
        assert.deepEqual(topK(values, k, undefined, "desc"), [...ascending].reverse().slice(0, k));
      }),
    );
  });

  it("minBy / maxBy agree with a full sort", () => {
    fc.assert(
      fc.property(fc.array(finiteDouble, { minLength: 1, maxLength: 200 }), (values) => {
        const sorted = [...values].sort((a, b) => a - b);
        assert.equal(
          minBy(values, (value) => value),
          sorted[0],
        );
        assert.equal(
          maxBy(values, (value) => value),
          sorted[sorted.length - 1],
        );
      }),
    );
  });
});

describe("property: strings", () => {
  it("slugify yields URL-safe ASCII and is idempotent", () => {
    fc.assert(
      fc.property(fc.string({ unit: "grapheme", maxLength: 80 }), (input) => {
        const slug = slugify(input);
        assert.match(slug, /^[a-z0-9]*(?:-[a-z0-9]+)*$/);
        assert.equal(slugify(slug), slug);
      }),
    );
  });

  it("truncate never exceeds the limit measured in code points", () => {
    fc.assert(
      fc.property(fc.string({ unit: "grapheme", maxLength: 80 }), fc.integer({ min: 0, max: 100 }), (input, limit) => {
        const output = truncate(input, limit);
        assert.ok(Array.from(output).length <= Math.max(limit, 0));
        if (Array.from(input).length <= limit) {
          assert.equal(output, input);
        }
      }),
    );
  });
});

describe("property: collections and windows", () => {
  it("chunk preserves every element and only the last chunk may be short", () => {
    fc.assert(
      fc.property(fc.array(fc.integer(), { maxLength: 100 }), fc.integer({ min: 1, max: 20 }), (values, size) => {
        const chunks = chunk(values, size);
        assert.deepEqual(chunks.flat(), values);
        chunks.slice(0, -1).forEach((part) => assert.equal(part.length, size));
      }),
    );
  });

  it("paginate covers the collection exactly once", () => {
    fc.assert(
      fc.property(fc.array(fc.integer(), { maxLength: 60 }), fc.integer({ min: 1, max: 10 }), (values, pageSize) => {
        const first = paginate(values, { page: 1, pageSize });
        const pages = Array.from({ length: first.totalPages }, (_, index) => paginate(values, { page: index + 1, pageSize }));
        assert.deepEqual(
          pages.flatMap((page) => page.items),
          values,
        );
        assert.equal(pages.at(-1)?.hasNextPage, false);
        assert.equal(pages[0].hasPreviousPage, false);
      }),
    );
  });

  it("rollingSum and windowDelta match their naive definitions on integers", () => {
    fc.assert(
      fc.property(fc.array(fc.integer({ min: -1000, max: 1000 }), { maxLength: 80 }), fc.integer({ min: 1, max: 10 }), (values, size) => {
        const naiveSums: number[] = [];
        const naiveDeltas: number[] = [];
        for (let index = 0; index + size <= values.length; index += 1) {
          const window = values.slice(index, index + size);
          naiveSums.push(window.reduce((total, value) => total + value, 0));
          naiveDeltas.push(window[window.length - 1] - window[0]);
        }
        assert.deepEqual(rollingSum(values, size), naiveSums);
        assert.deepEqual(windowDelta(values, size), naiveDeltas);
      }),
    );
  });
});

describe("property: hashing", () => {
  it("murmurHash3 is deterministic and bounded to 32 bits", () => {
    fc.assert(
      fc.property(fc.string({ unit: "grapheme", maxLength: 64 }), fc.integer({ min: 0, max: 0xffffffff }), (input, seed) => {
        const hash = murmurHash3(input, seed);
        assert.equal(hash, murmurHash3(input, seed));
        assert.ok(Number.isInteger(hash) && hash >= 0 && hash <= 0xffffffff);
      }),
    );
  });
});

describe("property: graphs", () => {
  const edgeArbitrary = fc.record({
    from: fc.integer({ min: 0, max: 7 }),
    to: fc.integer({ min: 0, max: 7 }),
    weight: fc.integer({ min: 1, max: 9 }),
  });

  it("BFS and DFS reach the same node set from the same start", () => {
    fc.assert(
      fc.property(fc.array(edgeArbitrary, { maxLength: 24 }), fc.integer({ min: 0, max: 7 }), fc.boolean(), (edges, start, directed) => {
        const bfs = breadthFirstSearch(edges, start, { directed });
        const dfs = depthFirstSearch(edges, start, { directed });
        assert.equal(bfs[0], start);
        assert.deepEqual(
          [...bfs].sort((a, b) => a - b),
          [...dfs].sort((a, b) => a - b),
        );
        assert.equal(new Set(bfs).size, bfs.length);
      }),
    );
  });

  it("dijkstraShortestPath agrees with Bellman-Ford on small directed graphs", () => {
    fc.assert(
      fc.property(
        fc.array(edgeArbitrary, { maxLength: 24 }),
        fc.integer({ min: 0, max: 7 }),
        fc.integer({ min: 0, max: 7 }),
        (edges, start, target) => {
          const distances = new Map<number, number>([[start, 0]]);
          for (let iteration = 0; iteration < 8; iteration += 1) {
            for (const edge of edges) {
              const fromDistance = distances.get(edge.from);
              if (fromDistance === undefined) continue;
              const candidate = fromDistance + edge.weight;
              if (candidate < (distances.get(edge.to) ?? Number.POSITIVE_INFINITY)) {
                distances.set(edge.to, candidate);
              }
            }
          }
          const expected = distances.get(target) ?? Number.POSITIVE_INFINITY;
          const result = dijkstraShortestPath(edges, start, target);
          assert.equal(result.distance, expected);
          if (expected !== Number.POSITIVE_INFINITY) {
            assert.equal(result.path[0], start);
            assert.equal(result.path[result.path.length - 1], target);
          }
        },
      ),
    );
  });
});
