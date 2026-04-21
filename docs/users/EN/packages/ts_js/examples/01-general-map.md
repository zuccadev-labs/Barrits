# 01 General Map of Examples

The integrated examples provide a comprehensive testbed for the Barrits SDK, covering the most common modern development ecosystems.

## Directory Structure

All implementation code for these examples is located in:
`packages/sdk/ts_js/examples/`

## Available Scenarios

| Category | Description | Primary Runtime |
| :--- | :--- | :--- |
| **CLI & Core** | Basic orchestration, file scanning, and manifest generation. | Node.js / Deno |
| **Frameworks** | Reactive UI orchestration with React, Vue, Solid, and Svelte. | Browser (via Vite) |
| **Bundlers** | Specialized plugins for industry-standard build tools. | Node.js |
| **Desktop** | Cross-platform desktop apps with isolated system access. | Tauri |
| **High Performance** | Optimization and fast development cycles. | Bun |

## Validation Policy

Examples are not just documentation; they are **First-Class Validation Surfaces**. Every release of the SDK must pass the build and execution gates for the representative examples within this matrix to ensure zero regressions in the integrator's experience.
