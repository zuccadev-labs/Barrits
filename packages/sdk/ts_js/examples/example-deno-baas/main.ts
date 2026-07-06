/**
 * @module
 * Barrits SDK — Deno BaaS Core Example
 *
 * This entrypoint demonstrates the Barrits SDK as the foundation for a
 * Backend-as-a-Service (BaaS) architecture using Deno. It exercises:
 * - IoC container with dependency injection via build manifest
 * - OpenAPI v3.1 schema auto-generation from trait descriptors
 * - Trait discovery with typed contract descriptors
 * - Operational path construction via barrits orchestration layer
 */

import {
  defineBarritsPackage,
} from "../../dist/adapters/deno/mod.js";
import { BarritsIoCContainer } from "../../src/barrits/ioc/index.ts";
import { generateOpenApiSchema } from "../../src/barrits/schema/openapi.ts";
import { buildBaaSPath, buildApiPath } from "./barrits/index.ts";
import {
  runtimeTrait,
  databaseServiceTrait,
  httpEndpointTrait,
} from "./barrits/traits/index.ts";

console.log("═══════════════════════════════════════════════════════════════");
console.log("  Barrits SDK — Deno BaaS Core");
console.log("═══════════════════════════════════════════════════════════════\n");

// ---------------------------------------------------------------------------
// 1. PACKAGE DECLARATION
//    The consumer declares its runtime identity and orchestration policy.
// ---------------------------------------------------------------------------

const barritsPackage = defineBarritsPackage({
  runtime: "deno",
  watch: "manual",
  discoveryRoots: ["barrits"],
});

console.log("[1] Package Configuration:");
console.log(JSON.stringify(barritsPackage, null, 2));

// ---------------------------------------------------------------------------
// 2. BUILD MANIFEST CONSTRUCTION
//    In a real BaaS, the manifest is generated at build time by the CLI.
//    Here we construct it programmatically from the trait descriptors to
//    demonstrate the IoC wiring and OpenAPI generation workflow.
// ---------------------------------------------------------------------------

const traitDescriptors = [
  {
    name: runtimeTrait.name,
    sourceFile: "barrits/traits/runtime-trait.ts",
    bindingName: "runtimeTrait",
    bindingKind: "variable" as const,
    requires: [],
    conflicts: [],
    state: runtimeTrait.state,
    consumes: [],
    provides: runtimeTrait.provides,
    tags: [],
    runtimes: ["deno"],
    summary: "Declares the Deno runtime capability for the BaaS",
  },
  {
    name: databaseServiceTrait.name,
    sourceFile: "barrits/traits/database-service.ts",
    bindingName: "databaseServiceTrait",
    bindingKind: "variable" as const,
    requires: [],
    conflicts: [],
    state: databaseServiceTrait.state,
    consumes: databaseServiceTrait.consumes,
    provides: databaseServiceTrait.provides,
    tags: [],
    runtimes: ["deno"],
    summary: "Declares a generic database capability for the BaaS",
  },
  {
    name: httpEndpointTrait.name,
    sourceFile: "barrits/traits/http-endpoint.ts",
    bindingName: "httpEndpointTrait",
    bindingKind: "variable" as const,
    requires: [],
    conflicts: [],
    state: httpEndpointTrait.state,
    consumes: httpEndpointTrait.consumes,
    provides: httpEndpointTrait.provides,
    tags: httpEndpointTrait.tags,
    runtimes: ["deno"],
    summary: "HTTP users API endpoint discoverable for OpenAPI schema",
  },
];

const buildManifest = {
  generatedAt: new Date().toISOString(),
  checksum: "sha256-mocked-example",
  projectRoot: Deno.cwd(),
  barritsDirectory: ".barrits",
  strategy: "current-directory" as const,
  discoveryRoots: ["barrits"],
  filesCount: traitDescriptors.length,
  exportsCount: traitDescriptors.length,
  publicExportsCount: traitDescriptors.length,
  internalExportsCount: 0,
  barrelsCount: 1,
  domains: ["baas", "api"],
  traitDiagnostics: [],
  importActions: [],
  collisions: [],
  traitDescriptors,
};

console.log("\n[2] Build Manifest:");
console.log(`    Traits discovered: ${buildManifest.traitDescriptors.length}`);
console.log(`    Domains: ${buildManifest.domains.join(", ")}`);

// ---------------------------------------------------------------------------
// 3. IoC DEPENDENCY INJECTION
//    The BarritsIoCContainer wires dependencies based on the manifest.
//    The BaaS consumer registers concrete implementations for each state
//    declared by the traits.
// ---------------------------------------------------------------------------

console.log("\n[3] IoC Dependency Injection:");

const container = new BarritsIoCContainer(buildManifest);

// Register concrete implementations for the BaaS
container.register("RuntimeConfig", () => ({
  runtime: "deno",
  version: Deno.version.deno,
  unstableKv: true,
}));

container.register("Database", () => ({
  connectionString: "deno-kv://baas-default",
  vendor: "DenoKV",
  connected: true,
  async query(query: string) {
    console.log(`    [DB] Executing: ${query}`);
    return { rows: [], affected: 0 };
  },
}));

container.register("RequestHandler", () => ({
  basePath: "/api/users",
  async handle(request: Request) {
    const url = new URL(request.url);
    console.log(`    [API] ${request.method} ${url.pathname}`);
    return new Response(JSON.stringify({ status: "ok" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  },
}));

await container.wire();

// Resolve and verify each dependency
const runtimeConfig = await container.resolve("RuntimeConfig");
console.log(`    Runtime config resolved: ${JSON.stringify(runtimeConfig)}`);

const database = await container.resolve("Database");
console.log(`    Database resolved: ${(database as any).connectionString}`);
await (database as any).query("SELECT 1");

const requestHandler = await container.resolve("RequestHandler");
console.log(`    RequestHandler resolved: ${(requestHandler as any).basePath}`);

// ---------------------------------------------------------------------------
// 4. OPENAPI SCHEMA GENERATION
//    Generates an OpenAPI v3.1 schema from the trait descriptors tagged with
//    "http-endpoint". This happens at build time in production, but is
//    demonstrated here at runtime for clarity.
// ---------------------------------------------------------------------------

console.log("\n[4] OpenAPI Schema Generation:");

const schema = generateOpenApiSchema(buildManifest, {
  title: "Deno BaaS API",
  description: "Auto-generated OpenAPI v3.1 schema from Barrits trait descriptors",
  version: "1.0.0",
});

const schemaInfo = schema.info as { title?: string; version?: string } | undefined;
console.log(`    Schema title: ${schemaInfo?.title ?? "N/A"}`);
console.log(`    Schema version: ${schemaInfo?.version ?? "N/A"}`);
const schemaPaths = schema.paths as Record<string, unknown> | undefined;
console.log(`    Paths defined: ${Object.keys(schemaPaths ?? {}).length}`);
console.log(`    OpenAPI version: ${schema.openapi}`);

// ---------------------------------------------------------------------------
// 5. OPERATIONAL PATHS
//    Convenience path builders from the barrits orchestration layer.
// ---------------------------------------------------------------------------

console.log("\n[5] Operational Paths:");
console.log(`    BaaS config path: ${buildBaaSPath("config", "database.json")}`);
console.log(`    API users path:   ${buildApiPath("users")}`);
console.log(`    API user by ID:   ${buildApiPath("users", "550e8400")}`);

// ---------------------------------------------------------------------------
// 6. TRAIT INVENTORY
//    Display all traits and their capabilities.
// ---------------------------------------------------------------------------

console.log("\n[6] Trait Inventory:");
for (const trait of traitDescriptors) {
  console.log(`    - ${trait.name}`);
  console.log(`      Provides: [${trait.provides.join(", ")}]`);
  console.log(`      Consumes: [${trait.consumes.join(", ")}]`);
  console.log(`      State:    [${trait.state.join(", ")}]`);
  if (trait.tags.length > 0) {
    console.log(`      Tags:     [${trait.tags.join(", ")}]`);
  }
}

console.log("\n═══════════════════════════════════════════════════════════════");
console.log("  Deno BaaS Core initialized successfully.");
console.log("═══════════════════════════════════════════════════════════════\n");
