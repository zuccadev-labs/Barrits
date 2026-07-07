import { describe, it } from "node:test";
import { ok, strictEqual } from "node:assert";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = resolve(__dirname, "..");
const url = (p: string) => pathToFileURL(resolve(root, p)).href;

describe("example-react", () => {
  it("barrits.config.ts: loads config with runtime 'react'", async () => {
    const { default: config } = await import(url("barrits.config.ts"));
    strictEqual(config.runtime, "react");
    strictEqual(config.watch, "auto");
    ok(config.autoManifest);
  });

  it("barrits: exports from src/barrits/index.ts", async () => {
    const mod = await import(url("src/barrits/index.ts"));
    ok(typeof mod.AppRouterProvider !== "undefined");
    ok(typeof mod.useAppRouter !== "undefined");
  });

  it("barrits: vite.config.ts loads with barrits plugin", async () => {
    const { default: config } = await import(url("vite.config.ts"));
    ok(config);
    const plugins = Array.isArray(config.plugins) ? config.plugins : [];
    ok(plugins.length >= 2, "Expected at least 2 plugins (react + barritsVitePlugin)");
  });

  it("barrits: dist build exists with index.html", () => {
    const distIndex = resolve(root, "dist", "index.html");
    ok(existsSync(distIndex), `Expected dist/index.html to exist`);
    const content = readFileSync(distIndex, "utf-8");
    ok(content.includes("root"), "Expected dist/index.html to contain root element");
  });

  it("barrits: .barrits/auto-build-manifest.json exists and is valid", () => {
    const manifestPath = resolve(root, ".barrits", "auto-build-manifest.json");
    ok(existsSync(manifestPath), `Expected .barrits/auto-build-manifest.json to exist`);
    const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
    ok(manifest.generatedAt, "Manifest should have generatedAt");
    ok(manifest.checksum, "Manifest should have checksum");
  });

  it("barrits: auth.domain trait exports", async () => {
    const mod = await import(url("src/barrits/traits/auth.domain.ts"));
    ok(typeof mod.createAuthSession === "function");
    ok(typeof mod.getCurrentUser === "function");
    ok(typeof mod.checkPermission === "function");
  });
});
