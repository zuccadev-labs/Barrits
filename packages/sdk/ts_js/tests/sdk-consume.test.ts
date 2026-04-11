import test from "node:test";
import assert from "node:assert/strict";

import {
  createBuildManifestSummary,
  createLanguageToolSnapshot,
  createWatchSnapshotSummary,
  parseBuildManifest,
  parseWatchSnapshot,
  readBuildManifestSummary,
  readLanguageToolSnapshot,
} from "../src/barrits/sdk";

test("consume helpers summarize manifest and snapshot state", () => {
  const manifest = parseBuildManifest(JSON.stringify({
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
    traitDiagnostics: [{
      code: "trait-missing-required-trait",
      category: "non-verifiable",
      severity: "warning",
      message: "Trait descriptor \"slug\" requires \"normalize\".",
      sourceFile: "traits/routing/slug.ts",
      descriptorName: "slug",
      bindingName: "slugTrait",
    }],
    traitDescriptors: [{
      name: "slug",
      sourceFile: "traits/routing/slug.ts",
      bindingName: "slugTrait",
      bindingKind: "const",
      summary: "Slugifies normalized strings.",
      requires: ["normalize"],
      conflicts: [],
      state: ["session"],
      consumes: ["normalize"],
      provides: ["toSlug"],
      tags: ["formatting", "routing"],
      runtimes: ["browser", "node"],
    }],
    importActions: [{
      exportName: "duplicar",
      domain: "logic",
      sourceFile: "logic/index.ts",
      kind: "namespace-access",
      statement: "barrits.logic.duplicar",
    }],
    filters: {
      domains: ["logic"],
      kinds: ["namespace-access"],
    },
  }));

  const manifestSummary = createBuildManifestSummary(manifest);
  assert.deepEqual(manifestSummary.domains, ["logic"]);
  assert.deepEqual(manifestSummary.importStatements, ["barrits.logic.duplicar"]);
  assert.deepEqual(manifestSummary.traitDescriptors, [{
    name: "slug",
    sourceFile: "traits/routing/slug.ts",
    bindingName: "slugTrait",
    bindingKind: "const",
    summary: "Slugifies normalized strings.",
    requires: ["normalize"],
    conflicts: [],
    state: ["session"],
    consumes: ["normalize"],
    provides: ["toSlug"],
    tags: ["formatting", "routing"],
    runtimes: ["browser", "node"],
  }]);
  assert.equal(manifestSummary.traitDiagnostics?.[0]?.category, "non-verifiable");
  assert.deepEqual(manifestSummary.traitDiagnosticAggregate, {
    counts: {
      total: 1,
      errorCount: 0,
      warningCount: 1,
    },
    byCategory: {
      drift: 0,
      impossible: 0,
      "non-verifiable": 1,
    },
    byCode: {
      "trait-duplicate-name": 0,
      "trait-duplicate-provides": 0,
      "trait-conflicts-mismatch": 0,
      "trait-missing-consumed-capability": 0,
      "trait-consumes-mismatch": 0,
      "trait-missing-required-trait": 1,
      "trait-name-mismatch": 0,
      "trait-requires-conflict-overlap": 0,
      "trait-requires-mismatch": 0,
      "trait-self-requires": 0,
      "trait-self-conflict": 0,
      "trait-provides-mismatch": 0,
      "trait-state-mismatch": 0,
      "trait-unsupported-factory": 0,
    },
    byDescriptor: [{
      descriptorName: "slug",
      sourceFile: "traits/routing/slug.ts",
      bindingName: "slugTrait",
      counts: {
        total: 1,
        errorCount: 0,
        warningCount: 1,
      },
      byCategory: {
        drift: 0,
        impossible: 0,
        "non-verifiable": 1,
      },
      byCode: {
        "trait-duplicate-name": 0,
        "trait-duplicate-provides": 0,
        "trait-conflicts-mismatch": 0,
        "trait-missing-consumed-capability": 0,
        "trait-consumes-mismatch": 0,
        "trait-missing-required-trait": 1,
        "trait-name-mismatch": 0,
        "trait-requires-conflict-overlap": 0,
        "trait-requires-mismatch": 0,
        "trait-self-requires": 0,
        "trait-self-conflict": 0,
        "trait-provides-mismatch": 0,
        "trait-state-mismatch": 0,
        "trait-unsupported-factory": 0,
      },
      codes: ["trait-missing-required-trait"],
    }],
  });
  assert.equal(manifestSummary.strategy, "direct-child");

  const snapshot = parseWatchSnapshot(JSON.stringify({
    generatedAt: "2026-04-06T00:00:01.000Z",
    mode: "dev",
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
      libraryRootFiles: [],
      libraryDomains: [],
      filesCount: 1,
      exportsCount: 1,
      publicExportsCount: 1,
      internalExportsCount: 0,
      barrelsCount: 1,
      traitDiagnostics: [{
        code: "trait-name-mismatch",
        category: "drift",
        severity: "error",
        message: "Trait descriptor \"slug\" documents a different runtime name.",
        sourceFile: "traits/routing/slug.ts",
        descriptorName: "slug",
        bindingName: "slugTrait",
      }],
      traitDescriptors: [{
        name: "slug",
        sourceFile: "traits/routing/slug.ts",
        bindingName: "slugTrait",
        bindingKind: "const",
        summary: "Slugifies normalized strings.",
        requires: ["normalize"],
        conflicts: [],
        state: ["session"],
        consumes: ["normalize"],
        provides: ["toSlug"],
        tags: ["formatting", "routing"],
        runtimes: ["browser", "node"],
      }],
      importActions: [{
        exportName: "duplicar",
        domain: "logic",
        sourceFile: "logic/index.ts",
        kind: "namespace-access",
        statement: "barrits.logic.duplicar",
      }],
    },
    filters: {
      domains: ["logic"],
      kinds: ["namespace-access"],
    },
  }));

  const snapshotSummary = createWatchSnapshotSummary(snapshot);
  assert.equal(snapshotSummary.mode, "dev");
  assert.deepEqual(snapshotSummary.domains, ["logic"]);
  assert.equal(snapshotSummary.traitDescriptors[0]?.name, "slug");
  assert.equal(snapshotSummary.traitDiagnostics?.[0]?.category, "drift");
  assert.deepEqual(snapshotSummary.traitDiagnosticAggregate?.byCategory, {
    drift: 1,
    impossible: 0,
    "non-verifiable": 0,
  });
  assert.equal(snapshotSummary.traitDiagnosticAggregate?.byCode["trait-name-mismatch"], 1);
  assert.deepEqual(snapshotSummary.traitDescriptors[0]?.tags, ["formatting", "routing"]);

  const languageToolSnapshot = createLanguageToolSnapshot(snapshot);
  assert.deepEqual(languageToolSnapshot.domains, [{
    name: "logic",
    filesCount: 1,
    exportNames: ["duplicar"],
  }]);
  assert.equal(languageToolSnapshot.traitDescriptors[0]?.summary, "Slugifies normalized strings.");
  assert.equal(languageToolSnapshot.traitDiagnostics[0]?.category, "drift");
  assert.equal(languageToolSnapshot.traitDiagnosticAggregate.byDescriptor[0]?.descriptorName, "slug");
  assert.equal(languageToolSnapshot.traitDiagnosticAggregate.byDescriptor[0]?.byCode["trait-name-mismatch"], 1);
  assert.deepEqual(languageToolSnapshot.importStatements, ["barrits.logic.duplicar"]);
});

test("consume parsers reject malformed manifest and snapshot payloads", () => {
  assert.throws(
    () => parseBuildManifest(JSON.stringify({
      generatedAt: "2026-04-06T00:00:00.000Z",
      projectRoot: ".",
      barritsDirectory: "./barrits",
      strategy: "direct-child",
      filesCount: 1,
      exportsCount: 1,
      publicExportsCount: 1,
      internalExportsCount: 0,
      barrelsCount: 1,
      domains: "logic",
      traitDescriptors: [],
      traitDiagnostics: [],
      importActions: [],
    })),
    /Invalid barrits build manifest at domains: expected string\[\]\./,
  );

  assert.throws(
    () => parseWatchSnapshot(JSON.stringify({
      generatedAt: "2026-04-06T00:00:01.000Z",
      mode: "dev",
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
              visibility: "private",
            }],
            traitDescriptors: [],
          }],
        }],
        libraryRootFiles: [],
        libraryDomains: [],
        filesCount: 1,
        exportsCount: 1,
        publicExportsCount: 1,
        internalExportsCount: 0,
        barrelsCount: 1,
        traitDescriptors: [],
        traitDiagnostics: [],
        importActions: [],
      },
    })),
    /Invalid barrits watch snapshot at graph\.domains\[0\]\.files\[0\]\.exports\[0\]\.visibility: expected valid BarritsExportVisibility\./,
  );
});

test("consume file readers reuse validated parsing with injected readTextFile", async () => {
  const files = new Map<string, string>([
    ["build.json", JSON.stringify({
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
      traitDescriptors: [],
      traitDiagnostics: [],
      importActions: [{
        exportName: "duplicar",
        domain: "logic",
        sourceFile: "logic/index.ts",
        kind: "namespace-access",
        statement: "barrits.logic.duplicar",
      }],
      collisions: [],
    })],
    ["snapshot.json", JSON.stringify({
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
        libraryRootFiles: [],
        libraryDomains: [],
        filesCount: 1,
        exportsCount: 1,
        publicExportsCount: 1,
        internalExportsCount: 0,
        barrelsCount: 1,
        traitDescriptors: [],
        traitDiagnostics: [],
        importActions: [{
          exportName: "duplicar",
          domain: "logic",
          sourceFile: "logic/index.ts",
          kind: "namespace-access",
          statement: "barrits.logic.duplicar",
        }],
        collisions: [],
      },
    })],
  ]);

  const readTextFile = async (filePath: string) => {
    const content = files.get(filePath);

    if (!content) {
      throw new Error(`Missing fixture for ${filePath}`);
    }

    return content;
  };

  const manifestSummary = await readBuildManifestSummary("build.json", readTextFile);
  const languageToolSnapshot = await readLanguageToolSnapshot("snapshot.json", readTextFile);

  assert.deepEqual(manifestSummary.importStatements, ["barrits.logic.duplicar"]);
  assert.equal(languageToolSnapshot.mode, "watch");
  assert.deepEqual(languageToolSnapshot.importStatements, ["barrits.logic.duplicar"]);
});