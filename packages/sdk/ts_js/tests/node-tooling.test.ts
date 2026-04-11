import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { readNodeBuildManifestSummary, readNodeLanguageToolSnapshot } from "../adapters/node";

test("node tooling readers load summaries and language tool payloads", async () => {
  const tempDirectory = await mkdtemp(join(tmpdir(), "barrits-node-tooling-"));
  const manifestPath = join(tempDirectory, "build-manifest.json");
  const snapshotPath = join(tempDirectory, "watch-snapshot.json");

  await writeFile(manifestPath, JSON.stringify({
    generatedAt: "2026-04-06T00:00:00.000Z",
    projectRoot: ".",
    barritsDirectory: "./barrits",
    strategy: "direct-child",
    filesCount: 1,
    exportsCount: 1,
    publicExportsCount: 1,
    internalExportsCount: 0,
    barrelsCount: 1,
    domains: ["logic"],
    importActions: [{
      exportName: "duplicar",
      domain: "logic",
      sourceFile: "logic/index.ts",
      kind: "namespace-access",
      statement: "barrits.logic.duplicar",
    }],
  }), "utf8");

  await writeFile(snapshotPath, JSON.stringify({
    generatedAt: "2026-04-06T00:00:01.000Z",
    mode: "watch",
    graph: {
      barritsDirectory: "./barrits",
      projectRoot: ".",
      strategy: "direct-child",
      rootFiles: [],
      domains: [{
        name: "logic",
        path: "./barrits/logic",
        files: [{
          path: "logic/index.ts",
          isIndex: true,
          kind: "barrel",
          sourceLayer: "barrits",
          exports: [{
            name: "duplicar",
            accessPath: "logic/index.ts#duplicar",
            accessStrategy: "export-name",
            kind: "reexport",
            visibility: "public",
          }],
          traitDescriptors: [],
        }],
      }],
      filesCount: 1,
      exportsCount: 1,
      publicExportsCount: 1,
      internalExportsCount: 0,
      barrelsCount: 1,
      importActions: [{
        exportName: "duplicar",
        domain: "logic",
        sourceFile: "logic/index.ts",
        kind: "namespace-access",
        statement: "barrits.logic.duplicar",
      }],
    },
  }), "utf8");

  const manifestSummary = await readNodeBuildManifestSummary(manifestPath);
  assert.deepEqual(manifestSummary.domains, ["logic"]);

  const toolingSnapshot = await readNodeLanguageToolSnapshot(snapshotPath);
  assert.equal(toolingSnapshot.mode, "watch");
  assert.deepEqual(toolingSnapshot.importStatements, ["barrits.logic.duplicar"]);
});