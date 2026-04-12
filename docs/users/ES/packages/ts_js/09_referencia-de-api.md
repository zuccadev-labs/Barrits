# 09 Referencia de API

Este documento actua como referencia central de la superficie publica de `@zuccadev-labs/barrits`. La meta es responder cuatro preguntas para cada metodo o familia: que hace, para que sirve, como se usa y donde aparece en los recorridos reales del repo.

## Como leer esta referencia

- si necesito arrancar rapido, primero leo `packages/sdk/ts_js/README.md`
- si ya se que ejemplo me interesa, entro a `examples/00_indice.md`, que documenta la carpeta canonica `packages/sdk/ts_js/examples/`, y despues al README local de la demo
- si quiero detalle exacto de una funcion, vuelvo aqui

## Entrada principal `@zuccadev-labs/barrits`

### Configuracion package-first

- `defineBarritsPackage(options)`
  Que hace: normaliza la descripcion del consumidor.
  Para que sirve: unifica runtime, watch, autoManifest, projectRoot y automationDirectory antes de tocar plugins o tooling.
  Como se usa: se llama en `vite.config.ts`, `webpack.config.mjs`, `rollup.config.mjs`, `esbuild.config.mjs` o scripts equivalentes.
  Donde se usa: `examples/example-react/vite.config.ts`, `examples/example-vue/vite.config.ts`, `examples/example-solid/vite.config.ts`, `examples/example-svelte/vite.config.ts`, `examples/bundlers/*` y `examples/example-bun/src/main.ts`.

- `toBarritsAutomationOptions(options)`
  Que hace: adapta la definicion del paquete a las opciones operativas que esperan los plugins.
  Para que sirve: evita que el bundler conozca detalles de configuracion que no necesita.
  Como se usa: se pasa el resultado de `defineBarritsPackage()` o el mismo objeto de entrada.
  Donde se usa: `examples/example-react/vite.config.ts` y cada configuracion en `examples/bundlers/`.

- `defineBarritsConfig(options)`
  Que hace: crea una configuracion valida para `barrits.config.*`.
  Para que sirve: declara defaults persistentes del proyecto en vez de repetirlos en cada archivo.
  Como se usa: se exporta como default desde el archivo de configuracion.
  Donde se usa: se explica en `05_automatizacion-y-configuracion.md`.

- `loadBarritsConfig()`
  Que hace: carga la configuracion del proyecto desde disco.
  Para que sirve: tooling, CLI o automatizaciones pueden resolver la configuracion sin duplicar la logica de lectura.
  Como se usa: se invoca desde procesos internos o herramientas que necesitan introspeccion.
  Donde se usa: forma parte del flujo documentado en `06_comandos-y-runtimes.md`.

- `findBarritsConfigFile()`
  Que hace: localiza el archivo de configuracion del proyecto.
  Para que sirve: discovery controlado de `barrits.config.*`.
  Como se usa: se llama antes de cargar o resolver configuracion cuando necesito saber si el archivo existe.
  Donde se usa: es util en tooling y diagnostico; queda explicada en `05_automatizacion-y-configuracion.md`.

- `resolveBarritsConfig()`
  Que hace: resuelve la configuracion efectiva del proyecto.
  Para que sirve: aplica defaults y devuelve un objeto listo para operar.
  Como se usa: se usa cuando necesito la configuracion final, no solo el archivo fuente.
  Donde se usa: en flujos de automatizacion y CLI.

### Rutas, nombres y dominios

- `buildPath(...parts)`
  Que hace: compone una ruta operativa a partir de partes seguras.
  Para que sirve: construir paths consistentes para artifacts, exports o rutas derivadas.
  Como se usa: se pasa una secuencia de segmentos y devuelve la ruta normalizada.
  Donde se usa: el ejemplo Deno construye una variante local en `examples/example-deno/barrits/` y Bun usa la API directa en `examples/example-bun/barrits/index.ts`.

- `parsePath(path)`
  Que hace: separa una ruta publica en sus partes.
  Para que sirve: inspeccion, validacion o transformacion de rutas package-first.
  Como se usa: se llama cuando necesito recuperar dominios o segmentos a partir de una ruta conocida.
  Donde se usa: diagnostico, tooling o validaciones internas del consumidor; Bun la usa en `examples/example-bun/barrits/index.ts`.

- `PACKAGE_NAME`
  Que hace: expone el nombre canonico del paquete.
  Para que sirve: logs, banners, tooling y mensajes consistentes.
  Como se usa: se importa como constante.
  Donde se usa: integraciones o CLIs que no quieren hardcodear el nombre.

- `PACKAGE_ALIAS`
  Que hace: expone el alias corto del paquete.
  Para que sirve: automatizacion, branding corto y comandos abreviados.
  Como se usa: se importa como constante.
  Donde se usa: scripts o tooling interno que necesitan una representacion breve.

- `barrits` y `brt`
  Que hace: agrupan la API por dominios (`logic`, `routes`, `traits`).
  Para que sirve: acceso namespaced cuando prefiero navegar por familias en vez de imports flat.
  Como se usa: `barrits.logic.orderBy(...)`, `barrits.routes.buildPath(...)` o `barrits.traits.composePipeline(...)`.
  Donde se usa: consumo avanzado o shells exploratorios.

### Consumo resumido de manifests y snapshots

- `parseBuildManifest(value)`
  Que hace: parsea un manifest de build.
  Para que sirve: validar o convertir el artifact crudo antes de consumirlo.
  Como se usa: recibe texto o estructura serializada y devuelve el manifest tipado.
  Donde se usa: pipelines de consumo y tooling.

- `parseWatchSnapshot(value)`
  Que hace: parsea un snapshot de watch.
  Para que sirve: transformar la salida serializada en una estructura utilizable.
  Como se usa: se aplica sobre el payload del snapshot antes de resumirlo o mostrarlo.
  Donde se usa: consumo de tooling y flujos de observabilidad.

- `createBuildManifestSummary(manifest)`
  Que hace: genera un resumen del manifest de build.
  Para que sirve: UI, dashboards o plugins no necesitan cargar la estructura completa.
  Como se usa: recibe un manifest ya disponible en memoria o inyectado por plugin.
  Donde se usa: `examples/example-react/src/main.jsx`, `examples/example-vue/src/App.vue`, `examples/example-solid/src/main.tsx`, `examples/example-svelte/src/App.svelte` y `examples/bundlers/*-manifest-entry.mjs`.

- `createWatchSnapshotSummary(snapshot)`
  Que hace: resume un snapshot de watch.
  Para que sirve: observabilidad, paneles o diagnostico rapido.
  Como se usa: recibe el snapshot ya parseado.
  Donde se usa: recorridos de consumo y tooling.

- `createLanguageToolSnapshot(input)`
  Que hace: construye un snapshot orientado a tooling de lenguaje.
  Para que sirve: compatibilidad con flujos de inspeccion y edicion asistida.
  Como se usa: se llama cuando quiero una vista estable del estado del dominio.
  Donde se usa: tooling y consumo de artifacts.

### Traits y composicion declarativa

- `composePipeline(initialValue, ...steps)`
  Que hace: compone una tuberia de transformaciones.
  Para que sirve: declarar flujos de procesamiento encadenados de forma clara.
  Como se usa: recibe un valor inicial y luego una secuencia de pasos; cada paso recibe el resultado del anterior.
  Donde se usa: `08_traits-y-composicion.md`.

- `composeTraitDescriptors(input)`
  Que hace: compone descriptores de traits en una estructura final.
  Para que sirve: consolidar metadata y conflictos declarativos.
  Como se usa: recibe un conjunto de descriptores y reglas de composicion.
  Donde se usa: documentacion de traits y escenarios package-first avanzados.

- `createTraitDescriptor(input)`
  Que hace: crea un descriptor de trait desde metadata explicita.
  Para que sirve: formalizar traits reutilizables.
  Como se usa: se define el nombre, metadata y comportamiento esperado.
  Donde se usa: `08_traits-y-composicion.md`.

- `createTraitDescriptorFromJsDoc(jsDoc, descriptor)`
  Que hace: crea un descriptor a partir de JSDoc.
  Para que sirve: derivar metadata desde comentarios ya existentes.
  Como se usa: se le pasa el bloque JSDoc y un descriptor con la funcion `create` y overrides opcionales.
  Donde se usa: pipelines de introspeccion y documentacion automatizada.

- `parseTraitDescriptorJsDoc(value)`
  Que hace: parsea JSDoc de traits.
  Para que sirve: convertir comentarios en metadata estructurada.
  Como se usa: se aplica antes de `createTraitDescriptorFromJsDoc()`.
  Donde se usa: tooling y contratos declarativos.

Tags declarativos reconocidos por este flujo:

- `@barrits-trait`
- `@barrits-summary`
- `@barrits-requires`
- `@barrits-conflicts`
- `@barrits-state`
- `@barrits-consumes`
- `@barrits-provides`
- `@barrits-tags`
- `@barrits-runtime`
- `@barrits-version`
- `@barrits-stability`

- `mergeTraits(...traits)`
  Que hace: fusiona traits.
  Para que sirve: consolidar comportamiento y metadata en un solo resultado.
  Como se usa: se usa cuando el consumidor necesita herencia o mezcla controlada.
  Donde se usa: `08_traits-y-composicion.md`.

## Algoritmos y utilidades funcionales

### Aritmetica basica

- `sumar(a, b)`
  Que hace: suma valores numericos con las guardas del paquete.
  Para que sirve: demos simples, pipelines y utilidades basicas.
  Como se usa: `sumar(2, 3)`.
  Donde se usa: `examples/example-solid/src/main.tsx` y `examples/example-svelte/src/App.svelte`.

- `restar(a, b)`
  Que hace: resta valores numericos.
  Para que sirve: operaciones simples dentro del mismo catalogo funcional.
  Como se usa: `restar(5, 2)`.
  Donde se usa: disponible para scripts y demos; no es protagonista en los ejemplos actuales.

- `arithmetic`
  Que hace: agrupa las operaciones aritmeticas basicas.
  Para que sirve: consumo namespaced.
  Como se usa: `arithmetic.sumar(...)`.
  Donde se usa: shells o exploracion interactiva.

### Colecciones

- `chunk(collection, size)`
  Que hace: divide una coleccion en bloques.
  Para que sirve: batch processing o paginacion manual.
  Como se usa: se pasa el array y el tamano de cada bloque.
  Donde se usa: `examples/example-nodejs/src/examples/collection/real-collection-cases.mjs`.

- `groupBy(collection, projector)`
  Que hace: agrupa elementos por una clave derivada.
  Para que sirve: agregacion previa, reportes o vistas agrupadas.
  Como se usa: el projector devuelve la clave de agrupacion.
  Donde se usa: `examples/example-nodejs/src/examples/collection/real-collection-cases.mjs`.

- `indexBy(collection, projector)`
  Que hace: indexa una coleccion por una clave unica.
  Para que sirve: acceso rapido por id o codigo.
  Como se usa: el projector devuelve la clave del indice.
  Donde se usa: `examples/example-nodejs/src/examples/collection/real-collection-cases.mjs`.

- `uniqueBy(collection, projector)`
  Que hace: elimina duplicados segun una clave derivada.
  Para que sirve: normalizacion previa de datos.
  Como se usa: el projector identifica cuando dos items representan la misma entidad.
  Donde se usa: `examples/example-nodejs/src/examples/collection/real-collection-cases.mjs`.

- `collectionAlgorithms`
  Que hace: agrupa el catalogo de colecciones.
  Para que sirve: consumo namespaced.
  Como se usa: `collectionAlgorithms.groupBy(...)`.
  Donde se usa: exploracion y tooling.

### Busqueda

- `linearSearch(collection, predicate)`
  Que hace: recorre secuencialmente hasta encontrar un match.
  Para que sirve: listas cortas o sin orden garantizado.
  Como se usa: el predicate decide el match.
  Donde se usa: `examples/example-nodejs/src/examples/search/real-search-cases.mjs`.

- `binarySearch(collection, target, compare?)`
  Que hace: busca sobre colecciones ordenadas.
  Para que sirve: acceso rapido con costo logaritmico.
  Como se usa: la coleccion debe estar ordenada segun el comparador.
  Donde se usa: `examples/example-nodejs/src/examples/search/real-search-cases.mjs`.

- `lowerBound(collection, target, compare?)`
  Que hace: devuelve la primera posicion valida para insertar un valor.
  Para que sirve: ventanas ordenadas, insercion o rangos.
  Como se usa: sobre una coleccion ya ordenada.
  Donde se usa: `examples/example-nodejs/src/examples/search/real-search-cases.mjs`.

- `upperBound(collection, target, compare?)`
  Que hace: devuelve la posicion posterior al ultimo match compatible.
  Para que sirve: delimitar rangos o duplicados en estructuras ordenadas.
  Como se usa: igual que `lowerBound()`.
  Donde se usa: `examples/example-nodejs/src/examples/search/real-search-cases.mjs`.

- `findSortedRange(collection, target, compare?)`
  Que hace: localiza el rango completo de un valor dentro de una coleccion ordenada.
  Para que sirve: datasets con duplicados o ventanas de coincidencia.
  Como se usa: combina internamente limites inferior y superior.
  Donde se usa: `examples/example-nodejs/src/examples/search/real-search-cases.mjs`.

- `searchAlgorithms`
  Que hace: agrupa el catalogo de busqueda.
  Para que sirve: acceso namespaced.
  Como se usa: `searchAlgorithms.binarySearch(...)`.
  Donde se usa: exploracion y tooling.

### Ordenamiento

- `orderBy(collection, criteria)`
  Que hace: ordena por uno o varios criterios declarativos.
  Para que sirve: listas de UI, reportes o dashboards.
  Como se usa: se pasa una lista de criterios con `project` y `direction`.
  Donde se usa: `examples/example-react/src/main.jsx`, `examples/example-vue/src/App.vue`, `examples/example-nodejs/src/examples/sort/real-sort-cases.mjs` y `examples/example-bun/src/main.ts`.

- `quickSort(collection, compare?)`
  Que hace: ordena con una estrategia general de alto rendimiento.
  Para que sirve: colecciones grandes cuando no necesito estabilidad.
  Como se usa: opcionalmente recibe comparador.
  Donde se usa: `examples/example-nodejs/src/examples/sort/real-sort-cases.mjs`.

- `stableSortBy(collection, projector, direction?)`
  Que hace: ordena manteniendo estabilidad relativa entre iguales.
  Para que sirve: UI y reportes donde el orden previo importa.
  Como se usa: se define la proyeccion y direccion.
  Donde se usa: `examples/example-nodejs/src/examples/sort/real-sort-cases.mjs`.

- `insertSorted(collection, value, compare?)`
  Que hace: inserta un valor en una coleccion ya ordenada.
  Para que sirve: mantener orden incremental sin reordenar todo.
  Como se usa: la coleccion de entrada debe respetar el mismo criterio.
  Donde se usa: `examples/example-nodejs/src/examples/sort/real-sort-cases.mjs`.

- `sortAlgorithms`
  Que hace: agrupa el catalogo de ordenamiento.
  Para que sirve: acceso namespaced.
  Como se usa: `sortAlgorithms.orderBy(...)`.
  Donde se usa: exploracion y tooling.

### Seleccion y agregacion

- `maxBy(collection, projector)`
  Que hace: devuelve el item con mayor valor proyectado.
  Para que sirve: top item o mejor candidato.
  Como se usa: el projector devuelve el valor comparable.
  Donde se usa: disponible para scripts y reportes.

- `minBy(collection, projector)`
  Que hace: devuelve el item con menor valor proyectado.
  Para que sirve: minimo operativo o baseline.
  Como se usa: igual que `maxBy()`.
  Donde se usa: scripts y reportes.

- `sumBy(collection, projector)`
  Que hace: suma una proyeccion numerica sobre la coleccion.
  Para que sirve: totals, costos, volumen o score acumulado.
  Como se usa: el projector devuelve el numero a sumar.
  Donde se usa: analitica y reportes.

- `averageBy(collection, projector)`
  Que hace: calcula el promedio de una proyeccion numerica.
  Para que sirve: KPIs, capacidad, throughput o latencia promedio.
  Como se usa: se pasa un array y una proyeccion.
  Donde se usa: `examples/example-nodejs/src/examples/timeseries/real-timeseries-cases.mjs`, `examples/example-deno/main.ts` y `examples/example-bun/src/main.ts`.

- `histogramBy(collection, projector)`
  Que hace: construye un histograma a partir de una clave o bucket derivado.
  Para que sirve: distribuciones y conteos por categoria.
  Como se usa: el projector devuelve el bucket.
  Donde se usa: scripts de analitica y catalogos agregados.

- `paginate(collection, options)`
  Que hace: pagina una coleccion.
  Para que sirve: UI y APIs que necesitan pagina, total y subset.
  Como se usa: se indican pagina, limite o cursores equivalentes segun la API.
  Donde se usa: `examples/example-nodejs/src/examples/selection/real-selection-cases.mjs`.

- `partitionBy(collection, predicate)`
  Que hace: separa la coleccion en dos grupos.
  Para que sirve: validos vs invalidos, activos vs inactivos, etc.
  Como se usa: el predicate define la condicion de particion.
  Donde se usa: `examples/example-nodejs/src/examples/selection/real-selection-cases.mjs`.

- `rankBy(collection, projector, direction?)`
  Que hace: asigna ranking a cada elemento segun una proyeccion.
  Para que sirve: leaderboards, priorizacion o scoring.
  Como se usa: se define la metrica y la direccion.
  Donde se usa: `examples/example-nodejs/src/examples/selection/real-selection-cases.mjs`.

- `topK(collection, limit, compare?)`
  Que hace: devuelve los mejores `k` elementos.
  Para que sirve: seleccion parcial sin ordenar toda la coleccion.
  Como se usa: se indica el limite y opcionalmente el comparador.
  Donde se usa: `examples/example-nodejs/src/examples/selection/real-selection-cases.mjs`, `examples/example-deno/main.ts` y `examples/example-bun/src/main.ts`.

- `aggregateAlgorithms` y `selectionAlgorithms`
  Que hace: agrupan los algoritmos de agregacion y seleccion.
  Para que sirve: acceso namespaced.
  Como se usa: `aggregateAlgorithms.averageBy(...)`, `selectionAlgorithms.topK(...)`.
  Donde se usa: exploracion y tooling.

### Series temporales y finanzas

- `bucketByInterval(series, interval)`
  Que hace: agrupa puntos temporales por intervalo.
  Para que sirve: resampling, dashboards o agregacion por ventana.
  Como se usa: se pasa la serie y el intervalo esperado.
  Donde se usa: `examples/example-nodejs/src/examples/timeseries/real-timeseries-cases.mjs`.

- `detectTimeSeriesGaps(series, interval)`
  Que hace: detecta huecos temporales.
  Para que sirve: observabilidad y calidad de datos.
  Como se usa: se pasa la serie y el intervalo esperado.
  Donde se usa: `examples/example-nodejs/src/examples/timeseries/real-timeseries-cases.mjs`.

- `differenceSeries(series)`
  Que hace: calcula la diferencia entre puntos consecutivos.
  Para que sirve: variacion, delta o momentum basico.
  Como se usa: recibe una serie ordenada.
  Donde se usa: `examples/example-nodejs/src/examples/timeseries/real-timeseries-cases.mjs`.

- `movingAverageSeries(series, windowSize)`
  Que hace: calcula el promedio movil sobre una serie temporal tipada.
  Para que sirve: suavizado de tendencia.
  Como se usa: se define el tamano de la ventana.
  Donde se usa: `examples/example-nodejs/src/examples/timeseries/real-timeseries-cases.mjs`, `examples/example-react/src/main.jsx`, `examples/example-vue/src/App.vue` y `examples/example-svelte/src/App.svelte`.

- `resampleSeries(series, interval)`
  Que hace: remuestrea una serie a un nuevo intervalo.
  Para que sirve: comparabilidad o consolidacion temporal.
  Como se usa: se pasa la serie y el intervalo destino.
  Donde se usa: `examples/example-nodejs/src/examples/timeseries/real-timeseries-cases.mjs`.

- `sortTimeSeries(series)`
  Que hace: ordena una serie por timestamp.
  Para que sirve: normalizar la entrada antes de analitica temporal.
  Como se usa: se llama previo a algoritmos que asumen orden cronologico.
  Donde se usa: util en pipelines temporales.

- `returnsSeries(series)`
  Que hace: calcula retornos entre puntos de una serie.
  Para que sirve: analitica financiera y performance relativa.
  Como se usa: recibe una serie numerica ordenada.
  Donde se usa: finanzas y KPIs avanzados.

- `maxDrawdown(series)`
  Que hace: calcula la mayor caida desde un maximo previo.
  Para que sirve: riesgo y analitica financiera.
  Como se usa: se pasa una serie temporal numerica.
  Donde se usa: `examples/example-react/src/main.jsx` y `examples/example-vue/src/App.vue`.

- `annualizedVolatility(series)`
  Que hace: calcula volatilidad anualizada.
  Para que sirve: analitica financiera avanzada.
  Como se usa: se aplica sobre retornos o serie compatible.
  Donde se usa: scripts analiticos del paquete.

- `exponentialMovingAverage(series, alpha)`
  Que hace: calcula promedio movil exponencial.
  Para que sirve: suavizado con mas peso en lo reciente.
  Como se usa: se define el factor o alpha.
  Donde se usa: analitica financiera o operacional.

- `timeSeriesAlgorithms`
  Que hace: agrupa el catalogo temporal y financiero.
  Para que sirve: acceso namespaced.
  Como se usa: `timeSeriesAlgorithms.movingAverageSeries(...)`.
  Donde se usa: exploracion y tooling.

### Ventanas

- `movingAverage(values, windowSize)`
  Que hace: calcula promedio movil sobre una secuencia simple.
  Para que sirve: suavizado rapido sobre listas numericas.
  Como se usa: recibe un array de numeros y el tamano de ventana.
  Donde se usa: `examples/example-nodejs/src/examples/window/real-window-cases.mjs`, `examples/example-deno/main.ts` y `examples/example-bun/src/main.ts`.

- `rollingSum(values, windowSize)`
  Que hace: calcula suma movil.
  Para que sirve: volumen, carga o throughput acumulado por ventana.
  Como se usa: igual que `movingAverage()`.
  Donde se usa: `examples/example-nodejs/src/examples/window/real-window-cases.mjs`.

- `slidingWindow(values, windowSize)`
  Que hace: expone cada ventana consecutiva de una secuencia.
  Para que sirve: aplicar transformaciones o analitica propia sobre ventanas.
  Como se usa: devuelve las subcolecciones correspondientes.
  Donde se usa: `examples/example-nodejs/src/examples/window/real-window-cases.mjs`.

- `windowDelta(values, windowSize)`
  Que hace: calcula el delta entre valores dentro de una ventana.
  Para que sirve: cambio relativo o aceleracion.
  Como se usa: recibe una secuencia y tamano de ventana.
  Donde se usa: `examples/example-nodejs/src/examples/window/real-window-cases.mjs`.

- `windowAlgorithms`
  Que hace: agrupa el catalogo de ventanas.
  Para que sirve: acceso namespaced.
  Como se usa: `windowAlgorithms.rollingSum(...)`.
  Donde se usa: exploracion y tooling.

### Grafos

- `buildAdjacencyList(edges)`
  Que hace: crea una lista de adyacencia.
  Para que sirve: preparar estructuras de grafo para algoritmos posteriores.
  Como se usa: recibe edges o relaciones entre nodos.
  Donde se usa: base para los casos de grafo en `examples/example-nodejs/src/examples/graph/real-graph-cases.mjs`.

- `breadthFirstSearch(graph, start)`
  Que hace: recorre el grafo en anchura.
  Para que sirve: niveles, conectividad o rutas simples.
  Como se usa: se indica nodo inicial.
  Donde se usa: `examples/example-nodejs/src/examples/graph/real-graph-cases.mjs`.

- `depthFirstSearch(graph, start)`
  Que hace: recorre el grafo en profundidad.
  Para que sirve: exploracion exhaustiva o deteccion estructural.
  Como se usa: se indica nodo inicial.
  Donde se usa: disponible en el mismo catalogo de grafos.

- `detectDirectedCycle(graph)`
  Que hace: detecta ciclos dirigidos.
  Para que sirve: validacion de pipelines, DAGs o dependencias.
  Como se usa: recibe un grafo dirigido.
  Donde se usa: tooling y validacion estructural.

- `dijkstraShortestPath(graph, from, to)`
  Que hace: calcula el camino minimo.
  Para que sirve: rutas optimas, costos y planeamiento.
  Como se usa: el grafo debe incluir pesos compatibles.
  Donde se usa: `examples/example-nodejs/src/examples/graph/real-graph-cases.mjs`.

- `maxFlow(graph, source, sink)`
  Que hace: calcula flujo maximo.
  Para que sirve: redes de capacidad o optimizacion de throughput.
  Como se usa: se indica origen y destino.
  Donde se usa: scripts avanzados de grafo.

- `minimumSpanningTree(graph)`
  Que hace: calcula el arbol de expansion minima.
  Para que sirve: conectividad minima con costo reducido.
  Como se usa: se pasa un grafo ponderado.
  Donde se usa: utilidades de grafo y escenarios de red.

- `topologicalSort(graph)`
  Que hace: ordena un DAG topologicamente.
  Para que sirve: dependencias, etapas de build o ejecucion.
  Como se usa: el grafo no debe tener ciclos.
  Donde se usa: `examples/example-nodejs/src/examples/graph/real-graph-cases.mjs`.

- `graphAlgorithms`
  Que hace: agrupa el catalogo de grafos.
  Para que sirve: acceso namespaced.
  Como se usa: `graphAlgorithms.topologicalSort(...)`.
  Donde se usa: exploracion y tooling.

### Catalogos agregados

- `algorithms`
  Que hace: expone el catalogo general de algoritmos.
  Para que sirve: navegacion dinamica o exploracion agrupada.
  Como se usa: `algorithms.sort.orderBy(...)` o estructura equivalente segun el modulo.
  Donde se usa: diagnostico y tooling.

- `logic`
  Que hace: agrupa algoritmos, aritmetica y familias funcionales.
  Para que sirve: acceso namespaced desde el dominio principal `barrits.logic`.
  Como se usa: `logic.orderBy(...)`, `logic.searchAlgorithms`, etc.
  Donde se usa: consumo namespaced.

## Subpaths especializados

### `@zuccadev-labs/barrits/consume`

- `readBuildManifest(path, readTextFile)`
  Que hace: lee y parsea un manifest desde una funcion de acceso a texto.
  Para que sirve: desacoplar filesystem, renderer o backend.
  Como se usa: se pasa la ruta y un reader asyncrono.
  Donde se usa: flujos seguros como Tauri o backends controlados.

- `readBuildManifestSummary(path, readTextFile)`
  Que hace: lee el manifest y devuelve directamente el resumen.
  Para que sirve: UI y dashboards que no quieren el artifact completo.
  Como se usa: igual que `readBuildManifest()`.
  Donde se usa: `examples/example-tauri/src/main.ts`.

- `readWatchSnapshot(path, readTextFile)`
  Que hace: lee y parsea un snapshot de watch.
  Para que sirve: observabilidad y tooling.
  Como se usa: se le pasa un reader asyncrono.
  Donde se usa: consumo seguro de snapshots.

- `readWatchSnapshotSummary(path, readTextFile)`
  Que hace: lee y resume el snapshot de watch.
  Para que sirve: vistas compactas del estado de automatizacion.
  Como se usa: wrapper directo para UI o reportes.
  Donde se usa: paneles o inspeccion operativa.

- `readLanguageToolSnapshot(path, readTextFile)`
  Que hace: lee un snapshot de tooling de lenguaje.
  Para que sirve: editores, tooling y renderer seguro.
  Como se usa: igual que el resto de readers de `consume`.
  Donde se usa: `examples/example-tauri/src/main.ts`.

### `@zuccadev-labs/barrits/node`

- `createNodeFileSystemAdapter()`
  Que hace: crea un adapter de filesystem para Node.
  Para que sirve: discovery, inspeccion y tooling con acceso real a disco.
  Como se usa: se importa desde el subpath Node y se conecta al flujo de lectura o inspeccion.
  Donde se usa: scripts y tooling del runtime Node.

- `readNodeBuildManifest(path)`
  Que hace: lee un manifest desde disco en Node.
  Para que sirve: wrapper listo para filesystem local.
  Como se usa: solo necesito la ruta del archivo.
  Donde se usa: scripts operativos del runtime Node.

- `readNodeBuildManifestSummary(path)`
  Que hace: lee y resume el manifest desde disco.
  Para que sirve: simplificar consumo en scripts o CLIs.
  Como se usa: se usa con una sola ruta.
  Donde se usa: `examples/example-nodejs/scripts/build-runner.mjs`.

- `readNodeWatchSnapshot(path)`
  Que hace: lee un snapshot de watch en Node.
  Para que sirve: diagnostico o tooling local.
  Como se usa: recibe la ruta del snapshot.
  Donde se usa: scripts de observabilidad.

- `readNodeWatchSnapshotSummary(path)`
  Que hace: lee y resume el snapshot de watch.
  Para que sirve: reportes compactos.
  Como se usa: wrapper directo por ruta.
  Donde se usa: tooling local.

- `readNodeLanguageToolSnapshot(path)`
  Que hace: lee un snapshot de tooling de lenguaje desde disco.
  Para que sirve: editores, scripts o inspeccion offline.
  Como se usa: se llama con la ruta del archivo.
  Donde se usa: `examples/example-nodejs/scripts/snapshot-consumer.mjs`.

- `runNodeCli(argumentsList?)`
  Que hace: ejecuta la CLI Node desde codigo.
  Para que sirve: wrappers, tests o automatizaciones que no quieren spawn manual.
  Como se usa: recibe la lista de argumentos opcional.
  Donde se usa: integraciones Node y `@zuccadev-labs/barrits/node/cli`.

### `@zuccadev-labs/barrits/deno`

- `createDenoFileSystemAdapter()`
  Que hace: crea un adapter de filesystem para Deno.
  Para que sirve: discovery e inspeccion en el runtime Deno.
  Como se usa: se conecta a tooling o lectura controlada.
  Donde se usa: flujos Deno y JSR.

- `readDenoBuildManifest(path)`
  Que hace: lee un manifest en Deno.
  Para que sirve: wrapper listo para el runtime.
  Como se usa: se pasa la ruta del archivo.
  Donde se usa: tooling Deno.

- `readDenoBuildManifestSummary(path)`
  Que hace: lee y resume el manifest en Deno.
  Para que sirve: scripts o tareas `deno task`.
  Como se usa: wrapper directo por ruta.
  Donde se usa: recorridos de runtime Deno.

- `readDenoWatchSnapshot(path)`
  Que hace: lee un snapshot de watch en Deno.
  Para que sirve: observabilidad y tooling.
  Como se usa: se pasa la ruta del snapshot.
  Donde se usa: scripts Deno.

- `readDenoWatchSnapshotSummary(path)`
  Que hace: resume un snapshot de watch en Deno.
  Para que sirve: vista compacta del estado del proyecto.
  Como se usa: wrapper por ruta.
  Donde se usa: tooling Deno.

- `readDenoLanguageToolSnapshot(path)`
  Que hace: lee un snapshot de tooling de lenguaje en Deno.
  Para que sirve: inspeccion o integraciones editor-friendly.
  Como se usa: recibe la ruta del archivo.
  Donde se usa: scripts y tareas del runtime.

- `runDenoCli(argumentsList?)`
  Que hace: ejecuta la CLI Deno desde codigo.
  Para que sirve: wrappers o automatizacion desde Deno.
  Como se usa: recibe argumentos opcionales.
  Donde se usa: `@zuccadev-labs/barrits/deno/cli`.

### Plugins de bundlers

- `barritsVitePlugin(options)`
  Que hace: integra el contrato package-first en Vite.
  Para que sirve: manifest virtual, automatizacion y wiring del proyecto consumidor.
  Como se usa: recibe `package: toBarritsAutomationOptions(...)`.
  Donde se usa: `examples/example-react/vite.config.ts`, `examples/example-vue/vite.config.ts`, `examples/example-solid/vite.config.ts`, `examples/example-svelte/vite.config.ts` y `examples/bundlers/vite/vite.config.ts`.

- `barritsEsbuildPlugin(options)`
  Que hace: integra el contrato package-first en esbuild.
  Para que sirve: build automatizado sin repetir discovery o artifacts.
  Como se usa: se conecta a la configuracion de esbuild con opciones derivadas del paquete.
  Donde se usa: `examples/bundlers/esbuild/esbuild.config.mjs`.

- `barritsRollupPlugin(options)`
  Que hace: integra el contrato package-first en Rollup.
  Para que sirve: mismos artifacts y mismas convenciones sobre otro bundler.
  Como se usa: plugin dentro de la config de Rollup.
  Donde se usa: `examples/bundlers/rollup/rollup.config.mjs`.

- `barritsWebpackPlugin(options)`
  Que hace: integra el contrato package-first en Webpack.
  Para que sirve: automatizacion y materializacion de artifacts en Webpack.
  Como se usa: se instancia o se invoca segun el modo del plugin.
  Donde se usa: `examples/bundlers/webpack/webpack.config.mjs`.

- `BarritsWebpackPlugin`
  Que hace: expone la clase del plugin de Webpack.
  Para que sirve: integraciones que prefieren instanciacion explicita.
  Como se usa: `new BarritsWebpackPlugin(...)`.
  Donde se usa: disponible para consumidores Webpack avanzados.

## Tipos publicos

Ademas de las funciones, la raiz y los subpaths exportan tipos utiles para consumers tipados: rutas (`PathParts`), runtimes (`RuntimeName`, `BarritsRuntimeKind`, `BarritsWatchMode`), estructuras de manifests y snapshots (`BarritsBuildManifest`, `BarritsLanguageToolSnapshot`, `BarritsWatchSnapshot`, `BarritsConsumedStateSummary`) y tipos de algoritmos (`OrderCriterion`, `TimeSeriesPoint`, `PaginatedResult`, `GraphEdge`, entre otros).

Yo recomiendo importar esos tipos solo cuando el consumidor realmente necesita contratos tipados explicitos. Si la integracion ya vive completa dentro de un ejemplo del repo, primero copio el recorrido y despues agrego tipos concretos segun la necesidad.
