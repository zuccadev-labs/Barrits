import { BarritsIoCContainer } from "@zuccadev-labs/barrits/src/barrits/ioc/index.ts";
import { generateOpenApiSchema } from "@zuccadev-labs/barrits/src/barrits/schema/openapi.ts";

// In a real application, you'd load the generated manifest here.
// For the sake of the example, we mock a discovery manifest.
const mockManifest = {
  generatedAt: new Date().toISOString(),
  checksum: "sha256-mocked-example",
  projectRoot: Deno.cwd(),
  barritsDirectory: ".barrits",
  strategy: "current-directory" as const,
  discoveryRoots: [],
  filesCount: 1,
  exportsCount: 1,
  publicExportsCount: 1,
  internalExportsCount: 0,
  barrelsCount: 0,
  domains: ["api"],
  traitDiagnostics: [],
  importActions: [],
  collisions: [],
  traitDescriptors: [
    {
      name: "getUser",
      sourceFile: "api/user.ts",
      bindingName: "getUser",
      bindingKind: "function" as const,
      requires: [],
      conflicts: [],
      state: ["MockDatabase"],
      consumes: [],
      provides: [],
      tags: ["http-endpoint"],
      runtimes: ["deno"],
      summary: "Fetches a user from the Database",
    }
  ],
};

const container = new BarritsIoCContainer(mockManifest);

// 1. Generic DB Primitive Hook (Implemented by the Consumer BaaS)
container.register("MockDatabase", () => {
  return { connectionString: "mock://database" };
});

console.log("🚀 Deno BaaS Core initialized.");

// 2. Auto-Wire dependencies based on the manifest
await container.wire();

// 3. Resolve the instance automatically
const db = await container.resolve<any>("MockDatabase");
console.log("✅ Database instance injected via Barrits IoC Container:", db);

// 4. Generate OpenAPI Schema dynamically
const schema = generateOpenApiSchema(mockManifest, {
  title: "Deno BaaS API",
  description: "Auto-generated from AST Traits",
});

console.log("📖 Generated OpenAPI v3.1 Schema:");
console.log(JSON.stringify(schema, null, 2));
