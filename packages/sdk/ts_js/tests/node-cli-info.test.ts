import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { createAutomationProjectFixture, writeProjectFile } from "./helpers/fixtures";
import { runCommand } from "./helpers/process";

const _require = createRequire(import.meta.url);
const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const tsxCliPath = _require.resolve("tsx/cli");
const nodeCliPath = join(repositoryRoot, "adapters", "node", "cli.ts");

test("node info prints trait diagnostics in human-readable output", async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-node-cli-info-"));
  await createAutomationProjectFixture(projectRoot);

  await writeProjectFile(projectRoot, "barrits/traits/routing/slug.ts", [
    "/**",
    " * @barrits-trait slug",
    " * @barrits-summary Slug trait used in CLI diagnostics output.",
    " * @barrits-provides toSlug",
    " */",
    "export const slugTrait = createTraitDescriptor({",
    '  name: "slug",',
    '  provides: ["toSlug"],',
    "  create: () => ({",
    "    toSlug(value: string) {",
    "      return value;",
    "    },",
    "  }),",
    "});",
    "",
  ].join("\n"));

  await writeProjectFile(projectRoot, "barrits/traits/formatting/slug.ts", [
    "/**",
    " * @barrits-trait slug",
    " * @barrits-provides toSlug",
    " */",
    "export const duplicateSlugTrait = {",
    '  name: "slug",',
    "};",
    "",
  ].join("\n"));

  const result = await runCommand(
    process.execPath,
    [tsxCliPath, nodeCliPath, "info", projectRoot],
    repositoryRoot,
    process.env,
  );

  assert.equal(result.exitCode, 0);
  assert.match(result.stdout, /traits: 2/);
  assert.match(result.stdout, /traitDiagnostics: 5 \(2 errors, 3 warnings\)/);
  assert.match(result.stdout, /\[error\] trait-duplicate-name:/);
  assert.match(result.stdout, /\[warning\] trait-duplicate-provides:/);
  assert.match(result.stdout, /\[warning\] trait-unsupported-factory:/);
});

test("node build prints trait diagnostics summary in human-readable output", async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-node-cli-build-"));
  await createAutomationProjectFixture(projectRoot);

  await writeProjectFile(projectRoot, "barrits/traits/routing/slug.ts", [
    "/**",
    " * @barrits-trait slug",
    " * @barrits-provides toSlug",
    " */",
    "export const slugTrait = createTraitDescriptor({",
    '  name: "slug",',
    '  provides: ["toSlug"],',
    "  create: () => ({ toSlug(value: string) { return value; } }),",
    "});",
    "",
  ].join("\n"));

  await writeProjectFile(projectRoot, "barrits/traits/formatting/slug.ts", [
    "/**",
    " * @barrits-trait slug",
    " * @barrits-provides toSlug",
    " */",
    "export const duplicateSlugTrait = {",
    '  name: "slug",',
    "};",
    "",
  ].join("\n"));

  const result = await runCommand(
    process.execPath,
    [tsxCliPath, nodeCliPath, "build", projectRoot],
    repositoryRoot,
    process.env,
  );

  assert.equal(result.exitCode, 0);
  assert.match(result.stdout, /buildManifest:/);
  assert.match(result.stdout, /domains: logic, traits/);
  assert.match(result.stdout, /traits: 2/);
  assert.match(result.stdout, /traitDiagnostics: 5 \(2 errors, 3 warnings\)/);
});

test("node info prints structural trait drift diagnostics in human-readable output", async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-node-cli-mismatch-info-"));
  await createAutomationProjectFixture(projectRoot);

  await writeProjectFile(projectRoot, "barrits/traits/routing/slug.ts", [
    "/**",
    " * @barrits-trait slug",
    " * @barrits-provides toSlug normalizeSlug",
    " */",
    "export const slugTrait = createTraitDescriptor({",
    '  name: "slug-runtime",',
    '  provides: ["toSlug"],',
    "  create: () => ({",
    "    toSlug(value: string) {",
    "      return value;",
    "    },",
    "  }),",
    "});",
    "",
  ].join("\n"));

  const result = await runCommand(
    process.execPath,
    [tsxCliPath, nodeCliPath, "info", projectRoot],
    repositoryRoot,
    process.env,
  );

  assert.equal(result.exitCode, 0);
  assert.match(result.stdout, /traits: 1/);
  assert.match(result.stdout, /traitDiagnostics: 2 \(1 errors, 1 warnings\)/);
  assert.match(result.stdout, /\[error\] trait-name-mismatch:/);
  assert.match(result.stdout, /\[warning\] trait-provides-mismatch:/);
});

test("node build prints structural trait drift summary in human-readable output", async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-node-cli-mismatch-build-"));
  await createAutomationProjectFixture(projectRoot);

  await writeProjectFile(projectRoot, "barrits/traits/routing/slug.ts", [
    "/**",
    " * @barrits-trait slug",
    " * @barrits-provides toSlug normalizeSlug",
    " */",
    "export const slugTrait = createTraitDescriptor({",
    '  name: "slug-runtime",',
    '  provides: ["toSlug"],',
    "  create: () => ({",
    "    toSlug(value: string) {",
    "      return value;",
    "    },",
    "  }),",
    "});",
    "",
  ].join("\n"));

  const result = await runCommand(
    process.execPath,
    [tsxCliPath, nodeCliPath, "build", projectRoot],
    repositoryRoot,
    process.env,
  );

  assert.equal(result.exitCode, 0);
  assert.match(result.stdout, /buildManifest:/);
  assert.match(result.stdout, /traits: 1/);
  assert.match(result.stdout, /traitDiagnostics: 2 \(1 errors, 1 warnings\)/);
  assert.doesNotMatch(result.stdout, /trait-name-mismatch:/);
  assert.doesNotMatch(result.stdout, /trait-provides-mismatch:/);
});

test("node info detects trait descriptors declared in barrits/traits/index.ts", async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-node-cli-traits-index-"));
  await createAutomationProjectFixture(projectRoot);

  await writeProjectFile(projectRoot, "barrits/traits/index.ts", [
    "/**",
    " * @barrits-trait runtime-node",
    " * @barrits-provides getRuntimeName",
    " */",
    "export const nodeRuntimeTrait = createTraitDescriptor({",
    '  name: "runtime-node",',
    '  provides: ["getRuntimeName"],',
    "  create: () => ({",
    '    getRuntimeName() { return "node"; },',
    "  }),",
    "});",
    "",
  ].join("\n"));

  const result = await runCommand(
    process.execPath,
    [tsxCliPath, nodeCliPath, "info", projectRoot],
    repositoryRoot,
    process.env,
  );

  assert.equal(result.exitCode, 0);
  assert.match(result.stdout, /traits: 1/);
  assert.match(result.stdout, /domains:\s*[\s\S]*- traits\s*[\s\S]*traits\/index\.ts \[trait\]/);
  assert.match(result.stdout, /barrits\.traits\.nodeRuntimeTrait/);
});

test("node info prints dependency, state, and conflicts drift diagnostics in human-readable output", async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-node-cli-dependency-drift-info-"));
  await createAutomationProjectFixture(projectRoot);

  await writeProjectFile(projectRoot, "barrits/traits/routing/slug.ts", [
    "/**",
    " * @barrits-trait slug",
    " * @barrits-requires normalize",
    " * @barrits-consumes normalize",
    " * @barrits-conflicts legacySlug",
    " * @barrits-state session",
    " * @barrits-provides toSlug",
    " */",
    "export const slugTrait = createTraitDescriptor({",
    '  name: "slug",',
    '  conflicts: ["normalize"],',
    "  requires: [],",
    '  consumes: ["formatPath"],',
    '  state: ["cache"],',
    '  provides: ["toSlug"],',
    "  create: () => ({",
    "    toSlug(value: string) {",
    "      return value;",
    "    },",
    "  }),",
    "});",
    "",
  ].join("\n"));

  const result = await runCommand(
    process.execPath,
    [tsxCliPath, nodeCliPath, "info", projectRoot],
    repositoryRoot,
    process.env,
  );

  assert.equal(result.exitCode, 0);
  assert.match(result.stdout, /traits: 1/);
  assert.match(result.stdout, /traitDiagnostics: 5 \(0 errors, 5 warnings\)/);
  assert.match(result.stdout, /\[warning\] trait-conflicts-mismatch:/);
  assert.match(result.stdout, /\[warning\] trait-missing-required-trait:/);
  assert.match(result.stdout, /\[warning\] trait-requires-mismatch:/);
  assert.match(result.stdout, /\[warning\] trait-consumes-mismatch:/);
  assert.match(result.stdout, /\[warning\] trait-state-mismatch:/);
});

test("node build prints dependency, state, and conflicts drift summary in human-readable output", async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-node-cli-dependency-drift-build-"));
  await createAutomationProjectFixture(projectRoot);

  await writeProjectFile(projectRoot, "barrits/traits/routing/slug.ts", [
    "/**",
    " * @barrits-trait slug",
    " * @barrits-requires normalize",
    " * @barrits-consumes normalize",
    " * @barrits-conflicts legacySlug",
    " * @barrits-state session",
    " * @barrits-provides toSlug",
    " */",
    "export const slugTrait = createTraitDescriptor({",
    '  name: "slug",',
    '  conflicts: ["normalize"],',
    "  requires: [],",
    '  consumes: ["formatPath"],',
    '  state: ["cache"],',
    '  provides: ["toSlug"],',
    "  create: () => ({",
    "    toSlug(value: string) {",
    "      return value;",
    "    },",
    "  }),",
    "});",
    "",
  ].join("\n"));

  const result = await runCommand(
    process.execPath,
    [tsxCliPath, nodeCliPath, "build", projectRoot],
    repositoryRoot,
    process.env,
  );

  assert.equal(result.exitCode, 0);
  assert.match(result.stdout, /buildManifest:/);
  assert.match(result.stdout, /traits: 1/);
  assert.match(result.stdout, /traitDiagnostics: 5 \(0 errors, 5 warnings\)/);
  assert.doesNotMatch(result.stdout, /trait-conflicts-mismatch:/);
  assert.doesNotMatch(result.stdout, /trait-missing-required-trait:/);
  assert.doesNotMatch(result.stdout, /trait-requires-mismatch:/);
  assert.doesNotMatch(result.stdout, /trait-consumes-mismatch:/);
  assert.doesNotMatch(result.stdout, /trait-state-mismatch:/);
});

test("node info prints contradictory portable trait contract diagnostics in human-readable output", async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-node-cli-policy-drift-info-"));
  await createAutomationProjectFixture(projectRoot);

  await writeProjectFile(projectRoot, "barrits/traits/routing/slug.ts", [
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
  ].join("\n"));

  const result = await runCommand(
    process.execPath,
    [tsxCliPath, nodeCliPath, "info", projectRoot],
    repositoryRoot,
    process.env,
  );

  assert.equal(result.exitCode, 0);
  assert.match(result.stdout, /traits: 1/);
  assert.match(result.stdout, /traitDiagnostics: 4 \(3 errors, 1 warnings\)/);
  assert.match(result.stdout, /categories: 3 impossible, 1 non-verifiable/);
  assert.match(result.stdout, /\[warning\] trait-missing-required-trait:/);
  assert.match(result.stdout, /\[error\] trait-requires-conflict-overlap:/);
  assert.match(result.stdout, /\[error\] trait-self-requires:/);
  assert.match(result.stdout, /\[error\] trait-self-conflict:/);
});

test("node build prints contradictory portable trait contract summary in human-readable output", async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-node-cli-policy-drift-build-"));
  await createAutomationProjectFixture(projectRoot);

  await writeProjectFile(projectRoot, "barrits/traits/routing/slug.ts", [
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
  ].join("\n"));

  const result = await runCommand(
    process.execPath,
    [tsxCliPath, nodeCliPath, "build", projectRoot],
    repositoryRoot,
    process.env,
  );

  assert.equal(result.exitCode, 0);
  assert.match(result.stdout, /buildManifest:/);
  assert.match(result.stdout, /traits: 1/);
  assert.match(result.stdout, /traitDiagnostics: 4 \(3 errors, 1 warnings\)/);
  assert.doesNotMatch(result.stdout, /trait-missing-required-trait:/);
  assert.doesNotMatch(result.stdout, /trait-requires-conflict-overlap:/);
  assert.doesNotMatch(result.stdout, /trait-self-requires:/);
  assert.doesNotMatch(result.stdout, /trait-self-conflict:/);
});

test("node info prints missing required trait diagnostics in human-readable output", async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-node-cli-missing-required-info-"));
  await createAutomationProjectFixture(projectRoot);

  await writeProjectFile(projectRoot, "barrits/traits/routing/slug.ts", [
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
  ].join("\n"));

  const result = await runCommand(
    process.execPath,
    [tsxCliPath, nodeCliPath, "info", projectRoot],
    repositoryRoot,
    process.env,
  );

  assert.equal(result.exitCode, 0);
  assert.match(result.stdout, /traits: 1/);
  assert.match(result.stdout, /traitDiagnostics: 1 \(0 errors, 1 warnings\)/);
  assert.match(result.stdout, /\[warning\] trait-missing-required-trait:/);
});

test("node build prints missing required trait summary in human-readable output", async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-node-cli-missing-required-build-"));
  await createAutomationProjectFixture(projectRoot);

  await writeProjectFile(projectRoot, "barrits/traits/routing/slug.ts", [
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
  ].join("\n"));

  const result = await runCommand(
    process.execPath,
    [tsxCliPath, nodeCliPath, "build", projectRoot],
    repositoryRoot,
    process.env,
  );

  assert.equal(result.exitCode, 0);
  assert.match(result.stdout, /buildManifest:/);
  assert.match(result.stdout, /traits: 1/);
  assert.match(result.stdout, /traitDiagnostics: 1 \(0 errors, 1 warnings\)/);
  assert.doesNotMatch(result.stdout, /trait-missing-required-trait:/);
});

test("node info prints missing consumed capability diagnostics in human-readable output", async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-node-cli-missing-consumed-info-"));
  await createAutomationProjectFixture(projectRoot);

  await writeProjectFile(projectRoot, "barrits/traits/routing/slug.ts", [
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
  ].join("\n"));

  const result = await runCommand(
    process.execPath,
    [tsxCliPath, nodeCliPath, "info", projectRoot],
    repositoryRoot,
    process.env,
  );

  assert.equal(result.exitCode, 0);
  assert.match(result.stdout, /traits: 1/);
  assert.match(result.stdout, /traitDiagnostics: 1 \(0 errors, 1 warnings\)/);
  assert.match(result.stdout, /categories: 1 non-verifiable/);
  assert.match(result.stdout, /\[warning\] trait-missing-consumed-capability:/);
});

test("node build prints missing consumed capability summary in human-readable output", async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-node-cli-missing-consumed-build-"));
  await createAutomationProjectFixture(projectRoot);

  await writeProjectFile(projectRoot, "barrits/traits/routing/slug.ts", [
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
  ].join("\n"));

  const result = await runCommand(
    process.execPath,
    [tsxCliPath, nodeCliPath, "build", projectRoot],
    repositoryRoot,
    process.env,
  );

  assert.equal(result.exitCode, 0);
  assert.match(result.stdout, /buildManifest:/);
  assert.match(result.stdout, /traits: 1/);
  assert.match(result.stdout, /traitDiagnostics: 1 \(0 errors, 1 warnings\)/);
  assert.doesNotMatch(result.stdout, /trait-missing-consumed-capability:/);
});