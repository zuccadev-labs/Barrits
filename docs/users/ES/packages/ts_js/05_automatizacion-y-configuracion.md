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
import { defineBarritsConfig } from "@zuccadev-labs/barrits";

export default defineBarritsConfig({
  runtime: "react",
  watch: "auto",
  autoManifest: true,
  automationDirectory: ".cache/barrits",
});
```

## Contratos low-config desde `barrits.config.*`

Si no quiero repetir encabezados JSDoc por cada trait, puedo declarar contratos manuales en configuracion:

```ts
import { defineBarritsConfig } from "@zuccadev-labs/barrits";

export default defineBarritsConfig({
  contracts: {
    traits: [
      {
        name: "runtime-node",
        sourceFile: "traits/runtime.ts",
        bindingName: "nodeRuntimeTrait",
        provides: ["runtime:node"],
      },
    ],
    exports: [
      {
        sourceFile: "logic/path.ts",
        exportName: "buildSecretPath",
        visibility: "internal",
      },
    ],
  },
});
```

Regla UX recomendada:

- si el proyecto ya usa JSDoc `@barrits-*`, mantengo JSDoc como fuente de verdad
- si necesito menor costo de configuracion, centralizo contratos en `barrits.config.*`
- Barrits mezcla contratos detectados + contratos manuales y prioriza la entrada manual cuando coincide `sourceFile + bindingName`
- para exports: yo dejo todo publico por defecto y solo marco privados con `contracts.exports`

## Menos re-exports, misma deteccion

Yo puedo reducir barrels/re-exports en `barrits/` porque Barrits detecta exports desde el arbol y genera named-imports automaticamente cuando el nombre es unico.

Regla practica:

- si un metodo es parte de la API normal, no necesito re-exportarlo en cada `index.ts`
- si un metodo debe quedar fuera de la API visible, lo marco en `contracts.exports` con `visibility: "internal"`

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

## Configurar un método main personalizado

Puedo definir un método main personalizado en mi configuración para controlar el comportamiento de arranque de mi aplicación:

```ts
import { defineBarritsConfig } from "@zuccadev-labs/barrits";

export default defineBarritsConfig({
  runtime: "node",
  main: async () => {
    // Mi lógica de arranque personalizada aquí
    console.log("Aplicación iniciando con configuración personalizada");
    // Retornar una promesa o valor void según necesite
  }
});
```

Este método main será resuelto y puede ser utilizado por el SDK o por herramientas que integren con barrits para ejecutar lógica de arranque personalizada en lugar de depender únicamente de los scripts de los ejemplos.
