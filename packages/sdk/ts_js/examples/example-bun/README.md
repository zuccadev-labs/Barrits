# example-bun

Yo uso este ejemplo cuando quiero validar que `@zuccadev-labs/barrits` corre bien en Bun sin renunciar al contrato package-first ni a las utilidades funcionales del SDK.

## Para que sirve

- demuestra consumo real del paquete con `bun run`
- valida funciones operativas y de analitica en un runtime Bun
- mantiene una capa visible del consumidor en `barrits/`

## Que archivos mirar primero

- `src/main.ts`: recorrido principal del ejemplo
- `barrits/index.ts`: helper del consumidor usando `buildPath` y `parsePath`
- `package.json`: scripts `dev`, `build`, `inspect` y `showcase`

## APIs que este ejemplo usa

- `defineBarritsPackage`: define el contrato del consumidor
- `orderBy`: ordena registros de dominio por score
- `movingAverage`: calcula promedio movil de throughput
- `averageBy`: calcula el promedio general de la serie
- `topK`: selecciona los valores de mayor throughput
- `buildPath` y `parsePath`: construyen e inspeccionan rutas operativas

## Como leerlo

Primero ejecuto `bun run dev` para validar el recorrido base.

Despues reviso el JSON de salida para comprobar contrato de paquete, analitica y parseo de rutas.

Si necesito detalle completo de cada metodo, uso [../../../../../docs/users/ES/packages/ts_js/09_referencia-de-api.md](../../../../../docs/users/ES/packages/ts_js/09_referencia-de-api.md).

## Comandos utiles

- `bun run dev`: ejecuta el recorrido base
- `bun run showcase`: alias de demostracion del ejemplo
- `bun run build`: ejecuta build via CLI de barrits sobre runtime Bun
- `bun run inspect`: inspecciona el proyecto con la CLI
