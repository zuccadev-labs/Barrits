# 02 Node.js, Deno y Bun

Yo separo estos tres ejemplos porque prueban runtimes reales sin depender de un frontend Vite.

## Node.js

Yo abro `packages/sdk/ts_js/examples/example-nodejs/` cuando quiero validar:

- `npm run dev`: flujo de desarrollo local del consumidor
- `npm run build`: construccion del consumidor usando el runner del ejemplo
- `npm run showcase`: catalogo de algoritmos y recorridos visibles
- `npm run benchmark:algorithms`: benchmark sobre los algoritmos del paquete
- `npm run demo:validation`: verificacion operativa adicional desde script TypeScript

Este ejemplo me sirve para revisar tres cosas a la vez:

- que la capa visible `barrits/` alcanza para un consumidor Node.js
- que el paquete soporta automatizacion local y snapshots
- que los algoritmos de ejemplo siguen siendo utilizables desde scripts reales

## Deno

Yo abro `packages/sdk/ts_js/examples/example-deno/` cuando quiero validar:

- `deno task dev`: ejecucion directa del consumidor
- `deno task build`: build del consumidor pasando por `adapters/deno/cli.ts`
- `deno task inspect`: inspeccion de la estructura del proyecto con el adapter Deno

Este ejemplo me confirma que el contrato package-first no depende de Node.js y que la superficie Deno-safe del paquete sigue siendo consumible desde el propio runtime.

## Bun

Yo abro `packages/sdk/ts_js/examples/example-bun/` cuando quiero validar:

- `bun run dev`: ejecucion directa de un consumidor Bun
- `bun run build`: build con CLI del paquete y runtime Bun
- `bun run inspect`: inspeccion del proyecto con el adapter Node ejecutado desde Bun

Este ejemplo me confirma que `@zuccadev-labs/barrits` tambien es consumible desde Bun usando el mismo contrato package-first y las mismas utilidades funcionales.

## Como elijo entre los tres

- yo uso Node.js si quiero showcase operativo, scripts y benchmark
- yo uso Deno si quiero validar CLI, inspeccion y build desde `deno task`
- yo uso Bun si quiero validar scripts `bun run` con una integracion package-first minimalista
- si necesito plugin de bundler, no entro aqui: voy directo a `bundlers/`
