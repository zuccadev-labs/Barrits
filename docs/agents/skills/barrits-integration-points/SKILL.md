---
name: barrits-integration-points
description: Integration with build tools: Vite, esbuild, Rollup, Webpack bundler plugins and package-first configuration. Use when configuring bundler plugins or setting up package-first automation in a consumer project.
---

# Barrits Integration Points

## When To Use

Apply this skill when integrating the Barrits SDK with build tools or configuring automation in consumer projects:

- **Add bundler plugin**: Wire up Vite, esbuild, Rollup, or Webpack plugins
- **Configure package-first mode**: Set up auto-discovery with `barrits.config.mjs`
- **Verify plugin output**: Confirm automation artifacts are generated correctly

## Bundler Plugins

All bundler plugins accept the same configuration options:

```typescript
interface BarritsPluginOptions {
  automationDirectory?: string; // Default: '.barrits'
  manifestPath?: string;        // Default: '.barrits/manifest.json'
}
```

### Vite

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { barritsVitePlugin } from '@zuccadev-labs/barrits/vite';

export default defineConfig({
  plugins: [
    barritsVitePlugin({
      automationDirectory: '.barrits',
    }),
  ],
});
```

### esbuild

```typescript
// esbuild.config.mjs
import { barritsEsbuildPlugin } from '@zuccadev-labs/barrits/esbuild';
import * as esbuild from 'esbuild';

await esbuild.build({
  plugins: [barritsEsbuildPlugin()],
});
```

### Rollup

```javascript
// rollup.config.mjs
import { barritsRollupPlugin } from '@zuccadev-labs/barrits/rollup';

export default {
  plugins: [barritsRollupPlugin()],
};
```

### Webpack

```javascript
// webpack.config.js
const { BarritsWebpackPlugin } = require('@zuccadev-labs/barrits/webpack');

module.exports = {
  plugins: [new BarritsWebpackPlugin()],
};
```

## Package-First Automation

Configure auto-discovery mode in consumer projects:

1. Create `barrits.config.mjs` at project root:
   ```javascript
   import { defineBarritsConfig } from '@zuccadev-labs/barrits';

   export default defineBarritsConfig({
     runtime: '<node|deno|bun|react|vue|solid|svelte>',
     autoManifest: true,
     automationDirectory: '.cache/barrits',
     discoveryRoots: ['src'],
   });
   ```

2. Add `@barrits-trait` and `@barrits-provides` JSDoc annotations to source files

3. Run the detection pipeline:
   ```bash
   npx barrits detect
   npx barrits build
   ```

4. The bundler plugins auto-discover and serve generated manifests

## Verification

After integration:

1. Check the `automationDirectory` (`.barrits/` or `.cache/barrits/`) exists
2. Verify `manifest.json` has valid JSON with a `checksum` field
3. Confirm virtual imports (`virtual:barrits` or similar) resolve correctly
4. Check that HMR works with the plugin enabled (Vite only)
5. Confirm no filesystem errors in the build output

## References

- Reference configurations: `packages/sdk/ts_js/examples/bundlers/`
- Plugin source: `packages/sdk/ts_js/src/barrits/plugins/`
- `.opencode/skills/integration-points/skill.jsonc`
