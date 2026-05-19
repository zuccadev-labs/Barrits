# example-tauri — Secure Desktop Consumption

## Purpose

This example demonstrates a secure consumption pattern for Tauri desktop
applications. The renderer process never accesses the filesystem directly;
all artifact reads are mediated by the Tauri backend, which controls
permitted paths and returns only summarized payloads to the UI.

## Key Files

| File | Description |
|---|---|
| `src/main.ts` | UI layer that invokes backend commands and renders summaries |
| `src-tauri/src/main.rs` | Rust backend that controls filesystem access |
| `src/barrits/` | Consumer-visible orchestration layer |

## API Functions Demonstrated

| Function | Purpose |
|---|---|
| `readBuildManifestSummary` | Reads and summarizes the manifest without exposing the raw file to the renderer |
| `readLanguageToolSnapshot` | Reads the language tool snapshot through controlled backend access |

## Type Contracts

| Type | Purpose |
|---|---|
| `BarritsConsumedStateSummary` | Types the manifest summary payload delivered to the UI |
| `BarritsLanguageToolSnapshot` | Types the language tool snapshot payload |

## Architecture Notes

The security boundary is defined by the Tauri IPC bridge. The backend reads
artifacts from the filesystem using the `@zuccadev-labs/barrits/consume`
subpath, validates them, and returns typed summaries to the renderer. This
pattern prevents direct filesystem exposure in desktop applications.

## Execution

```bash
npm run dev         # Start the web development server
npm run build       # Generate the web production build
npm run tauri:dev   # Launch the desktop application in development mode
npm run tauri:build # Generate the desktop production build
```

## Reference

For the complete API specification, consult
`docs/users/ES/packages/ts_js/09_referencia-de-api.md`.
## How it works

Barrits discovers traits automatically by scanning the consumer project for exported functions and JSDoc annotations. The flow is:

1. **Trait Discovery**: Barrits walks the source tree (by default src/) and collects all exported functions, classes, and constants that are marked with @barrits-trait JSDoc tags or reside in a 	raits/ folder.

2. **Dependency Graph**: For each discovered trait, Barrits analyzes its provides, consumes, and state fields to build a directed graph.

3. **Validation**: The graph is checked for missing capabilities, circular dependencies, and conflicting state ownership.

4. **Composition**: Traits are composed in dependency order, producing a final set of capabilities that are made available to the runtime adapters.

5. **Dependency Injection**: When the application starts, Barrits creates a lightweight DI container that injects the required consumes into each trait's initializer, ensuring that each trait receives only the dependencies it declared.

6. **Immutability & Safety**: All provided capabilities are frozen (Object.freeze) to prevent accidental mutation, and state is encapsulated within each trait's closure.

This automatic discovery reduces boilerplate and guarantees that the runtime contract matches the source-of-truth definitions.
