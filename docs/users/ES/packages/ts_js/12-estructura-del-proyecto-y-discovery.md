---
title: "Estructura del Proyecto y Discovery"
description: "Documentación corporativa de cómo Barrits descubre, lee y consume la estructura y el manifiesto del proyecto consumidor por runtime y caso de uso."
---

# Estructura del Proyecto y Discovery

Barrits es **package-first**: el SDK deriva el discovery, la generación de manifiestos y el comportamiento de watch a partir de una única declaración en el proyecto consumidor. Esta guía explica cómo el SDK **localiza y lee** tu estructura después de crearla — cubriendo el layout de carpetas, la resolución de `barrits.config.*`, las cuatro estrategias de discovery y cómo se lee el manifiesto por runtime y caso de uso.

## 1. Layout del proyecto

Un proyecto consumidor típicamente contiene tres clases de artefactos:

| Artefacto | Ubicación por defecto | Propósito |
| :--- | :--- | :--- |
| **Carpeta de dominio visible** | `barrits/` (o `.barrits/`) en la raíz de ejecución o un subdirectorio | Tus traits, contratos JSDoc y el código fuente que el motor descubre. |
| **Artefactos de automatización** | `<automationDirectory>/` (por defecto `.barrits/`) | `build-manifest.json` y `watch-snapshot.json` generados por la CLI o los plugins de bundler. |
| **Configuración de paquete** | `barrits.config.ts` (también `.mts` / `.js` / `.mjs`) | Declara runtime, política de watch, namespace, discovery roots y contratos. |

Puedes ubicar la carpeta de dominio visible en la raíz del proyecto, en un subdirectorio o incluso renombrarla — el motor de discovery la resuelve automáticamente (ver §3). Para separar la salida de automatización del dominio visible, configura un `automationDirectory` personalizado en `barrits.config.ts`.

## 2. Resolución de configuración

`resolveBarritsConfig(options)` fusiona dos fuentes, con las **`options` explícitas sobreescribiendo al archivo**:

1. `findBarritsConfigFile(projectRoot)` busca `barrits.config.ts` → `.mts` → `.js` → `.mjs` (en ese orden) en la raíz del proyecto. Soportado en Node y Deno.
2. El `default` export del módulo cargado (o los named `barritsConfig` / `config`) se parsea y valida.
3. El objeto fusionado se normaliza en `ResolvedBarritsConfig` (runtime, watch, namespace, ruta de manifiesto, discovery roots, estrategia de conflictos de traits, etc.).

El campo `namespace` aquí es lo que hace que el **nombre principal de la API sea personalizable** (ver [Referencia de API — Configuración](09a-referencia-de-api-configuracion.md)).

## 3. Estrategias de discovery (cómo el SDK encuentra la estructura)

`findBarritsDirectory(adapter, options)` recorre el filesystem usando un `RuntimeFileSystemAdapter` y devuelve un `BarritsDiscovery` describiendo dónde vive la carpeta de dominio y qué estrategia coincidió. Las cuatro estrategias, en orden de evaluación:

| Estrategia | Cuándo coincide | `projectRoot` resuelto a |
| :--- | :--- | :--- |
| `current-directory` | El basename del directorio inicial iguala el nombre objetivo (`barrits` por defecto). | Padre del directorio inicial. |
| `direct-child` | `<cursor>/barrits` existe como directorio. | El directorio que contiene la coincidencia. |
| `ancestor-child` | Un directorio ancestro tiene un hijo `barrits`. | Ese ancestro. |
| `recursive-child` | Un descendiente (BFS, hasta `maxDepth`, por defecto **4**) tiene un directorio `barrits`, excluyendo `node_modules`, `dist`, `build`, `.git`, `.next`, `.turbo`. | El directorio inicial. |

Parámetros opcionales: `targetName` (defecto `"barrits"`), `maxDepth` (defecto `4`), `startDirectory` e `ignoredDirectories`. El adapter de runtime se selecciona automáticamente con `createRuntimeFileSystemAdapter()` — Deno usa `DenoFileSystemAdapter`, mientras que Node y Bun usan `NodeFileSystemAdapter`.

## 4. Creación del manifiesto

Una vez descubierta la estructura, el motor construye un grafo de integración y lo serializa:

- `createBuildManifest(graph, filters)` → `stringifyBuildManifest(graph, filters)` produce el payload JSON.
- El comando `build` de la CLI (o un plugin de bundler) escribe `<automationDirectory>/build-manifest.json`.
- Los modos `watch` y `dev` escriben `<automationDirectory>/watch-snapshot.json`.

El manifiesto lleva dominios, exports, descriptores de traits, acciones de importación, colisiones y un checksum SHA-256 para integridad de la cadena de suministro.

## 5. Lectura del manifiesto por runtime (el contrato de consumo)

El tooling nunca re-implementa el discovery — consume el artefacto generado a través de un reader tipado y pequeño. Elige el reader según tu runtime:

| Runtime / caso de uso | Subpath | Readers |
| :--- | :--- | :--- |
| **Node.js / Bun** | `@zuccadev-labs/barrits/node` | `readNodeBuildManifest(path)`, `readNodeBuildManifestSummary(path)`, `readNodeWatchSnapshot(path)`, `readNodeLanguageToolSnapshot(path)` |
| **Deno / JSR** | `@zuccadev-labs/barrits/deno` | `readDenoBuildManifest(path)`, `readDenoBuildManifestSummary(path)`, `readDenoWatchSnapshot(path)`, `readDenoLanguageToolSnapshot(path)` |
| **Frontend (Vite/React/Vue/Solid/Svelte)** | `virtual:barrits/manifest` inyectado por el plugin | Consume el objeto inyectado con `createBuildManifestSummary(manifest)` dentro de la app. |
| **Tauri / backend de escritorio** | `@zuccadev-labs/barrits/consume` + `readTextFile` inyectado | `readBuildManifest(path, readTextFile)` delegado al backend Rust (restricciones explícitas de rutas permitidas). |
| **Runtime-agnóstico / serverless** | `@zuccadev-labs/barrits/consume` | `readBuildManifest(path, readTextFile)`, `readWatchSnapshot(path, readTextFile)`, `readLanguageToolSnapshot(path, readTextFile)`, `parseBuildManifest(source)`, `parseWatchSnapshot(source)` |

Cuando el acceso al filesystem debe delegarse (backend Tauri, reader serverless), pasa una función `readTextFile(path)` inyectable; el subpath `consume` valida estructuralmente el payload retornado.

## 6. Estructura recomendada por caso

| Caso | Layout | Leer vía |
| :--- | :--- | :--- |
| Librería backend Node.js | `barrits/` raíz + `barrits.config.ts` (`runtime: "node"`) | `@zuccadev-labs/barrits/node` o `/consume` |
| Servicio Deno / JSR | `barrits/` raíz + `barrits.config.ts` (`runtime: "deno"`) | `@zuccadev-labs/barrits/deno` |
| Runtime Bun | Igual que Node; `@zuccadev-labs/barrits/bun` reusa el adapter Node | `@zuccadev-labs/barrits/node` |
| App frontend (Vite) | `src/barrits/` + `barrits.config.ts` (`runtime: "react"`/`"browser"`) | `virtual:barrits/manifest` + `createBuildManifestSummary` |
| Escritorio Tauri | `barrits/` + `barrits.config.ts` | `/consume` con reader inyectado desde el backend |
| Paquete en monorepo | `barrits/` por paquete | El discovery camina ancestros (`ancestor-child`) |

## 7. Ejemplo práctico

Considera un servicio backend Node.js con el siguiente layout:

```text
mi-servicio/
├── barrits.config.ts          # runtime: "node", namespace: "corpAgent"
├── barrits/
│   ├── logic/
│   │   ├── order-by.ts        # export function orderBy(...)
│   │   └── search-algorithms/
│   │       ├── binary-search.ts
│   │       └── index.ts
│   ├── routes/
│   │   └── health.ts
│   └── traits/
│       ├── user-service.ts
│       └── http-handler.ts
├── src/
│   └── main.ts                # import { createBarrits } from "@zuccadev-labs/barrits"
└── package.json
```

Traza del ciclo de vida:

1. **Config** — `resolveBarritsConfig()` encuentra `barrits.config.ts` en la raíz del proyecto (solo Node/Deno) y lo normaliza. El campo `namespace: "corpAgent"` hace que el nombre raíz de la API sea `corpAgent`, de modo que `createBarrits<"corpAgent">()` devuelve un `{ corpAgent, barrits, brt, config }` tipado.
2. **Discovery** — partiendo del directorio de `src/main.ts`, `findBarritsDirectory()` evalúa primero `direct-child`: `<raiz>/barrits` existe, así que `projectRoot` se resuelve a `<raiz>` y la carpeta de dominio es `<raiz>/barrits`.
3. **Manifiesto** — `barrits build` (CLI) recorre la carpeta de dominio, construye el grafo de integración y escribe `.barrits/build-manifest.json` con checksum SHA-256.
4. **Consumo** — una herramienta Node lo lee vía `@zuccadev-labs/barrits/node`: `readNodeBuildManifest(".barrits/build-manifest.json")`. No se re-ejecuta el discovery; la herramienta consume el artefacto generado.

**Variante — paquete en monorepo.** Si el consumidor vive en `packages/checkout/` con su propio `barrits/` y `barrits.config.ts`, el discovery desde `packages/checkout/src/index.ts` camina ancestros y coincide con `ancestor-child`, resolviendo `projectRoot` a `packages/checkout/`.

**Variante — carpeta de dominio renombrada.** Define `targetName: "domain"` en `barrits.config.ts`; el discovery entonces busca `domain/` en lugar de `barrits/` usando las mismas cuatro estrategias.

## Relacionado

- [Automatización y Configuración](05-automatizacion-y-configuracion.md)
- [Manifests, Bundlers y Consumo](07-manifests-bundlers-y-consumo.md)
- [Referencia de API — Consume y Adapters](09c-referencia-de-api-consume-y-adapters.md)
- [Referencia de API — Configuración](09a-referencia-de-api-configuracion.md)

---

[← Ejemplos y Recorridos](03-ejemplos-y-recorridos.md) | [Referencia de API →](09-referencia-de-api.md)
