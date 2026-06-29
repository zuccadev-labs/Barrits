# Auditoría Forense Integral — Barrits SDK v0.1.8

> **Autor**: Ingeniero Experto Corporativo
> **Fecha**: 2026-06-29
> **Auditoría**: Seguridad, Gaps, Buenas Prácticas, Optimización, UX/DX, Skills

---

## Índice

1. [Executive Summary](#1-executive-summary)
2. [Hallazgos de Seguridad](#2-hallazgos-de-seguridad)
3. [Gap Analysis](#3-gap-analysis)
4. [Buenas Prácticas y Arquitectura](#4-buenas-prácticas-y-arquitectura)
5. [Optimización](#5-optimización)
6. [UX/DX — Desarrolladores y Agentes](#6-uxdx--desarrolladores-y-agentes)
7. [Skills — Documentación Modular por Caso de Uso](#7-skills--documentación-modular-por-caso-de-uso)
8. [Plan de Acción Priorizado](#8-plan-de-acción-priorizado)

---

## 1. Executive Summary

Se auditaron **~12,000 líneas de código fuente** en 80+ archivos, **65 tests**, **4 pipelines CI/CD**, **5 documentos de seguridad**, **10 skill files**, **4 ADRs**, y **40+ documentos de documentación** bilingüe EN/ES.

### Scorecard General

| Dimensión | Calificación | Estado |
|-----------|:-----------:|:------:|
| Seguridad | **6/10** | 1 crítico, 1 alto, 5 medios |
| Cobertura de Tests | **5/10** | ~40-50% módulos cubiertos |
| Documentación | **8/10** | Excelente pero con duplicados |
| Calidad de Código | **7/10** | SRP violations, duplicación nodo/deno |
| Optimización | **5/10** | Sin code splitting, sin lazy loading |
| UX/DX | **6/10** | Sin CLI autocomplete, sin onboarding |
| CI/CD | **7/10** | Robusto pero lento, sin caché |

### Hallazgos Críticos

1. **`typescript@^6.0.3`** como dependencia runtime — No existe en npm registry. Posible typosquatting o error semver.
2. **`@types/node@^25.6.0`** — No corresponde a ninguna release de Node.js conocida.
3. **Path traversal** en `resolveDenoPath` — Acepta rutas absolutas sin validación.
4. **Duplicación ~280 líneas** entre `adapters/node/cli.ts` y `adapters/deno/cli.ts`.
5. **Sin cobertura de tests** para `cli-parser.ts`, `adapters.ts`, `ast/*`, `crawler/*`, `graph/*`.
6. **12 pares de archivos ES duplicados** en `docs/users/ES/packages/ts_js/`.

---

## 2. Hallazgos de Seguridad

### 2.1 CRÍTICO — Dependencia `typescript@^6.0.3`

**Archivo**: `packages/sdk/ts_js/package.json:109`
**CWE**: CWE-1104 (Uso de Componentes No Mantenidos)

La versión `6.0.3` de TypeScript **no existe** en el registro público de npm. Las opciones:
- Error tipográfico (intencional: `~5.6.3`)
- Typosquatting (paquete malicioso)
- Pre-release no publicado

```json
"dependencies": { "typescript": "^6.0.3" }
```

**Impacto**: Ejecución de código arbitrario en instalación o runtime. El SDK importa TypeScript directamente en `ast/cache.ts`, `ast/traits.ts`, `ast/extractor.ts`.

**Recomendación**: Verificar inmediatamente con `npm view typescript versions --json`. Corregir a `"typescript": "5.6.3"` o versión verificada. Pin exacto.

### 2.2 ALTO — `@types/node@^25.6.0`

**Archivo**: `packages/sdk/ts_js/package.json:122`

`@types/node@25.x` no corresponde a ninguna versión de Node.js LTS conocida. Node 24 es la versión actual más reciente.

**Recomendación**: Cambiar a `"@types/node": "^22.0.0"` o `"^24.0.0"` según la versión de Node en `engines`.

### 2.3 MEDIO — Path Traversal en `resolveDenoPath`

**Archivo**: `adapters/deno/cli.ts:38-49`
**CWE**: CWE-22

```typescript
const resolveDenoPath = (...segments: string[]): string => {
  return segments.reduce((currentPath, segment) => {
    const normalizedSegment = segment.replace(/\\/g, "/");
    if (/^(?:[A-Za-z]:\/|\/)/.test(normalizedSegment)) {
      return normalizedSegment; // Devuelve ruta absoluta sin validar
    }
    // ...
  }, cwd);
};
```

**Impacto**: Atacante puede leer/escribir archivos fuera del proyecto vía `--target`, `--snapshot`.

### 2.4 MEDIO — Constructor `Function()` para imports dinámicos

**Archivo**: `src/barrits/config.ts:167-169`, `src/barrits/sdk/adapters.ts:9-11`
**CWE**: CWE-94 (Inyección de Código)

```typescript
const runtimeImport = <TModule>(specifier: string): Promise<TModule> => {
  const importModule = Function("specifier", "return import(specifier);");
  return importModule(specifier);
};
```

El wrapper `Function()` es innecesario — `import()` ya es dinámico. Bypass de análisis estático y CSP.

### 2.5 MEDIO — Sin validación de tamaño en parseo JSON

**Archivo**: `src/barrits/sdk/validation.ts:375-377`

`JSON.parse(source)` sin límite de tamaño. Un archivo malicioso de varios GB causa DoS por agotamiento de memoria.

### 2.6 MEDIO — `startDirectory` sin sanitización

**Archivo**: `src/barrits/sdk/cli-parser.ts:134-136`, `src/barrits/sdk/path.ts:25-33`

Las funciones `normalizePath` y `joinPath` no resuelven segmentos `..`. Una ruta como `../../etc/passwd` no es detectada.

### 2.7 BAJO — Fuga de environment variables a child processes

**Archivo**: `adapters/node/cli.ts:100-103`

```typescript
env: { ...process.env, ...envVars } // Toda env var del padre visible al hijo
```

### 2.8 BAJO — Potencial ReDoS en imports.ts

**Archivo**: `src/barrits/sdk/imports.ts:198,204`

```typescript
const importMatch = source.match(/^(?:import\s.+;\r?\n)+/);
```

Cuantificadores anidados (`+` dentro de `(?:)+`) pueden causar backtracking catastrófico en entradas adversariales.

---

## 3. Gap Analysis

### 3.1 Cobertura de Tests

| Módulo | Cobertura | Estado |
|--------|:---------:|:------:|
| `algorithms/` | 100% (6 suites, all example-based) | ✅ |
| `consume.ts` (sdk) | ~80% (parse + read paths) | ✅ |
| `traits/descriptor.ts` | ~85% (composición, merge) | ✅ |
| `traits/compose/` | ~60% | ⚠️ |
| Config (`defineBarritsPackage`) | ~70% | ⚠️ |
| `sdk/cli-parser.ts` | **0%** (261 líneas) | ❌ |
| `sdk/adapters.ts` | **0%** (121 líneas) | ❌ |
| `sdk/ast/*` | **0%** (~1,069 líneas) | ❌ |
| `sdk/crawler/*` | **0%** (210 líneas) | ❌ |
| `sdk/graph/*` | **0%** (~351 líneas) | ❌ |
| `sdk/imports.ts` | **0% directo** (indirecto vía E2E) | ❌ |
| `sdk/manifest.ts` | **0% directo** | ❌ |
| `sdk/query.ts` | **0%** (238 líneas) | ❌ |
| `sdk/path.ts` | **0%** (89 líneas) | ❌ |
| `sdk/logger.ts` | **0%** (87 líneas) | ❌ |
| `sdk/discovery.ts` | **0% directo** | ❌ |
| `sdk/inspect.ts` | **0% directo** | ❌ |
| `sdk/guards.ts` | **0%** (30 líneas) | ❌ |
| `schema/openapi.ts` | **0%** (tiene entry point en build) | ❌ |
| `ioc/index.ts` | **0%** (tiene entry point en build) | ❌ |
| `plugins/shared.ts` | **0% directo** | ❌ |
| `plugins/materialize.ts` | **0%** (18 líneas) | ❌ |
| `api/*` | **0%** | ❌ |
| `internal/*` | **0%** | ❌ |

**Total estimado**: ~40-50% del código fuente tiene cobertura directa.

### 3.2 Tipos de Tests Faltantes

- **Property-based testing**: 0 tests. Ninguna propiedad algebraica verificada.
- **Fuzz testing**: 0 tests.
- **Mutation testing**: 0 tests. Sin Stryker ni similares.
- **Regression tests**: 0 tests dedicados a regresiones.
- **Performance benchmark assertions**: 0. El benchmark existe pero no tiene aserciones.

### 3.3 Documentación

| Issue | Severidad | Detalle |
|-------|:---------:|---------|
| 12 pares de archivos ES duplicados | **ALTA** | `docs/users/ES/packages/ts_js/` — naming underscore vs hyphen |
| EN dev missing doc 04 | **MEDIA** | ES tiene `04_validacion-y-publicacion.md`; EN salta de 03 a 05 |
| Sin CODE_OF_CONDUCT.md | **MEDIA** | Estándar comunitario ausente |
| Sin guía de estilo documentación | **BAJA** | No hay `STYLEGUIDE.md` centralizado |
| Sin guía de onboarding | **BAJA** | CONTRIBUTING.md cubre lo básico pero no hay guía de arquitectura |
| Skills list mismatch | **MEDIA** | `docs/agents/README.md` lista 9 skills; solo 3 tienen SKILL.md |
| CHANGELOG SDK duplicado | **BAJA** | Root `CHANGELOG.md` + SDK `CHANGELOG.md` solapan |
| Sin diagramas de arquitectura formales | **MEDIA** | Solo Mermaid embebido en README; sin C4, UML, ni PlantUML |
| Sin guías de migración | **BAJA** | No hay docs para migrar entre versiones o desde competidores |

### 3.4 Features Faltantes

- Go SDK: placeholder vacío (solo `.gitkeep`)
- Kotlin SDK: placeholder vacío
- Python SDK: placeholder vacío
- Rust SDK: ni siquiera placeholder (mencionado en roadmap)
- Sin Docker/container support
- Sin VSCode extension
- Sin CLI autocomplete
- Sin telemetry / analytics
- Sin feature flags
- Sin dashboard UI

---

## 4. Buenas Prácticas y Arquitectura

### 4.1 Violaciones SRP (Single Responsibility Principle)

| Archivo | Líneas | Problema |
|---------|:------:|----------|
| `adapters/node/cli.ts` | 357 | CLI parsing + business logic + file I/O + child processes + watch session |
| `adapters/deno/cli.ts` | 357 | Idem, duplicado |
| `diagnostics.ts` `collectTraitDiagnostics` | 296 | 13 checks diferentes + 2 pases de agregación |
| `planImportActions` | 164 | 4 fases distintas mezcladas |
| `descriptor.ts` `composeTraitDescriptors` | 88 | Orquestación + validación + resolución |
| `extractor.ts` `collectDirectExports` | 75 | Todos los tipos de export en un solo bloque |

### 4.2 Duplicación Código

| Par | Líneas duplicadas | % |
|-----|:-----------------:|:-:|
| `node/cli.ts` ↔ `deno/cli.ts` | ~280 | 78% |
| `node/filesystem.ts` ↔ `deno/filesystem.ts` | ~35 | 80% |
| `node/tooling.ts` ↔ `deno/tooling.ts` | ~20 | 68% |
| `diagnostics.ts` bloques mismatch | ~120 | 6 patrones repetidos |

### 4.3 Type Safety

- **Uso excesivo de `any`**: `adapters.ts:20,65,70,79,87,96`, `descriptor.ts:5,131,464,465`
- **Type assertions inseguras**: `factory.ts:36,43`, `descriptor.ts:225,258,264,464,517`
- **Sin tipos de retorno explícitos** en `tooling.ts` (ambos adapters)

### 4.4 Error Handling

- **Errores genéricos**: `"Unable to resolve imports target file."` sin contexto del path
- **Silent catch**: `extractor.ts:344` — `catch { continue }` oculta errores de filesystem
- **Unhandled rejections**: `adapters/node/cli.ts:354` — `void runNodeCli().then(...)` sin `.catch()`
- **Sin `cause`**: Las excepciones no preservan la stack trace original vía `{ cause: error }`

### 4.5 Async Patterns

- **Sin límite de concurrencia**: `crawler/layer.ts:205` — `Promise.all` sin throttling, riesgo de FD exhaustion
- **Operaciones secuenciales innecesarias**: `cli.ts:229-230` — dos `await` que podrían paralelizarse
- **Missing awaits**: Potenciales en callbacks dentro de `setTimeout` en watch session

### 4.6 CI/CD

**Fortalezas**:
- `fail-fast: false` en matrix — buen patrón
- Deno + Bun + Node en CI
- Windows + Ubuntu testing
- npm audit + dependency-review + SBOM + secret scanning
- Release workflow completo con npm + JSR + GitHub Release

**Debilidades**:
- Sin caché de `node_modules` en CI (~2-3 minutos por run)
- Sin CI linting (ESLint no se ejecuta en CI)
- Sin CI de seguridad (SAST, Snyk)
- Sin CI de cobertura
- Sin CI de benchmarks
- Sin deploy previews
- Sin nightly builds

---

## 5. Optimización

### 5.1 Build

**Config actual**: `tsup.config.ts` — tsup con formato ESM + CJS, sourcemaps, tree-shaking.

**Problemas**:
- **Sin code splitting**: Todo el SDK en bundles monolíticos. Cada entry point incluye todo.
- **Sin lazy loading**: `typescript` (compilador completo) se importa estáticamente en AST modules.
- **Sin Dynamic imports**: Las rutas `./node`, `./deno`, `./vite` se importan completas aunque el consumidor use solo una.
- **`external: ["typescript"]`**: Correcto, TypeScript no se bundlea. Pero la dependencia runtime pesa ~60MB.
- **`dts: false`**: Los declaration files se generan con `tsc --emitDeclarationOnly` separado. Buena práctica.
- **Sin compresión**: Los bundles no tienen `.gz` ni `.br` para CDN.

### 5.2 Bundle Size (Estimado)

| Entry Point | Tamaño Estimado | Notas |
|-------------|:--------------:|-------|
| `index.js` | ~150-200 KB | Todo el SDK (algorithms, traits, consume, adapters, plugins) |
| `node/cli.js` | ~50-80 KB | CLI + all SDK |
| `deno/cli.js` | ~50-80 KB | Similar |
| `vite.js` | ~30-50 KB | Plugin + shared |
| `esbuild.js` | ~30-50 KB | Similar |
| `rollup.js` | ~30-50 KB | Similar |
| `webpack.js` | ~30-50 KB | Similar |
| `consume.js` | ~20-30 KB | Consume subpath alone |
| `openapi.js` | ~10-20 KB | Schema |
| `ioc/index.js` | ~5-10 KB | IoC container |

**Problema**: Cada entry point incluye todo el SDK porque `index.ts` es un barrel que re-exporta todo. No hay tree-shaking efectivo entre entry points.

### 5.3 Performance

**Cuellos de botella identificados**:
- **`extractor.ts`** — AST traversal completo del TypeScript compiler en cada build. Para proyectos grandes (>1000 archivos) puede tomar segundos.
- **`crawler/layer.ts`** — `Promise.all` sobre todos los archivos sin límite de concurrencia.
- **`diagnostics.ts`** — 13 checks en un solo loop lineal. Podría paralelizarse.
- **`ts: createSourceFile`** — Se llama repetidamente en `cache.ts` sin memoización entre calls.
- **Child processes** — En Deno, cada `deno run` re-compila TypeScript (no hay `deno compile` cacheado).

### 5.4 Dependencias

| Dependencia | Versión | Tamaño | Notas |
|-------------|:-------:|:------:|-------|
| `typescript` | ^6.0.3 ⚠️ | ~60 MB | CRÍTICO — Verificar existencia |
| `tsup` | ^8.5.1 | ~5 MB (dev) | Build tool |
| `tsx` | ^4.22.4 | ~2 MB (dev) | Test runner |
| `@types/node` | ^25.6.0 ⚠️ | ~2 MB (dev) | ALTO — Versión inexistente |
| `@emnapi/core` | ^1.10.0 | ~0.5 MB | Root dev dep (solo ejemplos) |
| React/Vue/Svelte/Solid | varias | ~50 MB total | Solo ejemplos |

---

## 6. UX/DX — Desarrolladores y Agentes

### 6.1 Developer Experience (DX)

**Fortalezas**:
- `npm test`, `npm run typecheck`, `npm run build` — comandos simples e intuitivos
- TypeScript strict mode
- ESLint + Prettier con lint-staged
- Conventional Commits con hook de validación
- Pre-commit hook con tests + git-secrets
- Documentación bilingüe completa
- ADRs documentan decisiones arquitectónicas

**Debilidades**:

| Issue | Impacto | Detalle |
|-------|:------:|---------|
| Sin CLI autocomplete | ALTO | `barrits --<TAB>` no funciona. Sin integración con `bash-completion` |
| Sin VSCode extension | ALTO | Sin syntax highlighting para `.barrits/` files, sin snippets, sin debugging |
| Sin hot reload en desarrollo | MEDIO | `npm run dev` usa `tsx watch` pero sin HMR |
| Debugging complejo | MEDIO | Sin launch.json para VSCode, sin node --inspect flags en scripts |
| Paths de scripts frágiles | MEDIO | `node ../../../node_modules/tsx/dist/cli.mjs` — deep relative paths quebradizos |
| Sin error codes | MEDIO | Errores como strings sueltos, sin códigos de error buscables |
| Sin warnings deprecation | BAJO | API breaking changes (SHA-256 async) no tienen migration deprecation path |
| Sin CLI progress indicators | BAJO | `barrits build` no muestra progreso en proyectos grandes |
| Sin CI linting | MEDIO | ESLint no se ejecuta en CI, solo en pre-commit |
| Error messages sin contexto | MEDIO | `"Unable to resolve imports target file."` — no dice qué path se intentó |
| Sin REPL/REPL-like | BAJO | No hay `barrits repl` para explorar el API interactivamente |

### 6.2 Agent Experience (AX)

**Fortalezas**:
- 4 agentes de GitHub definidos en `.github/agents/` (incident-commander, platform-architect, release-manager, runtime-quality)
- 5 skills en `.github/skills/` (contribution-workflow, incident-troubleshooting, jsdoc-authoring, maintainer-full-cycle, package-consumer-onboarding)
- 3 SKILL.md en `docs/agents/skills/` (release-orchestration, package-first-implementation, cross-runtime-validation)
- Documentación agnóstica al agente — bilingüe, estructurada, con ADRs

**Debilidades**:

| Issue | Severidad | Detalle |
|-------|:---------:|---------|
| 6 de 9 skills listadas no existen | ALTA | `docs/agents/README.md` lista 9; solo 3 tienen SKILL.md |
| Sin skill para auditoría forense | MEDIA | No hay SKILL.md que guíe auditorías como esta |
| Sin skill para testing | MEDIA | No hay skill que documente el test framework, patrones, cobertura esperada |
| Sin skill para release | MEDIA | Hay skill de release-orchestration pero no cubre rollback, hotfix, ni emergency release |
| Agentes sin definición de boundaries | MEDIA | Los agent list no especifica qué agente hace qué; hay overlap |
| Sin contexto de repositorio para agentes | ALTA | No hay `.repoconfig` o `ai-context.md` que describa arquitectura, convenciones, reglas |
| Skills sin versionado | BAJA | Skills no tienen versión ni changelog propio |
| Sin skill para onboarding | MEDIA | No hay skill para nuevos desarrolladores |
| Sin metaprompt estándar | MEDIA | No hay prompt canónico para agentes de código |

### 6.3 Recomendaciones AX

```
.github/
├── agents/
│   ├── README.md
│   ├── barrits-architect.agent.md        # (existe)
│   ├── barrits-cicd-engineer.agent.md    # NUEVO
│   ├── barrits-code-reviewer.agent.md    # NUEVO
│   └── barrits-security-auditor.agent.md # NUEVO
├── skills/
│   ├── README.md
│   ├── barrits-contribution-workflow/    # (existe)
│   ├── barrits-incident-troubleshooting/ # (existe)
│   ├── barrits-jsdoc-authoring/          # (existe)
│   ├── barrits-maintainer-full-cycle/    # (existe)
│   ├── barrits-package-consumer-onboarding/  # (existe)
│   ├── barrits-testing-patterns/         # NUEVO
│   ├── barrits-security-audit/           # NUEVO
│   ├── barrits-onboarding/              # NUEVO
│   └── barritos-emergency-release/       # NUEVO
└── REPOSITORY_CONTEXT.md                 # NUEVO — descripción canónica del repo
```

---

## 7. Skills — Documentación Modular por Caso de Uso

### 7.1 Skills Existentes vs Necesarias

| Skill | Estado | Prioridad | Uso |
|-------|:------:|:---------:|-----|
| `barrits-contribution-workflow` | ✅ Existe | — | Cómo contribuir, PR lifecycle |
| `barrits-incident-troubleshooting` | ✅ Existe | — | Diagnóstico de incidentes |
| `barrits-jsdoc-authoring` | ✅ Existe | — | Escribir JSDoc bilingüe |
| `barrits-maintainer-full-cycle` | ✅ Existe | — | Ciclo completo de mantenimiento |
| `barrits-package-consumer-onboarding` | ✅ Existe | — | Incorporar consumidores del paquete |
| `barrits-release-orchestration` | ✅ Existe (docs/agents) | — | Orquestación de releases |
| `barrits-package-first-implementation` | ✅ Existe (docs/agents) | — | Implementación package-first |
| `barrits-cross-runtime-validation` | ✅ Existe (docs/agents) | — | Validación cross-runtime |
| **`barrits-testing-patterns`** | ❌ **NUEVO** | 🔴 Alta | Patrones de test, cobertura esperada, mocking |
| **`barrits-security-audit`** | ❌ **NUEVO** | 🔴 Alta | Auditorías de seguridad, SAST, dependencias |
| **`barrits-onboarding`** | ❌ **NUEVO** | 🟡 Media | Setup, arquitectura, primeros pasos |
| **`barrits-emergency-release`** | ❌ **NUEVO** | 🟡 Media | Hotfix, rollback, emergency publish |
| **`barrits-api-design`** | ❌ **NUEVO** | 🟢 Baja | Convenciones de API, tipos, breaking changes |
| **`barrits-benchmarking`** | ❌ **NUEVO** | 🟢 Baja | Performance, benchmarks, profiling |

### 7.2 Formato de Skill Recomendado

Cada skill debe tener una estructura estándar:

```markdown
# Skill: barrits-<nombre>

## Metadata
- **Versión**: 1.0.0
- **Última actualización**: 2026-06-29
- **Tags**: #testing, #node, #deno
- **Agentes objetivo**: code-reviewer, maintainer

## Contexto
¿Qué problema resuelve este skill? ¿Cuándo usarlo?

## Requisitos Previos
- Qué herramientas/configuración se necesitan
- Qué skills deben ejecutarse antes

## Procedimiento
1. Paso 1: ...
2. Paso 2: ...
3. Paso 3: ...

## Ejemplos
```bash
# Ejemplo de uso
```

## Output Esperado
¿Qué debe producir este skill? (archivos, cambios, reportes)

## Criterios de Aceptación
- [ ] Criterio 1
- [ ] Criterio 2

## Referencias
- ADRs relacionados
- Documentación relacionada
```

---

## 8. Plan de Acción Priorizado

### 🔴 Día 1 (Crítico — Seguridad)

| # | Acción | Archivo |
|---|--------|---------|
| 1 | Verificar `typescript@^6.0.3` en npm registry | `package.json:109` |
| 2 | Corregir versión de TypeScript a `5.6.3` | `package.json:109` |
| 3 | Verificar `@types/node@^25.6.0` | `package.json:122` |
| 4 | Corregir `@types/node` a versión real | `package.json:122` |
| 5 | Validar rutas absolutas en `resolveDenoPath` | `adapters/deno/cli.ts:38-49` |
| 6 | Sanitizar `normalizePath` contra path traversal `..` | `src/barrits/sdk/path.ts:25-33` |
| 7 | Reemplazar `Function()` constructor por `import()` directo | `config.ts:167-169`, `adapters.ts:9-11` |
| 8 | Agregar límite de tamaño a `JSON.parse` | `validation.ts:375-377` |

### 🟡 Semana 1 (Alta — Deuda Técnica)

| # | Acción | Archivo |
|---|--------|---------|
| 9 | Extraer CLI pipeline compartido node/deno | `cli.ts` (ambos) |
| 10 | Dividir `collectTraitDiagnostics` (~296 lines) | `diagnostics.ts` |
| 11 | Dividir `planImportActions` (~164 lines) | `imports.ts` |
| 12 | Agregar `.catch()` a entry points CLI | `cli.ts` (ambos) |
| 13 | Agregar límite de concurrencia en `Promise.all` | `crawler/layer.ts:205` |
| 14 | Agregar tests para `cli-parser.ts` | Nuevo archivo test |
| 15 | Agregar tests para `sdk/adapters.ts` | Nuevo archivo test |
| 16 | Deduplicar 12 pares de archivos ES | `docs/users/ES/packages/ts_js/` |
| 17 | Crear CODE_OF_CONDUCT.md | Raíz |
| 18 | Crear EN development doc 04 | `docs/development/EN/packages/ts_js/` |

### 🟢 Semana 2 (Media — Optimización)

| # | Acción |
|---|--------|
| 19 | Agregar ESLint a CI pipeline |
| 20 | Agregar coverage reporting (`--experimental-test-coverage`) |
| 21 | Agregar code splitting por entry point en tsup |
| 22 | Agregar caché de `node_modules` en CI |
| 23 | Agregar límite de tiempo a child processes |
| 24 | Crear skills faltantes (testing-patterns, security-audit, onboarding) |
| 25 | Crear REPOSITORY_CONTEXT.md para agentes |
| 26 | Agregar CLI autocomplete (`barrits completion`) |

### 🔵 Semana 3 (Baja — Mejora Continua)

| # | Acción |
|---|--------|
| 27 | Agregar property-based tests (fast-check) |
| 28 | Agregar mutation testing (Stryker) |
| 29 | Crear guía de migración v0.1.x → v0.2.x |
| 30 | Agregar documentación de arquitectura (diagramas C4) |
| 31 | Agregar nightly builds |
| 32 | Agregar deploy previews para documentación |
| 33 | Implementar CLI progress indicators |
| 34 | Agregar VSCode extension |
| 35 | Migrar Go/Kotlin/Python SDKs de placeholder a implementación real |

### Métricas de Éxito

| Métrica | Línea Base | Objetivo 30 días |
|---------|:----------:|:----------------:|
| Cobertura de tests | ~40-50% | >70% |
| Módulos sin test | 16 | <5 |
| Duplicación node/deno | ~280 lines | 0 (compartido) |
| Skills documentados | 3/9 listados | 9/9 |
| CI time | ~5-8 min | <3 min (con caché) |
| Bundle size (index) | ~200 KB | <120 KB (code splitting) |
| Severidad crítica | 1 | 0 |
| Severidad alta | 1 | 0 |
| Severidad media | 5 | <2 |
| Documentos duplicados | 12 pares | 0 |

---

## Apéndice A: Archivos Auditados

**Total: 80+ archivos, ~12,000 líneas de código, ~5,000 líneas de documentación.**

### Código Fuente (40+ archivos)
- `adapters/node/`: `cli.ts`, `filesystem.ts`, `tooling.ts`, `index.ts`
- `adapters/deno/`: `cli.ts`, `filesystem.ts`, `tooling.ts`, `mod.ts`
- `src/barrits/sdk/`: `cli-parser.ts`, `manifest.ts`, `validation.ts`, `consume.ts`, `summarization.ts`, `imports.ts`, `discovery.ts`, `inspect.ts`, `path.ts`, `query.ts`, `cli-format.ts`, `logger.ts`, `adapters.ts`, `guards.ts`, `index.ts`, `contracts.d.ts`
- `src/barrits/sdk/ast/`: `cache.ts`, `extractor.ts`, `traits.ts`, `diagnostics.ts`
- `src/barrits/sdk/crawler/`: `layer.ts`
- `src/barrits/sdk/graph/`: `collisions.ts`, `imports.ts`
- `src/barrits/`: `consume.ts`, `config.ts`, `package.ts`
- `src/barrits/api/`: `domains.ts`, `factory.ts`, `flat.ts`, `hybrid.ts`
- `src/barrits/internal/`: `config_normalization.ts`
- `src/barrits/plugins/`: `shared.ts`, `materialize.ts`, `esbuild.ts`, `vite.ts`, `rollup.ts`, `webpack.ts`
- `src/barrits/traits/`: `descriptor.ts`, `compose/index.ts`, `compose/pipeline.ts`, `compose/merge.ts`

### Tests (19 archivos)
- 17 test files, 2 helper files
- `tests/helpers/process.ts`, `tests/helpers/fixtures.ts`

### Configuración (15+ archivos)
- `package.json`, `tsconfig.json`, `jsr.json`, `tsup.config.ts`
- `.github/workflows/ci.yml`, `release.yml`, `security.yml`, `security-enhanced.yml`
- `.husky/pre-commit`, `.eslintrc.js`, `.lintstagedrc.json`, `.env`, `.gitignore`

### Documentación (40+ archivos)
- README.md, README.es.md, CHANGELOG.md, CONTRIBUTING.md, SECURITY.md, LICENSE
- `docs/`: 5 subdirectorios con ~15 docs EN + ~20 docs ES
- 4 ADRs: 0001-0004
- `docs/agents/`: 4 agentes, 3 skills
- `docs/development/EN/packages/ts_js/`: 6 docs
- `docs/investigations/EN/packages/ts_js/`: 7 docs
- `docs/package/EN/`: 10 docs
- `docs/users/EN/packages/ts_js/`: 22 docs
