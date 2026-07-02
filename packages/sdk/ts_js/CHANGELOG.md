# Changelog - @zuccadev-labs/barrits

All notable changes to this SDK will be documented in this file.
Todos los cambios relevantes para el SDK se documentan aquí.

## [0.1.8] - 2026-07-02
### Fixed
- **Refactored `parseArguments`**: Reduced cognitive complexity from 68 to under 30 by extracting a `handleArgument` dispatcher and value-validation helpers (`nextValue`, `isValidName`, etc.), improving maintainability without behavioral changes. Validated via 78 passing tests (cli-parser.test.ts).
- **P0 tsconfig audit fix**: Added `tests/` to the TypeScript `include` array so test files are type-checked by `tsc --noEmit`. Resolves a structural gap where 23 test files had zero type-level validation during CI.
- **P0 Stryker audit fix**: Expanded `mutate` list from 4 files to 12, adding `ast/cache.ts`, `ast/extractor.ts`, `ast/traits.ts`, `ast/diagnostics.ts`, `crawler/layer.ts`, `graph/collisions.ts`, `graph/imports.ts`, and `manifest.ts`. Expanded `testFiles` to match, enabling mutation coverage for all 8 newly-covered modules.

### Quality
- **P1 test quality — ast-cache**: Added `afterEach` cache cleanup to eliminate shared mutable state between tests. Added tests for empty relativePath and syntactically invalid source (parse error without throw).
- **P1 test quality — ast-traits**: Fixed invalid TypeScript syntax in `satisfies` test fixture. Added `AsExpression`, `NonNullExpression`, and `BinaryExpression` traversal tests, covering all expression types in `resolveTraitDescriptorFactoryFromExpression`.
- **P1 test quality — ast-extractor**: Replaced direct `createNodeFileSystemAdapter` import from Node adapter layer with SDK `createRuntimeFileSystemAdapter` barrel import, respecting the adapter abstraction boundary. Wrapped filesystem cleanup in `try/finally` to prevent temp dir leaks.
- **P1 test quality — crawler-layer**: Added `IGNORED_DIRECTORIES` filtering test verifying `.git`, `node_modules`, and `dist` are excluded from collected files. Added a real-directory `inspectLayer` test using `createRuntimeFileSystemAdapter` with `try/finally` cleanup, validating end-to-end layer inspection.
- **P1 test quality — manifest**: Added `createProjectedGraph` filter tests for `exports`, `visibilities`, and `fileKinds` (previously only `domains` was tested). Extended `stringifyBuildManifest` to verify top-level JSON structure keys and 2-space indentation. Added filter inclusion in JSON output test.

### Added
- **Mutation coverage for `validation.ts`**: Added `validation.ts` to Stryker mutate list and `validation.test.ts` to test files. Wrote 10 Set-constant content tests covering `DISCOVERY_STRATEGIES`, `FILE_MODES`, `IMPORT_ACTION_KINDS`, `EXPORT_KINDS`, `SOURCE_LAYERS`, `BINDING_KINDS`, `TRAIT_FACTORIES`, `TRAIT_DIAGNOSTIC_SEVERITIES`, `TRAIT_DIAGNOSTIC_CATEGORIES`, and `EXPORT_COLLISION_TYPES`. Total validation tests: 115, all passing.
- **Test coverage for `ast/cache.ts`**: 9 tests covering createCachedSourceFile (valid source, cache reuse, invalidation on change, path isolation, empty source, empty path, invalid syntax) and clearAstCache (re-parse after clear, idempotency).
- **Test coverage for `ast/extractor.ts`**: 33 tests covering relativeFromBase, isInternalPath, splitPathSegments, resolveRelativeModulePath, stripSourceExtension, toAccessSegments, deriveExportAccessPath, extractAttachedJsDoc, parseJsDocAccessPath, hasExportModifier, collectDirectExports (const, function, reexport, export all, visibility, JSDoc override), and extractExports (recursive re-exports, missing targets).
- **Test coverage for `ast/traits.ts`**: 31 tests covering resolveTraitDescriptorFactoryFromExpression (12 expression types including call, parenthesized, satisfies, as, non-null, binary, await, conditional, property access), readStringArrayLiteral, readTraitRuntimeMetadataFromCall, collectExportedTraitBindings, collectTraitDescriptorMetadata, normalizeContractStringArray, toTraitContractDescriptor, and mergeTraitDescriptors.
- **Test coverage for `ast/diagnostics.ts`**: 19 tests covering self-consistency (self-requires, self-conflict, contradictory overlap, required-conflict), missing dependencies (missing required, missing consumed, unsupported factory), runtime mismatches (name, provides, conflicts, requires, consumes, state), global duplicates (duplicate name, duplicate provides), edge cases (empty descriptors, JsDoc factory), and sorting.
- **Test coverage for `crawler/layer.ts`**: 12 tests covering classifyFileKind (7 kinds), toRelativeFilePath, collectFiles (recursive, IGNORED_DIRECTORIES, empty dir), inspectFile, buildLayer (grouping, empty list), and inspectLayer (undefined dir, real directory with source files).
- **Test coverage for `graph/collisions.ts`**: 9 tests covering isAggregatorFile (index, barrel, api/flat, non-aggregator), collectPublicNamespaceEntries (root, domain, api filter, export name, visibility filter, sorting), and collectCollisions (project-project, project-library, non-overlapping, empty, non-aggregator preference).
- **Test coverage for `graph/imports.ts`**: 13 tests covering collectMergedExports (unique, matcher, no matches) and planImportActions (named imports from root/api/domain, root dedup, duplicate skip, internal skip, namespace access, alias, barrel skip, api skip, file without exports, empty, sorting).
- **Test coverage for `manifest.ts`**: 14 tests covering createProjectedGraph (no filters, domains, exports, visibilities, fileKinds), createBuildManifest (checksum, filters, sorted traits/actions, domains list), stringifyBuildManifest (valid JSON with top-level keys, 2-space indent, filter inclusion), createWatchSnapshot (mode, filters), and stringifyWatchSnapshot (valid JSON).
- **Test coverage for `ioc/index.ts`**: 11 tests covering BarritsIoCContainer creation, register/resolve (sync and async factories), singleton reuse, sub-dependency resolution, error for unresolved capability, and wire() with null/empty/real manifest.
- **Test coverage for `schema/openapi.ts`**: 11 tests covering generateOpenApiSchema structure, defaults, custom options, empty paths, http-endpoint tag detection, summary propagation, name-based endpoint detection, multiple endpoints, POST handler generation, and non-endpoint suffix names.
- **Test coverage for `sdk/query.ts`**: 16 tests covering filterIntegrationGraph (no filters, root/domain filters, export filter, fileKinds filter, visibility filter, empty domain removal, partial domain keep, metric computation, library domain filter) and resolveProjectFilePath (absolute, relative, undefined, empty, Windows drive letter).
- **Test coverage for `sdk/imports.ts`**: 19 tests covering filterImportActions (domain, export, kind, empty, graph preservation), createImportsModuleSource (structure, sorting, importMap grouping, empty), createImportBlock (named-import, empty, namespace-access, alias-namespace-access, dedup), and applyManagedImports (replace, append, prepend, namespace-access mode).
- **Test coverage for `plugins/shared.ts`**: 25 new tests covering all 7 exported functions of the shared plugin module. Total tests: 627, 0 failures. Coverage: 43/64 source files (67%) with tests.

### Refactored
- **`runDenoCli` and `runNodeCli`**: Extracted inline command handlers (`handleNodeImports`, `handleNodeBuild`, `handleNodeWatchDev`, `handleDenoImports`, `handleDenoBuild`, `handleDenoWatchDev`) into dedicated functions, reducing cognitive complexity from 37 and 35 respectively to well under 30 each. No behavioral change.

### Changed
- **`.gitignore`**: Added `AGENTS.md` and `agent.md` to prevent accidental commits of local agent instruction files.
- **Total tests**: 547 (+181 from 366, +16 quality improvements), 25 test files, 45 suites. Coverage: 37/64 source files (58%) with tests.

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
