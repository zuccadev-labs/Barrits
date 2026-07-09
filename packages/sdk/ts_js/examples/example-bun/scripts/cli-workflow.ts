import { parseBuildManifest, createBuildManifestSummary } from "@zuccadev-labs/barrits";

const manifestRaw = JSON.stringify({
  generatedAt: new Date().toISOString(),
  checksum: "sha256-demo",
  projectRoot: process.cwd(),
  barritsDirectory: ".barrits",
  strategy: "current-directory",
  discoveryRoots: [],
  filesCount: 3,
  exportsCount: 4,
  publicExportsCount: 3,
  internalExportsCount: 0,
  barrelsCount: 1,
  domains: ["api"],
  traitDiagnostics: [],
  importActions: [],
  collisions: [],
  traitDescriptors: [
    { name: "runtime-bun", sourceFile: "barrits/traits/runtime-trait.ts", bindingName: "bunRuntimeTrait", bindingKind: "const", requires: [], conflicts: [], state: [], consumes: [], provides: ["runtime:bun"], tags: ["runtime"], runtimes: ["bun"] },
    { name: "queue-service", sourceFile: "barrits/traits/queue-service.ts", bindingName: "queueServiceTrait", bindingKind: "const", requires: [], conflicts: [], state: ["items"], consumes: [], provides: ["queue:crud"], tags: ["service", "crud"], runtimes: ["bun"] },
    { name: "http-handler", sourceFile: "barrits/traits/http-handler.ts", bindingName: "httpHandlerTrait", bindingKind: "const", requires: [], conflicts: [], state: [], consumes: [], provides: ["http:request"], tags: ["http-endpoint", "runtime"], runtimes: ["bun"] },
  ],
});

const manifest = parseBuildManifest(manifestRaw);
const summary = createBuildManifestSummary(manifest);

console.log(`Checksum: ${manifest.checksum}`);
console.log(`Traits discovered: ${manifest.traitDescriptors.length}`);
console.log(`Domains: ${manifest.domains.join(", ")}`);
console.log(`Public exports: ${summary.publicExportCount}`);

for (const td of manifest.traitDescriptors) {
  console.log(`  Trait: ${td.name} → ${td.provides.join(", ")} [${td.tags.join(", ")}]`);
}
