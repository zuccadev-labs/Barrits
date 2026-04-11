# 01 Instalacion de ts_js

Yo instalo `barrits` como paquete normal de JavaScript o TypeScript. Mi recomendacion es partir de un proyecto que ya tenga Node.js 18 o superior cuando voy a consumir plugins, adapters o ejemplos frontend.

## Instalacion base

Si yo estoy en npm, instalo asi:

```bash
npm install barrits
```

Si yo trabajo dentro de este monorepo, el paquete real vive en `packages/sdk/ts_js` y los ejemplos ya lo consumen por workspace local.

## Lo que yo recibo al instalar

Cuando yo instalo el paquete, recibo:

- la superficie principal `barrits`
- subpaths para Node, Deno y plugins de bundler
- helpers de consumo en `barrits/consume`
- una CLI util como fallback operativo

## Cuando yo tambien necesito Deno

Si yo voy a validar publicacion JSR o consumo Deno, tambien necesito Deno instalado en mi maquina. Yo no lo trato como requisito universal para todo consumidor, pero si para esa superficie concreta.