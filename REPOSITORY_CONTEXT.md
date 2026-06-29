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

## Skills (.opencode/skills/)

- `testing-patterns` — Test conventions and write patterns
- `security-audit` — Security audit workflow and checklists
- `onboarding` — Developer setup and project structure guide
- `development-workflow` — Commit, branch, and PR conventions
- `architecture-decision-records` — ADR creation and management
- `automation-showcase` — Feature demonstrations
- `emergency-release` — Hotfix and security patch process
- `integration-points` — Build tool integration (Vite, esbuild, Rollup, Webpack)
- `llm-protocols` — AI agent protocols and documentation standards
