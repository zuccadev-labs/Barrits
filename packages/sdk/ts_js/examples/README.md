# Barrits SDK — Examples

## Overview

This directory contains executable reference implementations demonstrating
the integration of the Barrits SDK across multiple runtimes, frameworks,
and build systems. Each example is a self-contained project that can be
executed independently.

## Directory Structure

| Directory | Description |
|---|---|
| `example-deno/` | Deno-native service demonstrating contract discovery, trait composition, manifest integrity verification, and resilience patterns. |
| `example-nodejs/` | Node.js service showcasing operational algorithms, build manifest consumption, and cross-domain import orchestration. |
| `example-bun/` | Bun runtime consumption with package-first configuration. |
| `example-react/` | Vite + React integration with package-first discovery under `src/barrits/`. |
| `example-vue/` | Vue.js integration with domain-scoped discovery. |
| `example-solid/` | SolidJS validation of the package-first contract. |
| `example-svelte/` | Svelte validation of the equivalent contract. |
| `example-tauri/` | Tauri desktop application consuming Barrits artifacts from a Rust backend. |
| `bundlers/` | Direct integration examples for Vite, esbuild, Rollup, and Webpack. |

## Usage Guidelines

1. Select the runtime or framework that matches the target deployment environment.
2. Read the `README.md` within each example directory for setup instructions and
   the specific problem that the example resolves.
3. For the complete API reference, consult the documentation at
   `docs/users/ES/packages/ts_js/09_referencia-de-api.md`.

## Architectural Constraints

- All consumer examples expose `barrits/` or `src/barrits/` as the visible
  orchestration layer.
- Each example includes a `barrits.config.ts` file that declares runtime
  defaults, watch policy, and contract-level overrides.
- Examples demonstrate specific integration patterns without duplicating
  the full API surface documentation.
- The complete method reference is maintained separately in the official
  documentation directory.
