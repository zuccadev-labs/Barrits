# example-react — Vite + React Frontend Integration

## Purpose

This example demonstrates the package-first integration of the Barrits SDK
within a Vite + React application. It exercises the Vite plugin, virtual
manifest consumption, and operational analytics rendering within a browser
environment.

## Key Files

| File | Description |
|---|---|
| `vite.config.ts` | Vite plugin integration with `defineBarritsPackage` and `barritsVitePlugin` |
| `src/main.jsx` | Manifest consumption and analytics rendering (`orderBy`, `movingAverageSeries`, `maxDrawdown`) |
| `src/barrits/` | Consumer-visible orchestration layer |

## API Functions Demonstrated

| Function | Purpose |
|---|---|
| `defineBarritsPackage` | Declares the consumer identity |
| `toBarritsAutomationOptions` | Adapts configuration for the Vite plugin |
| `barritsVitePlugin` | Integrates the package-first contract with Vite |
| `createBuildManifestSummary` | Summarizes the virtual manifest for the UI |
| `orderBy` | Sorts detected domains within the manifest |
| `movingAverageSeries` | Smooths latency time-series data |
| `maxDrawdown` | Computes the maximum drawdown of a series |

## Architecture Notes

- Bundler integration resides in `vite.config.ts`.
- Analytics and UI rendering reside in `src/main.jsx`.
- The consumer orchestration layer resides in `src/barrits/`.

## Execution

```bash
npm run dev    # Start the development server with the plugin active
npm run build  # Generate the production build with artifact materialization
```

## Reference

For the complete API specification, consult
`docs/users/ES/packages/ts_js/09_referencia-de-api.md`.

For a detailed explanation of how trait discovery, dependency injection, and composition work, consult
`docs/investigations/ES/packages/ts_js/07_estandarizacion-catalogo-algoritmos.md`.
