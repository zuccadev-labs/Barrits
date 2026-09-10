import { describe, it } from "node:test";
import assert from "node:assert/strict";

import * as library from "../src/barrits_lib/logic";
import {
  logic,
  logicFamilies,
  aggregateAlgorithms,
  algorithms,
  arithmetic,
  binarySearch,
  chunk,
  comparators,
  groupBy,
  isEmail,
  maxBy,
  minBy,
  movingAverage,
  quickSort,
  restar,
  slugify,
  sumar,
  topologicalSort,
} from "../src/barrits/logic";

const libraryRuntimeExports = Object.keys(library).filter((key) => key !== "logicFamilies").sort();

describe("logic namespace object (barrits.logic)", () => {
  it("is an object", () => {
    assert.equal(typeof logic, "object");
    assert.notEqual(logic, null);
  });

  it("mirrors every runtime export of barrits_lib/logic and nothing else", () => {
    assert.deepEqual(Object.keys(logic).sort(), libraryRuntimeExports);
  });

  for (const key of libraryRuntimeExports) {
    it(`references the same ${key} as the standard library`, () => {
      assert.equal((logic as Record<string, unknown>)[key], (library as Record<string, unknown>)[key]);
    });
  }

  it("exposes the string, validation and comparator families that were previously unreachable", () => {
    assert.equal(logic.slugify, slugify);
    assert.equal(logic.isEmail, isEmail);
    assert.equal(logic.comparators, comparators);
    assert.equal(typeof logic.stringAlgorithms, "object");
    assert.equal(typeof logic.validationAlgorithms, "object");
    assert.equal(typeof logic.hashingAlgorithms, "object");
    assert.equal(typeof logic.datetimeAlgorithms, "object");
    assert.equal(typeof logic.resilienceAlgorithms, "object");
    assert.equal(typeof logic.createOrderComparator, "function");
  });

  it("does not nest the grouped families object inside the flat namespace", () => {
    assert.equal("logicFamilies" in logic, false);
    assert.equal(logicFamilies.algorithms, algorithms);
    assert.equal(logicFamilies.strings.slugify, slugify);
  });
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
