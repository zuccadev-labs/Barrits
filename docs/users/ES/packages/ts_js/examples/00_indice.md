# Mapa General de Ejemplos (ts_js)

Esta carpeta documenta la cobertura oficial de `packages/sdk/ts_js/examples/`. Cada documento apunta a un subconjunto específico de demos y valida una experiencia de integración.

## Mapa de cobertura

| Ejemplo | Superficie validada | APIs principales |
| :--- | :--- | :--- |
| `example-nodejs/` | Scripts, showcase y benchmarking en Node.js | `orderBy`, `binarySearch`, `movingAverageSeries`, `topK`, readers Node |
| `example-deno/` | Contrato package-first en Deno/JSR | `defineBarritsPackage`, `movingAverage`, `averageBy`, `topK` |
| `example-bun/` | Contrato package-first en Bun con scripts de runtime | `defineBarritsPackage`, `orderBy`, `movingAverage`, `averageBy`, `topK` |
| `example-react/` | Caso base frontend con Vite + React | `defineBarritsPackage`, `toBarritsAutomationOptions`, `barritsVitePlugin`, `createBuildManifestSummary` |
| `example-vue/` | Discovery bajo `src/barrits/` en Vue | `barritsVitePlugin`, `createBuildManifestSummary`, `orderBy`, `maxDrawdown` |
| `example-solid/` | Validación del mismo contrato en Solid | `createBuildManifestSummary`, `sumar`, `barritsVitePlugin` |
| `example-svelte/` | Cobertura package-first en Svelte | `createBuildManifestSummary`, `movingAverageSeries`, `sumar` |
| `example-tauri/` | Consumo seguro de artefactos desde desktop | `readBuildManifestSummary`, `readLanguageToolSnapshot` |
| `bundlers/` | Integración directa por bundler | `barritsVitePlugin`, `barritsEsbuildPlugin`, `barritsRollupPlugin`, `barritsWebpackPlugin` |

## Documentos detallados

- [02_nodejs-y-deno.md](02_nodejs-y-deno.md)
- [03_frontend-vite.md](03_frontend-vite.md)
- [04_bundlers.md](04_bundlers.md)
- [05_tauri.md](05_tauri.md)
- [06_bun.md](06_bun.md)

---

[← Guía de Usuario](../00_indice.md)
