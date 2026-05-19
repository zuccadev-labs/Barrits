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
## How it works

Barrits discovers traits automatically by scanning the consumer project for exported functions and JSDoc annotations. The flow is:

1. **Trait Discovery**: Barrits walks the source tree (by default src/) and collects all exported functions, classes, and constants that are marked with @barrits-trait JSDoc tags or reside in a 	raits/ folder.

2. **Dependency Graph**: For each discovered trait, Barrits analyzes its provides, consumes, and state fields to build a directed graph.

3. **Validation**: The graph is checked for missing capabilities, circular dependencies, and conflicting state ownership.

4. **Composition**: Traits are composed in dependency order, producing a final set of capabilities that are made available to the runtime adapters.

5. **Dependency Injection**: When the application starts, Barrits creates a lightweight DI container that injects the required consumes into each trait's initializer, ensuring that each trait receives only the dependencies it declared.

6. **Immutability & Safety**: All provided capabilities are frozen (Object.freeze) to prevent accidental mutation, and state is encapsulated within each trait's closure.

This automatic discovery reduces boilerplate and guarantees that the runtime contract matches the source-of-truth definitions.
