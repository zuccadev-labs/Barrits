/**
 * Tests for the Deno BaaS example.
 *
 * Validates all surfaces exercised by main.ts: trait contracts, barrel
 * re-exports, path builders, OpenAPI schema generation, IoC container
 * wiring, package declaration, and full process execution.
 *
 * @module
 */

import { assertEquals, assertExists, assertStringIncludes, assertObjectMatch } from "jsr:@std/assert@^1.0.8";

// ---------------------------------------------------------------------------
// 1. Trait descriptors
// ---------------------------------------------------------------------------

Deno.test("traits: runtimeTrait has correct shape", async () => {
  const mod = await import("../barrits/traits/runtime-trait.ts");
  assertEquals(mod.runtimeTrait.name, "runtime-deno-baas");
  assertEquals(mod.runtimeTrait.provides, ["runtime:deno"]);
  assertEquals(mod.runtimeTrait.state, ["RuntimeConfig"]);
  const instance = mod.runtimeTrait.initialize();
  assertEquals(instance.runtime, "deno");
});

Deno.test("traits: databaseServiceTrait has correct shape", async () => {
  const mod = await import("../barrits/traits/database-service.ts");
  assertEquals(mod.databaseServiceTrait.name, "database-service");
  assertEquals(mod.databaseServiceTrait.provides, ["database:connection"]);
  assertEquals(mod.databaseServiceTrait.consumes, ["runtime:deno"]);
  assertEquals(mod.databaseServiceTrait.state, ["Database"]);
  const instance = mod.databaseServiceTrait.initialize();
  assertEquals(instance.connected, false);
});

Deno.test("traits: httpEndpointTrait has correct shape", async () => {
  const mod = await import("../barrits/traits/http-endpoint.ts");
  assertEquals(mod.httpEndpointTrait.name, "users-api");
  assertEquals(mod.httpEndpointTrait.provides, ["http:api"]);
  assertEquals(mod.httpEndpointTrait.consumes, ["database:connection"]);
  assertEquals(mod.httpEndpointTrait.state, ["RequestHandler"]);
  assertExists(mod.httpEndpointTrait.tags);
  assertEquals(mod.httpEndpointTrait.tags.includes("http-endpoint"), true);
});

Deno.test("traits: httpEndpointTrait initializes correctly", async () => {
  const mod = await import("../barrits/traits/http-endpoint.ts");
  const instance = mod.httpEndpointTrait.initialize();
  assertEquals(instance.basePath, "/api/users");
  assertEquals(instance.methods.includes("GET"), true);
});

// ---------------------------------------------------------------------------
// 2. Barrel re-exports
// ---------------------------------------------------------------------------

Deno.test("traits: barrel re-exports all trait descriptors", async () => {
  const mod = await import("../barrits/traits/index.ts");
  assertExists(mod.runtimeTrait);
  assertExists(mod.databaseServiceTrait);
  assertExists(mod.httpEndpointTrait);
  assertEquals(mod.runtimeTrait.name, "runtime-deno-baas");
  assertEquals(mod.databaseServiceTrait.name, "database-service");
  assertEquals(mod.httpEndpointTrait.name, "users-api");
});

// ---------------------------------------------------------------------------
// 3. Path builders
// ---------------------------------------------------------------------------

Deno.test("barrits: buildBaaSPath constructs correct paths", async () => {
  const mod = await import("../barrits/index.ts");
  assertEquals(mod.buildBaaSPath("config", "database.json"), "baas/config/database.json");
  assertEquals(mod.buildBaaSPath("logs", "app.log"), "baas/logs/app.log");
  assertEquals(mod.buildBaaSPath(), "baas");
});

Deno.test("barrits: buildApiPath constructs correct paths", async () => {
  const mod = await import("../barrits/index.ts");
  assertEquals(mod.buildApiPath("users"), "/api/users");
  assertEquals(mod.buildApiPath("users", "550e8400"), "/api/users/550e8400");
  assertEquals(mod.buildApiPath("orders", "abc-123"), "/api/orders/abc-123");
});

// ---------------------------------------------------------------------------
// 4. OpenAPI schema generation
// ---------------------------------------------------------------------------

Deno.test("OpenAPI: generates schema from build manifest", async () => {
  const { generateOpenApiSchema } = await import("../../../src/barrits/schema/openapi.ts");

  const manifest = {
    generatedAt: new Date().toISOString(),
    checksum: "sha256-test",
    projectRoot: Deno.cwd(),
    barritsDirectory: ".barrits",
    strategy: "current-directory" as const,
    discoveryRoots: [],
    filesCount: 1,
    exportsCount: 1,
    publicExportsCount: 1,
    internalExportsCount: 0,
    barrelsCount: 1,
    domains: ["api"],
    traitDiagnostics: [],
    importActions: [],
    collisions: [],
    traitDescriptors: [{
      name: "users-api",
      sourceFile: "barrits/traits/http-endpoint.ts",
      bindingName: "httpEndpointTrait",
      bindingKind: "variable" as const,
      requires: [],
      conflicts: [],
      state: ["RequestHandler"],
      consumes: ["database:connection"],
      provides: ["http:api"],
      tags: ["http-endpoint"],
      runtimes: ["deno"],
      summary: "HTTP users API endpoint discoverable for OpenAPI schema",
    }],
  };

  const schema = generateOpenApiSchema(manifest, {
    title: "Deno BaaS API",
    version: "1.0.0",
  }) as Record<string, unknown>;

  assertEquals(schema.openapi, "3.1.0");
  const info = schema.info as Record<string, unknown>;
  assertEquals(info.title, "Deno BaaS API");
  assertEquals(info.version, "1.0.0");

  const paths = schema.paths as Record<string, unknown>;
  assertExists(paths["/users-api"], "Expected path /users-api to exist");
  assertExists((paths["/users-api"] as Record<string, unknown>).post);
});

// ---------------------------------------------------------------------------
// 5. IoC container
// ---------------------------------------------------------------------------

Deno.test("IoC: registers and resolves services synchronously", async () => {
  const { BarritsIoCContainer } = await import("../../../src/barrits/ioc/index.ts");

  const manifest = {
    generatedAt: new Date().toISOString(),
    checksum: "sha256-test",
    projectRoot: Deno.cwd(),
    barritsDirectory: ".barrits",
    strategy: "current-directory" as const,
    discoveryRoots: [],
    filesCount: 0,
    exportsCount: 0,
    publicExportsCount: 0,
    internalExportsCount: 0,
    barrelsCount: 0,
    domains: [],
    traitDiagnostics: [],
    importActions: [],
    collisions: [],
    traitDescriptors: [],
  };

  const container = new BarritsIoCContainer(manifest);
  container.register("RuntimeConfig", () => ({
    runtime: "deno",
    version: "1.0.0",
    unstableKv: true,
  }));
  container.register("Database", () => ({
    connectionString: "deno-kv://test",
    vendor: "DenoKV",
    connected: false,
  }));

  await container.wire();
  const config = await container.resolve<{ runtime: string }>("RuntimeConfig");
  assertEquals(config.runtime, "deno");

  const db = await container.resolve<{ connected: boolean }>("Database");
  assertEquals(db.connected, false);
});

Deno.test("IoC: resolves dependent services using container references", async () => {
  const { BarritsIoCContainer } = await import("../../../src/barrits/ioc/index.ts");

  const container = new BarritsIoCContainer();
  container.register("config", () => ({ port: 8080, env: "baas" }));
  container.register("handler", async (c) => {
    const config = await c.resolve<{ port: number; env: string }>("config");
    return { basePath: "/api/users", port: config.port, env: config.env };
  });

  const handler = await container.resolve<{ basePath: string; port: number }>("handler");
  assertEquals(handler.basePath, "/api/users");
  assertEquals(handler.port, 8080);
});

Deno.test("IoC: throws error for unresolved dependency", async () => {
  const { BarritsIoCContainer } = await import("../../../src/barrits/ioc/index.ts");
  const container = new BarritsIoCContainer();

  await assertRejects(
    () => container.resolve("NonExistent"),
    Error,
    "Unresolved dependency",
  );
});

// ---------------------------------------------------------------------------
// 6. Package declaration
// ---------------------------------------------------------------------------

Deno.test("package: defineBarritsPackage returns resolved options", async () => {
  const { defineBarritsPackage } = await import("../../../dist/adapters/deno/mod.js");

  const pkg = defineBarritsPackage({
    runtime: "deno",
    watch: "manual",
    discoveryRoots: ["barrits"],
  });

  assertExists(pkg);
  assertEquals(pkg.runtime, "deno");
  assertEquals(pkg.watch, "manual");
});

// ---------------------------------------------------------------------------
// 7. Full process execution
// ---------------------------------------------------------------------------

Deno.test("main: runs successfully and prints initialization summary", async () => {
  const cmd = new Deno.Command(Deno.execPath(), {
    args: ["run", "--unstable-kv", "-A", "main.ts"],
    stdout: "piped",
    stderr: "piped",
  });
  const { stdout, stderr, code } = await cmd.output();
  const output = new TextDecoder().decode(stdout);
  const errorOut = new TextDecoder().decode(stderr);

  assertEquals(code, 0, `exit ${code}: ${errorOut}`);
  assertStringIncludes(output, "Deno BaaS Core initialized successfully");
  assertStringIncludes(output, "Package Configuration");
  assertStringIncludes(output, "Build Manifest");
  assertStringIncludes(output, "IoC Dependency Injection");
  assertStringIncludes(output, "OpenAPI Schema Generation");
  assertStringIncludes(output, "Operational Paths");
  assertStringIncludes(output, "Trait Inventory");
});

// ---------------------------------------------------------------------------
// Helper to avoid import issues with assertRejects
// ---------------------------------------------------------------------------

async function assertRejects(
  fn: () => Promise<unknown>,
  expectedClass: new (...args: never[]) => Error,
  expectedMessage?: string,
): Promise<void> {
  let threw = false;
  try {
    await fn();
  } catch (err) {
    threw = true;
    if (err instanceof expectedClass) {
      if (expectedMessage && err.message.includes(expectedMessage)) {
        // Ok
      } else if (expectedMessage) {
        throw new Error(
          `Expected error message to include "${expectedMessage}" but got "${err.message}"`,
        );
      }
    } else {
      throw new Error(`Expected ${expectedClass.name} but got ${(err as Error).constructor.name}`);
    }
  }
  if (!threw) {
    throw new Error(`Expected function to throw ${expectedClass.name}`);
  }
}
