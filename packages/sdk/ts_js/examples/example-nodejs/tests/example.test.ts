import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const rootDir = resolve(import.meta.dirname, "..");
const tsx = resolve(rootDir, "..", "..", "node_modules", "tsx", "dist", "cli.mjs");

const run = (script: string): string => {
  const result = spawnSync(process.execPath, [tsx, script], {
    cwd: rootDir,
    encoding: "utf-8",
    timeout: 15000,
  });
  if (result.status !== 0) {
    throw new Error(`exit ${result.status}: ${result.stderr || result.stdout}`);
  }
  return result.stdout;
};

const importTs = (relPath: string) =>
  import(pathToFileURL(resolve(rootDir, relPath)).href);

describe("example-nodejs: traits", () => {
  it("loads runtime trait", async () => {
    const mod = await importTs("barrits/traits/runtime-trait.ts");
    assert.ok(mod.nodeRuntimeTrait);
    assert.equal(mod.nodeRuntimeTrait.name, "runtime-node");
  });

  it("loads user service trait", async () => {
    const mod = await importTs("barrits/traits/user-service.ts");
    assert.ok(mod.userServiceTrait);
    assert.equal(mod.userServiceTrait.name, "user-service");
    assert.deepEqual(mod.userServiceTrait.provides, ["user:crud"]);
  });

  it("loads http handler trait", async () => {
    const mod = await importTs("barrits/traits/http-handler.ts");
    assert.ok(mod.httpHandlerTrait);
    assert.ok(mod.httpHandlerTrait.tags?.includes("http-endpoint"));
  });

  it("re-exports all traits from barrel", async () => {
    const mod = await importTs("barrits/traits/index.ts");
    assert.ok(mod.nodeRuntimeTrait);
    assert.ok(mod.userServiceTrait);
    assert.ok(mod.httpHandlerTrait);
  });
});

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
