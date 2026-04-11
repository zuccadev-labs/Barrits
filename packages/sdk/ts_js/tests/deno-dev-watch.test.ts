import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { createAutomationProjectFixture, writeProjectFile } from "./helpers/fixtures";
import { runCommand, spawnCommand, waitForProcessExit, waitForProcessOutput } from "./helpers/process";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const denoAdapterPath = pathToFileURL(join(repositoryRoot, "dist", "adapters", "deno", "mod.js")).href;
const denoCliPath = join(repositoryRoot, "adapters", "deno", "cli.ts");

const waitFor = async (predicate: () => Promise<boolean>, timeoutMs = 5000): Promise<void> => {
  const start = Date.now();

  while ((Date.now() - start) < timeoutMs) {
    if (await predicate()) {
      return;
    }

    await new Promise((resolvePromise) => setTimeout(resolvePromise, 100));
  }

  throw new Error("Timed out waiting for condition");
};

test("deno dev flow runs a child consumer with manifest and snapshot outputs", { concurrency: false }, async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-deno-dev-flow-"));
  await createAutomationProjectFixture(projectRoot);
  await writeProjectFile(projectRoot, "barrits.config.mjs", [
    "export default {",
    '  automationDirectory: ".cache/barrits",',
    "};",
    "",
  ].join("\n"));

  const consumerScriptPath = await writeProjectFile(projectRoot, "scripts/dev-consumer.ts", [
    `import { readDenoBuildManifestSummary, readDenoLanguageToolSnapshot } from ${JSON.stringify(denoAdapterPath)};`,
    "",
    'const buildManifestPath = Deno.env.get("BARRITS_BUILD_MANIFEST");',
    'const snapshotPath = Deno.env.get("BARRITS_WATCH_SNAPSHOT");',
    'const devMode = Deno.env.get("BARRITS_DEV_MODE") ?? "";',
    "",
    'if (!buildManifestPath || !snapshotPath || devMode !== "1") {',
    '  console.error("missing-deno-dev-environment");',
    '  Deno.exit(1);',
    "}",
    "",
    "const buildSummary = await readDenoBuildManifestSummary(buildManifestPath);",
    "const snapshot = await readDenoLanguageToolSnapshot(snapshotPath);",
    "",
    'console.log("BARRITS_DENO_CHILD_PAYLOAD::" + JSON.stringify({',
    '  devMode,',
    '  buildDomains: buildSummary.domains,',
    '  snapshotMode: snapshot.mode,',
    '  snapshotDomains: snapshot.domains.map((domain) => domain.name),',
    '  importStatements: snapshot.importStatements,',
    '}));',
  ].join("\n"));

  const result = await runCommand(
    "deno",
    [
      "run",
      "-A",
      denoCliPath,
      "dev",
      projectRoot,
      "--write-snapshot",
      "--",
      "deno",
      "run",
      "-A",
      consumerScriptPath,
    ],
    repositoryRoot,
    process.env,
  );

  assert.equal(result.exitCode, 0);
  assert.match(result.stdout, /watching for changes in barrits\//);
  assert.doesNotMatch(result.stderr, /missing-deno-dev-environment/);

  const payloadLine = result.stdout
    .split(/\r?\n/)
    .find((line) => line.startsWith("BARRITS_DENO_CHILD_PAYLOAD::"));
  assert.ok(payloadLine);

  const payload = JSON.parse(payloadLine.slice("BARRITS_DENO_CHILD_PAYLOAD::".length));
  assert.equal(payload.devMode, "1");
  assert.deepEqual(payload.buildDomains, ["logic"]);
  assert.equal(payload.snapshotMode, "dev");
  assert.deepEqual(payload.snapshotDomains, ["logic"]);
  assert.ok(payload.importStatements.includes('import { duplicar } from "@zuccadev-labs/barrits";'));

  const buildManifestSource = await readFile(join(projectRoot, ".cache", "barrits", "build-manifest.json"), "utf8");
  const snapshotSource = await readFile(join(projectRoot, ".cache", "barrits", "watch-snapshot.json"), "utf8");
  assert.match(buildManifestSource, /"domains":\s*\[\s*"logic"/m);
  assert.match(snapshotSource, /"mode":\s*"dev"/);
});

test("deno watch updates snapshot after chained hot file changes in one session", { concurrency: false }, async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-deno-watch-flow-"));
  await createAutomationProjectFixture(projectRoot);
  await writeProjectFile(projectRoot, "barrits.config.mjs", [
    "export default {",
    '  automationDirectory: ".cache/barrits",',
    "};",
    "",
  ].join("\n"));
  const mutationScriptPath = await writeProjectFile(projectRoot, "scripts/mutate-watch-fixture.ts", [
    'const phase = Deno.args[0] ?? "phase-1";',
    `const projectRoot = ${JSON.stringify(projectRoot.replace(/\\/g, "/"))};`,
    "",
    'if (phase === "phase-1") {',
    '  await Deno.writeTextFile(`${projectRoot}/barrits/logic/duplicar.ts`, [',
    '    "export const duplicar = (value: number) => value * 2;",',
    '    "export const triplicar = (value: number) => value * 3;",',
    '    "",',
    '  ].join("\\n"));',
    '  await Deno.writeTextFile(`${projectRoot}/barrits/logic/index.ts`, "export { duplicar, triplicar } from \\\"./duplicar\\\";\\n");',
    '  await Deno.writeTextFile(`${projectRoot}/barrits/index.ts`, "export { duplicar, triplicar } from \\\"./logic\\\";\\n");',
    '} else {',
    '  await Deno.writeTextFile(`${projectRoot}/barrits/logic/duplicar.ts`, [',
    '    "export const duplicar = (value: number) => value * 2;",',
    '    "export const cuadruplicar = (value: number) => value * 4;",',
    '    "",',
    '  ].join("\\n"));',
    '  await Deno.writeTextFile(`${projectRoot}/barrits/logic/index.ts`, "export { duplicar, cuadruplicar } from \\\"./duplicar\\\";\\n");',
    '  await Deno.writeTextFile(`${projectRoot}/barrits/index.ts`, "export { duplicar, cuadruplicar } from \\\"./logic\\\";\\n");',
    '}',
  ].join("\n"));

  const watchProcess = spawnCommand(
    "deno",
    [
      "run",
      "-A",
      denoCliPath,
      "watch",
      projectRoot,
      "--write-snapshot",
    ],
    repositoryRoot,
    process.env,
  );

  try {
    await waitForProcessOutput(watchProcess, /watching for changes in barrits\//, 8000);

    const snapshotPath = join(projectRoot, ".cache", "barrits", "watch-snapshot.json");
    await waitFor(async () => {
      try {
        const source = await readFile(snapshotPath, "utf8");
        return /"importStatements"/m.test(source) || /"graph"/m.test(source);
      } catch {
        return false;
      }
    }, 8000);

    const mutationResult = await runCommand(
      "deno",
      ["run", "-A", mutationScriptPath, "phase-1"],
      repositoryRoot,
      process.env,
    );
    assert.equal(mutationResult.exitCode, 0);

    await waitFor(async () => {
      const snapshotSource = await readFile(snapshotPath, "utf8");
      const buildManifestSource = await readFile(join(projectRoot, ".cache", "barrits", "build-manifest.json"), "utf8");
      return snapshotSource.includes("triplicar") && buildManifestSource.includes("triplicar");
    }, 20000);

    const snapshotSource = await readFile(snapshotPath, "utf8");
    const buildManifestSource = await readFile(join(projectRoot, ".cache", "barrits", "build-manifest.json"), "utf8");
    assert.match(snapshotSource, /triplicar/);
    assert.match(snapshotSource, /"mode":\s*"watch"/);
    assert.match(buildManifestSource, /triplicar/);

    const secondMutationResult = await runCommand(
      "deno",
      ["run", "-A", mutationScriptPath, "phase-2"],
      repositoryRoot,
      process.env,
    );
    assert.equal(secondMutationResult.exitCode, 0);

    await waitFor(async () => {
      const nextSnapshotSource = await readFile(snapshotPath, "utf8");
      const nextBuildManifestSource = await readFile(join(projectRoot, ".cache", "barrits", "build-manifest.json"), "utf8");
      return nextSnapshotSource.includes("cuadruplicar")
        && nextBuildManifestSource.includes("cuadruplicar")
        && !nextSnapshotSource.includes("triplicar")
        && !nextBuildManifestSource.includes("triplicar");
    }, 20000);

    const nextSnapshotSource = await readFile(snapshotPath, "utf8");
    const nextBuildManifestSource = await readFile(join(projectRoot, ".cache", "barrits", "build-manifest.json"), "utf8");
    assert.match(nextSnapshotSource, /cuadruplicar/);
    assert.doesNotMatch(nextSnapshotSource, /triplicar/);
    assert.match(nextBuildManifestSource, /cuadruplicar/);
    assert.doesNotMatch(nextBuildManifestSource, /triplicar/);
  } finally {
    watchProcess.kill("SIGTERM");
    await waitForProcessExit(watchProcess, 8000).catch(() => undefined);
  }
});