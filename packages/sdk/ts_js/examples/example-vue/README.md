# example-vue — Vue.js Frontend Integration

## Purpose

This example validates that the Barrits package-first contract and Vite
plugin integration operate identically in a Vue.js application, confirming
framework-agnostic portability.

## Key Files

| File | Description |
|---|---|
| `vite.config.ts` | Plugin integration with `defineBarritsPackage` and `barritsVitePlugin` |
| `src/App.vue` | Manifest consumption and analytics (`orderBy`, `movingAverageSeries`, `maxDrawdown`) |
| `src/barrits/` | Consumer-visible orchestration layer |

## API Functions Demonstrated

| Function | Purpose |
|---|---|
| `defineBarritsPackage` | Consumer identity declaration |
| `toBarritsAutomationOptions` | Plugin configuration adapter |
| `barritsVitePlugin` | Vite integration |
| `createBuildManifestSummary` | Virtual manifest summarization |
| `orderBy` | Domain ordering |
| `movingAverageSeries` | Time-series smoothing |
| `maxDrawdown` | Maximum drawdown computation |

## Execution

```bash
npm run dev    # Start the Vue development server
npm run build  # Generate the production build
```

## Reference

For the complete API specification, consult
`docs/users/ES/packages/ts_js/09_referencia-de-api.md`.
