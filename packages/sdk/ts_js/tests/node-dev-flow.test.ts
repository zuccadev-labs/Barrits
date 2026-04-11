import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { createAutomationProjectFixture, writeProjectFile } from "./helpers/fixtures";
import { runCommand } from "./helpers/process";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(repositoryRoot, "..", "..", "..");
const tsxCliPath = join(workspaceRoot, "node_modules", "tsx", "dist", "cli.mjs");
const nodeAdapterPath = pathToFileURL(join(repositoryRoot, "dist", "adapters", "node", "index.js")).href;
const nodeCliPath = join(repositoryRoot, "adapters", "node", "cli.ts");

test("node dev flow runs a child consumer with manifest and snapshot outputs", async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-node-dev-flow-"));
  await createAutomationProjectFixture(projectRoot);
  await writeProjectFile(projectRoot, "barrits.config.mjs", [
    "export default {",
    '  automationDirectory: ".cache/barrits",',
    "};",
    "",
  ].join("\n"));

  const consumerScriptPath = await writeProjectFile(projectRoot, "scripts/dev-consumer.mjs", [
    `import { readNodeBuildManifestSummary, readNodeLanguageToolSnapshot } from ${JSON.stringify(nodeAdapterPath)};`,
    "",
    'const buildManifestPath = process.env.BARRITS_BUILD_MANIFEST;',
    'const snapshotPath = process.env.BARRITS_WATCH_SNAPSHOT;',
    'const devMode = process.env.BARRITS_DEV_MODE ?? "";',
    "",
    'if (!buildManifestPath || !snapshotPath || devMode !== "1") {',
    '  console.error("missing-dev-environment");',
    '  process.exit(1);',
    "}",
    "",
    "const buildSummary = await readNodeBuildManifestSummary(buildManifestPath);",
    "const snapshot = await readNodeLanguageToolSnapshot(snapshotPath);",
    "",
    "console.log(\"BARRITS_CHILD_PAYLOAD::\" + JSON.stringify({",
    "  devMode,",
    "  buildManifestPath,",
    "  snapshotPath,",
    "  buildDomains: buildSummary.domains,",
    "  snapshotMode: snapshot.mode,",
    "  snapshotDomains: snapshot.domains.map((domain) => domain.name),",
    "  importStatements: snapshot.importStatements,",
    "}));",
  ].join("\n"));

  const result = await runCommand(
    process.execPath,
    [
      tsxCliPath,
      nodeCliPath,
      "dev",
      projectRoot,
      "--write-snapshot",
      "--",
      process.execPath,
      consumerScriptPath,
    ],
    repositoryRoot,
    process.env,
  );

  assert.equal(result.exitCode, 0);
  assert.match(result.stdout, /watching for changes in barrits\//);
  assert.doesNotMatch(result.stderr, /missing-dev-environment/);

  const payloadLine = result.stdout
    .split(/\r?\n/)
    .find((line) => line.startsWith("BARRITS_CHILD_PAYLOAD::"));
  assert.ok(payloadLine);

  const payload = JSON.parse(payloadLine.slice("BARRITS_CHILD_PAYLOAD::".length));
  assert.equal(payload.devMode, "1");
  assert.deepEqual(payload.buildDomains, ["logic"]);
  assert.equal(payload.snapshotMode, "dev");
  assert.deepEqual(payload.snapshotDomains, ["logic"]);
  assert.ok(payload.importStatements.includes('import { duplicar } from "@zuccadev-labs/barrits";'));

  const buildManifestPath = join(projectRoot, ".cache", "barrits", "build-manifest.json");
  const snapshotPath = join(projectRoot, ".cache", "barrits", "watch-snapshot.json");
  const buildManifestSource = await readFile(buildManifestPath, "utf8");
  const snapshotSource = await readFile(snapshotPath, "utf8");

  assert.match(buildManifestSource, /"domains":\s*\[\s*"logic"/m);
  assert.match(snapshotSource, /"mode":\s*"dev"/);
});