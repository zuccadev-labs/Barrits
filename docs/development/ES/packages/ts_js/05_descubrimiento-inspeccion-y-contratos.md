# 05 Descubrimiento, inspeccion y contratos de ts_js

Discovery, inspection, manifest y snapshot se mantienen como un solo sistema coherente. Cada adapter o bundler debe consumir el mismo contrato operativo, sin reinterpretar la estructura del consumidor.

## Como pienso discovery

La localizacion de `barrits/` sigue un orden estable:

1. si la ruta actual ya es `barrits/`, se usa
2. si el directorio actual contiene `barrits/`, se usa
3. si un ancestro contiene `barrits/`, se usa
4. si no existe coincidencia, se busca en descendencia con profundidad limitada

## Como pienso inspection

`info` e `inspectBarritsIntegrations()` releen el estado real del consumidor y proyectan:

- dominios
- barrels
- exports
- kinds de archivo
- actions de import
- traits declarativos y `traitDiagnostics`

Tambien se mantienen filtros repetibles para inspeccion puntual, por ejemplo por dominio, export, kind de archivo o visibilidad. Esto permite proyectar el mismo grafo sobre un subconjunto sin cambiar el motor base.

## Como trato traits y diagnosticos

Cuando la inspeccion detecta metadata declarativa de traits, esa informacion se proyecta tanto a salida humana como a contratos JSON.

Eso incluye:

- descriptors detectados
- drift entre metadata JSDoc y contrato runtime
- categorias como `drift`, `impossible` y `non-verifiable`
- agregados que luego puede consumir `@zuccadev-labs/barrits/consume`

## Contratos JSDoc para traits y API publica

Las funciones publicas y contratos de traits se documentan con JSDoc para mantener semantica estable y verificable.

Reglas operativas:

- funciones exportadas deben declarar proposito, parametros y retorno
- funciones con errores de contrato deben declarar `@throws`
- los descriptors declarativos de traits usan tags `@barrits-*`
- la metadata JSDoc se normaliza con orden estable para evitar drift por formato

Tags declarativos usados hoy:

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

## Como pienso los contratos operativos

Se mantienen dos contratos principales:

- `build-manifest.json` para pipelines de compilacion
- `watch-snapshot.json` para tooling o procesos vivos de desarrollo

La idea es siempre la misma:

1. el motor integrado mantiene el grafo real
2. el manifest o snapshot es una proyeccion serializada de ese grafo
3. el tooling externo consume la proyeccion y no la logica interna del watcher

Cuando un proceso hijo participa del flujo, se exponen rutas operativas mediante variables como `BARRITS_BUILD_MANIFEST` y `BARRITS_WATCH_SNAPSHOT` para no obligar al host a redescubrir artefactos.