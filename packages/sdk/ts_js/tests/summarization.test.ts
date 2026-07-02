import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { createEmptyTraitDiagnosticCounts } from "../src/barrits/sdk/validation";

import {
  mapImportStatements,
  mapTraitDescriptors,
  mapTraitDiagnostics,
  createTraitDiagnosticAggregate,
  createBuildManifestSummary,
  createWatchSnapshotSummary,
  createLanguageToolSnapshot,
} from "../src/barrits/sdk/summarization";

import type {
  BarritsBuildManifest,
  BarritsWatchSnapshot,
  BarritsTraitDiagnostic,
  BarritsImportAction,
  BarritsConsumedTraitDescriptor,
} from "../src/barrits/sdk/contracts";

describe("mapImportStatements", () => {
  it("returns empty array for empty input", () => {
    assert.deepEqual(mapImportStatements([]), []);
  });

  it("maps import actions to statement strings", () => {
    const actions: BarritsImportAction[] = [
      { exportName: "foo", domain: "logic", sourceFile: "logic/foo.ts", kind: "named-import", statement: 'import { foo } from "./logic/foo";' },
      { exportName: "bar", domain: "logic", sourceFile: "logic/bar.ts", kind: "named-import", statement: 'import { bar } from "./logic/bar";' },
    ];
    assert.deepEqual(mapImportStatements(actions), [
      'import { foo } from "./logic/foo";',
      'import { bar } from "./logic/bar";',
    ]);
  });

  it("preserves input order", () => {
    const actions: BarritsImportAction[] = [
      { exportName: "z", domain: "a", sourceFile: "a/z.ts", kind: "named-import", statement: "z" },
      { exportName: "a", domain: "a", sourceFile: "a/a.ts", kind: "named-import", statement: "a" },
    ];
    assert.deepEqual(mapImportStatements(actions), ["z", "a"]);
  });
});

describe("mapTraitDescriptors", () => {
  it("returns empty array for undefined", () => {
    assert.deepEqual(mapTraitDescriptors(undefined), []);
  });

  it("returns empty array for empty input", () => {
    assert.deepEqual(mapTraitDescriptors([]), []);
  });

  it("sorts by name then sourceFile", () => {
    const descriptors: BarritsConsumedTraitDescriptor[] = [
      {
        name: "zebra", sourceFile: "a/z.ts", bindingName: "z", bindingKind: "const",
        requires: [], conflicts: [], state: [], consumes: [], provides: [], tags: [], runtimes: [],
      },
      {
        name: "alfa", sourceFile: "z/a.ts", bindingName: "a", bindingKind: "const",
        requires: [], conflicts: [], state: [], consumes: [], provides: [], tags: [], runtimes: [],
      },
      {
        name: "alfa", sourceFile: "a/b.ts", bindingName: "b", bindingKind: "function",
        requires: [], conflicts: [], state: [], consumes: [], provides: [], tags: [], runtimes: [],
      },
    ];
    const result = mapTraitDescriptors(descriptors);
    assert.equal(result.length, 3);
    assert.equal(result[0].name, "alfa");
    assert.equal(result[0].sourceFile, "a/b.ts");
    assert.equal(result[1].name, "alfa");
    assert.equal(result[1].sourceFile, "z/a.ts");
    assert.equal(result[2].name, "zebra");
  });

  it("does not mutate the input array", () => {
    const originalOrder: BarritsConsumedTraitDescriptor[] = [
      {
        name: "z", sourceFile: "z.ts", bindingName: "z", bindingKind: "const",
        requires: [], conflicts: [], state: [], consumes: [], provides: [], tags: [], runtimes: [],
      },
      {
        name: "a", sourceFile: "a.ts", bindingName: "a", bindingKind: "const",
        requires: [], conflicts: [], state: [], consumes: [], provides: [], tags: [], runtimes: [],
      },
    ];
    mapTraitDescriptors(originalOrder);
    assert.equal(originalOrder[0].name, "z");
    assert.equal(originalOrder[1].name, "a");
  });
});

describe("mapTraitDiagnostics", () => {
  it("returns empty array for undefined", () => {
    assert.deepEqual(mapTraitDiagnostics(undefined), []);
  });

  it("returns empty array for empty input", () => {
    assert.deepEqual(mapTraitDiagnostics([]), []);
  });

  it("sorts by severity, code, then sourceFile", () => {
    const diagnostics: BarritsTraitDiagnostic[] = [
      { code: "trait-missing-consumed-capability", category: "drift", severity: "error", message: "err1", sourceFile: "b.ts" },
      { code: "trait-duplicate-name", category: "impossible", severity: "error", message: "err2", sourceFile: "a.ts" },
      { code: "trait-missing-consumed-capability", category: "drift", severity: "warning", message: "warn1", sourceFile: "a.ts" },
      { code: "trait-duplicate-name", category: "impossible", severity: "warning", message: "warn2", sourceFile: "b.ts" },
    ];
    const result = mapTraitDiagnostics(diagnostics);
    assert.equal(result[0].severity, "error");
    assert.equal(result[0].code, "trait-duplicate-name");
    assert.equal(result[1].severity, "error");
    assert.equal(result[1].code, "trait-missing-consumed-capability");
    assert.equal(result[2].severity, "warning");
    assert.equal(result[2].code, "trait-duplicate-name");
    assert.equal(result[3].severity, "warning");
    assert.equal(result[3].code, "trait-missing-consumed-capability");
  });

  it("does not mutate the input array", () => {
    const diagnostics: BarritsTraitDiagnostic[] = [
      { code: "trait-duplicate-name", category: "impossible", severity: "warning", message: "x", sourceFile: "x.ts" },
      { code: "trait-missing-consumed-capability", category: "drift", severity: "error", message: "y", sourceFile: "y.ts" },
    ];
    mapTraitDiagnostics(diagnostics);
    assert.equal(diagnostics[0].severity, "warning");
  });
});

describe("createTraitDiagnosticAggregate", () => {
  it("returns undefined for undefined", () => {
    assert.equal(createTraitDiagnosticAggregate(undefined), undefined);
  });

  it("returns undefined for empty array", () => {
    assert.equal(createTraitDiagnosticAggregate([]), undefined);
  });

  it("counts total, errors and warnings", () => {
    const diagnostics: BarritsTraitDiagnostic[] = [
      { code: "trait-duplicate-name", category: "impossible", severity: "error", message: "dup", sourceFile: "a.ts" },
      { code: "trait-missing-consumed-capability", category: "drift", severity: "warning", message: "missing", sourceFile: "b.ts" },
    ];
    const result = createTraitDiagnosticAggregate(diagnostics);
    assert(result !== undefined);
    assert.equal(result.counts.total, 2);
    assert.equal(result.counts.errorCount, 1);
    assert.equal(result.counts.warningCount, 1);
  });

  it("aggregates by category and code", () => {
    const diagnostics: BarritsTraitDiagnostic[] = [
      { code: "trait-duplicate-name", category: "impossible", severity: "error", message: "dup", sourceFile: "a.ts" },
      { code: "trait-duplicate-name", category: "impossible", severity: "error", message: "dup2", sourceFile: "b.ts" },
      { code: "trait-missing-consumed-capability", category: "drift", severity: "warning", message: "missing", sourceFile: "c.ts" },
    ];
    const result = createTraitDiagnosticAggregate(diagnostics);
    assert(result !== undefined);
    assert.equal(result.byCategory.impossible, 2);
    assert.equal(result.byCategory.drift, 1);
    assert.equal(result.byCategory["non-verifiable"], 0);
    assert.equal(result.byCode["trait-duplicate-name"], 2);
    assert.equal(result.byCode["trait-missing-consumed-capability"], 1);
  });

  it("groups by descriptor name, sourceFile and bindingName", () => {
    const diagnostics: BarritsTraitDiagnostic[] = [
      { code: "trait-duplicate-name", category: "impossible", severity: "error", message: "dup", sourceFile: "a.ts", descriptorName: "myTrait" },
      { code: "trait-duplicate-name", category: "impossible", severity: "error", message: "dup2", sourceFile: "a.ts", descriptorName: "myTrait" },
      { code: "trait-missing-consumed-capability", category: "drift", severity: "warning", message: "missing", sourceFile: "b.ts", descriptorName: "otherTrait" },
    ];
    const result = createTraitDiagnosticAggregate(diagnostics);
    assert(result !== undefined);
    assert.equal(result.byDescriptor.length, 2);
    assert.equal(result.byDescriptor[0].descriptorName, "myTrait");
    assert.equal(result.byDescriptor[0].counts.total, 2);
    assert.equal(result.byDescriptor[1].descriptorName, "otherTrait");
    assert.equal(result.byDescriptor[1].counts.total, 1);
  });

  it("uses (anonymous) when descriptorName is undefined", () => {
    const diagnostics: BarritsTraitDiagnostic[] = [
      { code: "trait-duplicate-name", category: "impossible", severity: "error", message: "dup", sourceFile: "a.ts" },
    ];
    const result = createTraitDiagnosticAggregate(diagnostics);
    assert(result !== undefined);
    assert.equal(result.byDescriptor.length, 1);
    assert.equal(result.byDescriptor[0].descriptorName, "(anonymous)");
  });

  it("sorts byDescriptor by descriptorName then sourceFile", () => {
    const diagnostics: BarritsTraitDiagnostic[] = [
      { code: "trait-duplicate-name", category: "impossible", severity: "error", message: "z", sourceFile: "a.ts", descriptorName: "zebra" },
      { code: "trait-duplicate-name", category: "impossible", severity: "error", message: "a", sourceFile: "z.ts", descriptorName: "alfa" },
      { code: "trait-duplicate-name", category: "impossible", severity: "error", message: "b", sourceFile: "a.ts", descriptorName: "alfa" },
    ];
    const result = createTraitDiagnosticAggregate(diagnostics);
    assert(result !== undefined);
    assert.equal(result.byDescriptor.length, 3);
    assert.equal(result.byDescriptor[0].descriptorName, "alfa");
    assert.equal(result.byDescriptor[0].sourceFile, "a.ts");
    assert.equal(result.byDescriptor[1].descriptorName, "alfa");
    assert.equal(result.byDescriptor[1].sourceFile, "z.ts");
    assert.equal(result.byDescriptor[2].descriptorName, "zebra");
  });

  it("sorts codes within each descriptor", () => {
    const diagnostics: BarritsTraitDiagnostic[] = [
      { code: "trait-missing-consumed-capability", category: "drift", severity: "warning", message: "x", sourceFile: "a.ts", descriptorName: "t" },
      { code: "trait-duplicate-name", category: "impossible", severity: "error", message: "y", sourceFile: "a.ts", descriptorName: "t" },
    ];
    const result = createTraitDiagnosticAggregate(diagnostics);
    assert(result !== undefined);
    assert.equal(result.byDescriptor.length, 1);
    assert.deepEqual(result.byDescriptor[0].codes, ["trait-duplicate-name", "trait-missing-consumed-capability"]);
  });

  it("maps bindingName from diagnostics", () => {
    const diagnostics: BarritsTraitDiagnostic[] = [
      { code: "trait-duplicate-name", category: "impossible", severity: "error", message: "dup", sourceFile: "a.ts", descriptorName: "t", bindingName: "myBinding" },
    ];
    const result = createTraitDiagnosticAggregate(diagnostics);
    assert(result !== undefined);
    assert.equal(result.byDescriptor.length, 1);
    assert.equal(result.byDescriptor[0].bindingName, "myBinding");
  });
});

describe("createBuildManifestSummary", () => {
  it("returns missing summary when manifest is null", () => {
    const summary = createBuildManifestSummary(null);
    assert.equal(summary.generatedAt, null);
    assert.equal(summary.strategy, "missing");
    assert.deepEqual(summary.domains, []);
    assert.deepEqual(summary.importStatements, []);
    assert.deepEqual(summary.traitDescriptors, []);
  });

  it("maps manifest fields correctly", () => {
    const manifest: BarritsBuildManifest = {
      checksum: "sha256-abc",
      generatedAt: "2025-06-01T00:00:00.000Z",
      projectRoot: "/project",
      barritsDirectory: "/project/barrits",
      strategy: "current-directory",
      discoveryRoots: [],
      filesCount: 10,
      exportsCount: 20,
      publicExportsCount: 15,
      internalExportsCount: 5,
      barrelsCount: 2,
      domains: ["logic", "ui"],
      traitDescriptors: [
        { name: "myTrait", sourceFile: "logic/trait.ts", bindingName: "t", bindingKind: "const", requires: [], conflicts: [], state: [], consumes: [], provides: [], tags: [], runtimes: [] },
      ],
      traitDiagnostics: [
        { code: "trait-duplicate-name", category: "impossible", severity: "error", message: "dup", sourceFile: "a.ts" },
      ],
      importActions: [
        { exportName: "foo", domain: "logic", sourceFile: "logic/foo.ts", kind: "named-import", statement: 'import { foo } from "./logic/foo";' },
      ],
      collisions: [
        { type: "project-project", namespace: "shared", exportName: "dup", projectSourceFile: "a.ts", conflictSourceFile: "b.ts", message: "Duplicate export" },
      ],
    };
    const summary = createBuildManifestSummary(manifest);
    assert.equal(summary.generatedAt, "2025-06-01T00:00:00.000Z");
    assert.equal(summary.strategy, "current-directory");
    assert.deepEqual(summary.domains, ["logic", "ui"]);
    assert.deepEqual(summary.importStatements, ['import { foo } from "./logic/foo";']);
    assert.equal(summary.traitDescriptors.length, 1);
    assert.equal(summary.traitDescriptors[0].name, "myTrait");
    assert.equal(summary.traitDiagnostics!.length, 1);
    assert(summary.traitDiagnosticAggregate !== undefined);
    assert.equal(summary.traitDiagnosticAggregate!.counts.total, 1);
    assert.equal(summary.collisionsCount, 1);
  });

  it("omits filters when manifest has none", () => {
    const manifest: BarritsBuildManifest = {
      checksum: "sha256-abc",
      generatedAt: "2025-06-01T00:00:00.000Z",
      projectRoot: "/project",
      barritsDirectory: "/project/barrits",
      strategy: "current-directory",
      discoveryRoots: [],
      filesCount: 0,
      exportsCount: 0,
      publicExportsCount: 0,
      internalExportsCount: 0,
      barrelsCount: 0,
      domains: [],
      traitDescriptors: [],
      traitDiagnostics: [],
      importActions: [],
      collisions: [],
    };
    const summary = createBuildManifestSummary(manifest);
    assert.equal("filters" in summary, false);
  });

  it("includes filters when manifest has filters", () => {
    const manifest: BarritsBuildManifest = {
      checksum: "sha256-abc",
      generatedAt: "2025-06-01T00:00:00.000Z",
      projectRoot: "/project",
      barritsDirectory: "/project/barrits",
      strategy: "current-directory",
      discoveryRoots: [],
      filesCount: 0,
      exportsCount: 0,
      publicExportsCount: 0,
      internalExportsCount: 0,
      barrelsCount: 0,
      domains: [],
      traitDescriptors: [],
      traitDiagnostics: [],
      importActions: [],
      collisions: [],
      filters: { domains: ["logic"], exports: [], fileKinds: [], visibilities: [] },
    };
    const summary = createBuildManifestSummary(manifest);
    assert.deepEqual(summary.filters, { domains: ["logic"], exports: [], fileKinds: [], visibilities: [] });
  });

  it("handles null collisionsCount", () => {
    const manifest: BarritsBuildManifest = {
      checksum: "sha256-abc",
      generatedAt: "2025-06-01T00:00:00.000Z",
      projectRoot: "/project",
      barritsDirectory: "/project/barrits",
      strategy: "current-directory",
      discoveryRoots: [],
      filesCount: 0,
      exportsCount: 0,
      publicExportsCount: 0,
      internalExportsCount: 0,
      barrelsCount: 0,
      domains: [],
      traitDescriptors: [],
      traitDiagnostics: [],
      importActions: [],
      collisions: undefined as unknown as readonly never[],
    };
    const summary = createBuildManifestSummary(manifest);
    assert.equal(summary.collisionsCount, 0);
  });
});

describe("createWatchSnapshotSummary", () => {
  it("returns missing summary when snapshot is null", () => {
    const summary = createWatchSnapshotSummary(null);
    assert.equal(summary.generatedAt, null);
    assert.equal(summary.strategy, "missing");
    assert.deepEqual(summary.domains, []);
    assert.deepEqual(summary.importStatements, []);
    assert.deepEqual(summary.traitDescriptors, []);
  });

  it("maps snapshot fields correctly", () => {
    const snapshot: BarritsWatchSnapshot = {
      generatedAt: "2025-06-01T00:00:00.000Z",
      mode: "watch",
      graph: {
        projectRoot: "/project",
        barritsDirectory: "/project/barrits",
        strategy: "recursive-child",
        discoveryRoots: [],
        rootFiles: [],
        libraryRootFiles: [],
        libraryDomains: [],
        filesCount: 0,
        exportsCount: 0,
        publicExportsCount: 0,
        internalExportsCount: 0,
        barrelsCount: 0,
        domains: [
          { name: "logic", path: "logic", files: [] },
          { name: "ui", path: "ui", files: [] },
        ],
        traitDescriptors: [],
        traitDiagnostics: [],
        importActions: [
          { exportName: "foo", domain: "logic", sourceFile: "logic/foo.ts", kind: "named-import", statement: 'import { foo } from "./logic/foo";' },
        ],
        collisions: [],
      },
    };
    const summary = createWatchSnapshotSummary(snapshot);
    assert.equal(summary.generatedAt, "2025-06-01T00:00:00.000Z");
    assert.equal(summary.mode, "watch");
    assert.equal(summary.strategy, "recursive-child");
    assert.deepEqual(summary.domains, ["logic", "ui"]);
    assert.deepEqual(summary.importStatements, ['import { foo } from "./logic/foo";']);
    assert.equal(summary.collisionsCount, 0);
  });

  it("includes filters when snapshot has filters", () => {
    const snapshot: BarritsWatchSnapshot = {
      generatedAt: "2025-06-01T00:00:00.000Z",
      mode: "dev",
      graph: {
        projectRoot: "/project",
        barritsDirectory: "/project/barrits",
        strategy: "current-directory",
        discoveryRoots: [],
        rootFiles: [],
        libraryRootFiles: [],
        libraryDomains: [],
        filesCount: 0,
        exportsCount: 0,
        publicExportsCount: 0,
        internalExportsCount: 0,
        barrelsCount: 0,
        domains: [{ name: "logic", path: "logic", files: [] }],
        traitDescriptors: [],
        traitDiagnostics: [],
        importActions: [],
        collisions: [],
      },
      filters: { domains: ["logic"], exports: [], fileKinds: [], visibilities: [] },
    };
    const summary = createWatchSnapshotSummary(snapshot);
    assert.deepEqual(summary.filters, { domains: ["logic"], exports: [], fileKinds: [], visibilities: [] });
  });

  it("omits filters when snapshot has none", () => {
    const snapshot: BarritsWatchSnapshot = {
      generatedAt: "2025-06-01T00:00:00.000Z",
      mode: "dev",
      graph: {
        projectRoot: "/project",
        barritsDirectory: "/project/barrits",
        strategy: "current-directory",
        discoveryRoots: [],
        rootFiles: [],
        libraryRootFiles: [],
        libraryDomains: [],
        filesCount: 0,
        exportsCount: 0,
        publicExportsCount: 0,
        internalExportsCount: 0,
        barrelsCount: 0,
        domains: [{ name: "logic", path: "logic", files: [] }],
        traitDescriptors: [],
        traitDiagnostics: [],
        importActions: [],
        collisions: [],
      },
    };
    const summary = createWatchSnapshotSummary(snapshot);
    assert.equal("filters" in summary, false);
  });
});

describe("createLanguageToolSnapshot", () => {
  it("maps domains with filesCount and exportNames", () => {
    const snapshot: BarritsWatchSnapshot = {
      generatedAt: "2025-06-01T00:00:00.000Z",
      mode: "watch",
      graph: {
        projectRoot: "/project",
        barritsDirectory: "/project/barrits",
        strategy: "current-directory",
        discoveryRoots: [],
        rootFiles: [],
        libraryRootFiles: [],
        libraryDomains: [],
        filesCount: 0,
        exportsCount: 0,
        publicExportsCount: 0,
        internalExportsCount: 0,
        barrelsCount: 0,
        domains: [
          {
            name: "logic",
            path: "logic",
            files: [
              { path: "a.ts", isIndex: false, kind: "domain", sourceLayer: "barrits", traitDescriptors: [], exports: [{ name: "foo", accessPath: "foo", accessStrategy: "export-name", kind: "const", visibility: "public" }] },
              { path: "b.ts", isIndex: false, kind: "domain", sourceLayer: "barrits", traitDescriptors: [], exports: [{ name: "bar", accessPath: "bar", accessStrategy: "export-name", kind: "function", visibility: "public" }] },
            ],
          },
          {
            name: "ui",
            path: "ui",
            files: [],
          },
        ],
        traitDescriptors: [],
        traitDiagnostics: [],
        importActions: [],
        collisions: [],
      },
    };
    const langSnapshot = createLanguageToolSnapshot(snapshot);
    assert.equal(langSnapshot.strategy, "current-directory");
    assert.equal(langSnapshot.domains.length, 2);
    assert.equal(langSnapshot.domains[0].name, "logic");
    assert.equal(langSnapshot.domains[0].filesCount, 2);
    assert.deepEqual(langSnapshot.domains[0].exportNames, ["foo", "bar"]);
    assert.equal(langSnapshot.domains[1].name, "ui");
    assert.equal(langSnapshot.domains[1].filesCount, 0);
    assert.deepEqual(langSnapshot.domains[1].exportNames, []);
  });

  it("uses empty aggregates when no diagnostics", () => {
    const snapshot: BarritsWatchSnapshot = {
      generatedAt: "2025-06-01T00:00:00.000Z",
      mode: "dev",
      graph: {
        projectRoot: "/project",
        barritsDirectory: "/project/barrits",
        strategy: "current-directory",
        discoveryRoots: [],
        rootFiles: [],
        libraryRootFiles: [],
        libraryDomains: [],
        filesCount: 0,
        exportsCount: 0,
        publicExportsCount: 0,
        internalExportsCount: 0,
        barrelsCount: 0,
        domains: [{ name: "logic", path: "logic", files: [] }],
        traitDescriptors: [],
        traitDiagnostics: [],
        importActions: [],
        collisions: [],
      },
    };
    const langSnapshot = createLanguageToolSnapshot(snapshot);
    assert.deepEqual(langSnapshot.traitDiagnosticAggregate.counts, createEmptyTraitDiagnosticCounts());
    assert.equal(langSnapshot.traitDiagnosticAggregate.byDescriptor.length, 0);
  });

  it("includes filters when snapshot has filters", () => {
    const snapshot: BarritsWatchSnapshot = {
      generatedAt: "2025-06-01T00:00:00.000Z",
      mode: "dev",
      graph: {
        projectRoot: "/project",
        barritsDirectory: "/project/barrits",
        strategy: "current-directory",
        discoveryRoots: [],
        rootFiles: [],
        libraryRootFiles: [],
        libraryDomains: [],
        filesCount: 0,
        exportsCount: 0,
        publicExportsCount: 0,
        internalExportsCount: 0,
        barrelsCount: 0,
        domains: [{ name: "logic", path: "logic", files: [] }],
        traitDescriptors: [],
        traitDiagnostics: [],
        importActions: [],
        collisions: [],
      },
      filters: { domains: ["logic"], exports: [], fileKinds: [], visibilities: [] },
    };
    const langSnapshot = createLanguageToolSnapshot(snapshot);
    assert.deepEqual(langSnapshot.filters, { domains: ["logic"], exports: [], fileKinds: [], visibilities: [] });
  });

  it("omits filters when snapshot has none", () => {
    const snapshot: BarritsWatchSnapshot = {
      generatedAt: "2025-06-01T00:00:00.000Z",
      mode: "dev",
      graph: {
        projectRoot: "/project",
        barritsDirectory: "/project/barrits",
        strategy: "current-directory",
        discoveryRoots: [],
        rootFiles: [],
        libraryRootFiles: [],
        libraryDomains: [],
        filesCount: 0,
        exportsCount: 0,
        publicExportsCount: 0,
        internalExportsCount: 0,
        barrelsCount: 0,
        domains: [{ name: "logic", path: "logic", files: [] }],
        traitDescriptors: [],
        traitDiagnostics: [],
        importActions: [],
        collisions: [],
      },
    };
    const langSnapshot = createLanguageToolSnapshot(snapshot);
    assert.equal("filters" in langSnapshot, false);
  });

  it("includes importActions, collisions and importStatements", () => {
    const snapshot: BarritsWatchSnapshot = {
      generatedAt: "2025-06-01T00:00:00.000Z",
      mode: "dev",
      graph: {
        projectRoot: "/project",
        barritsDirectory: "/project/barrits",
        strategy: "current-directory",
        discoveryRoots: [],
        rootFiles: [],
        libraryRootFiles: [],
        libraryDomains: [],
        filesCount: 0,
        exportsCount: 0,
        publicExportsCount: 0,
        internalExportsCount: 0,
        barrelsCount: 0,
        domains: [{ name: "logic", path: "logic", files: [] }],
        traitDescriptors: [],
        traitDiagnostics: [],
        importActions: [
          { exportName: "foo", domain: "logic", sourceFile: "logic/foo.ts", kind: "named-import", statement: 'import { foo } from "./logic/foo";' },
        ],
        collisions: [
          { type: "project-project", namespace: "shared", exportName: "dup", projectSourceFile: "a.ts", conflictSourceFile: "b.ts", message: "Duplicate export" },
        ],
      },
    };
    const langSnapshot = createLanguageToolSnapshot(snapshot);
    assert.equal(langSnapshot.importActions.length, 1);
    assert.equal(langSnapshot.collisions.length, 1);
    assert.deepEqual(langSnapshot.importStatements, ['import { foo } from "./logic/foo";']);
  });
});
