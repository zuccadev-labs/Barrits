# Manifests, Bundlers, and Consumption

Barrits uses manifests and snapshots as first-class contracts between the discovery engine and external tooling. This eliminates the need to reimplement discovery inside every bundler or backend integration.

## The `@zuccadev-labs/barrits/consume` Subpath

This subpath provides runtime-agnostic manifest and snapshot reading without importing plugin code or unnecessary runtime dependencies.

Available functions:

- `parseBuildManifest()` — validates and parses raw manifest data
- `parseWatchSnapshot()` — validates and parses raw snapshot data
- `readBuildManifestSummary(path, readTextFile)` — reads and summarizes a manifest
- `readWatchSnapshotSummary(path, readTextFile)` — reads and summarizes a snapshot
- `readLanguageToolSnapshot(path, readTextFile)` — reads a language tooling snapshot

When filesystem access needs to be delegated (e.g., to Tauri's backend or a serverless reader), pass an injectable `readTextFile(path)` function. The consume subpath handles structural validation of the returned payload.

## Build and Watch Output

- `build` writes `<automationDirectory>/build-manifest.json`
- `watch` and `dev` write `<automationDirectory>/watch-snapshot.json`
- The child process receives `BARRITS_BUILD_MANIFEST` or `BARRITS_WATCH_SNAPSHOT` environment variables where applicable

When `traitDiagnostics` are present in the manifest, pre-aggregated data is available for tooling and analytics without manual reconstruction.

## Bundler Integration

Available subpaths and matching examples:

| Import path | Example |
| :--- | :--- |
| `@zuccadev-labs/barrits/vite` | `examples/bundlers/vite/` |
| `@zuccadev-labs/barrits/esbuild` | `examples/bundlers/esbuild/` |
| `@zuccadev-labs/barrits/rollup` | `examples/bundlers/rollup/` |
| `@zuccadev-labs/barrits/webpack` | `examples/bundlers/webpack/` |

**Design rule**: Barrits generates discovery and the manifest; the bundler only consumes that contract through a small adapter.

In Webpack, materializing an intermediate module and aliasing it is preferred over relying on a virtual module ID with `:` that the runtime might interpret as a URL scheme before resolving aliases.

## Choosing the Right Example

| Scenario | Example |
| :--- | :--- |
| Vite, esbuild, Rollup, Webpack | `packages/sdk/ts_js/examples/bundlers/` |
| Secure manifest reading from a desktop backend | `packages/sdk/ts_js/examples/example-tauri/` |
| Local manifest and snapshot consumption in Node | `packages/sdk/ts_js/examples/example-nodejs/` |

## Validating the JSR Surface

When touching the Deno surface or ESM publication, run:

```bash
npm run publish:jsr:dry-run
```

This validates that the publication from `jsr.json` is clean and that the exported surface for Deno does not carry new issues.

---

[← Commands and Runtimes](06-commands-and-runtimes.md) | [Traits and Composition →](08-traits-and-composition.md)
