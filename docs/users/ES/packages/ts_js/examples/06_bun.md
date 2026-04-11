# 06 Bun

Yo uso `packages/sdk/ts_js/examples/example-bun/` cuando quiero validar una integracion real de `@zuccadev-labs/barrits` en runtime Bun con scripts operativos y contrato package-first.

## Objetivo del ejemplo

Este ejemplo responde tres preguntas concretas:

- puedo ejecutar el SDK con `bun run` sin depender de Node.js como runtime principal
- puedo mantener la capa visible del consumidor en `barrits/`
- puedo mezclar contrato package-first, utilidades funcionales y rutas operativas en el mismo flujo

## APIs que cubre

- `defineBarritsPackage`: define el consumidor Bun
- `orderBy`: ordena registros por score
- `movingAverage`: calcula promedio movil de la serie
- `averageBy`: resume el promedio global
- `topK`: recupera picos de throughput
- `buildPath` y `parsePath`: construyen e inspeccionan rutas operativas

## Recorrido recomendado

1. correr `bun run dev` para validar la salida base
2. revisar `src/main.ts` para entender el orden del flujo
3. revisar `barrits/index.ts` para ver la capa visible del consumidor
4. correr `bun run inspect` para validar inspeccion del proyecto

## Comandos

- `bun run dev`
- `bun run showcase`
- `bun run build`
- `bun run inspect`

## Cuando me conviene este ejemplo

- cuando mi equipo usa Bun como runtime principal
- cuando quiero una demo corta y funcional sin frontend
- cuando necesito validar que la API principal del SDK sigue portable entre runtimes
