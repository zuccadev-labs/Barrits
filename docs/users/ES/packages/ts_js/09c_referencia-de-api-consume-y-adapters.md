# 09c — Referencia de API: Consume y Adapters

Este documento cubre los subpaths especializados: `barrits/consume` para lectura de artefactos agnóstica de runtime, `barrits/node` y `barrits/deno` para acceso al sistema de archivos, y los plugins de bundlers.

---

## `@zuccadev-labs/barrits/consume`

Readers agnósticos de runtime que aceptan una función `readTextFile` inyectada. Este desacoplamiento permite usar la misma lógica de lectura en Tauri, scripts backend, funciones serverless o cualquier entorno donde el mecanismo de filesystem difiera.

### `readBuildManifest(path, readTextFile)`

Lee y parsea un manifest de build usando el reader provisto.

```ts
import { readBuildManifest } from "@zuccadev-labs/barrits/consume";

const manifest = await readBuildManifest(".barrits/manifest.json", async (p) => {
  return await fetch(p).then((r) => r.text());
});
```

### `readBuildManifestSummary(path, readTextFile)`

Lee el manifest y devuelve directamente su resumen.

Aparece en: `examples/example-tauri/src/main.ts`.

### `readWatchSnapshot(path, readTextFile)`

Lee y parsea un snapshot de watch.

### `readWatchSnapshotSummary(path, readTextFile)`

Lee y resume el snapshot de watch.

### `readLanguageToolSnapshot(path, readTextFile)`

Lee un snapshot de tooling de lenguaje.

Aparece en: `examples/example-tauri/src/main.ts`.

---

## `@zuccadev-labs/barrits/node`

Helpers nativos de Node.js. Son wrappers pre-configurados sobre los readers de `consume`.

### `createNodeFileSystemAdapter()`

Crea un adapter de filesystem para Node.js.

```ts
import { createNodeFileSystemAdapter } from "@zuccadev-labs/barrits/node";
const adapter = createNodeFileSystemAdapter();
```

### `readNodeBuildManifest(path)`

Lee un manifest de build desde disco en Node.js.

### `readNodeBuildManifestSummary(path)`

Lee y resume el manifest desde disco.

```ts
import { readNodeBuildManifestSummary } from "@zuccadev-labs/barrits/node";

const summary = await readNodeBuildManifestSummary(".barrits/manifest.json");
console.log(summary.domains);
```

Aparece en: `examples/example-nodejs/scripts/build-runner.mjs`.

### `readNodeWatchSnapshot(path)`

Lee un snapshot de watch en Node.js.

### `readNodeWatchSnapshotSummary(path)`

Lee y resume el snapshot de watch.

### `readNodeLanguageToolSnapshot(path)`

Lee un snapshot de tooling de lenguaje desde disco.

Aparece en: `examples/example-nodejs/scripts/snapshot-consumer.mjs`.

### `runNodeCli(argumentsList?)`

Ejecuta la CLI de Barrits para Node desde código sin spawn manual.

```ts
import { runNodeCli } from "@zuccadev-labs/barrits/node";
await runNodeCli(["build"]);
```

---

## `@zuccadev-labs/barrits/deno`

Equivalentes nativos de Deno para el adapter de Node.

### `createDenoFileSystemAdapter()`

Crea un adapter de filesystem para Deno.

### `readDenoBuildManifest(path)`

Lee un manifest de build en Deno.

### `readDenoBuildManifestSummary(path)`

Lee y resume el manifest en Deno.

### `readDenoWatchSnapshot(path)`

Lee un snapshot de watch en Deno.

### `readDenoWatchSnapshotSummary(path)`

Lee y resume el snapshot de watch en Deno.

### `readDenoLanguageToolSnapshot(path)`

Lee un snapshot de tooling de lenguaje en Deno.

### `runDenoCli(argumentsList?)`

Ejecuta la CLI de Barrits para Deno desde código.

```ts
import { runDenoCli } from "@zuccadev-labs/barrits/deno";
await runDenoCli(["inspect"]);
```

---

## Plugins de bundlers

### `barritsVitePlugin(options)`

Integra el contrato package-first en Vite.

```ts
import { barritsVitePlugin } from "@zuccadev-labs/barrits/vite";
import { defineBarritsPackage, toBarritsAutomationOptions } from "@zuccadev-labs/barrits";

const pkg = defineBarritsPackage({ runtime: "react", watch: "auto" });

export default defineConfig({
  plugins: [barritsVitePlugin({ package: toBarritsAutomationOptions(pkg) })],
});
```

Aparece en: `examples/example-react/vite.config.ts`, `examples/example-vue/vite.config.ts`, `examples/example-solid/vite.config.ts`, `examples/example-svelte/vite.config.ts`, `examples/bundlers/vite/vite.config.ts`.

### `barritsEsbuildPlugin(options)`

Integra el contrato package-first en esbuild.

Aparece en: `examples/bundlers/esbuild/esbuild.config.mjs`.

### `barritsRollupPlugin(options)`

Integra el contrato package-first en Rollup.

Aparece en: `examples/bundlers/rollup/rollup.config.mjs`.

### `barritsWebpackPlugin(options)` / `BarritsWebpackPlugin`

Integra el contrato package-first en Webpack. Disponible como función factory y como clase para instanciación explícita.

```ts
import { BarritsWebpackPlugin } from "@zuccadev-labs/barrits/webpack";

module.exports = {
  plugins: [new BarritsWebpackPlugin({ /* opciones */ })],
};
```

Aparece en: `examples/bundlers/webpack/webpack.config.mjs`.

---

[← Algoritmos](09b_referencia-de-api-algoritmos.md) | [← Índice](00_indice.md)
