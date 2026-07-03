import { assertEquals, assertExists, assertStringIncludes } from "jsr:@std/assert@^1.0.8";

Deno.test("traits: loads runtime trait", async () => {
  const mod = await import("../barrits/traits/runtime-trait.ts");
  assertEquals(mod.denoRuntimeTrait.name, "runtime-deno");
});

Deno.test("traits: loads parse service trait", async () => {
  const mod = await import("../barrits/traits/parse-service.ts");
  assertEquals(mod.parseServiceTrait.name, "parse-service");
  assertEquals(mod.parseServiceTrait.provides, ["parse:crud"]);
});

Deno.test("traits: loads http handler trait", async () => {
  const mod = await import("../barrits/traits/http-handler.ts");
  assertEquals(mod.httpHandlerTrait.name, "http-handler");
  assertEquals(mod.httpHandlerTrait.tags?.includes("http-endpoint"), true);
});

Deno.test("traits: re-exports all traits from barrel", async () => {
  const mod = await import("../barrits/traits/index.ts");
  assertExists(mod.denoRuntimeTrait);
  assertExists(mod.parseServiceTrait);
  assertExists(mod.httpHandlerTrait);
});

Deno.test("parse-service: CRUD operations", async () => {
  const { parseServiceTrait } = await import("../barrits/traits/parse-service.ts");
  const { create: buildService } = parseServiceTrait;
  const svc = buildService();
  assertEquals(svc.list(), []);

  const user = svc.create({ username: "admin", role: "super" });
  assertEquals(user.username, "admin");
  assertEquals(svc.list().length, 1);

  const found = svc.get(user.objectId);
  assertEquals(found?.username, "admin");

  const removed = svc.remove(user.objectId);
  assertEquals(removed, true);
  assertEquals(svc.list().length, 0);
});

Deno.test("OpenAPI: generates schema from manifest", async () => {
  const { generateOpenApiSchema } = await import("../../../src/barrits/schema/openapi.ts");
  const manifest = {
    generatedAt: new Date().toISOString(),
    checksum: "sha256-test",
    projectRoot: Deno.cwd(),
    barritsDirectory: ".barrits",
    strategy: "current-directory",
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
      name: "http-handler",
      sourceFile: "traits/http-handler.ts",
      bindingName: "httpHandlerTrait",
      bindingKind: "const",
      requires: [],
      conflicts: [],
      state: [],
      consumes: [],
      provides: ["http:request"],
      tags: ["http-endpoint"],
      runtimes: ["deno"],
    }],
  };
  const schema = generateOpenApiSchema(manifest);
  assertEquals((schema as Record<string, unknown>).openapi, "3.1.0");
  assertExists((schema as Record<string, Record<string, unknown>>).paths["/http-handler"]);
});

Deno.test("IoC: registers and resolves services", async () => {
  const { BarritsIoCContainer } = await import("../../../src/barrits/ioc/index.ts");
  const manifest = {
    generatedAt: new Date().toISOString(),
    checksum: "sha256-test",
    projectRoot: Deno.cwd(),
    barritsDirectory: ".barrits",
    strategy: "current-directory",
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
  container.register("config", () => ({ port: 3000, env: "test" }));
  container.register("greeter", async (c) => {
    const config = await c.resolve<{ port: number; env: string }>("config");
    return { greet: (name: string) => `Hello ${name} (${config.env})` };
  });

  await container.wire();
  const greeter = await container.resolve<{ greet: (n: string) => string }>("greeter");
  assertEquals(greeter.greet("World"), "Hello World (test)");
});

Deno.test("showcase: main.ts runs successfully", async () => {
  const cmd = new Deno.Command(Deno.execPath(), {
    args: ["run", "-A", "main.ts"],
    stdout: "piped",
    stderr: "piped",
  });
  const { stdout, stderr, code } = await cmd.output();
  const output = new TextDecoder().decode(stdout);
  const errorOut = new TextDecoder().decode(stderr);
  assertEquals(code, 0, `exit ${code}: ${errorOut}`);
  assertStringIncludes(output, "Orchestration complete");
});
