import { describe, it, after } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { createNodeCliRuntime } from "../adapters/node/cli";
import { createHelpText, runCli } from "../src/barrits/sdk/cli-core";
import { DefaultBarritsLogger } from "../src/barrits/sdk/logger";
import { parseBuildManifest, verifyBuildManifest } from "../src/barrits/sdk";
import { createAutomationProjectFixture, writeProjectFile } from "./helpers/fixtures";

const tempDirs = new Set<string>();

after(async () => {
  await Promise.allSettled([...tempDirs].map((dir) => rm(dir, { recursive: true, force: true })));
});

const createProject = async (): Promise<string> => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-cli-core-"));
  tempDirs.add(projectRoot);
  await createAutomationProjectFixture(projectRoot);
  return projectRoot;
};

type CapturedOutput = { stdout: string[]; stderr: string[] };

const capture = async (run: () => Promise<number>): Promise<CapturedOutput & { exitCode: number }> => {
  const output: CapturedOutput = { stdout: [], stderr: [] };
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args: unknown[]) => output.stdout.push(args.map(String).join(" "));
  console.error = (...args: unknown[]) => output.stderr.push(args.map(String).join(" "));

  try {
    const exitCode = await run();
    return { ...output, exitCode };
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }
};

describe("createHelpText", () => {
  it("renders one usage block per command prefix", () => {
    const help = createHelpText(["barrits", "brt"]);
    assert.match(help, /^barrits SDK\n\nUsage:\n/);
    assert.match(help, /  barrits detect \[path\] \[--json\]/);
    assert.match(help, /  brt completion <bash\|zsh\|fish>/);
    assert.match(help, /Description:/);
  });
});

describe("runCli (Node runtime)", () => {
  const io = createNodeCliRuntime();

  it("prints help and completion without touching the filesystem", async () => {
    const help = await capture(() => runCli(io, ["help"]));
    assert.equal(help.exitCode, 0);
    assert.match(help.stdout.join("\n"), /Usage:/);

    const completion = await capture(() => runCli(io, ["completion", "zsh"]));
    assert.equal(completion.exitCode, 0);
    assert.match(completion.stdout.join("\n"), /compdef _barrits barrits brt/);
  });

  it("returns 1 with a JSON payload when no barrits directory exists", async () => {
    const emptyRoot = await mkdtemp(join(tmpdir(), "barrits-cli-core-empty-"));
    tempDirs.add(emptyRoot);

    const result = await capture(() => runCli(io, ["detect", emptyRoot, "--json"]));
    assert.equal(result.exitCode, 1);
    assert.deepEqual(JSON.parse(result.stderr.join("\n")), { found: false, target: "barrits" });
  });

  it("detects and inspects a project", async () => {
    const projectRoot = await createProject();

    const detect = await capture(() => runCli(io, ["detect", projectRoot, "--json"]));
    assert.equal(detect.exitCode, 0);
    assert.equal((JSON.parse(detect.stdout.join("\n")) as { strategy: string }).strategy, "direct-child");

    const info = await capture(() => runCli(io, ["info", projectRoot]));
    assert.equal(info.exitCode, 0);
    assert.match(info.stdout.join("\n"), /domains:\n {2}- logic/);
    assert.match(info.stdout.join("\n"), /duplicar/);
  });

  it("builds a sealed manifest and honours the configured automation directory", async () => {
    const projectRoot = await createProject();
    await writeProjectFile(projectRoot, "barrits.config.mjs", 'export default { automationDirectory: ".cache/barrits" };\n');

    const build = await capture(() => runCli(io, ["build", projectRoot, "--json"]));
    assert.equal(build.exitCode, 0);

    const manifestPath = join(projectRoot, ".cache", "barrits", "build-manifest.json");
    assert.ok(existsSync(manifestPath));
    const manifest = parseBuildManifest(await readFile(manifestPath, "utf8"));
    assert.deepEqual(manifest.domains, ["logic"]);
    assert.equal((await verifyBuildManifest(manifest)).valid, true);
    assert.equal(JSON.parse(build.stdout.join("\n")).checksum, manifest.checksum);
  });

  it("writes managed imports into the target file", async () => {
    const projectRoot = await createProject();

    const imports = await capture(() => runCli(io, ["imports", projectRoot, "--write", "--target", "src/main.ts"]));
    assert.equal(imports.exitCode, 0);

    const target = await readFile(join(projectRoot, "src", "main.ts"), "utf8");
    assert.match(
      target,
      /\/\/ barrits:auto-imports:start\nimport \{ duplicar \} from "@zuccadev-labs\/barrits";\n\/\/ barrits:auto-imports:end/,
    );
    assert.ok(existsSync(join(projectRoot, ".barrits", "import-actions.generated.ts")));
    assert.match(imports.stdout.join("\n"), /importsTarget: .*main\.ts/);
  });

  it("applies configured discoveryRoots and raises the logger level with debugCommands", async () => {
    const projectRoot = await createProject();
    await writeProjectFile(
      projectRoot,
      "barrits.config.mjs",
      'export default { debugCommands: true, discoveryRoots: ["src", "barrits", "src"] };\n',
    );
    await writeProjectFile(
      projectRoot,
      "src/traits/user.ts",
      [
        "/**",
        " * @barrits-trait user-service",
        " * @barrits-provides user",
        " */",
        'export const userServiceTrait = createTraitDescriptor({ name: "user-service", provides: ["user"], create: () => ({ user: 1 }) });',
        "",
      ].join("\n"),
    );

    const debugLines: string[] = [];
    const logger = new DefaultBarritsLogger("info");
    logger.debug = (message: string) => debugLines.push(message);

    const info = await capture(() => runCli(io, ["info", projectRoot], { logger }));
    assert.equal(info.exitCode, 0);
    assert.equal(logger.level, "debug");
    assert.match(info.stdout.join("\n"), /traits: 1/);
    assert.ok(
      debugLines.some((line) => line.includes("discoveryRoots=[src]")),
      debugLines.join("\n"),
    );
  });
});
