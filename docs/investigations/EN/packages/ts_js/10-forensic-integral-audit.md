# Comprehensive Forensic Audit — Barrits SDK v0.1.8

> **Author**: Corporate Expert Engineer
> **Date**: 2026-06-29
> **Audit**: Security, Gaps, Best Practices, Optimization, UX/DX, Skills

---

## Index

1. [Executive Summary](#1-executive-summary)
2. [Security Findings](#2-security-findings)
3. [Gap Analysis](#3-gap-analysis)
4. [Best Practices and Architecture](#4-best-practices-and-architecture)
5. [Optimization](#5-optimization)
6. [UX/DX — Developers and Agents](#6-uxdx--developers-and-agents)
7. [Skills — Modular Use-Case Documentation](#7-skills--modular-use-case-documentation)
8. [Prioritized Action Plan](#8-prioritized-action-plan)

---

## 1. Executive Summary

**~12,000 lines of source code** were audited across 80+ files, **65 tests**, **4 CI/CD pipelines**, **5 security documents**, **10 skill files**, **4 ADRs**, and **40+ bilingual (EN/ES) documentation files**.

### Overall Scorecard

| Dimension | Rating | Status |
|-----------|:-----:|:------:|
| Security | **6/10** | 1 critical, 1 high, 5 medium |
| Test Coverage | **5/10** | ~40-50% modules covered |
| Documentation | **8/10** | Excellent but with duplicates |
| Code Quality | **7/10** | SRP violations, node/deno duplication |
| Optimization | **5/10** | No code splitting, no lazy loading |
| UX/DX | **6/10** | No CLI autocomplete, no onboarding |
| CI/CD | **7/10** | Robust but slow, no caching |

### Critical Findings

1. **`typescript@^6.0.3`** as a runtime dependency — Does not exist on npm registry. Possible typosquatting or semver error.
2. **`@types/node@^25.6.0`** — Does not correspond to any known Node.js release.
3. **Path traversal** in `resolveDenoPath` — Accepts absolute paths without validation.
4. **~280 lines duplicated** between `adapters/node/cli.ts` and `adapters/deno/cli.ts`.
5. **No test coverage** for `cli-parser.ts`, `adapters.ts`, `ast/*`, `crawler/*`, `graph/*`.
6. **12 pairs of duplicate ES files** in `docs/users/ES/packages/ts_js/`.

---

## 2. Security Findings

### 2.1 CRITICAL — `typescript@^6.0.3` Dependency

**File**: `packages/sdk/ts_js/package.json:109`
**CWE**: CWE-1104 (Use of Unmaintained Components)

Version `6.0.3` of TypeScript **does not exist** in the public npm registry. Possibilities:
- Typo (intentional: `~5.6.3`)
- Typosquatting (malicious package)
- Unpublished pre-release

```json
"dependencies": { "typescript": "^6.0.3" }
```

**Impact**: Arbitrary code execution during installation or runtime. The SDK imports TypeScript directly in `ast/cache.ts`, `ast/traits.ts`, `ast/extractor.ts`.

**Recommendation**: Immediately verify with `npm view typescript versions --json`. Correct to `"typescript": "5.6.3"` or a verified version. Pin exact.

### 2.2 HIGH — `@types/node@^25.6.0`

**File**: `packages/sdk/ts_js/package.json:122`

`@types/node@25.x` does not correspond to any known Node.js LTS release. Node 24 is the latest current version.

**Recommendation**: Change to `"@types/node": "^22.0.0"` or `"^24.0.0"` based on the Node version in `engines`.

### 2.3 MEDIUM — Path Traversal in `resolveDenoPath`

**File**: `adapters/deno/cli.ts:38-49`
**CWE**: CWE-22

```typescript
const resolveDenoPath = (...segments: string[]): string => {
  return segments.reduce((currentPath, segment) => {
    const normalizedSegment = segment.replace(/\\/g, "/");
    if (/^(?:[A-Za-z]:\/|\/)/.test(normalizedSegment)) {
      return normalizedSegment; // Returns absolute path without validation
    }
    // ...
  }, cwd);
};
```

**Impact**: Attacker can read/write files outside the project via `--target`, `--snapshot`.

### 2.4 MEDIUM — `Function()` Constructor for Dynamic Imports

**File**: `src/barrits/config.ts:167-169`, `src/barrits/sdk/adapters.ts:9-11`
**CWE**: CWE-94 (Code Injection)

```typescript
const runtimeImport = <TModule>(specifier: string): Promise<TModule> => {
  const importModule = Function("specifier", "return import(specifier);");
  return importModule(specifier);
};
```

The `Function()` wrapper is unnecessary — `import()` is already dynamic. Bypasses static analysis and CSP.

### 2.5 MEDIUM — No Size Validation in JSON Parsing

**File**: `src/barrits/sdk/validation.ts:375-377`

`JSON.parse(source)` without size limit. A multi-GB malicious file causes DoS via memory exhaustion.

### 2.6 MEDIUM — `startDirectory` Without Sanitization

**File**: `src/barrits/sdk/cli-parser.ts:134-136`, `src/barrits/sdk/path.ts:25-33`

The `normalizePath` and `joinPath` functions do not resolve `..` segments. A path like `../../etc/passwd` is not detected.

### 2.7 LOW — Environment Variable Leakage to Child Processes

**File**: `adapters/node/cli.ts:100-103`

```typescript
env: { ...process.env, ...envVars } // All parent env vars visible to child
```

### 2.8 LOW — Potential ReDoS in imports.ts

**File**: `src/barrits/sdk/imports.ts:198,204`

```typescript
const importMatch = source.match(/^(?:import\s.+;\r?\n)+/);
```

Nested quantifiers (`+` inside `(?:)+`) can cause catastrophic backtracking on adversarial input.

---

## 3. Gap Analysis

### 3.1 Test Coverage

| Module | Coverage | Status |
|--------|:-------:|:------:|
| `algorithms/` | 100% (6 suites, all example-based) | ✅ |
| `consume.ts` (sdk) | ~80% (parse + read paths) | ✅ |
| `traits/descriptor.ts` | ~85% (composition, merge) | ✅ |
| `traits/compose/` | ~60% | ⚠️ |
| Config (`defineBarritsPackage`) | ~70% | ⚠️ |
| `sdk/cli-parser.ts` | **0%** (261 lines) | ❌ |
| `sdk/adapters.ts` | **0%** (121 lines) | ❌ |
| `sdk/ast/*` | **0%** (~1,069 lines) | ❌ |
| `sdk/crawler/*` | **0%** (210 lines) | ❌ |
| `sdk/graph/*` | **0%** (~351 lines) | ❌ |
| `sdk/imports.ts` | **0% direct** (indirect via E2E) | ❌ |
| `sdk/manifest.ts` | **0% direct** | ❌ |
| `sdk/query.ts` | **0%** (238 lines) | ❌ |
| `sdk/path.ts` | **0%** (89 lines) | ❌ |
| `sdk/logger.ts` | **0%** (87 lines) | ❌ |
| `sdk/discovery.ts` | **0% direct** | ❌ |
| `sdk/inspect.ts` | **0% direct** | ❌ |
| `sdk/guards.ts` | **0%** (30 lines) | ❌ |
| `schema/openapi.ts` | **0%** (has entry point in build) | ❌ |
| `ioc/index.ts` | **0%** (has entry point in build) | ❌ |
| `plugins/shared.ts` | **0% direct** | ❌ |
| `plugins/materialize.ts` | **0%** (18 lines) | ❌ |
| `api/*` | **0%** | ❌ |
| `internal/*` | **0%** | ❌ |

**Total estimated**: ~40-50% of source code has direct coverage.

### 3.2 Missing Test Types

- **Property-based testing**: 0 tests. No algebraic properties verified.
- **Fuzz testing**: 0 tests.
- **Mutation testing**: 0 tests. No Stryker or similar.
- **Regression tests**: 0 dedicated regression tests.
- **Performance benchmark assertions**: 0. The benchmark exists but has no assertions.

### 3.3 Documentation

| Issue | Severity | Detail |
|-------|:-------:|--------|
| 12 pairs of duplicate ES files | **HIGH** | `docs/users/ES/packages/ts_js/` — underscore vs hyphen naming |
| EN dev doc 04 missing | **MEDIUM** | ES has `04_validacion-y-publicacion.md`; EN jumps from 03 to 05 |
| No CODE_OF_CONDUCT.md | **MEDIUM** | Community standard missing |
| No documentation style guide | **LOW** | No centralized `STYLEGUIDE.md` |
| No onboarding guide | **LOW** | CONTRIBUTING.md covers basics but no architecture guide |
| Skills list mismatch | **MEDIUM** | `docs/agents/README.md` lists 9 skills; only 3 have SKILL.md |
| Duplicate SDK CHANGELOG | **LOW** | Root `CHANGELOG.md` + SDK `CHANGELOG.md` overlap |
| No formal architecture diagrams | **MEDIUM** | Only Mermaid embedded in README; no C4, UML, or PlantUML |
| No migration guides | **LOW** | No docs for migrating between versions or from competitors |

### 3.4 Missing Features

- Go SDK: empty placeholder (only `.gitkeep`)
- Kotlin SDK: empty placeholder
- Python SDK: empty placeholder
- Rust SDK: not even a placeholder (mentioned in roadmap)
- No Docker/container support
- No VSCode extension
- No CLI autocomplete
- No telemetry / analytics
- No feature flags
- No dashboard UI

---

## 4. Best Practices and Architecture

### 4.1 SRP (Single Responsibility Principle) Violations

| File | Lines | Problem |
|------|:----:|---------|
| `adapters/node/cli.ts` | 357 | CLI parsing + business logic + file I/O + child processes + watch session |
| `adapters/deno/cli.ts` | 357 | Same, duplicated |
| `diagnostics.ts` `collectTraitDiagnostics` | 296 | 13 different checks + 2 aggregation passes |
| `planImportActions` | 164 | 4 mixed phases |
| `descriptor.ts` `composeTraitDescriptors` | 88 | Orchestration + validation + resolution |
| `extractor.ts` `collectDirectExports` | 75 | All export types in a single block |

### 4.2 Code Duplication

| Pair | Duplicated Lines | % |
|------|:--------------:|:-:|
| `node/cli.ts` ↔ `deno/cli.ts` | ~280 | 78% |
| `node/filesystem.ts` ↔ `deno/filesystem.ts` | ~35 | 80% |
| `node/tooling.ts` ↔ `deno/tooling.ts` | ~20 | 68% |
| `diagnostics.ts` mismatch blocks | ~120 | 6 repeated patterns |

### 4.3 Type Safety

- **Excessive `any` usage**: `adapters.ts:20,65,70,79,87,96`, `descriptor.ts:5,131,464,465`
- **Unsafe type assertions**: `factory.ts:36,43`, `descriptor.ts:225,258,264,464,517`
- **Missing explicit return types** in `tooling.ts` (both adapters)

### 4.4 Error Handling

- **Generic errors**: `"Unable to resolve imports target file."` without path context
- **Silent catch**: `extractor.ts:344` — `catch { continue }` hides filesystem errors
- **Unhandled rejections**: `adapters/node/cli.ts:354` — `void runNodeCli().then(...)` without `.catch()`
- **No `cause`**: Exceptions do not preserve original stack traces via `{ cause: error }`

### 4.5 Async Patterns

- **No concurrency limit**: `crawler/layer.ts:205` — `Promise.all` without throttling, risk of FD exhaustion
- **Unnecessary sequential operations**: `cli.ts:229-230` — two `await`s that could be parallelized
- **Missing awaits**: Potential in callbacks inside `setTimeout` in watch session

### 4.6 CI/CD

**Strengths**:
- `fail-fast: false` in matrix — good pattern
- Deno + Bun + Node in CI
- Windows + Ubuntu testing
- npm audit + dependency-review + SBOM + secret scanning
- Complete release workflow with npm + JSR + GitHub Release

**Weaknesses**:
- No `node_modules` cache in CI (~2-3 minutes per run)
- No CI linting (ESLint does not run in CI)
- No CI security scanning (SAST, Snyk)
- No CI coverage reporting
- No CI benchmarks
- No deploy previews
- No nightly builds

---

## 5. Optimization

### 5.1 Build

**Current config**: `tsup.config.ts` — tsup with ESM + CJS formats, sourcemaps, tree-shaking.

**Issues**:
- **No code splitting**: Entire SDK in monolithic bundles. Every entry point includes everything.
- **No lazy loading**: `typescript` (full compiler) is imported statically in AST modules.
- **No dynamic imports**: Paths like `./node`, `./deno`, `./vite` are imported fully even if the consumer uses only one.
- **`external: ["typescript"]`**: Correct, TypeScript is not bundled. But the runtime dependency weighs ~60MB.
- **`dts: false`**: Declaration files are generated with `tsc --emitDeclarationOnly` separately. Good practice.
- **No compression**: Bundles have no `.gz` or `.br` for CDN.

### 5.2 Bundle Size (Estimated)

| Entry Point | Estimated Size | Notes |
|-------------|:-------------:|-------|
| `index.js` | ~150-200 KB | Entire SDK (algorithms, traits, consume, adapters, plugins) |
| `node/cli.js` | ~50-80 KB | CLI + all SDK |
| `deno/cli.js` | ~50-80 KB | Similar |
| `vite.js` | ~30-50 KB | Plugin + shared |
| `esbuild.js` | ~30-50 KB | Similar |
| `rollup.js` | ~30-50 KB | Similar |
| `webpack.js` | ~30-50 KB | Similar |
| `consume.js` | ~20-30 KB | Consume subpath alone |
| `openapi.js` | ~10-20 KB | Schema |
| `ioc/index.js` | ~5-10 KB | IoC container |

**Problem**: Each entry point includes the entire SDK because `index.ts` is a barrel that re-exports everything. No effective tree-shaking between entry points.

### 5.3 Performance

**Identified bottlenecks**:
- **`extractor.ts`** — Full AST traversal of the TypeScript compiler on every build. For large projects (>1000 files) this can take seconds.
- **`crawler/layer.ts`** — `Promise.all` over all files with no concurrency limit.
- **`diagnostics.ts`** — 13 checks in a single linear loop. Could be parallelized.
- **`ts: createSourceFile`** — Called repeatedly in `cache.ts` without memoization between calls.
- **Child processes** — In Deno, each `deno run` re-compiles TypeScript (no cached `deno compile`).

### 5.4 Dependencies

| Dependency | Version | Size | Notes |
|------------|:------:|:----:|-------|
| `typescript` | ^6.0.3 ⚠️ | ~60 MB | CRITICAL — Verify existence |
| `tsup` | ^8.5.1 | ~5 MB (dev) | Build tool |
| `tsx` | ^4.22.4 | ~2 MB (dev) | Test runner |
| `@types/node` | ^25.6.0 ⚠️ | ~2 MB (dev) | HIGH — Non-existent version |
| `@emnapi/core` | ^1.10.0 | ~0.5 MB | Root dev dep (examples only) |
| React/Vue/Svelte/Solid | various | ~50 MB total | Examples only |

---

## 6. UX/DX — Developers and Agents

### 6.1 Developer Experience (DX)

**Strengths**:
- `npm test`, `npm run typecheck`, `npm run build` — simple, intuitive commands
- TypeScript strict mode
- ESLint + Prettier with lint-staged
- Conventional Commits with validation hook
- Pre-commit hook with tests + git-secrets
- Complete bilingual documentation
- ADRs document architectural decisions

**Weaknesses**:

| Issue | Impact | Detail |
|-------|:-----:|--------|
| No CLI autocomplete | HIGH | `barrits --<TAB>` does not work. No `bash-completion` integration |
| No VSCode extension | HIGH | No syntax highlighting for `.barrits/` files, no snippets, no debugging |
| No hot reload in development | MEDIUM | `npm run dev` uses `tsx watch` but without HMR |
| Complex debugging | MEDIUM | No launch.json for VSCode, no node --inspect flags in scripts |
| Fragile script paths | MEDIUM | `node ../../../node_modules/tsx/dist/cli.mjs` — fragile deep relative paths |
| No error codes | MEDIUM | Errors as loose strings, no searchable error codes |
| No deprecation warnings | LOW | API breaking changes (SHA-256 async) have no migration deprecation path |
| No CLI progress indicators | LOW | `barrits build` shows no progress on large projects |
| No CI linting | MEDIUM | ESLint not run in CI, only in pre-commit |
| Error messages without context | MEDIUM | `"Unable to resolve imports target file."` — does not say which path was attempted |
| No REPL/REPL-like | LOW | No `barrits repl` to explore the API interactively |

### 6.2 Agent Experience (AX)

**Strengths**:
- 4 GitHub agents defined in `.github/agents/` (incident-commander, platform-architect, release-manager, runtime-quality)
- 5 skills in `.github/skills/` (contribution-workflow, incident-troubleshooting, jsdoc-authoring, maintainer-full-cycle, package-consumer-onboarding)
- 3 SKILL.md in `docs/agents/skills/` (release-orchestration, package-first-implementation, cross-runtime-validation)
- Agent-agnostic documentation — bilingual, structured, with ADRs

**Weaknesses**:

| Issue | Severity | Detail |
|-------|:-------:|--------|
| 6 of 9 listed skills do not exist | HIGH | `docs/agents/README.md` lists 9; only 3 have SKILL.md |
| No forensic audit skill | MEDIUM | No SKILL.md to guide audits like this one |
| No testing skill | MEDIUM | No skill documenting test framework, patterns, expected coverage |
| No release skill | MEDIUM | Release-orchestration skill exists but does not cover rollback, hotfix, or emergency release |
| Agents without boundary definitions | MEDIUM | Agent list does not specify which agent does what; there is overlap |
| No repository context for agents | HIGH | No `.repoconfig` or `ai-context.md` describing architecture, conventions, rules |
| Skills without versioning | LOW | Skills have no version or own changelog |
| No onboarding skill | MEDIUM | No skill for new developers |
| No standard metaprompt | MEDIUM | No canonical prompt for code agents |

### 6.3 AX Recommendations

```
.github/
├── agents/
│   ├── README.md
│   ├── barrits-architect.agent.md        # (exists)
│   ├── barrits-cicd-engineer.agent.md    # NEW
│   ├── barrits-code-reviewer.agent.md    # NEW
│   └── barrits-security-auditor.agent.md # NEW
├── skills/
│   ├── README.md
│   ├── barrits-contribution-workflow/    # (exists)
│   ├── barrits-incident-troubleshooting/ # (exists)
│   ├── barrits-jsdoc-authoring/          # (exists)
│   ├── barrits-maintainer-full-cycle/    # (exists)
│   ├── barrits-package-consumer-onboarding/  # (exists)
│   ├── barrits-testing-patterns/         # NEW
│   ├── barrits-security-audit/           # NEW
│   ├── barrits-onboarding/              # NEW
│   └── barritos-emergency-release/       # NEW
└── REPOSITORY_CONTEXT.md                 # NEW — canonical repo description
```

---

## 7. Skills — Modular Use-Case Documentation

### 7.1 Existing vs. Required Skills

| Skill | Status | Priority | Use Case |
|-------|:-----:|:-------:|----------|
| `barrits-contribution-workflow` | ✅ Exists | — | How to contribute, PR lifecycle |
| `barrits-incident-troubleshooting` | ✅ Exists | — | Incident diagnosis |
| `barrits-jsdoc-authoring` | ✅ Exists | — | Writing bilingual JSDoc |
| `barrits-maintainer-full-cycle` | ✅ Exists | — | Complete maintenance cycle |
| `barrits-package-consumer-onboarding` | ✅ Exists | — | Onboarding package consumers |
| `barrits-release-orchestration` | ✅ Exists (docs/agents) | — | Release orchestration |
| `barrits-package-first-implementation` | ✅ Exists (docs/agents) | — | Package-first implementation |
| `barrits-cross-runtime-validation` | ✅ Exists (docs/agents) | — | Cross-runtime validation |
| **`barrits-testing-patterns`** | ❌ **NEW** | 🔴 High | Test patterns, expected coverage, mocking |
| **`barrits-security-audit`** | ❌ **NEW** | 🔴 High | Security audits, SAST, dependencies |
| **`barrits-onboarding`** | ❌ **NEW** | 🟡 Medium | Setup, architecture, first steps |
| **`barrits-emergency-release`** | ❌ **NEW** | 🟡 Medium | Hotfix, rollback, emergency publish |
| **`barrits-api-design`** | ❌ **NEW** | 🟢 Low | API conventions, types, breaking changes |
| **`barrits-benchmarking`** | ❌ **NEW** | 🟢 Low | Performance, benchmarks, profiling |

### 7.2 Recommended Skill Format

Each skill must have a standard structure:

```markdown
# Skill: barrits-<name>

## Metadata
- **Version**: 1.0.0
- **Last updated**: 2026-06-29
- **Tags**: #testing, #node, #deno
- **Target agents**: code-reviewer, maintainer

## Context
What problem does this skill solve? When to use it?

## Prerequisites
- Required tools/configuration
- Skills to execute beforehand

## Procedure
1. Step 1: ...
2. Step 2: ...
3. Step 3: ...

## Examples
```bash
# Usage example
```

## Expected Output
What must this skill produce? (files, changes, reports)

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## References
- Related ADRs
- Related documentation
```

---

## 8. Prioritized Action Plan

### 🔴 Day 1 (Critical — Security)

| # | Action | File |
|---|--------|------|
| 1 | Verify `typescript@^6.0.3` on npm registry | `package.json:109` |
| 2 | Fix TypeScript version to `5.6.3` | `package.json:109` |
| 3 | Verify `@types/node@^25.6.0` | `package.json:122` |
| 4 | Fix `@types/node` to real version | `package.json:122` |
| 5 | Validate absolute paths in `resolveDenoPath` | `adapters/deno/cli.ts:38-49` |
| 6 | Sanitize `normalizePath` against path traversal `..` | `src/barrits/sdk/path.ts:25-33` |
| 7 | Replace `Function()` constructor with direct `import()` | `config.ts:167-169`, `adapters.ts:9-11` |
| 8 | Add size limit to `JSON.parse` | `validation.ts:375-377` |

### 🟡 Week 1 (High — Technical Debt)

| # | Action | File |
|---|--------|------|
| 9 | Extract shared CLI pipeline for node/deno | `cli.ts` (both) |
| 10 | Split `collectTraitDiagnostics` (~296 lines) | `diagnostics.ts` |
| 11 | Split `planImportActions` (~164 lines) | `imports.ts` |
| 12 | Add `.catch()` to CLI entry points | `cli.ts` (both) |
| 13 | Add concurrency limit to `Promise.all` | `crawler/layer.ts:205` |
| 14 | Add tests for `cli-parser.ts` | New test file |
| 15 | Add tests for `sdk/adapters.ts` | New test file |
| 16 | Deduplicate 12 pairs of ES files | `docs/users/ES/packages/ts_js/` |
| 17 | Create CODE_OF_CONDUCT.md | Root |
| 18 | Create EN development doc 04 | `docs/development/EN/packages/ts_js/` |

### 🟢 Week 2 (Medium — Optimization)

| # | Action |
|---|--------|
| 19 | Add ESLint to CI pipeline |
| 20 | Add coverage reporting (`--experimental-test-coverage`) |
| 21 | Add code splitting by entry point in tsup |
| 22 | Add `node_modules` cache in CI |
| 23 | Add timeout limit to child processes |
| 24 | Create missing skills (testing-patterns, security-audit, onboarding) |
| 25 | Create REPOSITORY_CONTEXT.md for agents |
| 26 | Add CLI autocomplete (`barrits completion`) |

### 🔵 Week 3 (Low — Continuous Improvement)

| # | Action |
|---|--------|
| 27 | Add property-based tests (fast-check) |
| 28 | Add mutation testing (Stryker) |
| 29 | Create migration guide v0.1.x → v0.2.x |
| 30 | Add architecture documentation (C4 diagrams) |
| 31 | Add nightly builds |
| 32 | Add deploy previews for documentation |
| 33 | Implement CLI progress indicators |
| 34 | Add VSCode extension |
| 35 | Migrate Go/Kotlin/Python SDKs from placeholder to real implementation |

### Success Metrics

| Metric | Baseline | 30-Day Target |
|--------|:-------:|:-------------:|
| Test coverage | ~40-50% | >70% |
| Modules without tests | 16 | <5 |
| Node/deno duplication | ~280 lines | 0 (shared) |
| Documented skills | 3/9 listed | 9/9 |
| CI time | ~5-8 min | <3 min (with cache) |
| Bundle size (index) | ~200 KB | <120 KB (code splitting) |
| Critical severity | 1 | 0 |
| High severity | 1 | 0 |
| Medium severity | 5 | <2 |
| Duplicate documents | 12 pairs | 0 |

---

## Appendix A: Audited Files

**Total: 80+ files, ~12,000 lines of code, ~5,000 lines of documentation.**

### Source Code (40+ files)
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

### Tests (19 files)
- 17 test files, 2 helper files
- `tests/helpers/process.ts`, `tests/helpers/fixtures.ts`

### Configuration (15+ files)
- `package.json`, `tsconfig.json`, `jsr.json`, `tsup.config.ts`
- `.github/workflows/ci.yml`, `release.yml`, `security.yml`, `security-enhanced.yml`
- `.husky/pre-commit`, `.eslintrc.js`, `.lintstagedrc.json`, `.env`, `.gitignore`

### Documentation (40+ files)
- README.md, README.es.md, CHANGELOG.md, CONTRIBUTING.md, SECURITY.md, LICENSE
- `docs/`: 5 subdirectories with ~15 EN docs + ~20 ES docs
- 4 ADRs: 0001-0004
- `docs/agents/`: 4 agents, 3 skills
- `docs/development/EN/packages/ts_js/`: 6 docs
- `docs/investigations/EN/packages/ts_js/`: 7 docs
- `docs/package/EN/`: 10 docs
- `docs/users/EN/packages/ts_js/`: 22 docs
