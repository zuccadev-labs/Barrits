import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const rootDir = resolve(import.meta.dirname, "..");

const run = (script: string): string => {
  const result = spawnSync("bun", ["run", script], {
    cwd: rootDir,
    encoding: "utf-8",
    timeout: 15000,
  });
  expect(result.status).toBe(0);
  return result.stdout;
};

describe("traits", () => {
  test("loads runtime trait", async () => {
    const mod = await import("../barrits/traits/runtime-trait.ts");
    expect(mod.bunRuntimeTrait).toBeDefined();
    expect(mod.bunRuntimeTrait.name).toBe("runtime-bun");
  });
  test("loads queue service trait", async () => {
    const mod = await import("../barrits/traits/queue-service.ts");
    expect(mod.queueServiceTrait).toBeDefined();
    expect(mod.queueServiceTrait.name).toBe("queue-service");
    expect(mod.queueServiceTrait.provides).toEqual(["queue:crud"]);
  });
  test("loads http handler trait", async () => {
    const mod = await import("../barrits/traits/http-handler.ts");
    expect(mod.httpHandlerTrait).toBeDefined();
    expect(mod.httpHandlerTrait.tags).toContain("http-endpoint");
  });
  test("re-exports all traits from barrel", async () => {
    const mod = await import("../barrits/traits/index.ts");
    expect(mod.bunRuntimeTrait).toBeDefined();
    expect(mod.queueServiceTrait).toBeDefined();
    expect(mod.httpHandlerTrait).toBeDefined();
  });
});

describe("OpenAPI generation", () => {
  test("generates OpenAPI schema from manifest", () => {
    const output = run("scripts/openapi-demo.ts");
    const schema = JSON.parse(output);
    expect(schema.openapi).toBe("3.1.0");
    expect(schema.info).toBeDefined();
    expect(schema.paths).toBeDefined();
    expect(schema.paths["/http-handler"]).toBeDefined();
  });
});

describe("IoC container", () => {
  test("registers and resolves services", () => {
    const output = run("scripts/ioc-demo.ts");
    expect(output).toContain("Config: port=3000, env=development");
    expect(output).toContain("Users: Alice, Bob");
  });
});

describe("CLI pipeline", () => {
  test("parses manifest and creates summary", () => {
    const output = run("scripts/cli-workflow.ts");
    expect(output).toContain("Checksum:");
    expect(output).toContain("Traits discovered:");
  });
});

describe("Build manifest", () => {
  test("runs build flow", () => {
    const output = run("scripts/build-runner.mjs");
    expect(output).toBeDefined();
  });
});

describe("Validation", () => {
  test("validates Bun user schema", () => {
    const output = run("scripts/barrits-validation.ts");
    expect(output).toContain("Valid user:");
  });
});

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

describe("main.ts entrypoint", () => {
  test("runs successfully", () => {
    const output = run("src/main.ts");
    expect(output).toBeDefined();
  });
});
