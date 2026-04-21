# 02 Primeros Pasos Operativos de ts_js

La integración de `barrits` se realiza conceptualmente como un motor de infraestructura en lugar de un simple comando. El primer paso operativo consiste en declarar de forma determinista el *runtime* del proyecto consumidor, permitiendo que el SDK derive la automatización subsecuente mediante introspección estática.

## Configuración Mínima

Un despliegue de infraestructura base requiere la siguiente declaración:

```ts
import { defineBarritsPackage } from "@zuccadev-labs/barrits";

export const barritsPackage = defineBarritsPackage({
  runtime: "react",
  watch: "auto",
});
```

## Configuración Global (Recomendada)

Para establecer estándares y comportamiento por defecto a nivel repositorio, se debe aprovisionar el archivo `barrits.config.ts` en la raíz del espacio de trabajo:

```ts
import { defineBarritsConfig } from "@zuccadev-labs/barrits";

export default defineBarritsConfig({
  runtime: "react",
  watch: "auto",
  autoManifest: true,
  namespace: "midominio_corp", // <- Inicializa el Factory con un alias corporativo
});
```

## Estandar de Consumo por Factory

Para consumir el paquete sin contaminar el alcance global y garantizando el autocompletado en los IDEs, la corporación dicta el uso del patrón Factory asíncrono para abstraer el namespace construido en el `barrits.config.ts`:

```ts
import { createBarrits } from "@zuccadev-labs/barrits";

const bootSystem = async () => {
    // Retorna una instancia fuertemente tipada con tu Namespace
    const root = await createBarrits();
    root.midominio_corp.logic.orderBy(...);
}
```

Este modelo asegura encapsulación absoluta bajo arquitecturas Domain-Driven Design (DDD).