# 02 Operational Flows

This document details the standard technical procedures for building, validating, and monitoring the SDK throughout its lifecycle.

## Build Flow

The build process is managed via the `package.json` scripts and ensures that the source code is transpiled into compatible formats for both Node.js and Deno.

1.  **Standard Build**: Execution of `npm run build` generates the production artifacts in the `dist/` directory.
2.  **Type Certification**: `npm run typecheck` validates the structural integrity of the TypeScript definitions across the entire workspace.

## Validation Cycle (Quality Gates)

No release is certified without completing the following validation sequence:

- **Unit Testing**: Execution of 65+ specialized tests via `npm test`.
- **Integrated Example Verification**: Automated builds of the integrated examples (React, Vue, Solid, Svelte, Deno, Node) to verify implementation parity.
- **JSR Suitability**: `npm run publish:jsr:dry-run` validates that the export surface meets JSR requirements.

## Monitoring and Benchmarking

Performance is monitored using the `benchmarks/` suite, focusing on:
- **Discovery Speed**: Latency of the AST scanner during the initial crawl.
- **Cache Optimization**: Efficiency of the incremental caching system (.0ms overhead on warm runs).

## Continuous Integration (CI)

The GitHub Actions workflows (`ci.yml`, `security.yml`) enforce these flows on every Pull Request toward the `dev` or `main` branches, preventing the ingestion of code that violates the architectural or performance standards.
