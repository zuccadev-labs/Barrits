# 02 Primeros pasos de ts_js

Yo empiezo con `barrits` como paquete y no como comando. Mi primer paso es describir el runtime del proyecto consumidor y dejar que el SDK derive la automatizacion a partir de ahi.

## Configuracion minima

Yo puedo empezar con algo asi:

```ts
import { defineBarritsPackage } from "barrits";

export const barritsPackage = defineBarritsPackage({
  runtime: "react",
  watch: "auto",
});
```

## Configuracion raiz opcional

Si yo quiero defaults del proyecto, creo `barrits.config.ts` en la raiz:

```ts
import { defineBarritsConfig } from "barrits";

export default defineBarritsConfig({
  runtime: "react",
  watch: "auto",
  autoManifest: true,
  automationDirectory: ".barrits",
});
```

## Como pienso el consumo

Yo puedo consumir el paquete de tres maneras:

- funciones planas desde `barrits`
- namespaces desde `barrits` o `brt`
- subpaths especializados para tooling o bundlers

Mi recomendacion practica es empezar por la superficie mas pequena que resuelva mi caso y crecer desde ahi.