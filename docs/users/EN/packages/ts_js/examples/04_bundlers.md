# 04 Bundlers

I use `packages/sdk/ts_js/examples/bundlers/` to validate build integrations without mixing that concern into the Node.js runtime example.

Covered tools:

- Vite
- esbuild
- Rollup
- Webpack

Available commands:

- `npm run build:vite`
- `npm run build:esbuild`
- `npm run build:rollup`
- `npm run build:webpack`
- `npm run build:all`

This folder lets me verify two concrete things:

- `barrits` plugins still auto-generate the manifest where expected
- bundler validation stays separate from the main runtime showcase