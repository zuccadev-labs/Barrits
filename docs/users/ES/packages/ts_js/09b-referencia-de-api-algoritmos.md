---
title: "09b — Referencia de API: Algoritmos"
description: "Corporate documentation for 09b — Referencia de API: Algoritmos."
---

# 09b — Referencia de API: Algoritmos

Catálogo completo de algoritmos disponibles en `@zuccadev-labs/barrits`. Estos utilitarios forman parte de la librería base `barrits_lib` y son accesibles tanto por importación plana como a través del namespace `barrits.logic`.

---

## Aritmética básica

### `sumar(a, b)`

Suma valores numéricos con las guardas del paquete.

```ts
import { sumar } from "@zuccadev-labs/barrits";
sumar(2, 3); // 5
```

Aparece en: `examples/example-solid/src/main.tsx`, `examples/example-svelte/src/App.svelte`.

### `restar(a, b)`

Resta valores numéricos.

```ts
import { restar } from "@zuccadev-labs/barrits";
restar(5, 2); // 3
```

### `arithmetic`

Acceso namespaced a las operaciones aritméticas básicas.

```ts
import { arithmetic } from "@zuccadev-labs/barrits";
arithmetic.sumar(2, 3);
```

---

## Colecciones

### `chunk(collection, size)`

Divide una colección en bloques del tamaño indicado.

```ts
import { chunk } from "@zuccadev-labs/barrits";
chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
```

Aparece en: `examples/example-nodejs/src/examples/collection/real-collection-cases.mjs`.

### `groupBy(collection, projector)`

Agrupa elementos por una clave derivada.

```ts
import { groupBy } from "@zuccadev-labs/barrits";
groupBy(users, (u) => u.department);
```

### `indexBy(collection, projector)`

Indexa una colección por una clave única.

### `uniqueBy(collection, projector)`

Elimina duplicados según una clave derivada.

### `collectionAlgorithms`

Acceso namespaced a todos los utilitarios de colecciones.

---

## Búsqueda

### `linearSearch(collection, predicate)`

Búsqueda secuencial para listas cortas o sin orden garantizado.

### `binarySearch(collection, target, compare?)`

Búsqueda O(log n) sobre colecciones ordenadas.

```ts
import { binarySearch } from "@zuccadev-labs/barrits";
binarySearch(sortedItems, targetValue);
```

Aparece en: `examples/example-nodejs/src/examples/search/real-search-cases.mjs`.

### `lowerBound(collection, target, compare?)`

Devuelve la primera posición válida para insertar un valor en una colección ordenada.

### `upperBound(collection, target, compare?)`

Devuelve la posición posterior al último match compatible.

### `findSortedRange(collection, target, compare?)`

Localiza el rango completo de un valor dentro de una colección ordenada.

### `searchAlgorithms`

Acceso namespaced a todos los utilitarios de búsqueda.

---

## Ordenamiento

### `orderBy(collection, criteria)`

Ordena por uno o varios criterios declarativos.

```ts
import { orderBy } from "@zuccadev-labs/barrits";

orderBy(items, [
  { project: (i) => i.score, direction: "desc" },
  { project: (i) => i.name, direction: "asc" },
]);
```

Aparece en: `examples/example-react/src/main.jsx`, `examples/example-vue/src/App.vue`, `examples/example-nodejs/src/examples/sort/`, `examples/example-bun/src/main.ts`.

### `quickSort(collection, compare?)`

Ordenamiento de propósito general de alto rendimiento.

### `stableSortBy(collection, projector, direction?)`

Ordenamiento estable con preservación del orden relativo entre iguales.

### `insertSorted(collection, value, compare?)`

Inserta un valor en una colección ya ordenada sin reordenar todo.

### `sortAlgorithms`

Acceso namespaced a todos los utilitarios de ordenamiento.

---

## Selección y agregación

### `maxBy(collection, projector)`

Devuelve el item con el mayor valor proyectado.

### `minBy(collection, projector)`

Devuelve el item con el menor valor proyectado.

### `sumBy(collection, projector)`

Suma una proyección numérica sobre la colección.

### `averageBy(collection, projector)`

Calcula el promedio de una proyección numérica.

```ts
import { averageBy } from "@zuccadev-labs/barrits";
averageBy(metrics, (m) => m.latency);
```

Aparece en: `examples/example-deno/main.ts`, `examples/example-bun/src/main.ts`.

### `histogramBy(collection, projector)`

Construye un histograma a partir de una clave o bucket derivado.

### `paginate(collection, options)`

Pagina una colección con contexto de página, límite y total.

```ts
import { paginate } from "@zuccadev-labs/barrits";
paginate(items, { page: 1, limit: 10 });
```

Aparece en: `examples/example-nodejs/src/examples/selection/real-selection-cases.mjs`.

### `partitionBy(collection, predicate)`

Separa la colección en dos grupos según un predicado.

### `rankBy(collection, projector, direction?)`

Asigna ranking a cada elemento según una proyección.

### `topK(collection, limit, compare?)`

Devuelve los mejores `k` elementos sin ordenar la colección completa.

```ts
import { topK } from "@zuccadev-labs/barrits";
topK(candidates, 5);
```

Aparece en: `examples/example-deno/main.ts`, `examples/example-bun/src/main.ts`.

### `aggregateAlgorithms` y `selectionAlgorithms`

Acceso namespaced a todos los utilitarios de agregación y selección.

---

## Series temporales y finanzas

### `bucketByInterval(series, interval)`

Agrupa puntos temporales por intervalo fijo.

### `detectTimeSeriesGaps(series, interval)`

Detecta huecos temporales en una serie.

### `differenceSeries(series)`

Calcula la diferencia entre puntos consecutivos.

### `movingAverageSeries(series, windowSize)`

Calcula el promedio móvil sobre una serie temporal tipada.

```ts
import { movingAverageSeries } from "@zuccadev-labs/barrits";
movingAverageSeries(priceSeries, 5);
```

Aparece en: `examples/example-nodejs/src/examples/timeseries/`, `examples/example-react/src/main.jsx`, `examples/example-vue/src/App.vue`, `examples/example-svelte/src/App.svelte`.

### `resampleSeries(series, interval)`

Remuestrea una serie a un nuevo intervalo.

### `sortTimeSeries(series)`

Ordena una serie por timestamp.

### `returnsSeries(series)`

Calcula retornos entre puntos de una serie.

### `maxDrawdown(series)`

Calcula la mayor caída desde un máximo previo en una serie numérica.

Aparece en: `examples/example-react/src/main.jsx`, `examples/example-vue/src/App.vue`.

### `annualizedVolatility(series)`

Calcula volatilidad anualizada.

### `exponentialMovingAverage(series, alpha)`

Calcula promedio móvil exponencial con factor alpha configurable.

### `timeSeriesAlgorithms`

Acceso namespaced a todos los utilitarios de series temporales y finanzas.

---

## Ventanas

### `movingAverage(values, windowSize)`

Calcula promedio móvil sobre una secuencia numérica simple.

```ts
import { movingAverage } from "@zuccadev-labs/barrits";
movingAverage([10, 20, 30, 40], 2); // [15, 25, 35]
```

Aparece en: `examples/example-deno/main.ts`, `examples/example-bun/src/main.ts`.

### `rollingSum(values, windowSize)`

Calcula suma móvil sobre una secuencia.

### `slidingWindow(values, windowSize)`

Expone cada ventana consecutiva de una secuencia para transformación personalizada.

### `windowDelta(values, windowSize)`

Calcula el delta entre valores dentro de una ventana.

### `windowAlgorithms`

Acceso namespaced a todos los utilitarios de ventanas.

---

## Grafos

### `buildAdjacencyList(edges)`

Crea una lista de adyacencia desde un conjunto de aristas.

### `breadthFirstSearch(graph, start)`

Recorre el grafo en anchura (BFS).

### `depthFirstSearch(graph, start)`

Recorre el grafo en profundidad (DFS).

### `detectDirectedCycle(graph)`

Detecta ciclos dirigidos. Útil para validar DAGs y pipelines de dependencias.

### `dijkstraShortestPath(graph, from, to)`

Calcula el camino más corto entre dos nodos.

### `maxFlow(graph, source, sink)`

Calcula el flujo máximo en una red de capacidades.

### `minimumSpanningTree(graph)`

Calcula el árbol de expansión mínima de un grafo ponderado.

### `topologicalSort(graph)`

Ordena topológicamente un DAG. Útil para dependencias y etapas de build.

Aparece en: `examples/example-nodejs/src/examples/graph/real-graph-cases.mjs`.

### `graphAlgorithms`

Acceso namespaced a todos los utilitarios de grafos.

---

## Catálogos agregados

### `algorithms`

Expone el catálogo general de algoritmos para navegación dinámica o exploración agrupada.

```ts
import { algorithms } from "@zuccadev-labs/barrits";
algorithms.sort.orderBy(items, criteria);
```

### `logic`

Agrupa algoritmos, aritmética y familias funcionales bajo el dominio principal.

```ts
import { logic } from "@zuccadev-labs/barrits";
logic.orderBy(items, criteria);
logic.searchAlgorithms.binarySearch(sorted, target);
```

---

[← Configuración Package-First](09a-referencia-de-api-configuracion.md) | [Consume y Adapters →](09c-referencia-de-api-consume-y-adapters.md)
