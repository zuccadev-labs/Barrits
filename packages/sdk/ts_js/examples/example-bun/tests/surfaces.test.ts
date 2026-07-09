import { describe, expect, test } from "bun:test";
import { run } from "./helpers/setup";

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
