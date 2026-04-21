# 04 Bundler Integrations

While Vite is the primary recommendation for web projects, Barrits provides dedicated support for other major bundlers in the JavaScript ecosystem.

## Supported Plugins

- **esbuild**: High-speed bundling with a specialized discovery plugin.
- **Rollup**: Native plugin support for library authors and complex build pipelines.
- **Webpack**: Full integration for legacy and enterprise-scale projects.

## Common Plugin Pattern

All bundler plugins follow the same declarative configuration:

```ts
import { barritsPlugin } from "@zuccadev-labs/barrits/bundler";

// Configuration is consistent across all tools
export default {
  plugins: [
    barritsPlugin({ /* automation options */ })
  ]
};
```

This ensuring that migrations between build tools are transparent to the core orchestration logic.
