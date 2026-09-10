import { describe, it, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  BarritsConfigError,
  defineBarritsConfig,
  findBarritsConfigFile,
  loadBarritsConfig,
  resolveBarritsConfig,
  DEFAULT_AUTOMATION_DIRECTORY,
  BARRITS_CONFIG_FILENAMES,
} from "../src/barrits/config";

const tempDirs = new Set<string>();

after(async () => {
  const dirs = [...tempDirs];
  tempDirs.clear();
  await Promise.allSettled(dirs.map((d) => rm(d, { recursive: true, force: true })));
});

const createTempDir = async (): Promise<string> => {
  const dir = await mkdtemp(join(tmpdir(), "barrits-config-"));
  tempDirs.add(dir);
  return dir;
};

describe("DEFAULT_AUTOMATION_DIRECTORY", () => {
  it("is '.barrits'", () => {
    assert.equal(DEFAULT_AUTOMATION_DIRECTORY, ".barrits");
  });
});

describe("BARRITS_CONFIG_FILENAMES", () => {
  it("contains expected filenames in order", () => {
    assert.deepEqual([...BARRITS_CONFIG_FILENAMES], ["barrits.config.ts", "barrits.config.mts", "barrits.config.js", "barrits.config.mjs"]);
  });
});

describe("defineBarritsConfig", () => {
  it("returns the same config object", () => {
    const config = { runtime: "node" as const };
    assert.equal(defineBarritsConfig(config), config);
  });

  it("preserves runtime type", () => {
    const result = defineBarritsConfig({ runtime: "deno", watch: "auto" });
    assert.equal(result.runtime, "deno");
    assert.equal(result.watch, "auto");
  });

  it("accepts empty config", () => {
    const result = defineBarritsConfig({});
    assert.deepEqual(result, {});
  });
});

describe("findBarritsConfigFile", () => {
  it("finds barrits.config.mjs when present", async () => {
    const dir = await createTempDir();
    await writeFile(join(dir, "barrits.config.mjs"), "export default {};");
    const result = await findBarritsConfigFile(dir);
    assert.ok(result);
    assert.ok(result.endsWith("barrits.config.mjs"));
  });

  it("finds barrits.config.ts when present", async () => {
    const dir = await createTempDir();
    await writeFile(join(dir, "barrits.config.ts"), `export default {} as const;`);
    const result = await findBarritsConfigFile(dir);
    assert.ok(result);
    assert.ok(result.endsWith("barrits.config.ts"));
  });

  it("returns undefined when no config file exists", async () => {
    const dir = await createTempDir();
    const result = await findBarritsConfigFile(dir);
    assert.equal(result, undefined);
  });

  it("prefers the TypeScript candidate when several files exist", async () => {
    const dir = await createTempDir();
    await writeFile(join(dir, "barrits.config.mjs"), "export default {};");
    await writeFile(join(dir, "barrits.config.ts"), "export default {};");
    const result = await findBarritsConfigFile(dir);
    assert.ok(result?.endsWith("barrits.config.ts"));
  });
});

describe("loadBarritsConfig", () => {
  it("loads config from barrits.config.mjs", async () => {
    const dir = await createTempDir();
    const configContent = `export default { runtime: "deno", watch: "manual" };`;
    await writeFile(join(dir, "barrits.config.mjs"), configContent);
    const result = await loadBarritsConfig(dir);
    assert.ok(result);
    assert.equal(result.runtime, "deno");
    assert.equal(result.watch, "manual");
    assert.ok(result.configFilePath);
    assert.ok(result.configFilePath.endsWith("barrits.config.mjs"));
  });

  it("loads config with barritsConfig named export", async () => {
    const dir = await createTempDir();
    const configContent = `export const barritsConfig = { runtime: "deno" };`;
    await writeFile(join(dir, "barrits.config.mjs"), configContent);
    const result = await loadBarritsConfig(dir);
    assert.ok(result);
    assert.equal(result.runtime, "deno");
  });

  it("returns null when no config file exists", async () => {
    const dir = await createTempDir();
    const result = await loadBarritsConfig(dir);
    assert.equal(result, null);
  });

  it("throws BarritsConfigError when config does not export an object", async () => {
    const dir = await createTempDir();
    await writeFile(join(dir, "barrits.config.mjs"), "export default 42;");
    await assert.rejects(
      () => loadBarritsConfig(dir),
      (error: unknown) => {
        assert.ok(error instanceof BarritsConfigError);
        assert.match(error.message, /must export an object/);
        return true;
      },
    );
  });
});

describe("loadBarritsConfig TypeScript fallback", () => {
  const unknownExtensionError = (): Error =>
    Object.assign(new Error('Unknown file extension ".ts"'), { code: "ERR_UNKNOWN_FILE_EXTENSION" });

  it("transpiles a .ts config next to the original file when the runtime cannot import TypeScript", async () => {
    const dir = await createTempDir();
    await writeFile(
      join(dir, "barrits.config.ts"),
      [
        'type Shape = { runtime: "deno"; watch: "manual"; automationDirectory: string };',
        'const config: Shape = { runtime: "deno", watch: "manual", automationDirectory: ".cache/barrits" };',
        "export default config;",
        "",
      ].join("\n"),
    );

    const attempts: string[] = [];
    const importModule = async (specifier: string): Promise<Record<string, unknown>> => {
      attempts.push(specifier);
      if (specifier.endsWith(".ts")) {
        throw unknownExtensionError();
      }
      return (await import(specifier)) as Record<string, unknown>;
    };

    const result = await loadBarritsConfig(dir, { importModule });
    assert.ok(result);
    assert.equal(result.runtime, "deno");
    assert.equal(result.automationDirectory, ".cache/barrits");
    assert.ok(result.configFilePath?.endsWith("barrits.config.ts"));
    assert.equal(attempts.length, 2);
    assert.match(attempts[1], /\.tmp\.mjs$/);
    assert.deepEqual(await readdir(dir), ["barrits.config.ts"], "temporary module must be removed");
  });

  it("does not retry when the config module itself throws", async () => {
    const dir = await createTempDir();
    await writeFile(join(dir, "barrits.config.ts"), 'throw new Error("boom");\n');
    let attempts = 0;
    const importModule = async (): Promise<Record<string, unknown>> => {
      attempts += 1;
      throw new Error("boom");
    };

    await assert.rejects(
      () => loadBarritsConfig(dir, { importModule }),
      (error: unknown) => {
        assert.ok(error instanceof BarritsConfigError);
        assert.match(error.message, /Unable to load Barrits config/);
        assert.match(error.message, /boom/);
        assert.ok(error.configFilePath.endsWith("barrits.config.ts"));
        return true;
      },
    );
    assert.equal(attempts, 1);
  });

  it("wraps import failures of JavaScript configs in BarritsConfigError", async () => {
    const dir = await createTempDir();
    await writeFile(join(dir, "barrits.config.mjs"), 'import "./missing-dependency.mjs";\nexport default {};\n');

    await assert.rejects(
      () => loadBarritsConfig(dir),
      (error: unknown) => {
        assert.ok(error instanceof BarritsConfigError);
        assert.match(error.message, /barrits\.config\.mjs/);
        return true;
      },
    );
  });
});

describe("resolveBarritsConfig", () => {
  it("returns defaults when no config file and no options", async () => {
    const dir = await createTempDir();
    const result = await resolveBarritsConfig({}, dir);
    assert.equal(result.runtime, "other");
    assert.equal(result.watch, "auto");
    assert.equal(result.autoManifest, true);
    assert.equal(result.debugCommands, false);
    assert.equal(result.traitConflictStrategy, "error");
    assert.equal(result.automationDirectory, ".barrits");
  });

  it("overrides runtime with explicit option", async () => {
    const dir = await createTempDir();
    const result = await resolveBarritsConfig({ runtime: "node" }, dir);
    assert.equal(result.runtime, "node");
  });

  it("overrides watch with explicit option", async () => {
    const dir = await createTempDir();
    const result = await resolveBarritsConfig({ watch: "off" }, dir);
    assert.equal(result.watch, "off");
  });

  it("merges options from config file with explicit overrides", async () => {
    const dir = await createTempDir();
    await writeFile(join(dir, "barrits.config.mjs"), `export default { runtime: "deno", watch: "manual" };`);
    const result = await resolveBarritsConfig({ runtime: "node" }, dir);
    assert.equal(result.runtime, "node");
    assert.equal(result.watch, "manual");
  });

  it("uses fallbackProjectRoot when no projectRoot in options", async () => {
    const dir = await createTempDir();
    const result = await resolveBarritsConfig({}, dir);
    assert.equal(result.projectRoot, dir);
  });

  it("configFilePath is undefined when no config file", async () => {
    const dir = await createTempDir();
    const result = await resolveBarritsConfig({}, dir);
    assert.equal(result.configFilePath, undefined);
  });
});
