import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { createNodeFileSystemAdapter } from "../adapters/node/filesystem";
import {
  applyManagedImports,
  createBuildManifest,
  createBuildManifestSummary,
  createImportsModuleSource,
  createLanguageToolSnapshot,
  createProjectedGraph,
  createWatchSnapshot,
  createWatchSnapshotSummary,
  findBarritsDirectory,
  inspectBarritsIntegrations,
  parseWatchSnapshot,
  stringifyWatchSnapshot,
} from "../src/barrits/sdk";
import { createAutomationProjectFixture } from "./helpers/fixtures";

const inspectAutomationFixture = async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-automation-e2e-"));
  const { targetPath } = await createAutomationProjectFixture(projectRoot);

  const adapter = createNodeFileSystemAdapter();
  const discovery = await findBarritsDirectory(adapter, { startDirectory: projectRoot });

  assert.ok(discovery);

  const graph = await inspectBarritsIntegrations(adapter, discovery);

  return { projectRoot, targetPath, graph };
};

test("imports and automation flow stays consistent for named and namespace modes", async () => {
  const { targetPath, graph } = await inspectAutomationFixture();
  const manifest = createBuildManifest(graph);
  const summary = createBuildManifestSummary(manifest);
  const importsModuleSource = createImportsModuleSource(graph);
  const originalTargetSource = await readFile(targetPath, "utf8");
  const namedImportSource = applyManagedImports(originalTargetSource, graph, "named-import");
  const namespaceImportSource = applyManagedImports(originalTargetSource, graph, "namespace-access");
  const aliasImportSource = applyManagedImports(originalTargetSource, graph, "alias-namespace-access");
  const updatedAgainSource = applyManagedImports(aliasImportSource, graph, "alias-namespace-access");

  assert.deepEqual(summary.domains, ["logic"]);
  assert.ok(summary.importStatements.some((statement) => statement.includes("duplicar")));
  assert.ok(summary.importStatements.some((statement) => statement === 'import { duplicar } from "@zuccadev-labs/barrits";'));
  assert.ok(summary.importStatements.some((statement) => statement === "barrits.logic.duplicar"));
  assert.ok(summary.importStatements.some((statement) => statement === "brt.logic.duplicar"));
  assert.match(importsModuleSource, /export const importMap = \{/);
  assert.match(importsModuleSource, /"duplicar"/);
  assert.match(namedImportSource, /import \{ duplicar \} from "@zuccadev-labs\/barrits";/);
  assert.match(namespaceImportSource, /import \{ barrits \} from "@zuccadev-labs\/barrits";/);
  assert.match(aliasImportSource, /import \{ brt \} from "@zuccadev-labs\/barrits";/);
  assert.equal(updatedAgainSource, aliasImportSource);
  assert.deepEqual(summary.traitDiagnostics, []);
});

test("watch snapshot flow stays consistent for live automation consumers", async () => {
  const { graph } = await inspectAutomationFixture();
  const filters = {
    domains: ["logic"],
    kinds: ["alias-namespace-access"] as const,
  };
  const projectedGraph = createProjectedGraph(graph, filters);
  const snapshotSource = stringifyWatchSnapshot(projectedGraph, "dev", filters);
  const snapshot = parseWatchSnapshot(snapshotSource);
  const snapshotSummary = createWatchSnapshotSummary(snapshot);
  const languageToolSnapshot = createLanguageToolSnapshot(createWatchSnapshot(projectedGraph, "dev", filters));

  assert.equal(snapshotSummary.mode, "dev");
  assert.deepEqual(snapshotSummary.domains, ["logic"]);
  assert.deepEqual(snapshotSummary.filters, filters);
  assert.deepEqual(snapshotSummary.importStatements, ["brt.logic.duplicar"]);
  assert.equal(languageToolSnapshot.mode, "dev");
  assert.deepEqual(languageToolSnapshot.filters, filters);
  assert.deepEqual(languageToolSnapshot.importStatements, ["brt.logic.duplicar"]);
});

test("discovery and automation also work when barrits lives inside src", async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-nested-automation-e2e-"));
  await createAutomationProjectFixture(projectRoot, {
    barritsRoot: "src/barrits",
    targetPath: "src/main.ts",
  });

  const adapter = createNodeFileSystemAdapter();
  const discovery = await findBarritsDirectory(adapter, { startDirectory: projectRoot });

  assert.ok(discovery);
  assert.equal(discovery.strategy, "recursive-child");
  assert.match(discovery.barritsDirectory, /src[\\/]barrits$/);

  const graph = await inspectBarritsIntegrations(adapter, discovery);
  const manifest = createBuildManifest(graph);
  const summary = createBuildManifestSummary(manifest);

  assert.deepEqual(summary.domains, ["logic"]);
  assert.ok(summary.importStatements.includes('import { duplicar } from "@zuccadev-labs/barrits";'));
});

test("automation infers nested namespace paths from the file tree and accepts JSDoc overrides", async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-nested-tree-"));
  const barritsRoot = join(projectRoot, "barrits");

  await mkdir(join(barritsRoot, "logic", "math"), { recursive: true });
  await writeFile(join(barritsRoot, "index.ts"), 'export { duplicar } from "./logic/index";\n', "utf8");
  await writeFile(join(barritsRoot, "logic", "index.ts"), 'export const duplicar = (value: number) => value * 2;\n', "utf8");
  await writeFile(
    join(barritsRoot, "logic", "math", "sumar.ts"),
    [
      "/**",
      " * @barrits-path aggregate.sumar",
      " */",
      "export const sumar = (left: number, right: number) => left + right;",
      "",
    ].join("\n"),
    "utf8",
  );
  await writeFile(join(barritsRoot, "logic", "path.ts"), 'export const normalizeInput = (value: string) => value.trim();\n', "utf8");

  const adapter = createNodeFileSystemAdapter();
  const discovery = await findBarritsDirectory(adapter, { startDirectory: projectRoot });

  assert.ok(discovery);

  const graph = await inspectBarritsIntegrations(adapter, discovery);
  const statements = graph.importActions.map((action) => action.statement);

  assert.ok(statements.includes("barrits.logic.aggregate.sumar"));
  assert.ok(statements.includes("barrits.logic.path.normalizeInput"));
  assert.ok(graph.collisions.every((collision) => collision.exportName !== "aggregate.sumar"));
});

test("automation inspection ignores export-like text inside comments and strings", async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-export-ast-"));
  const barritsRoot = join(projectRoot, "barrits");

  await mkdir(join(barritsRoot, "logic"), { recursive: true });
  await writeFile(join(barritsRoot, "index.ts"), 'export { duplicar } from "./logic/index";\n', "utf8");
  await writeFile(join(barritsRoot, "logic", "index.ts"), 'export { duplicar } from "./duplicar";\n', "utf8");
  await writeFile(
    join(barritsRoot, "logic", "duplicar.ts"),
    [
      '// export const fantasma = () => "comment";',
      'const debugSnippet = "export const sombra = () => 0;";',
      '',
      'export const duplicar = (value: number) => value * 2;',
      'void debugSnippet;',
      '',
    ].join("\n"),
    "utf8",
  );

  const adapter = createNodeFileSystemAdapter();
  const discovery = await findBarritsDirectory(adapter, { startDirectory: projectRoot });

  assert.ok(discovery);

  const graph = await inspectBarritsIntegrations(adapter, discovery);
  const logicFile = graph.domains
    .find((domain) => domain.name === "logic")
    ?.files.find((file) => file.path === "logic/duplicar.ts");

  assert.ok(logicFile);
  assert.deepEqual(logicFile.exports.map((entry) => entry.name), ["duplicar"]);
  assert.ok(graph.importActions.every((action) => action.exportName !== "fantasma"));
  assert.ok(graph.importActions.every((action) => action.exportName !== "sombra"));
});

test("automation inspection exposes declarative trait metadata from barrits/traits files", async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-traits-inspection-"));
  const barritsRoot = join(projectRoot, "barrits");

  await mkdir(join(barritsRoot, "traits", "routing"), { recursive: true });
  await mkdir(join(barritsRoot, "traits", "formatting"), { recursive: true });
  await writeFile(join(barritsRoot, "index.ts"), 'export {} from "./traits/routing/slug";\n', "utf8");
  await writeFile(
    join(barritsRoot, "traits", "routing", "slug.ts"),
    [
      "/**",
      " * @barrits-trait ignored-helper",
      " * @barrits-summary This block is not attached to an exported declaration and must be ignored.",
      " */",
      "const helper = true;",
      "",
      "/**",
      " * @barrits-trait slug",
      " * @barrits-summary Slugifies normalized strings for route-safe ids.",
      " * @barrits-requires normalize",
      " * @barrits-consumes normalize",
      " * @barrits-state session",
      " * @barrits-provides toSlug",
      " * @barrits-tags routing formatting",
      " * @barrits-runtime browser node",
      " */",
      "export const slugTrait = createTraitDescriptor({",
      "  name: \"slug\",",
      "  requires: [\"normalize\"],",
      "  provides: [\"toSlug\"],",
      "  create: ({ traits }) => ({",
      "    toSlug(value: string) {",
      "      return traits.normalize?.(value) ?? value;",
      "    },",
      "  }),",
      "});",
      "",
    ].join("\n"),
    "utf8",
  );
  await writeFile(
    join(barritsRoot, "traits", "formatting", "slug.ts"),
    [
      "/**",
      " * @barrits-trait slug",
      " * @barrits-summary Duplicate local slug trait used to test diagnostics.",
      " * @barrits-provides toSlug",
      " */",
      "export const duplicateSlugTrait = {",
      "  name: \"slug\"",
      "};",
      "",
      "const unrelatedFactory = createTraitDescriptor({",
      "  name: \"ignored-local\",",
      "  provides: [\"ignoredCapability\"],",
      "  create: () => ({ ignoredCapability() { return true; } }),",
      "});",
      "void unrelatedFactory;",
      "",
    ].join("\n"),
    "utf8",
  );

  const adapter = createNodeFileSystemAdapter();
  const discovery = await findBarritsDirectory(adapter, { startDirectory: projectRoot });

  assert.ok(discovery);

  const graph = await inspectBarritsIntegrations(adapter, discovery);
  const slugFile = graph.domains
    .find((domain) => domain.name === "traits")
    ?.files.find((file) => file.path === "traits/routing/slug.ts");

  assert.ok(slugFile);
  assert.deepEqual(slugFile.traitDescriptors, [
    {
      name: "slug",
      sourceFile: "traits/routing/slug.ts",
      bindingName: "slugTrait",
      bindingKind: "const",
      factory: "createTraitDescriptor",
      summary: "Slugifies normalized strings for route-safe ids.",
      requires: ["normalize"],
      conflicts: [],
      state: ["session"],
      consumes: ["normalize"],
      provides: ["toSlug"],
      tags: ["formatting", "routing"],
      runtimes: ["browser", "node"],
    },
  ]);
  assert.deepEqual(
    graph.traitDescriptors.map((descriptor) => ({
      name: descriptor.name,
      sourceFile: descriptor.sourceFile,
      bindingName: descriptor.bindingName,
      factory: descriptor.factory,
    })),
    [
      {
        name: "slug",
        sourceFile: "traits/formatting/slug.ts",
        bindingName: "duplicateSlugTrait",
        factory: undefined,
      },
      {
        name: "slug",
        sourceFile: "traits/routing/slug.ts",
        bindingName: "slugTrait",
        factory: "createTraitDescriptor",
      },
    ],
  );
  assert.ok(graph.traitDescriptors.every((descriptor) => descriptor.name !== "ignored-helper"));
  assert.equal(
    graph.traitDescriptors.find((descriptor) => descriptor.bindingName === "duplicateSlugTrait")?.factory,
    undefined,
  );

  const traitDiagnosticCodes = graph.traitDiagnostics.map((diagnostic) => diagnostic.code);
  assert.ok(traitDiagnosticCodes.includes("trait-duplicate-name"));
  assert.ok(traitDiagnosticCodes.includes("trait-duplicate-provides"));
  assert.ok(traitDiagnosticCodes.includes("trait-unsupported-factory"));

  const watchSnapshotSummary = createWatchSnapshotSummary(createWatchSnapshot(graph, "dev"));
  assert.ok(watchSnapshotSummary.traitDiagnostics);
  assert.ok(watchSnapshotSummary.traitDiagnostics?.some((diagnostic) => diagnostic.code === "trait-duplicate-name"));

  const buildManifestSummary = createBuildManifestSummary(createBuildManifest(graph));
  assert.ok(buildManifestSummary.traitDiagnostics);
  assert.ok(buildManifestSummary.traitDiagnostics?.some((diagnostic) => diagnostic.code === "trait-unsupported-factory"));

  const languageToolSnapshot = createLanguageToolSnapshot(createWatchSnapshot(graph, "dev"));
  assert.ok(languageToolSnapshot.traitDiagnostics.some((diagnostic) => diagnostic.code === "trait-unsupported-factory"));
});

test("automation inspection reports mismatches between JSDoc metadata and runtime createTraitDescriptor contracts", async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-traits-mismatch-"));
  const barritsRoot = join(projectRoot, "barrits");

  await mkdir(join(barritsRoot, "traits", "routing"), { recursive: true });
  await writeFile(join(barritsRoot, "index.ts"), 'export {} from "./traits/routing/slug";\n', "utf8");
  await writeFile(
    join(barritsRoot, "traits", "routing", "slug.ts"),
    [
      "/**",
      " * @barrits-trait slug",
      " * @barrits-provides toSlug normalizeSlug",
      " */",
      "export const slugTrait = createTraitDescriptor({",
      "  name: \"slug-runtime\",",
      "  provides: [\"toSlug\"],",
      "  create: () => ({",
      "    toSlug(value: string) {",
      "      return value;",
      "    },",
      "  }),",
      "});",
      "",
    ].join("\n"),
    "utf8",
  );

  const adapter = createNodeFileSystemAdapter();
  const discovery = await findBarritsDirectory(adapter, { startDirectory: projectRoot });

  assert.ok(discovery);

  const graph = await inspectBarritsIntegrations(adapter, discovery);
  const traitDiagnosticCodes = graph.traitDiagnostics.map((diagnostic) => diagnostic.code);

  assert.ok(traitDiagnosticCodes.includes("trait-name-mismatch"));
  assert.ok(traitDiagnosticCodes.includes("trait-provides-mismatch"));
  assert.ok(graph.traitDiagnostics.some((diagnostic) => diagnostic.code === "trait-name-mismatch" && diagnostic.severity === "error"));
  assert.ok(graph.traitDiagnostics.some((diagnostic) => diagnostic.code === "trait-provides-mismatch" && diagnostic.severity === "warning"));
});

test("automation inspection reports dependency and state drift between JSDoc metadata and runtime createTraitDescriptor contracts", async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-traits-dependency-mismatch-"));
  const barritsRoot = join(projectRoot, "barrits");

  await mkdir(join(barritsRoot, "traits", "routing"), { recursive: true });
  await writeFile(join(barritsRoot, "index.ts"), 'export {} from "./traits/routing/slug";\n', "utf8");
  await writeFile(
    join(barritsRoot, "traits", "routing", "slug.ts"),
    [
      "/**",
      " * @barrits-trait slug",
      " * @barrits-requires normalize",
      " * @barrits-consumes normalize",
      " * @barrits-conflicts legacySlug",
      " * @barrits-state session",
      " * @barrits-provides toSlug",
      " */",
      "export const slugTrait = createTraitDescriptor({",
      "  name: \"slug\",",
      "  conflicts: [\"normalize\"],",
      "  requires: [],",
      "  consumes: [\"formatPath\"],",
      "  state: [\"cache\"],",
      "  provides: [\"toSlug\"],",
      "  create: () => ({",
      "    toSlug(value: string) {",
      "      return value;",
      "    },",
      "  }),",
      "});",
      "",
    ].join("\n"),
    "utf8",
  );

  const adapter = createNodeFileSystemAdapter();
  const discovery = await findBarritsDirectory(adapter, { startDirectory: projectRoot });

  assert.ok(discovery);

  const graph = await inspectBarritsIntegrations(adapter, discovery);
  const traitDiagnosticCodes = graph.traitDiagnostics.map((diagnostic) => diagnostic.code);

  assert.ok(traitDiagnosticCodes.includes("trait-conflicts-mismatch"));
  assert.ok(traitDiagnosticCodes.includes("trait-requires-mismatch"));
  assert.ok(traitDiagnosticCodes.includes("trait-consumes-mismatch"));
  assert.ok(traitDiagnosticCodes.includes("trait-state-mismatch"));
  assert.ok(graph.traitDiagnostics.some((diagnostic) => diagnostic.code === "trait-conflicts-mismatch" && diagnostic.severity === "warning"));
  assert.ok(graph.traitDiagnostics.some((diagnostic) => diagnostic.code === "trait-requires-mismatch" && diagnostic.severity === "warning"));
  assert.ok(graph.traitDiagnostics.some((diagnostic) => diagnostic.code === "trait-consumes-mismatch" && diagnostic.severity === "warning"));
  assert.ok(graph.traitDiagnostics.some((diagnostic) => diagnostic.code === "trait-state-mismatch" && diagnostic.severity === "warning"));
});

test("automation inspection reports contradictory portable trait contracts before runtime composition", async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-traits-policy-diagnostics-"));
  const barritsRoot = join(projectRoot, "barrits");

  await mkdir(join(barritsRoot, "traits", "routing"), { recursive: true });
  await writeFile(join(barritsRoot, "index.ts"), 'export {} from "./traits/routing/slug";\n', "utf8");
  await writeFile(
    join(barritsRoot, "traits", "routing", "slug.ts"),
    [
      "/**",
      " * @barrits-trait slug",
      " * @barrits-requires normalize slug",
      " * @barrits-conflicts normalize slug",
      " * @barrits-provides toSlug",
      " */",
      "export const slugTrait = createTraitDescriptor({",
      '  name: "slug",',
      '  requires: ["normalize", "slug"],',
      '  conflicts: ["normalize", "slug"],',
      '  provides: ["toSlug"],',
      "  create: () => ({",
      "    toSlug(value: string) {",
      "      return value;",
      "    },",
      "  }),",
      "});",
      "",
    ].join("\n"),
    "utf8",
  );

  const adapter = createNodeFileSystemAdapter();
  const discovery = await findBarritsDirectory(adapter, { startDirectory: projectRoot });

  assert.ok(discovery);

  const graph = await inspectBarritsIntegrations(adapter, discovery);
  const traitDiagnosticCodes = graph.traitDiagnostics.map((diagnostic) => diagnostic.code);

  assert.ok(traitDiagnosticCodes.includes("trait-self-requires"));
  assert.ok(traitDiagnosticCodes.includes("trait-self-conflict"));
  assert.ok(traitDiagnosticCodes.includes("trait-requires-conflict-overlap"));
  assert.ok(graph.traitDiagnostics.some((diagnostic) => diagnostic.code === "trait-self-requires" && diagnostic.severity === "error"));
  assert.ok(graph.traitDiagnostics.some((diagnostic) => diagnostic.code === "trait-self-conflict" && diagnostic.severity === "error"));
  assert.ok(graph.traitDiagnostics.some((diagnostic) => diagnostic.code === "trait-requires-conflict-overlap" && diagnostic.severity === "error"));
});

test("automation inspection warns when a required trait is missing from the inspected portable graph", async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-traits-missing-required-"));
  const barritsRoot = join(projectRoot, "barrits");

  await mkdir(join(barritsRoot, "traits", "routing"), { recursive: true });
  await writeFile(join(barritsRoot, "index.ts"), 'export {} from "./traits/routing/slug";\n', "utf8");
  await writeFile(
    join(barritsRoot, "traits", "routing", "slug.ts"),
    [
      "/**",
      " * @barrits-trait slug",
      " * @barrits-requires normalize",
      " * @barrits-provides toSlug",
      " */",
      "export const slugTrait = createTraitDescriptor({",
      '  name: "slug",',
      '  requires: ["normalize"],',
      '  provides: ["toSlug"],',
      "  create: () => ({",
      "    toSlug(value: string) {",
      "      return value;",
      "    },",
      "  }),",
      "});",
      "",
    ].join("\n"),
    "utf8",
  );

  const adapter = createNodeFileSystemAdapter();
  const discovery = await findBarritsDirectory(adapter, { startDirectory: projectRoot });

  assert.ok(discovery);

  const graph = await inspectBarritsIntegrations(adapter, discovery);
  const traitDiagnosticCodes = graph.traitDiagnostics.map((diagnostic) => diagnostic.code);

  assert.ok(traitDiagnosticCodes.includes("trait-missing-required-trait"));
  assert.ok(graph.traitDiagnostics.some((diagnostic) => diagnostic.code === "trait-missing-required-trait" && diagnostic.severity === "warning"));
});

test("automation inspection does not warn about missing required traits that exist later in the inspected graph", async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-traits-missing-required-order-"));
  const barritsRoot = join(projectRoot, "barrits");

  await mkdir(join(barritsRoot, "traits", "routing"), { recursive: true });
  await mkdir(join(barritsRoot, "traits", "zz-formatting"), { recursive: true });
  await writeFile(join(barritsRoot, "index.ts"), 'export {} from "./traits/routing/slug";\nexport {} from "./traits/zz-formatting/normalize";\n', "utf8");
  await writeFile(
    join(barritsRoot, "traits", "routing", "slug.ts"),
    [
      "/**",
      " * @barrits-trait slug",
      " * @barrits-requires normalize",
      " * @barrits-provides toSlug",
      " */",
      "export const slugTrait = createTraitDescriptor({",
      '  name: "slug",',
      '  requires: ["normalize"],',
      '  provides: ["toSlug"],',
      "  create: ({ traits }) => ({",
      "    toSlug(value: string) {",
      "      return traits.normalize?.(value) ?? value;",
      "    },",
      "  }),",
      "});",
      "",
    ].join("\n"),
    "utf8",
  );
  await writeFile(
    join(barritsRoot, "traits", "zz-formatting", "normalize.ts"),
    [
      "/**",
      " * @barrits-trait normalize",
      " * @barrits-provides normalize",
      " */",
      "export const normalizeTrait = createTraitDescriptor({",
      '  name: "normalize",',
      '  provides: ["normalize"],',
      "  create: () => ({",
      "    normalize(value: string) {",
      "      return value.trim().toLowerCase();",
      "    },",
      "  }),",
      "});",
      "",
    ].join("\n"),
    "utf8",
  );

  const adapter = createNodeFileSystemAdapter();
  const discovery = await findBarritsDirectory(adapter, { startDirectory: projectRoot });

  assert.ok(discovery);

  const graph = await inspectBarritsIntegrations(adapter, discovery);

  assert.ok(graph.traitDescriptors.some((descriptor) => descriptor.name === "normalize"));
  assert.ok(graph.traitDiagnostics.every((diagnostic) => diagnostic.code !== "trait-missing-required-trait"));
});

test("automation inspection warns when a consumed capability is missing from the inspected portable graph", async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-traits-missing-consumed-"));
  const barritsRoot = join(projectRoot, "barrits");

  await mkdir(join(barritsRoot, "traits", "routing"), { recursive: true });
  await writeFile(join(barritsRoot, "index.ts"), 'export {} from "./traits/routing/slug";\n', "utf8");
  await writeFile(
    join(barritsRoot, "traits", "routing", "slug.ts"),
    [
      "/**",
      " * @barrits-trait slug",
      " * @barrits-consumes normalize",
      " * @barrits-provides toSlug",
      " */",
      "export const slugTrait = createTraitDescriptor({",
      '  name: "slug",',
      '  consumes: ["normalize"],',
      '  provides: ["toSlug"],',
      "  create: () => ({",
      "    toSlug(value: string) {",
      "      return value;",
      "    },",
      "  }),",
      "});",
      "",
    ].join("\n"),
    "utf8",
  );

  const adapter = createNodeFileSystemAdapter();
  const discovery = await findBarritsDirectory(adapter, { startDirectory: projectRoot });

  assert.ok(discovery);

  const graph = await inspectBarritsIntegrations(adapter, discovery);
  const traitDiagnosticCodes = graph.traitDiagnostics.map((diagnostic) => diagnostic.code);

  assert.ok(traitDiagnosticCodes.includes("trait-missing-consumed-capability"));
  assert.ok(graph.traitDiagnostics.some((diagnostic) => diagnostic.code === "trait-missing-consumed-capability" && diagnostic.severity === "warning"));
  assert.ok(graph.traitDiagnostics.every((diagnostic) => diagnostic.code !== "trait-missing-required-trait"));
});

test("automation inspection loads trait contracts from barrits.config.mjs when JSDoc trait headers are omitted", async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-traits-config-contracts-"));
  const barritsRoot = join(projectRoot, "barrits");

  await mkdir(join(barritsRoot, "traits"), { recursive: true });
  await writeFile(join(barritsRoot, "index.ts"), 'export {} from "./traits/runtime";\n', "utf8");
  await writeFile(
    join(barritsRoot, "traits", "runtime.ts"),
    [
      "export const nodeRuntimeTrait = createTraitDescriptor({",
      '  name: "runtime-node",',
      '  provides: ["runtime:node"],',
      "  create: () => ({",
      '    getRuntimeName() { return "node"; },',
      "  }),",
      "});",
      "",
    ].join("\n"),
    "utf8",
  );
  await writeFile(
    join(projectRoot, "barrits.config.mjs"),
    [
      "export default {",
      "  contracts: {",
      "    traits: [",
      "      {",
      '        name: "runtime-node",',
      '        sourceFile: "traits/runtime.ts",',
      '        bindingName: "nodeRuntimeTrait",',
      '        provides: ["runtime:node"],',
      "      },",
      "    ],",
      "  },",
      "};",
      "",
    ].join("\n"),
    "utf8",
  );

  const adapter = createNodeFileSystemAdapter();
  const discovery = await findBarritsDirectory(adapter, { startDirectory: projectRoot });

  assert.ok(discovery);

  const graph = await inspectBarritsIntegrations(adapter, discovery);
  const runtimeDescriptor = graph.traitDescriptors.find((descriptor) => descriptor.name === "runtime-node");

  assert.ok(runtimeDescriptor);
  assert.equal(runtimeDescriptor?.sourceFile, "traits/runtime.ts");
  assert.deepEqual(runtimeDescriptor?.provides, ["runtime:node"]);
});

test("automation infers named imports without root re-exports and allows private export overrides from barrits.config.mjs", async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-config-private-exports-"));
  const barritsRoot = join(projectRoot, "barrits");

  await mkdir(join(barritsRoot, "logic", "math"), { recursive: true });
  await writeFile(join(barritsRoot, "index.ts"), "\n", "utf8");
  await writeFile(
    join(barritsRoot, "logic", "math", "operations.ts"),
    [
      "export const duplicar = (value: number) => value * 2;",
      "export const triplicar = (value: number) => value * 3;",
      "",
    ].join("\n"),
    "utf8",
  );
  await writeFile(
    join(barritsRoot, "logic", "path.ts"),
    [
      "export const buildOperationalPath = (segment: string) => `/ops/${segment}`;",
      "export const buildSecretPath = (segment: string) => `/secret/${segment}`;",
      "",
    ].join("\n"),
    "utf8",
  );
  await writeFile(
    join(projectRoot, "barrits.config.mjs"),
    [
      "export default {",
      "  contracts: {",
      "    exports: [",
      "      {",
      "        sourceFile: 'logic/path.ts',",
      "        exportName: 'buildSecretPath',",
      "        visibility: 'internal'",
      "      }",
      "    ]",
      "  }",
      "};",
      "",
    ].join("\n"),
    "utf8",
  );

  const adapter = createNodeFileSystemAdapter();
  const discovery = await findBarritsDirectory(adapter, { startDirectory: projectRoot });

  assert.ok(discovery);

  const graph = await inspectBarritsIntegrations(adapter, discovery);
  const statements = graph.importActions.map((action) => action.statement);
  const logicPathFile = graph.domains
    .find((domain) => domain.name === "logic")
    ?.files.find((file) => file.path === "logic/path.ts");

  assert.ok(statements.includes('import { duplicar } from "@zuccadev-labs/barrits";'));
  assert.ok(statements.includes('import { triplicar } from "@zuccadev-labs/barrits";'));
  assert.ok(statements.includes('import { buildOperationalPath } from "@zuccadev-labs/barrits";'));
  assert.ok(!statements.includes('import { buildSecretPath } from "@zuccadev-labs/barrits";'));
  assert.ok(statements.includes("barrits.logic.path.buildOperationalPath"));
  assert.ok(!statements.includes("barrits.logic.path.buildSecretPath"));
  assert.ok(logicPathFile);
  assert.deepEqual(
    logicPathFile.exports.map((entry) => ({ name: entry.name, visibility: entry.visibility })),
    [
      { name: "buildOperationalPath", visibility: "public" },
      { name: "buildSecretPath", visibility: "internal" },
    ],
  );
});