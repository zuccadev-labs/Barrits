# 04 Bundler Integrations

While Vite is the primary recommendation for web projects, Barrits provides dedicated support for other major bundlers in the JavaScript ecosystem.

## Supported Plugins

- **esbuild**: High-speed bundling with a specialized discovery plugin.
- **Rollup**: Native plugin support for library authors and complex build pipelines.
- **Webpack**: Full integration for legacy and enterprise-scale projects.

## Common Plugin Pattern

All bundler plugins follow the same declarative configuration:

```ts
// One subpath per tool: /vite, /esbuild, /rollup, /webpack
import { barritsVitePlugin } from "@zuccadev-labs/barrits/vite";
// import { barritsEsbuildPlugin } from "@zuccadev-labs/barrits/esbuild";
// import { barritsRollupPlugin } from "@zuccadev-labs/barrits/rollup";
// import { barritsWebpackPlugin } from "@zuccadev-labs/barrits/webpack";

// Configuration is consistent across all tools
export default {
  plugins: [
    barritsVitePlugin({ /* automation options */ })
  ]
};
```

This ensuring that migrations between build tools are transparent to the core orchestration logic.
