import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { createNodeFileSystemAdapter } from "../adapters/node/filesystem";
import { findBarritsDirectory, inspectBarritsIntegrations } from "../src/barrits/sdk";
import { createAutomationProjectFixture, writeProjectFile } from "./helpers/fixtures";

const userTraitSource = [
  "/**",
  " * @barrits-trait user-service",
  " * @barrits-summary Provides user lookups for the extra discovery root.",
  " * @barrits-provides user",
  " */",
  "export const userServiceTrait = createTraitDescriptor({",
  '  name: "user-service",',
  '  provides: ["user"],',
  "  create: () => ({ user: () => ({ id: 1 }) }),",
  "});",
  "",
].join("\n");

const driftTraitSource = [
  "/**",
  " * @barrits-trait drift-service",
  " * @barrits-provides drift",
  " */",
  "export const driftTrait = createTraitDescriptor({",
  '  name: "renamed-at-runtime",',
  '  provides: ["drift"],',
  "  create: () => ({ drift: true }),",
  "});",
  "",
].join("\n");

test("discoveryRoots traits are read from their own root and diagnosed", async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-discovery-roots-"));

  try {
    await createAutomationProjectFixture(projectRoot);
    await writeProjectFile(projectRoot, "src/traits/user.ts", userTraitSource);
    await writeProjectFile(projectRoot, "src/traits/drift.ts", driftTraitSource);

    const adapter = createNodeFileSystemAdapter();
    const discovery = await findBarritsDirectory(adapter, { startDirectory: projectRoot });
    assert.ok(discovery);

    const graph = await inspectBarritsIntegrations(adapter, { ...discovery, discoveryRoots: ["src"] });

    assert.deepEqual(
      graph.traitDescriptors.map((descriptor) => `${descriptor.name}@${descriptor.sourceFile}`),
      ["drift-service@traits/drift.ts", "user-service@traits/user.ts"],
    );
    assert.equal(
      graph.traitDescriptors.every((descriptor) => descriptor.factory === "createTraitDescriptor"),
      true,
    );

    const nameMismatch = graph.traitDiagnostics.find((diagnostic) => diagnostic.code === "trait-name-mismatch");
    assert.ok(nameMismatch, "runtime/JSDoc name drift must be diagnosed for traits discovered under discoveryRoots");
    assert.equal(nameMismatch.sourceFile, "traits/drift.ts");
    assert.equal(
      graph.domains.some((domain) => domain.name === "traits"),
      true,
    );
  } finally {
    await rm(projectRoot, { recursive: true, force: true });
  }
});

test("discoveryRoots that do not exist are ignored", async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-discovery-roots-missing-"));

  try {
    await createAutomationProjectFixture(projectRoot);
    const adapter = createNodeFileSystemAdapter();
    const discovery = await findBarritsDirectory(adapter, { startDirectory: projectRoot });
    assert.ok(discovery);

    const graph = await inspectBarritsIntegrations(adapter, { ...discovery, discoveryRoots: ["does-not-exist"] });
    assert.equal(graph.traitDescriptors.length, 0);
    assert.equal(graph.filesCount, 3);
  } finally {
    await rm(projectRoot, { recursive: true, force: true });
  }
});
