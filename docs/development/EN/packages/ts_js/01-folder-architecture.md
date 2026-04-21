# 01 Folder Architecture

The `ts_js` SDK architecture is organized into distinct logical layers to ensure a clean separation between the portable orchestration engine, runtime adapters, and internal utilities.

## Core Structure (`src/`)

- **`barrits/`**: The main orchestration engine.
    - **`api/`**: Public surface definitions (flat, domains, hybrid).
    - **`internal/`**: Specialized internal services (e.g., config and state normalization).
    - **`plugins/`**: Adapters for popular build tools (Vite, esbuild, etc.).
    - **`sdk/`**: AST-layer discovery logic, manifest generation, and crawling.
    - **`traits/`**: Trait descriptor logic and pipeline composition.
- **`barrits_lib/`**: Internal reusable logic and general-purpose algorithms. No orchestration logic should reside here.

## Adapter Layer (`adapters/`)

- **`node/`**: Node.js specific implementations, including the CLI entry point and filesystem interactions.
- **`deno/`**: Deno specific entry points and JSR-native surface management.

## Validation and Examples

- **`tests/`**: Full suite for unit and integration testing.
- **`examples/`**: Real consumption projects categorized by runtime and framework, used to validate the SDK's ergonomics and functionality in production-like scenarios.

## Structural Rules

1.  **Dependency Flow**: `barrits/` may consume `barrits_lib/`, but `barrits_lib/` must never depend on the orchestration core.
2.  **Runtime Isolation**: Native APIs (e.g., `fs`, `path` from Node) must be encapsulated within the `adapters/` or injected into the core through abstraction interfaces.
3.  **Export Integrity**: All public exports are centralized in the root `src/index.ts` or through designated subpaths in `package.json`.
