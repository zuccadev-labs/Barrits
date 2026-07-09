# Barrits Repository Context

## Overview

Barrits is a **portable SDK** for automated integration discovery, inspection, import management, and build manifest generation in TypeScript/JavaScript monorepos. It uses a package-first approach with framework adapters for Vite, esbuild, Rollup, and Webpack.

## Monorepo Structure

| Path | Purpose |
|------|---------|
| `packages/sdk/ts_js/` | Primary SDK package (`@zuccadev-labs/barrits`) |
| `packages/sdk/ts_js/src/barrits/` | Core orchestration engine |
| `packages/sdk/ts_js/src/barrits/sdk/` | Public SDK modules (discovery, inspect, imports, manifest, etc.) |
| `packages/sdk/ts_js/src/barrits/plugins/` | Framework adapters (vite, esbuild, rollup, webpack) |
| `packages/sdk/ts_js/adapters/node/` | Node.js-specific CLI and filesystem implementations |
| `packages/sdk/ts_js/adapters/deno/` | Deno-specific CLI and filesystem implementations |
| `packages/sdk/ts_js/tests/` | Test suite (node:test runner via tsx) |
| `docs/` | Bilingual documentation (EN/ES) |
| `.opencode/skills/` | AI agent skill definitions |
| `.github/workflows/` | CI/CD pipeline workflows |

## Key SDK Modules (src/barrits/sdk/)

- `contracts.ts` — All TypeScript types and interfaces
- `cli-parser.ts` — CLI argument parsing → `CliOptions` / `CliCommand` 
- `cli-format.ts` — CLI output formatting utilities
- `completion.ts` — Shell completion script generation (bash/zsh/fish)
- `discovery.ts` — `findBarritsDirectory()` — locate `.barrits/` directory
- `inspect.ts` — `inspectBarritsIntegrations()` — build integration graph
- `manifest.ts` — Build manifest creation and projection
- `imports.ts` — Import action generation and application
- `query.ts` — Graph filtering and project file path resolution
- `consume.ts` — Manifest/snapshot file I/O
- `summarization.ts` — State summary creation
- `guards.ts` — Runtime type guards (visibility, file kind)
- `diagnostics.ts` — Trait diagnostics collection and formatting
- `async-utils.ts` — Concurrency utilities (`mapConcurrent`)

## CLI Commands

| Command | Alias | Purpose |
|---------|-------|---------|
| `detect` | `brt` | Detect barrits directory and integrations |
| `info` | | Show integration graph with domain/export/file-kind/visibility filters |
| `watch` | | Watch for changes in barrits directory |
| `dev` | | Dev session with child process + watch |
| `imports` | | Generate/manage import actions |
| `build` | | Generate build manifest |
| `completion` | | Generate shell completion script (bash/zsh/fish) |
| `help` | | Show usage text |

## Development Workflow

- **Branch**: Feature branches from `dev`, PR into `dev`, merge to `main` on release
- **Commits**: Conventional commits (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`)
- **Test**: `npm test` (108 tests, tsx --test runner)
- **CI**: 4 workflows — quality checks on ubuntu-latest + windows-latest
- **Lint**: ESLint with `@typescript-eslint` rules
- **Typecheck**: `tsc --noEmit`

## Architecture Rules

1. **SRP**: Domain-agnostic orchestration in `barrits/`, utilities in `barrits_lib/`
2. **Internal Services**: Business logic in `barrits/internal/`, consumed by API layer
3. **AST Layer**: Metadata extraction in `barrits/sdk/ast/` subsystem
4. **Bilingual**: All JSDoc and markdown docs in [EN] and [ES]
5. **No default exports**: Named exports only

## CI Pipeline

The CI workflow runs on push/PR to `dev` and `main`:
1. Lint + Typecheck
2. Build SDK
3. Test (108 tests across Node.js, Deno, Bun)
4. Validate JSR surface
5. Build all examples (Node, React, Vue, Solid, Svelte, bundlers, Tauri, Deno, Bun)

## Skills Ecosystem

Skills are organized in two layers for discoverability and depth:

### OpenCode-Native (`.opencode/skills/<name>/skill.jsonc`)

Discoverable by the OpenCode agent runtime. Each has rich action prompts:

| Skill | Domain |
|:---|---|
| `testing-patterns` | Test conventions, property-based & mutation testing |
| `security-audit` | Threat model, vulnerability scanning, OIDC audit |
| `onboarding` | Dev setup, project structure, first contribution |
| `development-workflow` | Commit conventions, branch strategy, PR process |
| `architecture-decision-records` | ADR creation, review, lifecycle management |
| `automation-showcase` | Live SDK feature demonstrations via CLI |
| `emergency-release` | Hotfix process, security patch, rollback |
| `integration-points` | Bundler plugin config (Vite, esbuild, Rollup, Webpack) |
| `llm-protocols` | AI agent protocols, JSDoc standards, coding conventions |

### Narrative Skills (`docs/agents/skills/<name>/SKILL.md`)

Full workflow documents with context, step-by-step procedures, examples, and acceptance criteria:

| Skill | Domain |
|:---|---|
| `barrits-testing-patterns` | Deep test patterns: pyramid, PBT, mutation, integration |
| `barrits-security-audit` | Security threat model, gates, supply chain verification |
| `barrits-onboarding` | Prerequisites, setup, architecture, dev workflow |
| `barrits-cross-runtime-validation` | Cross-runtime validation strategy (Node/Deno/Bun) |
| `barrits-package-first-implementation` | Package-first APIs, manifests, adapters, traits |
| `barrits-release-orchestration` | Release governance, versioning, npm + JSR publication |
| `barrits-maintainer-full-cycle` | Full lifecycle: version bump, changelog, build, publish |
| `barrits-contribution-workflow` | External PR intake, CI validation, merge criteria |
| `barrits-incident-troubleshooting` | Debugging incidents, diagnostics, rollback decisions |
| `barrits-jsdoc-authoring` | Bilingual JSDoc conventions, @barrits-* annotations |
| `barrits-package-consumer-onboarding` | Consumer-side integration, API surface, best practices |
