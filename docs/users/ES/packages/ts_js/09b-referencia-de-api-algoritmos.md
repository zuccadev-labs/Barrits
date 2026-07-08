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

## Patrones de Resiliencia

Patrones empresariales de tolerancia a fallos para sistemas distribuidos. Estas utilidades manejan fallos transitorios por particiones de red, limitación de tasa y caídas de dependencias.

### `retryWithBackoff(operation, options?)`

Ejecuta una operación asíncrona con reintento exponencial y jitter.

```ts
import { retryWithBackoff } from "@zuccadev-labs/barrits";

const data = await retryWithBackoff(
  () => fetch("https://api.example.com/data").then(r => r.json()),
  { maxRetries: 5, initialDelayMs: 500, isRetryable: (err) => err instanceof TypeError },
);
```

Opciones: `maxRetries` (default 3), `initialDelayMs` (default 200), `backoffFactor` (default 2), `maxDelayMs` (default 30000), y predicado `isRetryable`. La componente de jitter previene el efecto thundering-herd en despliegues multi-instancia.

### `withTimeout(operation, timeoutMs, label?)`

Envuelve una promesa con un plazo máximo de ejecución para cumplimiento de SLA.

```ts
import { withTimeout } from "@zuccadev-labs/barrits";

const result = await withTimeout(
  fetch("https://slow-api.example.com/data"),
  5000,
  "slow-api fetch",
);
```

Rechaza con un `TimeoutError` descriptivo si la operación no completa en el tiempo especificado.

### `createCircuitBreaker(options?)`

Crea un interruptor de circuito de tres estados (closed → open → half-open → closed) para protección de dependencias.

```ts
import { createCircuitBreaker } from "@zuccadev-labs/barrits";

const breaker = createCircuitBreaker({ failureThreshold: 3, resetTimeoutMs: 10000 });

const data = await breaker.call(() => fetch("/api/data").then(r => r.json()));
breaker.getState(); // "closed", "open", o "half-open"
breaker.reset();    // reinicio manual a closed
```

El circuito se abre tras `failureThreshold` fallos consecutivos, rechaza inmediatamente mientras está abierto, y prueba la recuperación tras `resetTimeoutMs` en estado half-open con `successThreshold` (default 1) llamadas exitosas antes de cerrar.

### `resilienceAlgorithms`

Acceso namespaced a todas las utilidades de resiliencia.

```ts
import { resilienceAlgorithms } from "@zuccadev-labs/barrits";
resilienceAlgorithms.retryWithBackoff(op);
```

---

## Hashing e Integridad

Funciones hash criptográficas y no criptográficas para sellado de manifiestos de build, caché content-addressable, y asignación de particiones distribuidas.

### `sha256Hex(input)`

Calcula el hash SHA-256 de un string UTF-8 y devuelve un digest hexadecimal de 64 caracteres en minúscula. Usa Web Crypto API — sin dependencias externas. Disponible en Deno, Node.js 18+, Bun y navegadores.

```ts
import { sha256Hex } from "@zuccadev-labs/barrits";

const checksum = await sha256Hex(JSON.stringify({ version: "0.2.0" }));
// "a3f2...d8e1" (64 caracteres hex)
```

### `murmurHash3(input, seed?)`

Calcula un digest MurmurHash3 de 32 bits no criptográfico. Aproximadamente 10x más rápido que SHA-256. Ideal para particionamiento por hash, anillos de hash consistente y filtros Bloom.

```ts
import { murmurHash3 } from "@zuccadev-labs/barrits";

const partition = murmurHash3("user:12345", 0) % 16;
// Asigna el usuario a la partición [0-15] deterministicamente
```

Acepta un `seed` opcional de 32 bits sin signo (default 0). Devuelve un entero de 32 bits sin signo.

### `deterministicStringify(value, indent?)`

Produce un string JSON determinista con ordenamiento lexicográfico de claves. A diferencia de `JSON.stringify`, objetos estructuralmente idénticos siempre producen el mismo output sin importar el orden de inserción.

```ts
import { deterministicStringify } from "@zuccadev-labs/barrits";

const a = { z: 1, a: 2, m: { b: 3, a: 4 } };
const b = { a: 2, m: { a: 4, b: 3 }, z: 1 };

deterministicStringify(a) === deterministicStringify(b); // true
```

Esencial para checksums reproducibles y caché content-addressable en sistemas de build distribuidos.

### `hashingAlgorithms`

Acceso namespaced a todas las utilidades de hashing.

```ts
import { hashingAlgorithms } from "@zuccadev-labs/barrits";
hashingAlgorithms.sha256Hex(data);
```

---

## Utilidades de Fecha y Hora

Funciones inmutables de manipulación de fechas con conciencia de zona horaria. Todas las operaciones producen nuevos objetos sin mutar las entradas, siguiendo el principio de transparencia referencial.

### `toIsoString(input)`

Normaliza objetos Date, timestamps numéricos (Unix ms) o strings ISO 8601 a un string UTC ISO 8601 estandarizado.

```ts
import { toIsoString } from "@zuccadev-labs/barrits";

toIsoString(new Date("2026-04-21T14:30:00Z"));
// "2026-04-21T14:30:00.000Z"

toIsoString(1776960600000);
// String ISO equivalente para ese timestamp
```

Lanza `RangeError` para entradas de fecha inválidas.

### `fromIsoString(input)`

Parsea un string ISO 8601 a un objeto `Date` de forma segura. Devuelve `null` en lugar de crear un `Invalid Date`, previniendo la propagación de fechas inválidas entre capas del servicio.

```ts
import { fromIsoString } from "@zuccadev-labs/barrits";

const date = fromIsoString("2026-04-21T14:30:00.000Z");
// Objeto Date, o null si falla el parseo
```

### `diffMs(start, end)`

Calcula la diferencia en milisegundos entre dos fechas (`end - start`).

```ts
import { diffMs } from "@zuccadev-labs/barrits";

const start = new Date("2026-04-21T00:00:00Z");
const end = new Date("2026-04-22T00:00:00Z");
diffMs(start, end); // 86400000 (24 horas)
```

### `addMs(date, milliseconds)`

Devuelve un nuevo `Date` desplazado por los milisegundos especificados. Valores negativos restan. La fecha original nunca se muta.

```ts
import { addMs } from "@zuccadev-labs/barrits";

const later = addMs(new Date("2026-04-21T14:30:00Z"), 3600000);
// "2026-04-21T15:30:00.000Z"
```

### `toRelativeTime(date, locale?)`

Formatea una fecha como string de tiempo relativo legible (ej: "2 hours ago", "in 3 days"). Usa `Intl.RelativeTimeFormat` para formato locale-aware. Default `"en"`.

```ts
import { toRelativeTime } from "@zuccadev-labs/barrits";

const twoHoursAgo = new Date(Date.now() - 7200000);
toRelativeTime(twoHoursAgo);       // "2 hours ago"
toRelativeTime(twoHoursAgo, "es"); // "hace 2 horas"
```

### `datetimeAlgorithms`

Acceso namespaced a todas las utilidades de fecha y hora.

```ts
import { datetimeAlgorithms } from "@zuccadev-labs/barrits";
datetimeAlgorithms.toIsoString(date);
```

---

## Catálogos agregados

### `algorithms`

Expone el catálogo general de algoritmos (incluyendo resiliencia, hashing y fecha/hora) para navegación dinámica o exploración agrupada.

```ts
import { algorithms } from "@zuccadev-labs/barrits";
algorithms.sort.orderBy(items, criteria);
```

### `logic`

Agrupa algoritmos, aritmética, resiliencia, hashing, fecha/hora y familias funcionales bajo el dominio principal.

```ts
import { logic } from "@zuccadev-labs/barrits";
logic.orderBy(items, criteria);
logic.searchAlgorithms.binarySearch(sorted, target);
logic.retryWithBackoff(op);         // resiliencia
logic.sha256Hex(manifest);          // hashing
logic.toIsoString(new Date());      // fecha/hora
```

---

[← Configuración Package-First](09a-referencia-de-api-configuracion.md) | [Consume y Adapters →](09c-referencia-de-api-consume-y-adapters.md)
