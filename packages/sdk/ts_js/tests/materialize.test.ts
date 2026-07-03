import { describe, it, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { ensureManifestModuleFile } from "../src/barrits/plugins/materialize";

const tempDirs = new Set<string>();

after(async () => {
  const dirs = [...tempDirs];
  tempDirs.clear();
  await Promise.allSettled(dirs.map((d) => rm(d, { recursive: true, force: true })));
});

describe("ensureManifestModuleFile", () => {
  it("creates file with manifest content", async () => {
    const dir = await mkdtemp(join(tmpdir(), "barrits-materialize-")); tempDirs.add(dir);
    const filePath = join(dir, "manifest.ts");

    const manifest = {
      checksum: "sha256-test",
      generatedAt: new Date().toISOString(),
      projectRoot: dir,
      barritsDirectory: join(dir, "barrits"),
      strategy: "current-directory" as const,
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

    await ensureManifestModuleFile(filePath, manifest, "// banner");
    const content = await readFile(filePath, "utf8");
    assert.match(content, /sha256-test/);
    assert.match(content, /export const manifest =/);
  });

  it("creates file with null manifest", async () => {
    const dir = await mkdtemp(join(tmpdir(), "barrits-materialize-")); tempDirs.add(dir);
    const filePath = join(dir, "empty-manifest.ts");

    await ensureManifestModuleFile(filePath, null, "// banner");
    const content = await readFile(filePath, "utf8");
    assert.match(content, /export const manifest = null/);
  });

  it("creates intermediate directories", async () => {
    const dir = await mkdtemp(join(tmpdir(), "barrits-materialize-")); tempDirs.add(dir);
    const filePath = join(dir, "nested", "deep", "manifest.ts");

    await ensureManifestModuleFile(filePath, null, "");
    const content = await readFile(filePath, "utf8");
    assert.match(content, /export const manifest = null/);
  });
});
