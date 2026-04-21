# 01 Mapa general de ejemplos

La carpeta `packages/sdk/ts_js/examples/` está organizada por experiencia de consumo, segregando los detalles internos de implementación del motor de la superficie visible del consumidor.

## Mapa actual de ejemplos

| Ejemplo | Superficie validada | APIs principales |
| :--- | :--- | :--- |
| `example-nodejs/` | Showcase operativo, scripts locales y consumo desde Node.js | `orderBy`, `binarySearch`, `movingAverageSeries`, `topK`, readers Node |
| `example-deno/` | Consumo desde Deno con tareas `deno task` y adapter Deno | `defineBarritsPackage`, `movingAverage`, `averageBy`, `topK` |
| `example-bun/` | Consumo desde Bun con scripts `bun run` y contrato package-first | `defineBarritsPackage`, `orderBy`, `movingAverage`, `averageBy`, `topK` |
| `example-react/` | Frontend Vite + React usando `@zuccadev-labs/barrits/vite` | `defineBarritsPackage`, `toBarritsAutomationOptions`, `barritsVitePlugin` |
| `example-vue/` | Frontend Vite + Vue con discovery bajo el esquema estándar | `barritsVitePlugin`, `createBuildManifestSummary`, `orderBy`, `maxDrawdown` |
| `example-solid/` | Frontend Vite + Solid con discovery sobre `src/barrits/` | `createBuildManifestSummary`, `sumar`, `barritsVitePlugin` |
| `example-svelte/` | Frontend Vite + Svelte con el mismo patrón de consumo | `createBuildManifestSummary`, `movingAverageSeries`, `sumar` |
| `example-tauri/` | Frontend Vite + backend Tauri para lectura segura de artifacts | `readBuildManifestSummary`, `readLanguageToolSnapshot` |
| `bundlers/` | Validación técnica independiente para Vite, esbuild, Rollup y Webpack | `barritsVitePlugin`, `barritsEsbuildPlugin`, `barritsRollupPlugin`, `barritsWebpackPlugin` |

## Superficies de validación cubiertas

Esta malla de ejemplos permite validar:

- Runtimes puros de Node.js, Deno y Bun.
- Modelos frontend package-first mediante el plugin oficial de Vite.
- Estrategias de discovery proyectadas en carpetas como `barrits/` o `src/barrits/`.
- Lectura segura de manifests y snapshots desde backends locales controlados (ej. Tauri).
- Plugins de bundlers de forma aislada para evitar contaminación en las narrativas de los ejemplos de runtime.

## Reglas arquitectónicas aplicadas

- El proyecto consumidor expone `barrits/` o `src/barrits/` como capa visible de su dominio.
- `barrits_lib` se mantiene como una implementación interna del paquete, delegando al orquestador la responsabilidad de la superficie pública.
- Los archivos README locales de cada ejemplo sirven como punto de entrada rápido, mientras que la documentación normativa se centraliza en esta carpeta de guías de usuario.

---

[← Guía de Usuario](../00_indice.md)