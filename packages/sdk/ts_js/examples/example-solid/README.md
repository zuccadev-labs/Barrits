# example-solid — SolidJS Framework Validation

## Purpose

This example confirms that the Barrits package-first contract and Vite
plugin operate correctly in a SolidJS application without requiring
framework-specific adaptation.

## Key Files

| File | Description |
|---|---|
| `vite.config.ts` | Package-first contract and Vite plugin integration |
| `src/main.tsx` | Manifest consumption with `createBuildManifestSummary` and `sumar` |
| `src/barrits/` | Consumer-visible orchestration layer |

## API Functions Demonstrated

| Function | Purpose |
|---|---|
| `defineBarritsPackage` | Consumer identity declaration |
| `toBarritsAutomationOptions` | Plugin configuration adapter |
| `barritsVitePlugin` | Vite integration |
| `createBuildManifestSummary` | Virtual manifest summarization |
| `sumar` | Arithmetic utility demonstration |

## Design Note

This example intentionally exercises a minimal API surface. Its value lies
in demonstrating that the package-first contract remains stable across
frameworks, not in covering the full algorithm catalogue.

## Execution

```bash
npm run dev    # Start the SolidJS development server
npm run build  # Generate the production build
```

## Reference

For the complete API specification, consult
`docs/users/ES/packages/ts_js/09_referencia-de-api.md`.
