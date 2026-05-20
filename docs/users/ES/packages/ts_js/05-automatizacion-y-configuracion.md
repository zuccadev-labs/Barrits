---
title: "05 Automatización y configuración de ts_js"
description: "Corporate documentation for 05 Automatización y configuración de ts_js."
---

# 05 Automatización y configuración de ts_js

Barrits actúa como un paquete con motor integrado de automatización. La configuración del proyecto se declara una sola vez y el SDK deriva el discovery, la generación de manifests y el comportamiento de watch a partir de esa declaración.

## Configurar el proyecto

Para establecer defaults estables del proyecto, se crea uno de los siguientes archivos en la raíz del consumidor:

- `barrits.config.ts`
- `barrits.config.mts`
- `barrits.config.js`
- `barrits.config.mjs`

```ts
import { defineBarritsConfig } from "@zuccadev-labs/barrits";

export default defineBarritsConfig({
  runtime: "react",
  watch: "auto",
  autoManifest: true,
  automationDirectory: ".cache/barrits",
  namespace: "miApp", // opcional: cambia el namespace dinámico inyectado en createBarrits()
});
```

Cuando se provee un `namespace`, el diseño de auto-descubrimiento en Vite, Node y otras integraciones lo respeta manteniendo limpio el tipado mediante la función asíncrona `createBarrits()`.

## Contratos low-config desde `barrits.config.*`

Para reducir la dependencia de encabezados JSDoc, los contratos manuales pueden declararse directamente en la configuración:

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

**Regla de decisión recomendada:**

- Si el proyecto ya usa JSDoc `@barrits-*`, se mantiene JSDoc como fuente de verdad.
- Si se prefiere menor costo de configuración, se centralizan contratos en `barrits.config.*`.
- Barrits mezcla contratos detectados con contratos manuales y prioriza la entrada manual cuando coincide `sourceFile + bindingName`.

## Reducir re-exports

Barrits detecta exports desde el árbol de archivos y genera named-imports automáticamente cuando el nombre es único en el grafo. Esto significa que los barrels en `barrits/index.ts` pueden simplificarse o eliminarse.

- Los métodos que forman parte de la API normal no necesitan re-exportarse en cada `index.ts`.
- Los métodos que deben quedar fuera de la API visible se marcan en `contracts.exports` con `visibility: "internal"`.

## Prioridad de configuración

- El archivo de configuración raíz define los defaults del proyecto.
- Las opciones inline del paquete o del adapter siempre tienen prioridad.
- Si `automationDirectory` no se especifica, el valor por defecto es `.barrits`.

## Ciclo de vida de la automatización

La automatización no es un daemon permanente del sistema.

Regla práctica estándar:

1. Watch no arranca al instalar el paquete.
2. Watch arranca cuando una sesión `dev` o `watch` lo requiere.
3. El proceso se cierra cuando termina la sesión padre.

## Mover artefactos

Para separar artefactos de automatización del dominio visible del proyecto, se configura un `automationDirectory` personalizado. Esto mueve manifests, snapshots e imports generados fuera de `.barrits` hacia la ruta configurada.

## Método main personalizado

Se puede declarar un método main personalizado en la configuración para controlar el comportamiento de arranque:

```ts
import { defineBarritsConfig } from "@zuccadev-labs/barrits";

export default defineBarritsConfig({
  runtime: "node",
  main: async () => {
    console.log("Aplicación iniciando con configuración personalizada");
  },
});
```

## Instanciación segura con patrón Factory

Cuando se configura el campo `namespace`, `createBarrits()` devuelve un objeto tipado y aislado sin contaminar el scope global:

```ts
import { createBarrits } from "@zuccadev-labs/barrits";

const boot = async () => {
  const system = await createBarrits();
  // El autocompletado en el IDE está 100% garantizado bajo el namespace configurado
  system.miApp.logic.orderBy(items, criteria);
};
```

## Patrones de Integración Experta (Nivel Corporativo)

Para implementaciones de alta demanda en ecosistemas de gran escala, se recomienda observar los siguientes patrones de arquitectura:

### 1. Aislamiento de Entornos (Monorepos)

En estructuras de monorepo (NX, Turborepo), la configuración de Barrits debe residir preferiblemente en el paquete raíz del SDK o en cada aplicación consumidora de forma independiente. Para evitar la contaminación de artefactos entre aplicaciones, se recomienda el uso de un `automationDirectory` segregado por proyecto:

```ts
// apps/api-gateway/barrits.config.ts
export default defineBarritsConfig({
  automationDirectory: "../../.cache/barrits/api-gateway",
  namespace: "gateway",
});
```

### 2. Inyección de Dependencias y Estado

Un ingeniero experto evita la dependencia directa del singleton `barrits` en favor de la instanciación controlada. El uso de `createBarrits()` permite inyectar el sistema en contenedores de IoC (Inversion of Control) garantizando la testabilidad:

```ts
import { createBarrits } from "@zuccadev-labs/barrits";

export class ApplicationService {
  constructor(private readonly barrits: Awaited<ReturnType<typeof createBarrits>>) {}

  public async execute() {
    return this.barrits.miApp.logic.executeWorkflow();
  }
}
```

### 3. Seguridad y Restricciones de Visibilidad

En entornos corporativos, la protección de la superficie de API es crítica. Se prescribe el uso de `contracts.exports` para ocultar utilidades de infraestructura que no deben ser consumidas por la lógica de negocio:

```ts
export default defineBarritsConfig({
  contracts: {
    exports: [
      {
        sourceFile: "internal/db-connection.ts",
        visibility: "internal", // Impide la exportación automática en el discovery manifest
      },
    ],
  },
});
```

### 4. Gobernanza de Watch en CI/CD

Se advierte que la propiedad `watch: "auto"` debe ser evaluada cuidadosamente en entornos de integración continua. Aunque Barrits detecta el entorno, la recomendación experta consiste en forzar `watch: "off"` en los pipelines de build para garantizar resultados deterministas:

```ts
const isCI = !!process.env.CI;
export default defineBarritsPackage({
  runtime: "node",
  watch: isCI ? "off" : "auto",
});
```

---

[← Buenas Prácticas](04_buenas_practicas.md) | [Comandos y Runtimes →](06_comandos_y_runtimes.md)
