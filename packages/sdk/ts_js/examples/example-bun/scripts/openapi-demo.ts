import { generateOpenApiSchema } from "@zuccadev-labs/barrits/schema/openapi";
import type { BarritsBuildManifest } from "@zuccadev-labs/barrits";

const mockManifest: BarritsBuildManifest = {
  generatedAt: new Date().toISOString(),
  checksum: "sha256-mock",
  projectRoot: process.cwd(),
  barritsDirectory: ".barrits",
  strategy: "current-directory",
  discoveryRoots: [],
  filesCount: 3,
  exportsCount: 3,
  publicExportsCount: 3,
  internalExportsCount: 0,
  barrelsCount: 1,
  domains: ["api"],
  traitDiagnostics: [],
  importActions: [],
  collisions: [],
  traitDescriptors: [
    {
      name: "http-handler",
      sourceFile: "barrits/traits/http-handler.ts",
      bindingName: "httpHandlerTrait",
      bindingKind: "const",
      requires: [],
      conflicts: [],
      state: [],
      consumes: [],
      provides: ["http:request"],
      tags: ["http-endpoint", "runtime"],
      runtimes: ["bun"],
    },
  ],
};

const schema = generateOpenApiSchema(mockManifest, {
  title: "Example Bun API",
  version: "1.0.0",
  description: "Generated from Barrits AST trait discovery (Bun runtime)",
});

console.log(JSON.stringify(schema, null, 2));
