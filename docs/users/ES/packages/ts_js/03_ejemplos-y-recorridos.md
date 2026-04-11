# 03 Ejemplos y recorridos de ts_js

Yo uso los ejemplos reales del repo como referencia de consumo. No los trato como carpetas decorativas; los uso para validar flujos concretos.

Si yo necesito la guia oficial detallada de la carpeta `examples/`, sigo este indice complementario:

- `examples/00_indice.md`
- `examples/01_mapa-general.md`
- `examples/02_nodejs-y-deno.md`
- `examples/03_frontend-vite.md`
- `examples/04_bundlers.md`
- `examples/05_tauri.md`

## Si yo quiero Node.js

Yo miro `packages/sdk/ts_js/examples/example-nodejs/` cuando necesito:

- build local con manifest
- showcase de algoritmos
- consumo de snapshots y scripts operativos

## Si yo quiero Deno

Yo miro `packages/sdk/ts_js/examples/example-deno/` cuando necesito:

- tareas `deno task`
- consumo de `barrits` desde Deno
- inspeccion con el adapter Deno

## Si yo quiero frontend package-first

Yo miro estos ejemplos segun mi stack:

- `packages/sdk/ts_js/examples/example-react/`
- `packages/sdk/ts_js/examples/example-vue/`
- `packages/sdk/ts_js/examples/example-solid/`
- `packages/sdk/ts_js/examples/example-svelte/`

## Si yo quiero bundlers directos

Yo miro `packages/sdk/ts_js/examples/bundlers/` cuando necesito integrar:

- Vite
- esbuild
- Rollup
- Webpack

## Si yo quiero desktop seguro

Yo miro `packages/sdk/ts_js/examples/example-tauri/` cuando necesito leer manifests o snapshots desde backend controlado y entregar al frontend solo payloads resumidos.