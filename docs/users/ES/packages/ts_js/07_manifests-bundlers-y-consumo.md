# 07 Manifests, bundlers y consumo de ts_js

Yo uso manifests y snapshots como contratos entre el motor de `barrits` y el tooling externo. Asi evito reimplementar discovery dentro de cada bundler o backend.

## Lo que expone `@zuccadev-labs/barrits/consume`

Yo uso `@zuccadev-labs/barrits/consume` cuando necesito leer manifests o snapshots sin arrastrar plugins ni codigo de runtime no necesario.

Superficies utiles:

- `parseBuildManifest()`
- `parseWatchSnapshot()`
- `readBuildManifestSummary()`
- `readWatchSnapshotSummary()`
- `readLanguageToolSnapshot()`

Si yo necesito delegar el acceso al filesystem, uso las funciones `read*` con un `readTextFile(path)` inyectable y dejo que `@zuccadev-labs/barrits/consume` haga la validacion estructural del payload.

## Como pienso `build` y `watch`

- `build` escribe `<automationDirectory>/build-manifest.json`
- `watch` y `dev` pueden escribir `<automationDirectory>/watch-snapshot.json`
- el proceso hijo recibe `BARRITS_BUILD_MANIFEST` o `BARRITS_WATCH_SNAPSHOT` cuando aplica

Cuando existen `traitDiagnostics`, yo tambien recibo agregados listos para tooling y analitica sin tener que reconstruirlos a mano.

## Como integro bundlers

Yo ya tengo subpaths y ejemplos reales para:

- `@zuccadev-labs/barrits/vite`
- `@zuccadev-labs/barrits/esbuild`
- `@zuccadev-labs/barrits/rollup`
- `@zuccadev-labs/barrits/webpack`

Mi regla practica es esta: `barrits` genera discovery y manifest; el bundler solo consume ese contrato mediante un adapter pequeno.

En webpack yo sigo un matiz adicional: prefiero materializar un modulo intermedio y aliasarlo, en vez de depender de un id con `:` que el runtime pueda interpretar como scheme antes de resolver aliases.

## Que ejemplo uso segun el caso

- `packages/sdk/ts_js/examples/bundlers/` para Vite, esbuild, Rollup y Webpack
- `packages/sdk/ts_js/examples/example-tauri/` para lectura segura de manifests y snapshots desde backend controlado
- `packages/sdk/ts_js/examples/example-nodejs/` para consumo operativo local de manifests y snapshots

## Cuando valido JSR

Si yo toco superficie Deno o publicacion ESM, corro:

```bash
npm run publish:jsr:dry-run
```

Con eso yo valido que la publicacion desde `jsr.json` siga limpia y que la superficie exportada para Deno no arrastre problemas nuevos.