# 01 Arquitectura de carpetas de ts_js

Yo organizo `barrits` como un SDK publicable dentro de un monorepo y no como un paquete raiz mezclado con ejemplos y tooling.

## Mi objetivo de estructura

Yo quiero que cada pieza tenga una responsabilidad visible:

- `packages/sdk/ts_js/src/`: aqui mantengo la superficie reusable del SDK
- `packages/sdk/ts_js/src/barrits/`: aqui concentro la capa publica, interna y operativa del paquete
- `packages/sdk/ts_js/src/barrits_lib/`: aqui dejo algoritmos y soporte interno que no forman parte de la arquitectura visible del consumidor
- `packages/sdk/ts_js/adapters/`: aqui resuelvo diferencias por runtime, sobre todo Node y Deno
- `packages/sdk/ts_js/examples/`: aqui guardo consumidores reales del SDK TS/JS, no ejemplos del monorepo en abstracto
- `packages/sdk/ts_js/tests/`: aqui valido contratos del paquete, plugins, adapters y flujos de automatizacion
- `packages/sdk/ts_js/benchmarks/`: aqui mido piezas que me interesan por costo o volumen

## Mi regla de monorepo

Yo trato la raiz del repositorio como coordinadora de workspaces, no como paquete publicable. Por eso:

- el `package.json` raiz es privado
- el paquete publicable real vive en `packages/sdk/ts_js/package.json`
- los ejemplos del SDK viven dentro de `packages/sdk/ts_js/examples/`
- la documentacion se ordena por area y lenguaje en `docs/<area>/ES/packages/ts_js/`

## Mi lectura de capas

Yo separo las capas de esta forma:

1. Yo expongo funciones, namespaces, plugins y contracts desde `src/`.
2. Yo encapsulo los detalles de runtime dentro de `adapters/`.
3. Yo mantengo `examples/` como consumidores que prueban experiencias visibles y no como parte del core.
4. Yo uso `tests/` para validar comportamiento y `benchmarks/` para medir decisiones concretas.

## Mi criterio de crecimiento

Cuando agrego una pieza nueva, yo decido su ubicacion con estas preguntas:

- si la pieza es API reusable, yo la llevo a `src/`
- si la pieza depende del runtime, yo la llevo a `adapters/`
- si la pieza demuestra una experiencia de consumo, yo la llevo a `examples/`
- si la pieza solo valida comportamiento, yo la llevo a `tests/`
- si la pieza solo mide costo o throughput, yo la llevo a `benchmarks/`

Con este criterio yo evito volver a mezclar codigo publicable, integraciones visibles y artefactos de soporte en la raiz del repo.