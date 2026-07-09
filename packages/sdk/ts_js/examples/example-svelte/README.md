# example-svelte — Svelte Framework Validation

## Purpose

This example validates the Barrits package-first contract and Vite plugin
within a Svelte application, completing the cross-framework compatibility
matrix alongside React, Vue, and SolidJS.

## Key Files

| File | Description |
|---|---|
| `vite.config.ts` | Plugin integration with package definition |
| `src/App.svelte` | Manifest consumption with `movingAverageSeries` and `sumar` |
| `src/barrits/` | Consumer-visible orchestration layer |

## API Functions Demonstrated

| Function | Purpose |
|---|---|
| `defineBarritsPackage` | Consumer identity declaration |
| `toBarritsAutomationOptions` | Plugin configuration adapter |
| `barritsVitePlugin` | Vite integration |
| `createBuildManifestSummary` | Virtual manifest summarization |
| `movingAverageSeries` | Time-series smoothing |
| `sumar` | Arithmetic utility demonstration |

## Design Note

The Vite plugin contract is identical across all framework examples. Only
the UI consumption layer changes (`.svelte` vs `.jsx` vs `.vue`), which
demonstrates that the orchestration boundary is framework-agnostic.

## Execution

```bash
npm run dev    # Start the Svelte development server
npm run build  # Generate the production build
```

## Reference

For the complete API specification, consult
`docs/users/ES/packages/ts_js/09_referencia-de-api.md`.

For a detailed explanation of how trait discovery, dependency injection, and composition work, consult
`docs/investigations/ES/packages/ts_js/07_estandarizacion-catalogo-algoritmos.md`.
