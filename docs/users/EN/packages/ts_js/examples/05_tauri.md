# 05 Tauri

I use `packages/sdk/ts_js/examples/example-tauri/` when I need to demonstrate secure manifest and snapshot consumption from a desktop application.

Example goal:

- keep artifact reads out of the renderer
- validate allowed paths in the Tauri backend
- reuse `@zuccadev-labs/barrits/consume` to summarize manifests and snapshots
- deliver UI-safe payloads to the frontend

Available commands:

- `npm run dev`
- `npm run build`
- `npm run tauri:dev`
- `npm run tauri:build`

Documented flow:

1. the frontend asks the Tauri backend for a manifest or snapshot
2. the backend validates the allowed path
3. the backend reads the file and uses summarized readers from the package
4. the renderer only receives controlled data, not arbitrary filesystem access