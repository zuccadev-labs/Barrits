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

## Why this example does not use `createBarrits()`

Unlike `example-nodejs` or `example-bun`, this example **intentionally avoids**
the runtime namespaced API (`createBarrits().barrits.<domain>.<family>.<member>`)
in the renderer. Two reasons:

1. **Security model.** The renderer is a webview that must never touch the
   filesystem or run trait discovery. All artifact access is mediated by the
   Rust backend, which enforces allowed paths and returns only summarized,
   validated payloads.
2. **No consumer domain.** This project ships no `barrits/` domain folder, so
   there are no `barrits.<domain>.*` members to expose. The engine still
   generates the manifest (via `runtime: "browser"` + `autoManifest`), but it
   is consumed through `@zuccadev-labs/barrits/consume` with an injected
   `readTextFile` — exactly the secure pattern described above.

For the runtime namespaced API demonstration, see `examples/example-nodejs`
and `examples/example-bun`, or `examples/bundlers/scripts/namespaced-demo.ts`.

## Architecture Notes

The security boundary is defined by the Tauri IPC bridge. The backend reads
artifacts from the filesystem using the `@zuccadev-labs/barrits/consume`
subpath, validates them, and returns typed summaries to the renderer. This
pattern prevents direct filesystem exposure in desktop applications.

## Why this example does not use `createBarrits()`

Unlike `example-nodejs` or `example-bun`, this example **intentionally avoids**
the runtime namespaced API (`createBarrits().barrits.<domain>.<family>.<member>`)
in the renderer. Two reasons:

1. **Security model.** The renderer is a webview that must never touch the
   filesystem or run trait discovery. All artifact access is mediated by the
   Rust backend, which enforces allowed paths and returns only summarized,
   validated payloads.
2. **No consumer domain.** This project ships no `barrits/` domain folder, so
   there are no `barrits.<domain>.*` members to expose. The engine still
   generates the manifest (via `runtime: "browser"` + `autoManifest`), but it
   is consumed through `@zuccadev-labs/barrits/consume` with an injected
   `readTextFile` — exactly the secure pattern described above.

For the runtime namespaced API demonstration, see `examples/example-nodejs`
and `examples/example-bun`, or `examples/bundlers/scripts/namespaced-demo.ts`.

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

For a detailed explanation of how trait discovery, dependency injection, and composition work, consult
`docs/investigations/ES/packages/ts_js/07_estandarizacion-catalogo-algoritmos.md`.
