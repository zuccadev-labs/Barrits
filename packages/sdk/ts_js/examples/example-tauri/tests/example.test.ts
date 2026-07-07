import { describe, it } from "node:test";
import { ok, strictEqual } from "node:assert";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = resolve(__dirname, "..");
const url = (p: string) => pathToFileURL(resolve(root, p)).href;

describe("example-tauri", () => {
  it("barrits.config.ts: loads config with runtime 'browser'", async () => {
    const { default: config } = await import(url("barrits.config.ts"));
    strictEqual(config.runtime, "browser");
    strictEqual(config.watch, "auto");
    ok(config.autoManifest);
  });

  it("vite.config.ts: file has correct Tauri configuration structure", () => {
    // Read as text to avoid executing the module (uses __dirname which breaks in ESM)
    const content = readFileSync(resolve(root, "vite.config.ts"), "utf-8");
    ok(content.includes("clearScreen: false"));
    ok(content.includes("port: 1420"));
    ok(content.includes("strictPort: true"));
    ok(content.includes("TAURI_"));
    ok(content.includes("TAURI_"));
  });

  it("barrits: dist build exists with index.html", () => {
    const distIndex = resolve(root, "dist", "index.html");
    ok(existsSync(distIndex), `Expected dist/index.html to exist`);
    const content = readFileSync(distIndex, "utf-8");
    ok(content.includes("app"), "Expected dist/index.html to contain app element");
  });

  it("tauri: tauri.conf.json exists and has valid structure", () => {
    const confPath = resolve(root, "src-tauri", "tauri.conf.json");
    ok(existsSync(confPath), `Expected src-tauri/tauri.conf.json to exist`);
    const conf = JSON.parse(readFileSync(confPath, "utf-8"));
    ok(conf.$schema, "Config should have $schema");
    ok(conf.productName || conf.identifier, "Config should have productName or identifier");
  });

  it("tauri: Cargo.toml exists with tauri dependency", () => {
    const cargoPath = resolve(root, "src-tauri", "Cargo.toml");
    ok(existsSync(cargoPath), `Expected src-tauri/Cargo.toml to exist`);
    const content = readFileSync(cargoPath, "utf-8");
    ok(content.includes("tauri"), "Cargo.toml should depend on tauri");
  });

  it("barrits: main.ts source imports @tauri-apps/api and @zuccadev-labs/barrits/consume", () => {
    // Read as text — module uses `document` API not available in Node.js
    const content = readFileSync(resolve(root, "src/main.ts"), "utf-8");
    ok(content.includes("@tauri-apps/api/core"), "Should import from @tauri-apps/api/core");
    ok(content.includes("@zuccadev-labs/barrits/consume"), "Should import from @zuccadev-labs/barrits/consume");
    ok(content.includes("readBuildManifestSummary"), "Should use readBuildManifestSummary");
    ok(content.includes("readLanguageToolSnapshot"), "Should use readLanguageToolSnapshot");
  });
});
