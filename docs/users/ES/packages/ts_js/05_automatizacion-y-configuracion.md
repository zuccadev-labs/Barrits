# 05 Automatizacion y configuracion de ts_js

Yo trato `barrits` como paquete con motor integrado de automatizacion. Eso significa que configuro defaults del proyecto y dejo que el SDK derive discovery, manifests y watch cuando realmente hace falta.

## Como configuro el proyecto

Si yo quiero defaults estables, creo uno de estos archivos en la raiz del consumidor:

- `barrits.config.ts`
- `barrits.config.mts`
- `barrits.config.js`
- `barrits.config.mjs`

Mi forma recomendada es esta:

```ts
import { defineBarritsConfig } from "barrits";

export default defineBarritsConfig({
  runtime: "react",
  watch: "auto",
  autoManifest: true,
  automationDirectory: ".cache/barrits",
});
```

## Como interpreto la prioridad

Yo sigo esta regla:

- la configuracion raiz define defaults del proyecto
- las opciones inline del package o del adapter siguen teniendo prioridad
- si yo no indico `automationDirectory`, el valor por defecto sigue siendo `.barrits`

## Como pienso el ciclo de vida

Yo no trato la automatizacion como daemon permanente del sistema.

Mi regla practica es esta:

1. yo no arranco watch al instalar el paquete
2. yo arranco watch cuando una sesion `dev` o `watch` lo necesita
3. yo cierro el proceso cuando termina la sesion padre

## Cuando me conviene mover artefactos

Si yo no quiero mezclar artefactos operativos con el dominio visible del proyecto, cambio `automationDirectory` y saco manifests, snapshots e imports generados fuera de `.barrits`.