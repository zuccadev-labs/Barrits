import test from "node:test";
import assert from "node:assert/strict";

import * as rootSurface from "../src/index";
import * as sdkSurface from "../src/barrits/sdk";
import * as nodeSurface from "../adapters/node/index";
import * as bunSurface from "../adapters/bun/index";
import * as denoSurface from "../adapters/deno/mod";

const ENGINE_EXPORTS = [
  "findBarritsDirectory",
  "inspectBarritsIntegrations",
  "createBuildManifest",
  "createProjectedGraph",
  "createWatchSnapshot",
  "filterIntegrationGraph",
  "applyManagedImports",
  "createImportsModuleSource",
  "readBuildManifest",
  "parseBuildManifest",
] as const;

const surfaces: Record<string, Record<string, unknown>> = {
  root: rootSurface,
  sdk: sdkSurface,
  node: nodeSurface,
  bun: bunSurface,
  deno: denoSurface,
};

for (const [name, surface] of Object.entries(surfaces)) {
  test(`${name} surface exposes the discovery/inspection engine`, () => {
    for (const exportName of ENGINE_EXPORTS) {
      assert.equal(typeof surface[exportName], "function", `${name} surface is missing ${exportName}`);
    }
  });
}

test("bun surface exposes Bun-named readers alongside the Node ones", () => {
  assert.equal(typeof bunSurface.readBunBuildManifestSummary, "function");
  assert.equal(bunSurface.readBunBuildManifestSummary, bunSurface.readNodeBuildManifestSummary);
  assert.equal(typeof bunSurface.createBunFileSystemAdapter, "function");
});
