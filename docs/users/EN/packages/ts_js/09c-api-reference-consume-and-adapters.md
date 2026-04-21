# API Reference — Consume and Adapters

This reference covers the specialized subpath APIs: `barrits/consume` for runtime-agnostic artifact reading, `barrits/node` and `barrits/deno` for runtime-specific filesystem access, and the bundler plugins.

---

## `@zuccadev-labs/barrits/consume`

Runtime-agnostic readers that accept an injected `readTextFile` function. This decoupling allows the same reading logic to work in Tauri, backend scripts, serverless functions, or any environment where the filesystem access mechanism differs.

### `readBuildManifest(path, readTextFile)`

Reads and parses a build manifest using the provided text reader.

```ts
import { readBuildManifest } from "@zuccadev-labs/barrits/consume";

const manifest = await readBuildManifest(".barrits/manifest.json", async (p) => {
  return await fetch(p).then((r) => r.text()); // or Tauri's readTextFile
});
```

### `readBuildManifestSummary(path, readTextFile)`

Reads the manifest and returns its summary directly.

Appears in: `examples/example-tauri/src/main.ts`.

### `readWatchSnapshot(path, readTextFile)`

Reads and parses a watch snapshot.

### `readWatchSnapshotSummary(path, readTextFile)`

Reads and summarizes the watch snapshot.

### `readLanguageToolSnapshot(path, readTextFile)`

Reads a language tooling snapshot.

Appears in: `examples/example-tauri/src/main.ts`.

---

## `@zuccadev-labs/barrits/node`

Node.js-native filesystem helpers. These are pre-wired wrappers over the `consume` readers.

### `createNodeFileSystemAdapter()`

Creates a Node.js filesystem adapter for discovery and inspection.

```ts
import { createNodeFileSystemAdapter } from "@zuccadev-labs/barrits/node";

const adapter = createNodeFileSystemAdapter();
```

### `readNodeBuildManifest(path)`

Reads a build manifest from disk in Node.js.

### `readNodeBuildManifestSummary(path)`

Reads and summarizes the manifest from disk.

Appears in: `examples/example-nodejs/scripts/build-runner.mjs`.

```ts
import { readNodeBuildManifestSummary } from "@zuccadev-labs/barrits/node";

const summary = await readNodeBuildManifestSummary(".barrits/manifest.json");
console.log(summary.domains);
```

### `readNodeWatchSnapshot(path)`

Reads a watch snapshot from disk in Node.js.

### `readNodeWatchSnapshotSummary(path)`

Reads and summarizes the watch snapshot.

### `readNodeLanguageToolSnapshot(path)`

Reads a language tooling snapshot from disk.

Appears in: `examples/example-nodejs/scripts/snapshot-consumer.mjs`.

### `runNodeCli(argumentsList?)`

Executes the Barrits Node.js CLI from code, without a manual spawn.

```ts
import { runNodeCli } from "@zuccadev-labs/barrits/node";

await runNodeCli(["build"]);
```

---

## `@zuccadev-labs/barrits/deno`

Deno-native equivalents of the Node.js adapter.

### `createDenoFileSystemAdapter()`

Creates a Deno filesystem adapter for discovery and inspection.

### `readDenoBuildManifest(path)`

Reads a build manifest in Deno.

### `readDenoBuildManifestSummary(path)`

Reads and summarizes the manifest in Deno.

### `readDenoWatchSnapshot(path)`

Reads a watch snapshot in Deno.

### `readDenoWatchSnapshotSummary(path)`

Reads and summarizes the watch snapshot in Deno.

### `readDenoLanguageToolSnapshot(path)`

Reads a language tooling snapshot in Deno.

### `runDenoCli(argumentsList?)`

Executes the Barrits Deno CLI from code.

```ts
import { runDenoCli } from "@zuccadev-labs/barrits/deno";

await runDenoCli(["inspect"]);
```

---

## Bundler Plugins

### `barritsVitePlugin(options)`

Integrates the package-first contract into Vite.

```ts
import { barritsVitePlugin } from "@zuccadev-labs/barrits/vite";
import { defineBarritsPackage, toBarritsAutomationOptions } from "@zuccadev-labs/barrits";

const pkg = defineBarritsPackage({ runtime: "react", watch: "auto" });

export default defineConfig({
  plugins: [barritsVitePlugin({ package: toBarritsAutomationOptions(pkg) })],
});
```

Appears in: `examples/example-react/vite.config.ts`, `examples/example-vue/vite.config.ts`, `examples/example-solid/vite.config.ts`, `examples/example-svelte/vite.config.ts`, `examples/bundlers/vite/vite.config.ts`.

### `barritsEsbuildPlugin(options)`

Integrates the package-first contract into esbuild.

Appears in: `examples/bundlers/esbuild/esbuild.config.mjs`.

### `barritsRollupPlugin(options)`

Integrates the package-first contract into Rollup.

Appears in: `examples/bundlers/rollup/rollup.config.mjs`.

### `barritsWebpackPlugin(options)` / `BarritsWebpackPlugin`

Integrates the package-first contract into Webpack. Available both as a factory function and as a class for explicit instantiation.

```ts
import { BarritsWebpackPlugin } from "@zuccadev-labs/barrits/webpack";

module.exports = {
  plugins: [new BarritsWebpackPlugin({ /* options */ })],
};
```

Appears in: `examples/bundlers/webpack/webpack.config.mjs`.

---

[← API Reference — Algorithms](09b-api-reference-algorithms.md) | [← Index](00-index.md)
