import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  BUILD_MANIFEST_CHECKSUM_PREFIX,
  assertBuildManifestIntegrity,
  computeBuildManifestChecksum,
  createBuildManifest,
  stringifyBuildManifest,
  verifyBuildManifest,
} from "../src/barrits/sdk/manifest";
import { parseBuildManifest } from "../src/barrits/sdk/consume";
import type { BarritsBuildManifest, BarritsIntegrationGraph } from "../src/barrits/sdk/contracts";

const makeGraph = (overrides: Partial<BarritsIntegrationGraph> = {}): BarritsIntegrationGraph => ({
  projectRoot: "/project",
  barritsDirectory: "/project/barrits",
  strategy: "direct-child",
  discoveryRoots: [],
  filesCount: 1,
  exportsCount: 1,
  rootFiles: [],
  domains: [{ name: "logic", path: "/project/barrits/logic", files: [] }],
  libraryRootFiles: [],
  libraryDomains: [],
  publicExportsCount: 1,
  internalExportsCount: 0,
  barrelsCount: 0,
  traitDescriptors: [
    {
      name: "slug",
      sourceFile: "traits/slug.ts",
      bindingName: "slugTrait",
      bindingKind: "const",
      factory: "createTraitDescriptor",
      requires: [],
      conflicts: [],
      state: [],
      consumes: [],
      provides: ["toSlug"],
      tags: [],
      runtimes: [],
    },
  ],
  traitDiagnostics: [],
  importActions: [{ exportName: "duplicar", domain: "logic", sourceFile: "logic/duplicar.ts", kind: "named-import", statement: 'import { duplicar } from "./barrits";' }],
  collisions: [],
  ...overrides,
});

const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

describe("build manifest integrity", () => {
  it("seals the manifest with a prefixed SHA-256 checksum", async () => {
    const manifest = await createBuildManifest(makeGraph());
    assert.ok(manifest.checksum.startsWith(BUILD_MANIFEST_CHECKSUM_PREFIX));
    assert.equal(manifest.checksum.length, BUILD_MANIFEST_CHECKSUM_PREFIX.length + 64);
  });

  it("produces the same checksum for the same content regardless of generation time", async () => {
    const first = await createBuildManifest(makeGraph());
    await wait(5);
    const second = await createBuildManifest(makeGraph());

    assert.notEqual(first.generatedAt, second.generatedAt);
    assert.equal(first.checksum, second.checksum);
  });

  it("changes the checksum when any content field changes", async () => {
    const baseline = await createBuildManifest(makeGraph());
    const tamperedStatement = await createBuildManifest(
      makeGraph({
        importActions: [{ exportName: "duplicar", domain: "logic", sourceFile: "logic/duplicar.ts", kind: "named-import", statement: 'import { duplicar } from "evil";' }],
      }),
    );
    const tamperedDiagnostics = await createBuildManifest(
      makeGraph({
        traitDiagnostics: [{ code: "trait-self-requires", category: "impossible", severity: "error", message: "m", sourceFile: "traits/slug.ts" }],
      }),
    );
    const tamperedCollisions = await createBuildManifest(
      makeGraph({
        collisions: [
          {
            type: "project-project",
            namespace: "logic",
            exportName: "duplicar",
            projectSourceFile: "logic/a.ts",
            conflictSourceFile: "logic/b.ts",
            message: "collision",
          },
        ],
      }),
    );

    assert.notEqual(baseline.checksum, tamperedStatement.checksum);
    assert.notEqual(baseline.checksum, tamperedDiagnostics.checksum);
    assert.notEqual(baseline.checksum, tamperedCollisions.checksum);
  });

  it("verifies a freshly created manifest and a manifest that round-tripped through JSON", async () => {
    const manifest = await createBuildManifest(makeGraph(), { domains: ["logic"] });
    assert.equal((await verifyBuildManifest(manifest)).valid, true);

    const parsed = parseBuildManifest(await stringifyBuildManifest(makeGraph(), { domains: ["logic"] }));
    const integrity = await verifyBuildManifest(parsed);
    assert.equal(integrity.valid, true, `${integrity.expected} !== ${integrity.actual}`);
  });

  it("detects modifications made after generation", async () => {
    const manifest = await createBuildManifest(makeGraph());
    const tampered: BarritsBuildManifest = {
      ...manifest,
      importActions: [{ ...manifest.importActions[0], statement: 'import { duplicar } from "evil";' }],
    };

    const integrity = await verifyBuildManifest(tampered);
    assert.equal(integrity.valid, false);
    assert.equal(integrity.actual, manifest.checksum);
    assert.notEqual(integrity.expected, manifest.checksum);
    await assert.rejects(() => assertBuildManifestIntegrity(tampered), /integrity check failed/);
    assert.equal(await assertBuildManifestIntegrity(manifest), manifest);
  });

  it("ignores key insertion order when computing the checksum", async () => {
    const manifest = await createBuildManifest(makeGraph());
    const reordered = Object.fromEntries(Object.entries(manifest).reverse()) as unknown as BarritsBuildManifest;

    assert.equal(await computeBuildManifestChecksum(reordered), manifest.checksum);
  });
});
