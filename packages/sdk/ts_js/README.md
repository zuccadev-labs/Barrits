# @zuccadev-labs/barrits

`@zuccadev-labs/barrits` es un SDK para TypeScript, JavaScript y Deno orientado a un flujo package-first. Yo describo el proyecto consumidor una vez y despues reutilizo el mismo contrato para automatizacion, manifests, snapshots, plugins de bundlers, consumo seguro de artifacts y un catalogo amplio de utilidades funcionales.

## Que resuelve

Yo uso este paquete cuando necesito una de estas tres capacidades:

1. Modelar un consumidor `barrits/` o `src/barrits/` sin pegar el proyecto a comandos manuales.
2. Generar y consumir manifests o snapshots de build para observabilidad, tooling o interfaces.
3. Reutilizar algoritmos y helpers funcionales ya empaquetados dentro del mismo SDK.

El modo recomendado es package-first: primero defino el contrato del consumidor y despues conecto runtime, bundler o reader segun el caso. La CLI existe, pero la trato como fallback operativo, diagnostico o automatizacion puntual.

## Instalacion

### npm

```bash
npm install @zuccadev-labs/barrits
```

### Deno o JSR

```ts
import { defineBarritsPackage } from "jsr:@zuccadev-labs/barrits";
```

## Inicio rapido

### 1. Definir el paquete consumidor

```ts
import { defineBarritsPackage } from "@zuccadev-labs/barrits";

export const barritsPackage = defineBarritsPackage({
  runtime: "react",
  watch: "auto",
  autoManifest: true,
});
```

Que hace: normaliza el contrato publico del consumidor.

Para que sirve: evita repetir opciones equivalentes en Vite, esbuild, Rollup, Webpack o scripts propios.

Como se usa: la salida de `defineBarritsPackage()` se pasa a `toBarritsAutomationOptions()` cuando un plugin necesita solo la porcion operativa.

Donde se usa en el repo: `examples/example-react/vite.config.ts`, `examples/example-vue/vite.config.ts`, `examples/example-solid/vite.config.ts`, `examples/example-svelte/vite.config.ts` y `examples/bundlers/*`.

### 2. Declarar defaults del proyecto

```ts
import { defineBarritsConfig } from "@zuccadev-labs/barrits";

export default defineBarritsConfig({
  runtime: "react",
  watch: "auto",
  autoManifest: true,
  automationDirectory: ".barrits",
});
```

Que hace: declara la configuracion persistente del proyecto.

Para que sirve: centraliza runtime, directorio de automatizacion, estrategias de watch y rutas derivadas.

Como se usa: se coloca en `barrits.config.ts` cuando quiero que el proyecto tenga defaults compartidos y discoverables.

Donde se usa: en la documentacion operativa de `docs/users/ES/packages/ts_js/05_automatizacion-y-configuracion.md`.

### 3. Integrar el bundler sin romper el flujo package-first

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { defineBarritsPackage, toBarritsAutomationOptions } from "@zuccadev-labs/barrits";
import { barritsVitePlugin } from "@zuccadev-labs/barrits/vite";

const barritsPackage = defineBarritsPackage({
  runtime: "react",
  watch: "auto",
});

export default defineConfig({
  plugins: [react(), barritsVitePlugin({ package: toBarritsAutomationOptions(barritsPackage) })],
});
```

Que hace: transforma la descripcion del paquete en opciones concretas para el plugin del bundler.

Para que sirve: el plugin sabe donde emitir o consumir artifacts sin que yo duplique rutas o modos de watch.

Como se usa: `defineBarritsPackage()` describe la intencion, `toBarritsAutomationOptions()` la adapta, y el plugin queda acoplado al mismo contrato.

Donde se usa: `examples/example-react/vite.config.ts` y `examples/bundlers/`.

### 4. Consumir un manifest o snapshot

```ts
import { createBuildManifestSummary } from "@zuccadev-labs/barrits";
import manifest from "virtual:barrits/manifest";

const summary = createBuildManifestSummary(manifest);
console.log(summary.domains);
```

Que hace: resume un manifest de build en una estructura orientada a UI, dashboards o tooling.

Para que sirve: evita que una app dependa del JSON completo cuando solo necesita dominios, capas, exports o estado resumido.

Como se usa: en frontend se combina con manifests virtuales; en desktop o backend se puede cambiar por los readers de `@zuccadev-labs/barrits/consume`.

Donde se usa: `examples/example-react/src/main.jsx`, `examples/example-vue/src/App.vue` y `examples/bundlers/*-manifest-entry.mjs`.

### 5. Reutilizar algoritmos del paquete

```ts
import { maxDrawdown, movingAverageSeries, orderBy } from "@zuccadev-labs/barrits";

const ordered = orderBy([{ score: 3 }, { score: 1 }], [{ project: (item) => item.score, direction: "asc" }]);
const trend = movingAverageSeries([
  { timestamp: 1, value: 10 },
  { timestamp: 2, value: 14 },
  { timestamp: 3, value: 8 },
], 2);
const risk = maxDrawdown([
  { timestamp: 1, value: 120 },
  { timestamp: 2, value: 140 },
  { timestamp: 3, value: 90 },
]);
```

Que hace: expone algoritmos listos para colecciones, busqueda, seleccion, series temporales, grafos y ventanas.

Para que sirve: evita introducir una segunda libreria solo para resolver calculos operativos que ya conviven con el SDK.

Como se usa: se importa directo desde la raiz cuando el consumidor quiere mezclar automatizacion y utilidades funcionales en el mismo paquete.

Donde se usa: `examples/example-nodejs/src/examples/`, `examples/example-react/src/main.jsx`, `examples/example-vue/src/App.vue`, `examples/example-solid/src/main.tsx`, `examples/example-svelte/src/App.svelte`, `examples/example-deno/main.ts` y `examples/example-bun/src/main.ts`.

## Entrypoints publicos

### `@zuccadev-labs/barrits`

Entrada principal. Expone la API package-first, traits, rutas, consumo resumido, constantes y algoritmos.

### `@zuccadev-labs/barrits/consume`

Entrada orientada a lectura y parseo de manifests o snapshots. Es la opcion correcta cuando ya tengo artifacts en disco o cuando el renderer no debe acceder directo al filesystem.

### `@zuccadev-labs/barrits/node`

Entrada con helpers Node.js, readers listos para filesystem y wrapper del CLI.

### `@zuccadev-labs/barrits/deno`

Entrada equivalente para Deno y JSR. Mantiene el mismo contrato funcional con APIs compatibles con el runtime.

### `@zuccadev-labs/barrits/vite`, `@zuccadev-labs/barrits/esbuild`, `@zuccadev-labs/barrits/rollup`, `@zuccadev-labs/barrits/webpack`

Entradas de integracion con bundlers. Cada una traduce el contrato package-first a la API del bundler correspondiente.

### `@zuccadev-labs/barrits/node/cli` y `@zuccadev-labs/barrits/deno/cli`

Entradas CLI para diagnostico, build puntual, inspeccion o ejecucion operativa fuera del flujo normal del plugin.

## Que APIs mirar primero

Si yo estoy empezando, este orden cubre casi todos los casos reales:

1. `defineBarritsPackage()` para describir el consumidor.
2. `defineBarritsConfig()` si necesito defaults persistentes.
3. `toBarritsAutomationOptions()` para conectarlo a bundlers.
4. `createBuildManifestSummary()` o `readBuildManifestSummary()` para observabilidad y UI.
5. `composePipeline()` o `createTraitDescriptor()` si el proyecto necesita composicion declarativa.
6. Algoritmos concretos como `orderBy()`, `movingAverageSeries()` o `binarySearch()` cuando el consumidor quiere utilidades funcionales listas para usar.

La referencia completa de metodos, subpaths y casos de uso vive en `docs/users/ES/packages/ts_js/09_referencia-de-api.md`.

## Ejemplos reales del repo

Uso cada ejemplo para responder una pregunta distinta:

| Carpeta | Que prueba | APIs principales |
| --- | --- | --- |
| `examples/example-nodejs/` | scripts, showcase y benchmarking en Node.js | `orderBy`, `binarySearch`, `movingAverageSeries`, `topK`, readers Node |
| `examples/example-deno/` | contrato package-first en Deno/JSR | `defineBarritsPackage`, `movingAverage`, `averageBy`, `topK` |
| `examples/example-bun/` | contrato package-first en Bun con scripts de runtime | `defineBarritsPackage`, `orderBy`, `movingAverage`, `averageBy`, `topK` |
| `examples/example-react/` | caso base frontend con Vite + React | `defineBarritsPackage`, `toBarritsAutomationOptions`, `barritsVitePlugin`, `createBuildManifestSummary` |
| `examples/example-vue/` | discovery bajo `src/barrits/` en Vue | `barritsVitePlugin`, `createBuildManifestSummary`, `orderBy`, `maxDrawdown` |
| `examples/example-solid/` | validacion del mismo contrato en Solid | `createBuildManifestSummary`, `sumar`, `barritsVitePlugin` |
| `examples/example-svelte/` | misma cobertura package-first en Svelte | `createBuildManifestSummary`, `movingAverageSeries`, `sumar` |
| `examples/example-tauri/` | consumo seguro de artifacts desde desktop | `readBuildManifestSummary`, `readLanguageToolSnapshot` |
| `examples/bundlers/` | integracion directa por bundler | `barritsVitePlugin`, `barritsEsbuildPlugin`, `barritsRollupPlugin`, `barritsWebpackPlugin` |

## Documentacion oficial

Si yo quiero usar el SDK:

- [../../../docs/users/ES/packages/ts_js/00_indice.md](../../../docs/users/ES/packages/ts_js/00_indice.md)
- [../../../docs/users/ES/packages/ts_js/09_referencia-de-api.md](../../../docs/users/ES/packages/ts_js/09_referencia-de-api.md)
- [../../../docs/users/ES/packages/ts_js/examples/00_indice.md](../../../docs/users/ES/packages/ts_js/examples/00_indice.md)
- [../../../docs/users/ES/packages/ts_js/05_automatizacion-y-configuracion.md](../../../docs/users/ES/packages/ts_js/05_automatizacion-y-configuracion.md)
- [../../../docs/users/ES/packages/ts_js/06_comandos-y-runtimes.md](../../../docs/users/ES/packages/ts_js/06_comandos-y-runtimes.md)
- [../../../docs/users/ES/packages/ts_js/07_manifests-bundlers-y-consumo.md](../../../docs/users/ES/packages/ts_js/07_manifests-bundlers-y-consumo.md)
- [../../../docs/users/ES/packages/ts_js/08_traits-y-composicion.md](../../../docs/users/ES/packages/ts_js/08_traits-y-composicion.md)

Si yo quiero mantener o extender el SDK:

- [../../../docs/development/ES/packages/ts_js/00_indice.md](../../../docs/development/ES/packages/ts_js/00_indice.md)
- [../../../docs/development/ES/packages/ts_js/05_descubrimiento-inspeccion-y-contratos.md](../../../docs/development/ES/packages/ts_js/05_descubrimiento-inspeccion-y-contratos.md)
- [../../../docs/development/ES/packages/ts_js/06_tooling-publicacion-y-plataformas.md](../../../docs/development/ES/packages/ts_js/06_tooling-publicacion-y-plataformas.md)

Si yo quiero entender la evolucion arquitectonica:

- [../../../docs/investigations/ES/packages/ts_js/00_indice.md](../../../docs/investigations/ES/packages/ts_js/00_indice.md)

## Posicion de este README

Este `README` es la portada publica que se publica junto al paquete. Por eso cubre que hace el SDK, para que sirve, como se integra y donde verlo funcionando. El detalle normativo, operativo e historico sigue viviendo en `docs/`, separado por uso, desarrollo e investigacion para no duplicar contenido.
