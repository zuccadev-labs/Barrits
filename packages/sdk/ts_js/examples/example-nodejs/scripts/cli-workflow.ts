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
    { name: "runtime-node", sourceFile: "traits/runtime-trait.ts", bindingName: "nodeRuntimeTrait", bindingKind: "const", requires: [], conflicts: [], state: [], consumes: [], provides: ["runtime:node"], tags: ["runtime"], runtimes: ["node"] },
    { name: "user-service", sourceFile: "traits/user-service.ts", bindingName: "userServiceTrait", bindingKind: "const", requires: [], conflicts: [], state: ["users"], consumes: [], provides: ["user:crud"], tags: ["service", "crud"], runtimes: ["node"] },
    { name: "http-handler", sourceFile: "traits/http-handler.ts", bindingName: "httpHandlerTrait", bindingKind: "const", requires: [], conflicts: [], state: [], consumes: [], provides: ["http:request"], tags: ["http-endpoint", "runtime"], runtimes: ["node"] },
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
