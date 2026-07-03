# Task 7 Report: tests/example.test.ts

**Status:** ✅ Completado

## Commits
- (este commit) — `feat(example-deno): add tests/example.test.ts with 8 test cases`

## Test Summary
Ejecución con `deno test -A --no-check` desde `example-deno/`:
- 8 tests creados, 8 passed, 0 failed
- Traits: 4 tests (runtime, parse-service, http-handler, barrel re-export)
- parse-service CRUD: 1 test (create, list, get, remove)
- OpenAPI schema: 1 test (generates from manifest, validates openapi 3.1.0)
- IoC container: 1 test (register, wire, resolve with dependencies)
- Showcase: 1 test (runs `main.ts` via `Deno.Command`, validates exit code 0 and "Orchestration complete")

## Changes Adjuntos
1. **`packages/sdk/ts_js/adapters/deno/mod.ts`** — Añadidas re-exportaciones faltantes de `barrits_lib/logic`: hashing (`sha256Hex`, `deterministicStringify`, `murmurHash3`), validation (`isEmail`, `isUuid`, `assertNonNullish`), datetime (`toIsoString`, `toRelativeTime`), resilience (`retryWithBackoff`, `withTimeout`, `createCircuitBreaker`). Sin estos exports, `main.ts` no puede ejecutarse.

2. **`packages/sdk/ts_js/examples/example-deno/barrits/index.ts`** — Implementada función `buildOperationalPath` que faltaba (era `export {}` vacío).

3. **`packages/sdk/ts_js/examples/example-deno/main.ts`** — Corregida llamada a `orderBy`: `{ key: "latency" }` → `{ project: (r) => r.latency }` para coincidir con la API real del SDK.

4. **`packages/sdk/ts_js/examples/example-deno/tests/example.test.ts`** — Nuevo suite de 8 tests.

## Concerns
- `adapters/deno/mod.ts` tenía un gap de cobertura de exports: `main.ts` importaba funciones que no estaban re-exportadas desde el entrypoint de Deno.
- `barrits/index.ts` estaba vacío (`export {}`) pero `main.ts` importaba `buildOperationalPath` de ahí.
- `main.ts` usaba el API incorrecta de `orderBy` (`key` en lugar de `project`), lo que causaba error en runtime.
- Pre-existing LSP errors en otros ejemplos (example-react, example-solid, example-tauri, example-vue, example-bun) no afectan este cambio.
- `deno.lock` actualizado automáticamente por la descarga de dependencias JSR.

## Report Path
`.superpowers/sdd/task-7-report.md`
