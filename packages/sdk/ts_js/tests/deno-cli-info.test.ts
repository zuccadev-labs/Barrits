import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { createAutomationProjectFixture, writeProjectFile } from "./helpers/fixtures";
import { runCommand } from "./helpers/process";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const denoCliPath = join(repositoryRoot, "adapters", "deno", "cli.ts");

const writeDependencyDriftTrait = async (projectRoot: string): Promise<void> => {
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
};

const writeContradictoryPortableTrait = async (projectRoot: string): Promise<void> => {
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
};

const writeMissingConsumedCapabilityTrait = async (projectRoot: string): Promise<void> => {
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
};

test("deno info prints dependency, state, and conflicts drift diagnostics in human-readable output", { concurrency: false }, async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-deno-cli-dependency-drift-info-"));
  await createAutomationProjectFixture(projectRoot);
  await writeDependencyDriftTrait(projectRoot);

  const result = await runCommand(
    "deno",
    ["run", "-A", denoCliPath, "info", projectRoot],
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

test("deno build prints dependency, state, and conflicts drift summary in human-readable output", { concurrency: false }, async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-deno-cli-dependency-drift-build-"));
  await createAutomationProjectFixture(projectRoot);
  await writeDependencyDriftTrait(projectRoot);

  const result = await runCommand(
    "deno",
    ["run", "-A", denoCliPath, "build", projectRoot],
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

test("deno info prints contradictory portable trait contract diagnostics in human-readable output", { concurrency: false }, async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-deno-cli-policy-drift-info-"));
  await createAutomationProjectFixture(projectRoot);
  await writeContradictoryPortableTrait(projectRoot);

  const result = await runCommand(
    "deno",
    ["run", "-A", denoCliPath, "info", projectRoot],
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

test("deno build prints contradictory portable trait contract summary in human-readable output", { concurrency: false }, async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-deno-cli-policy-drift-build-"));
  await createAutomationProjectFixture(projectRoot);
  await writeContradictoryPortableTrait(projectRoot);

  const result = await runCommand(
    "deno",
    ["run", "-A", denoCliPath, "build", projectRoot],
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

test("deno info prints missing consumed capability diagnostics in human-readable output", { concurrency: false }, async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-deno-cli-missing-consumed-info-"));
  await createAutomationProjectFixture(projectRoot);
  await writeMissingConsumedCapabilityTrait(projectRoot);

  const result = await runCommand(
    "deno",
    ["run", "-A", denoCliPath, "info", projectRoot],
    repositoryRoot,
    process.env,
  );

  assert.equal(result.exitCode, 0);
  assert.match(result.stdout, /traits: 1/);
  assert.match(result.stdout, /traitDiagnostics: 1 \(0 errors, 1 warnings\)/);
  assert.match(result.stdout, /categories: 1 non-verifiable/);
  assert.match(result.stdout, /\[warning\] trait-missing-consumed-capability:/);
});

test("deno build prints missing consumed capability summary in human-readable output", { concurrency: false }, async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-deno-cli-missing-consumed-build-"));
  await createAutomationProjectFixture(projectRoot);
  await writeMissingConsumedCapabilityTrait(projectRoot);

  const result = await runCommand(
    "deno",
    ["run", "-A", denoCliPath, "build", projectRoot],
    repositoryRoot,
    process.env,
  );

  assert.equal(result.exitCode, 0);
  assert.match(result.stdout, /buildManifest:/);
  assert.match(result.stdout, /traits: 1/);
  assert.match(result.stdout, /traitDiagnostics: 1 \(0 errors, 1 warnings\)/);
  assert.doesNotMatch(result.stdout, /trait-missing-consumed-capability:/);
});