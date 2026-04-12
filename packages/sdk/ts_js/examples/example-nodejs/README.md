# example-nodejs

Yo uso este ejemplo cuando quiero responder una pregunta concreta: como se ve `@zuccadev-labs/barrits` dentro de un runtime Node.js real, con scripts, showcase, benchmarking y familias completas de algoritmos funcionando juntas.

## Para que sirve

- valida que el contrato package-first convive bien con scripts Node.js
- muestra el catalogo de algoritmos en recorridos operativos y no solo en pruebas unitarias
- deja un punto de apoyo para manifests, snapshots y tooling de runtime

## Que archivos mirar primero

- `src/main.ts`: arranque minimo del ejemplo
- `src/examples/`: catalogo real por familia de algoritmos
- `barrits.config.ts`: contrato centralizado de runtime y traits
- `barrits/traits/index.ts`: trait declarativo del runtime Node para inspeccion y contratos
- `scripts/showcase.mjs`: recorrido visible para inspeccionar resultados
- `scripts/build-runner.mjs`: ejemplo de lectura resumida del manifest desde Node
- `scripts/snapshot-consumer.mjs`: lectura de snapshots con el subpath Node

## APIs del paquete que este ejemplo pone a prueba

- busqueda: `binarySearch`, `linearSearch`, `lowerBound`, `upperBound`, `findSortedRange`
- colecciones: `chunk`, `groupBy`, `indexBy`, `uniqueBy`
- ordenamiento: `orderBy`, `quickSort`, `stableSortBy`, `insertSorted`
- seleccion y agregacion: `paginate`, `partitionBy`, `rankBy`, `topK`
- series temporales: `averageBy`, `bucketByInterval`, `detectTimeSeriesGaps`, `differenceSeries`, `movingAverageSeries`, `resampleSeries`
- ventanas: `movingAverage`, `rollingSum`, `slidingWindow`, `windowDelta`
- grafos: `breadthFirstSearch`, `dijkstraShortestPath`, `topologicalSort`
- runtime Node: `readNodeBuildManifestSummary`, `readNodeLanguageToolSnapshot`

## Como leer el recorrido

Si yo quiero entender la parte funcional, entro primero a `src/examples/` y sigo la familia que me interesa.

Si yo quiero ver integracion operativa, entro a `scripts/` porque ahi es donde el ejemplo cruza manifest, snapshots y runtime local.

Si yo quiero detalle semantico de cada funcion, no lo repito aca: voy a [../../../../../docs/users/ES/packages/ts_js/09_referencia-de-api.md](../../../../../docs/users/ES/packages/ts_js/09_referencia-de-api.md).

## Comandos utiles

- `npm run dev`: arranque local del consumidor
- `npm run build`: build del ejemplo
- `npm run showcase`: recorrido funcional visible
- `npm run benchmark:algorithms`: benchmark del catalogo de algoritmos
- `npm run demo:validation`: verificacion operativa adicional
