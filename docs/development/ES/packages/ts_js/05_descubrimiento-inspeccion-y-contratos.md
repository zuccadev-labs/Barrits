# 05 Descubrimiento, inspeccion y contratos de ts_js

Yo mantengo discovery, inspection, manifest y snapshot como un solo sistema coherente. No quiero que cada adapter o bundler reinterprete la estructura del consumidor por su cuenta.

## Como pienso discovery

Yo localizo `barrits/` con un orden estable:

1. si la ruta actual ya es `barrits/`, yo la uso
2. si el directorio actual contiene `barrits/`, yo lo uso
3. si un ancestro contiene `barrits/`, yo lo uso
4. si no, yo busco en descendencia con profundidad limitada

## Como pienso inspection

`info` e `inspectBarritsIntegrations()` releen el estado real del consumidor y proyectan:

- dominios
- barrels
- exports
- kinds de archivo
- actions de import
- traits declarativos y `traitDiagnostics`

Yo tambien mantengo filtros repetibles para inspeccion puntual, por ejemplo por dominio, export, kind de archivo o visibilidad. Con eso puedo proyectar el mismo grafo sobre un subconjunto sin cambiar el motor base.

## Como trato traits y diagnosticos

Cuando la inspeccion detecta metadata declarativa de traits, yo proyecto esa informacion tanto a salida humana como a contratos JSON.

Eso incluye:

- descriptors detectados
- drift entre metadata JSDoc y contrato runtime
- categorias como `drift`, `impossible` y `non-verifiable`
- agregados que luego puede consumir `@zuccadev-labs/barrits/consume`

## Como pienso los contratos operativos

Yo mantengo dos contratos principales:

- `build-manifest.json` para pipelines de compilacion
- `watch-snapshot.json` para tooling o procesos vivos de desarrollo

La idea es siempre la misma:

1. el motor integrado mantiene el grafo real
2. el manifest o snapshot es una proyeccion serializada de ese grafo
3. el tooling externo consume la proyeccion y no la logica interna del watcher

Cuando un proceso hijo participa del flujo, yo expongo rutas operativas mediante variables como `BARRITS_BUILD_MANIFEST` y `BARRITS_WATCH_SNAPSHOT` para no obligar al host a redescubrir artefactos.