# 03 Dependencias y superficies de ts_js

Yo cuido este SDK con una regla simple: el core debe seguir portable y lo especifico de runtime no debe contaminar la superficie universal.

## Como separo dependencias

Yo acepto dependencias distintas segun la capa:

- en el core reusable yo prefiero piezas portables
- en `adapters/node/` yo acepto dependencias propias de Node
- en `adapters/deno/` yo acepto compatibilidad Deno y restricciones de publicacion JSR
- en ejemplos frontend yo acepto dependencias del framework y del bundler

## Como separo superficies publicas

Yo publico estas familias de entradas:

- `barrits`: superficie principal del paquete
- `@zuccadev-labs/barrits/node`: adapter para Node
- `@zuccadev-labs/barrits/deno`: adapter para Deno
- `@zuccadev-labs/barrits/vite`, `@zuccadev-labs/barrits/esbuild`, `@zuccadev-labs/barrits/rollup`, `@zuccadev-labs/barrits/webpack`: plugins de build
- `@zuccadev-labs/barrits/consume`: lectura segura de manifest y snapshot
- `barrits/node/cli` y `barrits/deno/cli`: entrypoints operativos

## Mis reglas internas de dependencia

Yo sigo estas restricciones para no degradar el diseño:

1. yo no hago que `shared/` dependa de dominios de negocio
2. yo no meto detalles de runtime dentro de la parte reusable por defecto
3. yo no uso `examples/` como dependencia del core
4. yo no expongo `barrits_lib` como arquitectura visible del consumidor

## Mi regla para ejemplos

Yo hago que cada ejemplo dependa del paquete local `barrits` desde el propio SDK `ts_js`. Asi valido el flujo real de workspace y evito una segunda verdad en la raiz del monorepo.