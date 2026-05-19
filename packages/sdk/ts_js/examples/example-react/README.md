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
## How it works

Barrits discovers traits automatically by scanning the consumer project for exported functions and JSDoc annotations. The flow is:

1. **Trait Discovery**: Barrits walks the source tree (by default src/) and collects all exported functions, classes, and constants that are marked with @barrits-trait JSDoc tags or reside in a 	raits/ folder.

2. **Dependency Graph**: For each discovered trait, Barrits analyzes its provides, consumes, and state fields to build a directed graph.

3. **Validation**: The graph is checked for missing capabilities, circular dependencies, and conflicting state ownership.

4. **Composition**: Traits are composed in dependency order, producing a final set of capabilities that are made available to the runtime adapters.

5. **Dependency Injection**: When the application starts, Barrits creates a lightweight DI container that injects the required consumes into each trait's initializer, ensuring that each trait receives only the dependencies it declared.

6. **Immutability & Safety**: All provided capabilities are frozen (Object.freeze) to prevent accidental mutation, and state is encapsulated within each trait's closure.

This automatic discovery reduces boilerplate and guarantees that the runtime contract matches the source-of-truth definitions.
