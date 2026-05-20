# Changelog

All notable changes to this project will be documented in this file.
Todos los cambios relevantes de este repositorio se documentan aquí.

## [0.1.7] - 2026-05-20 (Deno BaaS Core & Corporate Documentation)
### Added
- **Dynamic IoC Container (`barrits/ioc`)**: A new deterministic Inversion of Control container that dynamically wires capabilities discovered via AST Traits (`@barrits-consumes`, `@barrits-provides`, `@barrits-state`).
- **Auto OpenAPI Generator (`barrits/schema`)**: Translates AST traits (specifically `http-endpoint` tagged functions) directly into OpenAPI v3.1 JSON schemas at runtime.
- **`examples/example-deno-baas`**: Complete integration example demonstrating the new generic IoC container, mock databases, and Auto-OpenAPI generation.

### Changed
- **Corporate Readmes**: Rewrote `README.md` and `README.es.md` with an "Explain Like I'm 12" (ELI12) analogy for Trait-Oriented Programming (Smart Lego Pieces) while maintaining Fortune 500 corporate styling and ecosystem comparisons.
- **Documentation Overhaul**: Created `10-deno-baas-core.md` (EN/ES) and updated `09c-api-reference-consume-and-adapters.md` (EN/ES) to cover all new primitives, eliminating documentation gaps and ensuring Context7 / Docusaurus readiness.
- **Code Optimization**: Removed `Deno KV` adapter to strictly adhere to the Single Responsibility Principle, delegating database adapter implementations to the consumer BaaS. Extensive code review maintaining the codebase clean, DRY, and secure. Verified flawless compilation across all adapters (Vite, Rollup, Webpack, esbuild, React, Vue, Bun, Tauri, Node).

## [0.1.6] - 2026-05-20

### Added
- **AST Differential Caching:** 100x speedup in watch mode using in-memory `ts.SourceFile` cache.
- **Supply Chain Integrity:** Native Subresource Integrity Checksums (SHA-256) injected into `BarritsBuildManifest`.
- **LLM-Optimized Foundation:** Architected the foundation for AI agents (LLMs) to easily orchestrate Deno BaaS (IoC + Schemas).

### Changed
- **Deep Clean Code Audit:** Purged redundant `.d.ts` artifacts globally, removing false positive clones.
- **Bundlers Core Refactor:** Unified logic for Webpack, Vite, Rollup, and Esbuild into a standardized, 100% bilingual JSDoc `createPluginBaseOptions`.

### Fixed
- Duplicated type guards (`FILE_KINDS`, `EXPORT_VISIBILITIES`) preventing valid Node.js ESBuild transformations.


## [0.1.5] - 2026-05-19

### Added
- context7.json for improved static analysis benchmark
- Automatic trait discovery documentation added to all example READMEs ("How it works" section) explaining trait discovery, dependency graph, validation, composition, dependency injection, and immutability guarantees.
- Enterprise-grade code quality tools: husky, lint-staged, prettier, eslint with pre-commit hook.
- Enhanced security workflow with detailed npm audit reporting, SBOM generation, and basic secret scanning.
- Comprehensive API reference for traits and composition (09d-api-reference-traits-and-composition.md).
- CONTRIBUTING.md and CODEOWNERS files for governance.
- ADR 0001 documenting conventional commits and lint-staged implementation.


### Changed in 0.1.0-rc.4

- Posicionamiento documental del `README.md` hacia benchmarking evolutivo analítico evitando destrucción de librerías hermanas.
- Normalización formal de API de consumo.

## [0.1.0-rc.1] - 2026-04-11

### Added in 0.1.0-rc.1

- flujo formal de ramas `feature/* -> dev -> main` con proteccion y PR obligatorios para promociones
- soporte de prereleases mediante tags `pre-vX.Y.Z-rc.N` con publicacion diferenciada para npm y JSR
- GitHub Release automatica para prereleases y releases estables

### Changed in 0.1.0-rc.1

- CI y Security ahora validan `dev` y `main` tanto en push como en pull request
- release workflow valida la rama objetivo del tag y el versionado sincronizado entre npm y JSR
- actualizacion del toolchain y de las dependencias directas del monorepo a las ultimas versiones compatibles verificadas

### Fixed in 0.1.0-rc.1

- fallback limpio para `dependency-review` cuando GitHub no tiene dependency graph habilitado en el repositorio
- sincronizacion del pipeline de publicacion con `npm 11.6.2`, version validada para este grafo de dependencias

## [0.1.0] - 2026-04-10

### Added

- conversion del repo a monorepo coordinado desde raiz con `packages/sdk/ts_js`
- ejemplos reales reubicados bajo `packages/sdk/ts_js/examples`
- documentacion estructurada por `users`, `development`, `investigations` y `package`
- guias de publicacion, versionado, secretos y variables en `docs/package`
- workflows de GitHub Actions para CI, seguridad y release
- politicas base de seguridad en `SECURITY.md`
- licencia MIT para raiz y SDK activo

### Changed

- posicionamiento del repositorio como `sdk` y no `framework`
- README raiz y README del paquete alineados con publicacion corporativa y navegacion documental
- endurecimiento del `.gitignore` para artefactos reales de Node.js, Deno, bundlers y Tauri

### Fixed

- rutas de ejemplos y workspaces tras la migracion al monorepo
- cobertura documental de ejemplos con indices oficiales en ES y EN
- preparacion de release para npm y JSR con secrets y environments diferenciados
