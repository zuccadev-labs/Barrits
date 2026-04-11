# 03 Ejemplos y recorridos de ts_js

Yo uso los ejemplos reales del repo como referencia de consumo. No los trato como carpetas decorativas; los uso para validar flujos concretos.

Si yo necesito la guia oficial detallada de la carpeta `examples/`, sigo este indice complementario:

- `examples/00_indice.md`
- `examples/01_mapa-general.md`
- `examples/02_nodejs-y-deno.md`
- `examples/03_frontend-vite.md`
- `examples/04_bundlers.md`
- `examples/05_tauri.md`
- `examples/06_bun.md`

## Si yo quiero Node.js

Yo miro `packages/sdk/ts_js/examples/example-nodejs/` cuando necesito:

- build local con manifest
- showcase de algoritmos
- consumo de snapshots y scripts operativos

README local a revisar:

- `packages/sdk/ts_js/examples/example-nodejs/README.md`

APIs que conviene conocer antes de abrir el codigo:

- `binarySearch`, `findSortedRange`, `lowerBound`, `upperBound`
- `chunk`, `groupBy`, `indexBy`, `uniqueBy`
- `orderBy`, `quickSort`, `stableSortBy`, `insertSorted`
- `averageBy`, `bucketByInterval`, `detectTimeSeriesGaps`, `differenceSeries`, `movingAverageSeries`, `resampleSeries`
- `movingAverage`, `rollingSum`, `slidingWindow`, `windowDelta`
- `paginate`, `partitionBy`, `rankBy`, `topK`
- `breadthFirstSearch`, `dijkstraShortestPath`, `topologicalSort`

## Si yo quiero Deno

Yo miro `packages/sdk/ts_js/examples/example-deno/` cuando necesito:

- tareas `deno task`
- consumo de `barrits` desde Deno
- inspeccion con el adapter Deno

README local a revisar:

- `packages/sdk/ts_js/examples/example-deno/README.md`

APIs centrales de este recorrido:

- `defineBarritsPackage`
- `averageBy`
- `movingAverage`
- `topK`

## Si yo quiero Bun

Yo miro `packages/sdk/ts_js/examples/example-bun/` cuando necesito:

- scripts `bun run` sobre una integracion package-first
- validacion de utilidades funcionales en runtime Bun
- ruta operativa visible basada en `buildPath` y `parsePath`

README local a revisar:

- `packages/sdk/ts_js/examples/example-bun/README.md`

APIs centrales de este recorrido:

- `defineBarritsPackage`
- `orderBy`
- `movingAverage`
- `averageBy`
- `topK`
- `buildPath`
- `parsePath`

## Si yo quiero frontend package-first

Yo miro estos ejemplos segun mi stack:

- `packages/sdk/ts_js/examples/example-react/`
- `packages/sdk/ts_js/examples/example-vue/`
- `packages/sdk/ts_js/examples/example-solid/`
- `packages/sdk/ts_js/examples/example-svelte/`

READMEs locales a revisar:

- `packages/sdk/ts_js/examples/example-react/README.md`
- `packages/sdk/ts_js/examples/example-vue/README.md`
- `packages/sdk/ts_js/examples/example-solid/README.md`
- `packages/sdk/ts_js/examples/example-svelte/README.md`

APIs comunes de esta familia:

- `defineBarritsPackage`
- `toBarritsAutomationOptions`
- `barritsVitePlugin`
- `createBuildManifestSummary`

APIs de UI o analitica que cambian por framework:

- React y Vue: `orderBy`, `movingAverageSeries`, `maxDrawdown`
- Solid y Svelte: `sumar`
- Svelte: `movingAverageSeries`

## Si yo quiero bundlers directos

Yo miro `packages/sdk/ts_js/examples/bundlers/` cuando necesito integrar:

- Vite
- esbuild
- Rollup
- Webpack

README local a revisar:

- `packages/sdk/ts_js/examples/bundlers/README.md`

APIs centrales:

- `defineBarritsPackage`
- `toBarritsAutomationOptions`
- `barritsVitePlugin`
- `barritsEsbuildPlugin`
- `barritsRollupPlugin`
- `barritsWebpackPlugin`
- `createBuildManifestSummary`

## Si yo quiero desktop seguro

Yo miro `packages/sdk/ts_js/examples/example-tauri/` cuando necesito leer manifests o snapshots desde backend controlado y entregar al frontend solo payloads resumidos.

README local a revisar:

- `packages/sdk/ts_js/examples/example-tauri/README.md`

APIs centrales:

- `readBuildManifestSummary`
- `readLanguageToolSnapshot`

Si necesito la descripcion detallada de cualquiera de esas funciones, entro a `09_referencia-de-api.md`. La idea es que los ejemplos expliquen el recorrido de uso y que la referencia central explique la API completa sin duplicacion.
