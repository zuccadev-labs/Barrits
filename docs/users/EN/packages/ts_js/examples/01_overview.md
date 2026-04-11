# 01 Examples overview

I organize `packages/sdk/ts_js/examples/` by consumption experience, not by internal engine detail.

Current map:

- `example-nodejs/`: operational showcase, local scripts, and package consumption from Node.js.
- `example-deno/`: Deno consumption with `deno task` and the Deno adapter.
- `example-react/`: Vite + React frontend using `barrits/vite`.
- `example-vue/`: Vite + Vue frontend using the same package-first contract.
- `example-solid/`: Vite + Solid frontend with discovery over `src/barrits/`.
- `example-svelte/`: Vite + Svelte frontend with the same visible pattern.
- `example-tauri/`: Vite frontend + Tauri backend for secure artifact reads.
- `bundlers/`: dedicated validation for Vite, esbuild, Rollup, and Webpack.

What this matrix validates:

- pure Node.js and Deno runtimes
- package-first frontend with the Vite plugin
- visible consumption through `barrits/` or `src/barrits/`
- secure manifest and snapshot reads from a controlled backend
- bundler plugins without polluting the main runtime examples