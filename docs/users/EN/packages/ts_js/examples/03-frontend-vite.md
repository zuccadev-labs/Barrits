# 03 Frontend with Vite

These examples illustrate the integration of Barrits into modern reactive UI frameworks using the Vite build pipeline.

## Supported Frameworks

- **React**: Component-based orchestration with typed domains.
- **Vue**: Integration with the Vue composition API.
- **Solid**: High-performance reactive state management.
- **Svelte**: Minimalist and highly optimized UI flows.

## The Vite Plugin Experience

All frontend examples share a common integration pattern:
- The `barritsVitePlugin` is added to `vite.config.ts`.
- The plugin automatically triggers discovery and manifest generation during development.
- The frontend code imports the generated manifest to provide a strongly-typed view of the domain graph.

## Benefits for UI Development

Integrating Barrits into the frontend pipeline allows teams to:
- Sync backend and frontend domain definitions automatically.
- Prevent broken links or missing assets through build-time validation.
- Maintain a consistent architectural boundary throughout the full stack.
