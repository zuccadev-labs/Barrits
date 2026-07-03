import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  logic,
  aggregateAlgorithms,
  algorithms,
  arithmetic,
  binarySearch,
  chunk,
  groupBy,
  maxBy,
  minBy,
  movingAverage,
  quickSort,
  restar,
  sumar,
  topologicalSort,
} from "../src/barrits/logic";

const EXPECTED_PROPERTIES = [
  "aggregateAlgorithms",
  "algorithms",
  "averageBy",
  "annualizedVolatility",
  "breadthFirstSearch",
  "buildAdjacencyList",
  "bucketByInterval",
  "maxBy",
  "minBy",
  "movingAverage",
  "movingAverageSeries",
  "arithmetic",
  "binarySearch",
  "chunk",
  "collectionAlgorithms",
  "depthFirstSearch",
  "detectDirectedCycle",
  "detectTimeSeriesGaps",
  "differenceSeries",
  "dijkstraShortestPath",
  "exponentialMovingAverage",
  "findSortedRange",
  "graphAlgorithms",
  "histogramBy",
  "maxDrawdown",
  "maxFlow",
  "minimumSpanningTree",
  "resampleSeries",
  "returnsSeries",
  "rollingSum",
  "groupBy",
  "indexBy",
  "insertSorted",
  "linearSearch",
  "slidingWindow",
  "sortTimeSeries",
  "lowerBound",
  "orderBy",
  "sumBy",
  "timeSeriesAlgorithms",
  "topologicalSort",
  "paginate",
  "partitionBy",
  "quickSort",
  "windowAlgorithms",
  "windowDelta",
  "rankBy",
  "sumar",
  "restar",
  "searchAlgorithms",
  "selectionAlgorithms",
  "sortAlgorithms",
  "stableSortBy",
  "topK",
  "uniqueBy",
  "upperBound",
];

describe("logic namespace object (barrits.logic)", () => {
  it("is an object", () => {
    assert.equal(typeof logic, "object");
    assert.notEqual(logic, null);
  });

  it("has the correct number of properties", () => {
    assert.equal(Object.keys(logic).length, EXPECTED_PROPERTIES.length);
  });

  for (const prop of EXPECTED_PROPERTIES) {
    it(`has ${prop} property`, () => {
      const key = prop as keyof typeof logic;
      assert.ok(key in logic);
      assert.notEqual(logic[key], undefined);
    });
  }
});

describe("logic sampled function references", () => {
  it("references the same aggregateAlgorithms", () => {
    assert.equal(logic.aggregateAlgorithms, aggregateAlgorithms);
  });

  it("references the same algorithms", () => {
    assert.equal(logic.algorithms, algorithms);
  });

  it("references the same arithmetic", () => {
    assert.equal(logic.arithmetic, arithmetic);
  });

  it("references the same binarySearch", () => {
    assert.equal(logic.binarySearch, binarySearch);
  });

  it("references the same chunk", () => {
    assert.equal(logic.chunk, chunk);
  });

  it("references the same groupBy", () => {
    assert.equal(logic.groupBy, groupBy);
  });

  it("references the same maxBy", () => {
    assert.equal(logic.maxBy, maxBy);
  });

  it("references the same minBy", () => {
    assert.equal(logic.minBy, minBy);
  });

  it("references the same movingAverage", () => {
    assert.equal(logic.movingAverage, movingAverage);
  });

  it("references the same quickSort", () => {
    assert.equal(logic.quickSort, quickSort);
  });

  it("references the same restar", () => {
    assert.equal(logic.restar, restar);
  });

  it("references the same sumar", () => {
    assert.equal(logic.sumar, sumar);
  });

  it("references the same topologicalSort", () => {
    assert.equal(logic.topologicalSort, topologicalSort);
  });
});
