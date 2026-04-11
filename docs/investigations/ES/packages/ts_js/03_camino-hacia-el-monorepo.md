# 03 Camino hacia el monorepo de ts_js

Yo no empece con un monorepo limpio. Empece con un paquete publicado desde la raiz y con ejemplos y tooling alrededor. Ese diseño me servia al principio, pero no me escalaba bien para multiples SDKs.

## Lo que detecte

Yo vi tres problemas estructurales:

1. la raiz mezclaba orquestacion y publicacion
2. `examples`, `src`, `tests` y `adapters` convivian como si todo perteneciera al mismo nivel arquitectonico
3. la ruta de crecimiento hacia otros lenguajes no estaba representada en la estructura

## La decision de migracion

Yo movi el paquete publicable a `packages/sdk/ts_js/` y despues reubique `examples/` dentro del propio SDK para que la experiencia visible perteneciera a la misma familia de package.

## Lo que gane con eso

Con esa migracion yo consegui:

- una raiz privada que coordina workspaces
- un paquete publicable claro en `packages/sdk/ts_js`
- ejemplos del SDK viviendo junto al SDK y no al lado de todos los lenguajes posibles
- una ruta natural para `packages/sdk/go/` y `packages/sdk/python/`