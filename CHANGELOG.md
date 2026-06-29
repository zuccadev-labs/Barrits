# Changelog

All notable changes to this project will be documented in this file.
Todos los cambios relevantes de este repositorio se documentan aquí.

## [0.1.8] - 2026-06-29
### Fixed
- **False SHA-256 Checksum**: Replaced FNV-1a non-cryptographic hash (labeled `sha256-`) with real SHA-256 via Web Crypto API (`crypto.subtle.digest`). The old implementation used FNV-1a (32-bit, non-cryptographic) but misleadingly prefixed the output as `sha256-barrits-`, creating a false security guarantee. Now uses real SHA-256 digest for supply chain integrity.

### Changed
- **Async API**: `createBuildManifest`, `stringifyBuildManifest`, and internal `generateChecksum` now return `Promise` values to support async Web Crypto API.

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
- **Supply Chain Integrity:** Non-cryptographic FNV-1a hash (mislabeled as `sha256-`) injected into `BarritsBuildManifest` for change detection. **Note:** This was later corrected to real SHA-256 in v0.1.8.
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

## [0.1.2] - 2026-04-20

### Added
- **Industrialización de Lógica Core**: Delegación de la normalización de configuración a servicios internos (`config_normalization.ts`) bajo SRP.
- **Mesh Documental Enterprise**: Unificación bilingüe (ES/EN) en todos los dominios (`users`, `development`, `investigations`, `package`).
- **Certificación de Tono Corporativo**: Cumplimiento del 100% en tono formal de tercera persona en toda la suite documental.
- **Esquema de Configuración Experto**: Adición de referencia completa de propiedades y recomendaciones arquitectónicas para `barrits.config.ts`.
- **Patrones de Integración Avanzada**: Documentación de estrategias de aislamiento en Monorepos, Inyección de Dependencias y gobernanza de CI/CD.
- **Seguridad e Integridad**: Corrección de `ignoreDeprecations` en `tsconfig.json` y aseguramiento de estructuras de manifiesto preparadas para checksums.

## [0.1.1] - 2026-04-20

### Added

- Aprobación al 100% de la versión Release. Evolución estable desde la ruta de pre-releases (rc.4), implementando Orquestación, Clean Code y SRP.

## [0.1.0-rc.4] - 2026-04-20

### Added in 0.1.0-rc.4

- **AST Incremental Caching a 0ms**: Eliminación absoluta del cuello de botella en recolección de metadatos para proyectos en watch/build modes.
- **Desacoplamiento SRP Estricto**: División del monolito `inspect.ts` en dominios ultra-especializados (`ast/cache`, `ast/extractor`, `ast/traits`, `graph/collisions`).
- **Data Contract Checksums**: Integración de sellos de seguridad hash transaccionales en `BuildManifest` para repeler degeneración estructural del código.
- **Auditoría Multi-Lenguaje**: Preparación de librerías utilitarias internas (como lógica y matemáticas) mantenibles bajo un patrón *Core vs Lib*, sirviendo como fundamentos extensibles para nuevos lenguajes y constructos.

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
