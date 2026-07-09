---
title: "07 — Estandarización del Catálogo de Algoritmos"
description: "ADR y registro de investigación sobre la estandarización y validación del catálogo de 10 familias algorítmicas en el SDK ts_js."
---

# 07 — Estandarización del Catálogo de Algoritmos

## Contexto e Investigación

Con la arquitectura base resuelta (runtime-agnostic, traits, adaptadores node/deno), el equipo identificó la necesidad de ofrecer un **catálogo algorítmico uniforme** que pudiera ser consumido desde cualquier runtime sin fricción. Hasta ese momento, las funciones de algoritmos vivían dispersas entre `barrits_lib/logic/` y módulos sueltos, sin una taxonomía clara ni validación cruzada.

Se auditaron las funciones existentes en el SDK y se descubrieron 53 funciones exportadas desde `src/barrits/logic/index.ts`, agrupables en las siguientes familias naturales:

| Familia | Funciones | Madurez |
|---------|-----------|---------|
| Search | `binarySearch`, `linearSearch`, `lowerBound`, `upperBound`, `findSortedRange` | Estable |
| Collection | `chunk`, `groupBy`, `indexBy`, `uniqueBy` | Estable |
| Sort | `orderBy`, `quickSort`, `stableSortBy`, `insertSorted` | Estable |
| Selection | `paginate`, `partitionBy`, `rankBy`, `topK` | Estable |
| Time Series | `averageBy`, `bucketByInterval`, `detectTimeSeriesGaps`, `differenceSeries`, `movingAverageSeries`, `resampleSeries` | Estable |
| Window | `movingAverage`, `rollingSum`, `slidingWindow`, `windowDelta` | Estable |
| Graph | `breadthFirstSearch`, `dijkstraShortestPath`, `topologicalSort` | Estable |
| Resilience | `retryWithBackoff`, `createCircuitBreaker`, `withTimeout` | Estable |
| Hashing | `sha256Hex`, `deterministicStringify` | Estable |
| Datetime | `toIsoString`, `toRelativeTime`, `toDateString` | Estable |

## Decisiones Arquitectónicas (ADR)

1. **Taxonomía de 10 Familias como Contrato Público:**
   - **Decisión:** Se establecieron 10 familias algorítmicas como la clasificación oficial del SDK. Cada familia tiene una carpeta dedicada dentro de `src/barrits/logic/` y un barrel que re-exporta sus funciones.
   - **Por qué:** Proporciona una navegación predecible para consumidores humanos y agentes de IA. La taxonomía refleja dominios semánticos reconocibles (búsqueda, colecciones, ordenamiento, series temporales, etc.).
   - **Implementación:** `src/barrits/logic/{algorithms,hashing,resilience,datetime,validation}/` con barrels individuales y un barrel raíz en `src/barrits/logic/index.ts`.

2. **Validación mediante Ejemplos Reales en Lugar de Tests Unitarios Aislados:**
   - **Decisión:** Las funciones algorítmicas se validan mediante ejemplos ejecutables que demuestran su uso en contextos operacionales reales, no mediante tests unitarios tradicionales.
   - **Por qué:** Un ejemplo ejecutable documenta simultáneamente el API, el comportamiento esperado y el caso de uso real. Reduce la duplicación entre tests y documentación.
   - **Implementación:** `packages/sdk/ts_js/examples/example-nodejs/src/examples/` contiene un archivo por familia con escenarios anotados.

3. **Stubs para Funciones No Implementadas en el SDK:**
   - **Decisión:** Las funciones que existen en la taxonomía pero aún no tienen implementación real en el barrel principal del SDK se declaran como stubs en los ejemplos, con una implementación mínima funcional y un comentario `// @stub pending SDK export`.
   - **Por qué:** Permite que los ejemplos compilen y se ejecuten completos desde el primer día, mientras se mantiene visibilidad del gap de implementación.
   - **Implementación:** `example-bun` contiene 3 stubs (hashing, resilience, datetime) que serán reemplazados cuando el SDK exporte esas funciones.

## Resultados y Siguientes Pasos

La estandarización del catálogo permitió:
- Reducción de duplicación conceptual entre runtimes (node/deno/bun comparten la misma taxonomía).
- Documentación viva: los ejemplos ejecutables funcionan como la fuente de verdad del comportamiento algorítmico.
- Base para la validación cruzada: los mismos ejemplos se ejecutan en todos los runtimes soportados.

El siguiente paso natural es migrar los stubs a implementaciones reales del SDK y agregar property-based testing para las familias críticas (Sort, Time Series, Graph).

---

[← Conclusiones y Límites de Diseño](05_conclusiones-y-limites.md) | [Índice](00_indice.md)
