---
title: "07 Manifests, bundlers y consumo de ts_js"
description: "Corporate documentation for 07 Manifests, bundlers y consumo de ts_js."
---

# 07 Manifests, bundlers y consumo de ts_js

Barrits usa manifests y snapshots como contratos de primera clase entre el motor de descubrimiento y el tooling externo. Esto elimina la necesidad de reimplementar discovery dentro de cada bundler o integración backend.

## La superficie `@zuccadev-labs/barrits/consume`

Este subpath provee lectura y parseo de manifests o snapshots sin importar código de plugins ni dependencias de runtime innecesarias.

Funciones disponibles:

- `parseBuildManifest()` — valida y parsea datos crudos de manifest
- `parseWatchSnapshot()` — valida y parsea datos crudos de snapshot
- `readBuildManifestSummary(path, readTextFile)` — lee y resume un manifest
- `readWatchSnapshotSummary(path, readTextFile)` — lee y resume un snapshot
- `readLanguageToolSnapshot(path, readTextFile)` — lee un snapshot de tooling de lenguaje

Cuando el acceso al filesystem necesita delegarse (por ejemplo, al backend de Tauri o a un lector serverless), se pasa una función `readTextFile(path)` inyectable. El subpath consume maneja la validación estructural del payload retornado.

## Build y watch

- `build` escribe `<automationDirectory>/build-manifest.json`
- `watch` y `dev` escriben `<automationDirectory>/watch-snapshot.json`
- El proceso hijo recibe `BARRITS_BUILD_MANIFEST` o `BARRITS_WATCH_SNAPSHOT` como variables de entorno cuando aplica

Cuando `traitDiagnostics` están presentes en el manifest, los datos pre-agregados están disponibles para tooling y analítica sin reconstrucción manual.

## Integración con bundlers

Subpaths disponibles y ejemplos correspondientes:

| Import path | Ejemplo |
| :--- | :--- |
| `@zuccadev-labs/barrits/vite` | `examples/bundlers/vite/` |
| `@zuccadev-labs/barrits/esbuild` | `examples/bundlers/esbuild/` |
| `@zuccadev-labs/barrits/rollup` | `examples/bundlers/rollup/` |
| `@zuccadev-labs/barrits/webpack` | `examples/bundlers/webpack/` |

**Regla de diseño**: Barrits genera el discovery y el manifest; el bundler solo consume ese contrato mediante un adapter pequeño.

En Webpack, se prefiere materializar un módulo intermedio y aliasarlo, en lugar de depender de un virtual module ID con `:` que el runtime podría interpretar como scheme antes de resolver aliases.

## Elegir el ejemplo correcto

| Escenario | Ejemplo |
| :--- | :--- |
| Vite, esbuild, Rollup, Webpack | `packages/sdk/ts_js/examples/bundlers/` |
| Lectura segura de manifests desde un desktop backend | `packages/sdk/ts_js/examples/example-tauri/` |
| Consumo operativo local de manifests y snapshots | `packages/sdk/ts_js/examples/example-nodejs/` |

## Validar la superficie JSR

Al tocar la superficie Deno o publicación ESM, ejecutar:

```bash
npm run publish:jsr:dry-run
```

Esto valida que la publicación desde `jsr.json` esté limpia y que la superficie exportada para Deno no arrastre problemas nuevos.