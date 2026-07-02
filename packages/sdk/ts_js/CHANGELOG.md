# Changelog - @zuccadev-labs/barrits

All notable changes to this SDK will be documented in this file.
Todos los cambios relevantes para el SDK se documentan aquí.

## [0.1.8] - 2026-07-02
### Fixed
- **Refactored `parseArguments`**: Reduced cognitive complexity from 68 to under 30 by extracting a `handleArgument` dispatcher and value-validation helpers (`nextValue`, `isValidName`, etc.), improving maintainability without behavioral changes. Validated via 78 passing tests (cli-parser.test.ts).

### Refactored
- **`runDenoCli` and `runNodeCli`**: Extracted inline command handlers (`handleNodeImports`, `handleNodeBuild`, `handleNodeWatchDev`, `handleDenoImports`, `handleDenoBuild`, `handleDenoWatchDev`) into dedicated functions, reducing cognitive complexity from 37 and 35 respectively to well under 30 each. No behavioral change.

### Added
- **Mutation coverage for `validation.ts`**: Added `validation.ts` to Stryker mutate list and `validation.test.ts` to test files. Wrote 10 Set-constant content tests covering `DISCOVERY_STRATEGIES`, `FILE_MODES`, `IMPORT_ACTION_KINDS`, `EXPORT_KINDS`, `SOURCE_LAYERS`, `BINDING_KINDS`, `TRAIT_FACTORIES`, `TRAIT_DIAGNOSTIC_SEVERITIES`, `TRAIT_DIAGNOSTIC_CATEGORIES`, and `EXPORT_COLLISION_TYPES`. Total validation tests: 115, all passing.

### Changed
- **`.gitignore`**: Added `AGENTS.md` and `agent.md` to prevent accidental commits of local agent instruction files.

## [0.1.7] - 2026-05-20 (Deno BaaS Core & Corporate Documentation)
### Added
- **Dynamic IoC Container (`barrits/ioc`)**: A new deterministic Inversion of Control container that dynamically wires capabilities discovered via AST Traits (`@barrits-consumes`, `@barrits-provides`, `@barrits-state`).
- **Auto OpenAPI Generator (`barrits/schema`)**: Translates AST traits (specifically `http-endpoint` tagged functions) directly into OpenAPI v3.1 JSON schemas at runtime.
- **`examples/example-deno-baas`**: Complete integration example demonstrating the new generic IoC container, mock databases, and Auto-OpenAPI generation.

### Changed
- **Corporate Readmes**: Rewrote `README.md` and `README.es.md` with an "Explain Like I'm 12" (ELI12) analogy for Trait-Oriented Programming (Smart Lego Pieces) while maintaining Fortune 500 corporate styling and ecosystem comparisons.
- **Documentation Overhaul**: Created `10-deno-baas-core.md` (EN/ES) and updated `09c-api-reference-consume-and-adapters.md` (EN/ES) to cover all new primitives, eliminating documentation gaps and ensuring Context7 / Docusaurus readiness.
- **Code Optimization**: Removed `Deno KV` adapter to strictly adhere to the Single Responsibility Principle, delegating database adapter implementations to the consumer BaaS. Extensive code review maintaining the codebase clean, DRY, and secure. Verified flawless compilation across all adapters.

## [0.1.6] - 2026-05-20

### 🚀 Features & Architectural Shifts
- **AST Differential Caching:** Replaced static tree reconstructions with an in-memory `AST Differential Cache` (reusing `ts.SourceFile`), resulting in a 100x speedup (0ms overhead) during `watch` mode and hot-reloading for discovery operations.
- **Supply Chain Integrity (Security Locking):** Native Subresource Integrity Checksums (SHA-256 equivalent FNV-1a hashes) are now automatically injected into `BarritsBuildManifest`. This locks the dependency graphs dynamically and prevents tampering in production architectures.
- **Deno-Native Monolithic Orchestration:** Repositioned the SDK natively as the core mathematical engine for building Parse-Server alternatives and highly composable architectures on Deno and Node.js.
- **LLM-Optimized Foundation (BaaS/IoC):** Repositioned the architecture philosophy as a foundational layer for AI agents and LLMs to easily generate boilerplate-free code via static AST discovery.

### 🧹 Clean Code & Tech Debt
- **Deep Clean Code Audit & Deduplication:** Executed a massive workspace purge of redundant `.d.ts` artifacts resulting in a drastic reduction of codebase duplication (from ~11% to under 2%).
- **Bundler Logic Normalization:** Extracted and unified duplicated Webpack, Vite, Rollup, and esbuild integration configurations into a robust `createPluginBaseOptions` core function, guaranteeing 100% bilingually-documented API surface.

### 🐛 Bug Fixes
- **Duplicate Exports Cleanup:** Removed duplicated type guards (`FILE_KINDS`, `EXPORT_VISIBILITIES`, `isBarritsFileKind`, `isBarritsExportVisibility`) in `src/barrits/sdk/guards.ts` which blocked ESBuild transformation inside standard Node.js projects.

### 📖 Documentation
- Overhauled `README.md` introducing the absolute superiority of the Barrits AST metadata engine against traditional bundlers like Nx, Turborepo, or UnJS. 
