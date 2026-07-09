import { describe, expect, test } from "bun:test";
import { run } from "./helpers/setup";

describe("Resilience", () => {
  test("runs resilience examples", () => {
    const output = run("scripts/showcase.mjs");
    const data = JSON.parse(output);
    expect(data.resilience).toBeDefined();
  });
});

describe("Hashing", () => {
  test("runs hashing examples", () => {
    const output = run("scripts/showcase.mjs");
    const data = JSON.parse(output);
    expect(data.hashing).toBeDefined();
  });
});

describe("Datetime", () => {
  test("runs datetime examples", () => {
    const output = run("scripts/showcase.mjs");
    const data = JSON.parse(output);
    expect(data.datetime).toBeDefined();
  });
});

describe("Showcase", () => {
  test("runs full algorithmic showcase with all 10 families", () => {
    const output = run("scripts/showcase.mjs");
    const data = JSON.parse(output);
    expect(data.aggregate).toBeDefined();
    expect(data.collection).toBeDefined();
    expect(data.graph).toBeDefined();
    expect(data.search).toBeDefined();
    expect(data.selection).toBeDefined();
    expect(data.sort).toBeDefined();
    expect(data.timeseries).toBeDefined();
    expect(data.window).toBeDefined();
    expect(data.resilience).toBeDefined();
    expect(data.hashing).toBeDefined();
    expect(data.datetime).toBeDefined();
  });
});
