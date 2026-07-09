import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { run } from "./helpers/setup";

describe("example-nodejs: OpenAPI generation", () => {
  it("generates OpenAPI schema from manifest", () => {
    const output = run("scripts/openapi-demo.ts");
    const schema = JSON.parse(output);
    assert.equal(schema.openapi, "3.1.0");
    assert.ok(schema.info);
    assert.ok(schema.paths);
    assert.ok(schema.paths["/http-handler"]);
  });
});

describe("example-nodejs: IoC container", () => {
  it("registers and resolves services", () => {
    const output = run("scripts/ioc-demo.ts");
    assert.ok(output.includes("Config: port=3000, env=development"));
    assert.ok(output.includes("Users: Alice, Bob"));
  });
});

describe("example-nodejs: showcase", () => {
  it("runs algorithmic showcase", () => {
    const output = run("scripts/showcase.mjs");
    const data = JSON.parse(output);
    assert.ok(data.aggregate);
    assert.ok(data.collection);
    assert.ok(data.graph);
    assert.ok(data.search);
    assert.ok(data.selection);
    assert.ok(data.sort);
    assert.ok(data.timeseries);
    assert.ok(data.window);
  });
});

describe("example-nodejs: build runner", () => {
  it("runs build flow", () => {
    const output = run("scripts/build-runner.mjs");
    assert.ok(output);
  });
});
