# Node.js y Deno

Este documento describe los ejemplos orientados a runtimes backend o CLI puros: `example-nodejs/` y `example-deno/`.

## `example-nodejs/`

**Ubicación**: `packages/sdk/ts_js/examples/example-nodejs/`

**Qué valida**: Consumo del SDK desde scripts Node.js sin bundler, incluyendo todos los algoritmos y readers de manifests.

**Estructura relevante**:

```
example-nodejs/
├── src/
│   └── examples/
│       ├── collection/     # groupBy, chunk, indexBy, uniqueBy
│       ├── graph/          # topologicalSort, BFS, DFS, cycles
│       ├── search/         # binarySearch, linearSearch, lowerBound
│       ├── selection/      # paginate, topK, rankBy, averageBy
│       ├── sort/           # orderBy, quickSort, stableSortBy
│       └── timeseries/     # movingAverageSeries, maxDrawdown, gaps
└── scripts/
    ├── build-runner.mjs     # readNodeBuildManifestSummary
    └── snapshot-consumer.mjs # readNodeLanguageToolSnapshot
```

**Cómo ejecutar**:

```bash
cd packages/sdk/ts_js/examples/example-nodejs
npm install
node src/main.js
```

---

## `example-deno/`

**Ubicación**: `packages/sdk/ts_js/examples/example-deno/`

**Qué valida**: Contrato package-first desde Deno y JSR, incluyendo discovery, algoritmos y `runDenoCli`.

**Cómo ejecutar**:

```bash
cd packages/sdk/ts_js/examples/example-deno
deno task build
deno task inspect
```

**APIs usadas**: `defineBarritsPackage`, `movingAverage`, `averageBy`, `topK`, `runDenoCli`.

---

[← Índice de Ejemplos](00_indice.md)
