import { describe, it } from "node:test";
import { ok, strictEqual } from "node:assert";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = resolve(__dirname, "..");
const url = (p: string) => pathToFileURL(resolve(root, p)).href;

describe("examples-bundlers", () => {
  it("barrits.config.ts: loads config with runtime 'other'", async () => {
    const { default: config } = await import(url("barrits.config.ts"));
    strictEqual(config.runtime, "other");
    strictEqual(config.watch, "auto");
    ok(config.autoManifest);
  });

  it("barrits: math barrel exports duplicar and triplicar", async () => {
    const mod = await import(url("barrits/logic/math.ts"));
    strictEqual(mod.duplicar(2), 4);
    strictEqual(mod.duplicar(5), 10);
    strictEqual(mod.triplicar(3), 9);
    strictEqual(mod.triplicar(7), 21);
  });

  describe("vite bundler", () => {
    it("vite.config.ts: loads with correct configuration", async () => {
      const { default: config } = await import(url("vite/vite.config.ts"));
      ok(config);
    });

    it("dist output exists for vite", () => {
      const distPath = resolve(root, "dist", "vite", "main.js");
      ok(existsSync(distPath), `Expected dist/vite/main.js to exist`);
      const content = readFileSync(distPath, "utf-8");
      ok(content.length > 0, "Dist output should not be empty");
    });
  });

  describe("esbuild bundler", () => {
    it("esbuild.config.mjs: loads with correct configuration", async () => {
      const mod = await import(url("esbuild/esbuild.config.mjs"));
      ok(mod);
    });

    it("dist output exists for esbuild", () => {
      const distPath = resolve(root, "dist", "esbuild", "main.js");
      ok(existsSync(distPath), `Expected dist/esbuild/main.js to exist`);
      const content = readFileSync(distPath, "utf-8");
      ok(content.length > 0, "Dist output should not be empty");
    });
  });

  describe("rollup bundler", () => {
    it("rollup.config.mjs: loads with correct configuration", async () => {
      const mod = await import(url("rollup/rollup.config.mjs"));
      ok(mod);
    });

    it("dist output exists for rollup", () => {
      const distPath = resolve(root, "dist", "rollup", "main.js");
      ok(existsSync(distPath), `Expected dist/rollup/main.js to exist`);
      const content = readFileSync(distPath, "utf-8");
      ok(content.length > 0, "Dist output should not be empty");
    });
  });

  describe("webpack bundler", () => {
    it("webpack.config.mjs: loads with correct configuration", async () => {
      const mod = await import(url("webpack/webpack.config.mjs"));
      ok(mod);
    });

    it("dist output exists for webpack", () => {
      const distPath = resolve(root, "dist", "webpack", "main.js");
      ok(existsSync(distPath), `Expected dist/webpack/main.js to exist`);
      const content = readFileSync(distPath, "utf-8");
      ok(content.length > 0, "Dist output should not be empty");
    });
  });

  it("barrits: .barrits/auto-build-manifest.json exists and is valid", () => {
    const manifestPath = resolve(root, ".barrits", "auto-build-manifest.json");
    ok(existsSync(manifestPath), `Expected .barrits/auto-build-manifest.json to exist`);
    const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
    ok(manifest.generatedAt, "Manifest should have generatedAt");
    ok(manifest.checksum, "Manifest should have checksum");
  });
});
