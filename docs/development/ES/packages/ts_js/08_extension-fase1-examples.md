# Extensión Fase 1 — Ejemplos del SDK

## Propósito

Extender el patrón establecido en `example-nodejs` (traits + OpenAPI + IoC + CLI pipeline + tests) a los 10 ejemplos restantes del SDK, priorizando por runtime.

## Estrategia de ejecución

**Priorizar por runtime** — Completar un ejemplo por clase de runtime como template, luego replicar a los demás de la misma clase.

### Orden

| Orden | Runtime | Template | Réplicas |
|---|---|---|---|
| 1 | Deno | example-deno | example-deno-baas |
| 2 | Bun | example-bun | — |
| 3 | Framework (Vite) | example-react | example-solid, example-svelte, example-vue, example-tauri |
| 4 | Bundlers | bundlers/ | — |

### Patrón por ejemplo

Cada ejemplo debe incluir:

1. **Traits** — `barrits/traits/{runtime,domain,http}.ts` con `createTraitDescriptor`
2. **OpenAPI demo** — Script que genera esquema OpenAPI v3.1 desde manifest mock
3. **IoC demo** — Script que usa `BarritsIoCContainer` con registro/resolución
4. **Tests** — Suite con node:test, Deno.test, o bun:test según runtime
5. **README** — Documentación limpia sin "How it works" duplicado

## Diseño aprobado: example-deno (template Deno)

### Archivos a crear (7)

| Archivo | Contenido |
|---|---|
| `barrits/traits/runtime-trait.ts` | `denoRuntimeTrait` — proporciona `runtime:deno` |
| `barrits/traits/parse-service.ts` | `parseServiceTrait` — CRUD Parse-Server, proporciona `parse:crud` |
| `barrits/traits/http-handler.ts` | `httpHandlerTrait` — tag `http-endpoint` para OpenAPI |
| `barrits/traits/index.ts` | Barrel export de los 3 traits |
| `scripts/openapi-demo.ts` | Genera OpenAPI desde manifest, importa `generateOpenApiSchema` desde `src/` |
| `scripts/ioc-demo.ts` | Contenedor IoC, importa `BarritsIoCContainer` desde `src/` |
| `tests/example.test.ts` | Tests con `Deno.test`: traits, OpenAPI, IoC, showcase, build |

### Archivos a modificar (2)

| Archivo | Cambio |
|---|---|
| `deno.json` | Agregar tasks `test`, `demo:openapi`, `demo:ioc` |
| `README.md` | Eliminar "How it works", agregar secciones Traits/OpenAPI/IoC/Tests |

### Dependencias

- `BarritsIoCContainer` y `generateOpenApiSchema` se importan desde `../../src/barrits/ioc/index.ts` y `../../src/barrits/schema/openapi.ts` (patrón deno-baas)
- Tests usan `Deno.test` nativo (sin tsx wrapper)

---

*Documento de diseño — Fase 1, iteración 1. Creado: 2026-07-03.*
