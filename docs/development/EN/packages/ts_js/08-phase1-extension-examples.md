# Phase 1 Extension — SDK Examples

## Purpose

Extend the pattern established in `example-nodejs` (traits + OpenAPI + IoC + CLI pipeline + tests) to the remaining 10 SDK examples, prioritized by runtime.

## Execution Strategy

**Prioritize by runtime** — Complete one example per runtime class as a template, then replicate to the others in the same class.

### Order

| Order | Runtime | Template | Replicas |
|---|---|---|---|
| 1 | Deno | example-deno | example-deno-baas |
| 2 | Bun | example-bun | — |
| 3 | Framework (Vite) | example-react | example-solid, example-svelte, example-vue, example-tauri |
| 4 | Bundlers | bundlers/ | — |

### Pattern per example

Each example must include:

1. **Traits** — `barrits/traits/{runtime,domain,http}.ts` with `createTraitDescriptor`
2. **OpenAPI demo** — Script that generates OpenAPI v3.1 schema from a mock manifest
3. **IoC demo** — Script that uses `BarritsIoCContainer` with register/resolve
4. **Tests** — Suite using node:test, Deno.test, or bun:test depending on runtime
5. **README** — Clean documentation without duplicate "How it works" section

## Approved Design: example-deno (Deno Template)

### Files to create (7)

| File | Content |
|---|---|
| `barrits/traits/runtime-trait.ts` | `denoRuntimeTrait` — provides `runtime:deno` |
| `barrits/traits/parse-service.ts` | `parseServiceTrait` — CRUD Parse-Server, provides `parse:crud` |
| `barrits/traits/http-handler.ts` | `httpHandlerTrait` — tag `http-endpoint` for OpenAPI |
| `barrits/traits/index.ts` | Barrel export of the 3 traits |
| `scripts/openapi-demo.ts` | Generates OpenAPI from manifest, imports `generateOpenApiSchema` from `src/` |
| `scripts/ioc-demo.ts` | IoC container, imports `BarritsIoCContainer` from `src/` |
| `tests/example.test.ts` | Tests with `Deno.test`: traits, OpenAPI, IoC, showcase, build |

### Files to modify (2)

| File | Change |
|---|---|
| `deno.json` | Add `test`, `demo:openapi`, `demo:ioc` tasks |
| `README.md` | Remove "How it works", add Traits/OpenAPI/IoC/Tests sections |

### Dependencies

- `BarritsIoCContainer` and `generateOpenApiSchema` are imported from `../../src/barrits/ioc/index.ts` and `../../src/barrits/schema/openapi.ts` (deno-baas pattern)
- Tests use native `Deno.test` (no tsx wrapper)

---

*Design document — Phase 1, iteration 1. Created: 2026-07-03. EN translation.*
