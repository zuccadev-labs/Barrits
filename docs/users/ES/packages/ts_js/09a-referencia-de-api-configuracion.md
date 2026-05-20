---
title: "09a — Referencia de API: Configuración Package-First"
description: "Corporate documentation for 09a — Referencia de API: Configuración Package-First."
---

# 09a — Referencia de API: Configuración Package-First

Este documento cubre la superficie de API orientada a configuración, rutas, nombres, traits y manifests de `@zuccadev-labs/barrits`. Para cada función se describe qué hace, para qué sirve, cómo se usa y dónde aparece en los recorridos reales del repositorio.

---

## Configuración package-first

### `defineBarritsPackage(options)`

Normaliza la descripción del consumidor en un contrato validado.

Resuelve: declaraciones repetidas de `runtime`, `watch` y `autoManifest` en Vite, esbuild, Rollup, Webpack y scripts.

```ts
import { defineBarritsPackage } from "@zuccadev-labs/barrits";

const pkg = defineBarritsPackage({
  runtime: "react",
  watch: "auto",
  autoManifest: true,
});
```

Aparece en: `examples/example-react/vite.config.ts`, `examples/example-vue/vite.config.ts`, `examples/example-solid/vite.config.ts`, `examples/example-svelte/vite.config.ts`, `examples/bundlers/*`, `examples/example-bun/src/main.ts`.

---

### `toBarritsAutomationOptions(options)`

Adapta la definición del paquete a las opciones operativas que esperan los plugins.

Resuelve: evita que el bundler conozca detalles de configuración que no necesita.

Aparece en: `examples/example-react/vite.config.ts` y cada configuración en `examples/bundlers/`.

---

### `defineBarritsConfig(options)`

Crea una configuración válida para `barrits.config.*`.

Resuelve: declara defaults persistentes del proyecto en vez de repetirlos en cada archivo.

```ts
// barrits.config.ts
import { defineBarritsConfig } from "@zuccadev-labs/barrits";

export default defineBarritsConfig({
  runtime: "react",
  watch: "auto",
  autoManifest: true,
  automationDirectory: ".barrits",
});
```

Aparece en: [05_automatizacion-y-configuracion.md](05_automatizacion-y-configuracion.md).

---

### `loadBarritsConfig()`

Carga la configuración del proyecto desde disco.

Resuelve: tooling, CLI o automatizaciones pueden resolver la configuración sin duplicar la lógica de lectura.

Aparece en: [06_comandos-y-runtimes.md](06_comandos-y-runtimes.md).

---

### `findBarritsConfigFile()`

Localiza el archivo de configuración del proyecto (`barrits.config.*`).

Resuelve: discovery controlado antes de cargar o resolver la configuración.

Aparece en: [05_automatizacion-y-configuracion.md](05_automatizacion-y-configuracion.md).

---

### `resolveBarritsConfig()`

Resuelve la configuración efectiva del proyecto, aplicando defaults.

Resuelve: devuelve un objeto listo para operar en vez del archivo fuente sin procesar.

---

### `createBarrits(options?)`

Inicia la aplicación construyendo de forma dinámica el contexto del SDK basado en el archivo de configuración.

Resuelve: permite renombrar la raíz del namespace dinámicamente inyectando los dominios predefinidos (`logic`, `traits`) sin romper el IDE ni el tipado.

```ts
import { createBarrits } from "@zuccadev-labs/barrits";

const app = await createBarrits();
// app.logic, app.traits, app.routes están disponibles bajo el namespace configurado
```

Aparece en: scripts principales de `examples/example-nodejs/`.

---

## Rutas, nombres y dominios

### `buildPath(...parts)`

Compone una ruta operativa a partir de partes seguras.

```ts
import { buildPath } from "@zuccadev-labs/barrits";

const artifactPath = buildPath(".barrits", "manifest.json");
```

Aparece en: `examples/example-deno/barrits/` y `examples/example-bun/barrits/index.ts`.

---

### `parsePath(path)`

Separa una ruta pública en sus partes.

Resuelve: inspección, validación o transformación de rutas package-first.

Aparece en: `examples/example-bun/barrits/index.ts`.

---

### `PACKAGE_NAME`

Expone el nombre canónico del paquete (`@zuccadev-labs/barrits`).

### `PACKAGE_ALIAS`

Expone el alias corto (`brt`).

### `barrits` y `brt`

Agrupan la API completa por dominios (`logic`, `routes`, `traits`).

```ts
import { barrits, brt } from "@zuccadev-labs/barrits";

barrits.logic.orderBy(items, [{ project: (i) => i.score, direction: "asc" }]);
barrits.logic.searchAlgorithms.binarySearch(sorted, target);
barrits.traits.composePipeline(initialValue, step1, step2);
brt.logic.orderBy(items, criteria); // alias exacto de barrits
```

---

## Consumo resumido de manifests y snapshots

### `parseBuildManifest(value)`

Parsea y valida un manifest de build crudo.

### `parseWatchSnapshot(value)`

Parsea y valida un snapshot de watch crudo.

### `createBuildManifestSummary(manifest)`

Genera un resumen del manifest de build.

```ts
import { createBuildManifestSummary } from "@zuccadev-labs/barrits";

const summary = createBuildManifestSummary(manifest);
console.log(summary.domains);
```

Aparece en: `examples/example-react/src/main.jsx`, `examples/example-vue/src/App.vue`, `examples/example-solid/src/main.tsx`, `examples/example-svelte/src/App.svelte`, `examples/bundlers/*-manifest-entry.mjs`.

### `createWatchSnapshotSummary(snapshot)`

Resume un snapshot de watch para observabilidad o paneles.

### `createLanguageToolSnapshot(input)`

Construye un snapshot orientado a tooling de lenguaje.

---

## Traits y composición declarativa

### `composePipeline(initialValue, ...steps)`

Compone una tubería de transformaciones encadenadas.

```ts
import { composePipeline } from "@zuccadev-labs/barrits";

const result = composePipeline(
  rawData,
  (d) => normalize(d),
  (d) => filter(d),
  (d) => rank(d),
);
```

Aparece en: [08_traits-y-composicion.md](08_traits-y-composicion.md).

### `composeTraitDescriptors(input)`

Compone múltiples descriptores de traits en una estructura final.

### `createTraitDescriptor(input)`

Crea un descriptor de trait desde metadata explícita.

```ts
import { createTraitDescriptor } from "@zuccadev-labs/barrits";

/**
 * @barrits-trait
 * @barrits-provides auth-session, database-adapter
 * @barrits-conflicts legacy-adapter
 */
export const authTrait = createTraitDescriptor({
  name: "AuthDomain",
  provides: ["auth-session", "database-adapter"],
  conflicts: ["legacy-adapter"],
});
```

Aparece en: [08_traits-y-composicion.md](08_traits-y-composicion.md).

### `createTraitDescriptorFromJsDoc(jsDoc, descriptor)`

Crea un descriptor a partir de un bloque JSDoc existente.

### `parseTraitDescriptorJsDoc(value)`

Parsea JSDoc de traits en metadata estructurada.

**Tags declarativos reconocidos:**

| Tag | Propósito |
| :--- | :--- |
| `@barrits-trait` | Marca un bloque JSDoc como contrato de trait |
| `@barrits-summary` | Descripción corta del trait |
| `@barrits-requires` | Traits de los que depende este descriptor |
| `@barrits-conflicts` | Traits que no pueden coexistir con este |
| `@barrits-state` | Estado que posee este trait |
| `@barrits-consumes` | Capacidades consumidas de otros traits |
| `@barrits-provides` | Capacidades expuestas a otros traits |
| `@barrits-tags` | Etiquetas de clasificación |
| `@barrits-runtime` | Restricción de runtime objetivo |
| `@barrits-version` | Restricción de versión |
| `@barrits-stability` | Nivel de estabilidad (stable, experimental, deprecated) |

### `mergeTraits(...traits)`

Fusiona traits en un único resultado consolidado.

Aparece en: [08_traits-y-composicion.md](08_traits-y-composicion.md).

---

## Tipos públicos

| Tipo | Descripción |
| :--- | :--- |
| `PathParts` | Estructura de descomposición de rutas |
| `RuntimeName`, `BarritsRuntimeKind`, `BarritsWatchMode` | Tipos de runtime y watch |
| `BarritsBuildManifest`, `BarritsWatchSnapshot`, `BarritsConsumedStateSummary` | Contratos de artefactos |
| `BarritsLanguageToolSnapshot` | Tipo de snapshot de tooling de lenguaje |
| `OrderCriterion`, `TimeSeriesPoint`, `PaginatedResult`, `GraphEdge` | Tipos de algoritmos |

## Referencia Exhaustiva: Esquema de Configuración

La configuración del proyecto a través de `barrits.config.ts` se rige por el tipo `BarritsRootConfig`. A continuación se detallan las propiedades disponibles con sus implicaciones técnicas:

| Propiedad | Tipo | Por Defecto | Recomendación Experta |
| :--- | :--- | :--- | :--- |
| `runtime` | `BarritsRuntimeKind` | `"node"` | Definir explícitamente (`"react"`, `"deno"`, etc.) para optimizar el crawler de tipos. |
| `watch` | `BarritsWatchMode` | `"auto"` | Usar `"auto"` en desarrollo y asegurar `"off"` en procesos de auditoría pesada. |
| `autoManifest` | `boolean` | `true` | Mantener en `true` para asegurar que el contrato de automatización esté siempre sincronizado con el código. |
| `automationDirectory` | `string` | `".barrits"` | Cambiar a una ruta específica (ej. `.cache/barrits`) en monorepos para evitar ruido en la raíz. |
| `namespace` | `string` | `undefined` | Obligatorio en proyectos corporativos para evitar colisiones en instanciaciones múltiples. |
| `projectRoot` | `string` | `process.cwd()` | No modificar a menos que el archivo de configuración resida fuera de la raíz del proyecto. |
| `debugCommands` | `boolean` | `false` | Activar únicamente durante la integración inicial para auditar el flujo de descubrimiento de AST. |
| `contracts` | `BarritsContractsConfig` | `{}` | Usar para definir visibilidad de API y traits que no pueden usar JSDoc decorativo. |
| `main` | `Function` | `undefined` | Implementar para centralizar la orquestación de arranque en aplicaciones standalone. |

### Configuración de Contratos (`contracts`)

#### `traits`
Permite declarar descriptores de Traits de forma manual. Es la alternativa experta cuando no se desea contaminar el código fuente con bloques JSDoc extensos o cuando el trait se genera dinámicamente.

#### `exports`
Controla la visibilidad en el grafo de descubrimiento. Marcar un archivo o export como `"internal"` es la práctica estándar para mantener una API limpia y segura, reduciendo la carga cognitiva para el integrador final.

---

[← Índice](00_indice.md) | [Algoritmos →](09b_referencia-de-api-algoritmos.md)
