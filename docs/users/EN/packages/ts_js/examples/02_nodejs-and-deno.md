# 02 Node.js and Deno

I keep these two examples together because they validate real runtimes without depending on a Vite frontend.

## Node.js

I open `packages/sdk/ts_js/examples/example-nodejs/` when I want to validate:

- `npm run dev`
- `npm run build`
- `npm run showcase`
- `npm run benchmark:algorithms`
- `npm run demo:validation`

This example proves three things for me:

- the visible `barrits/` layer is enough for a Node.js consumer
- the package supports local automation and snapshot consumption
- the example algorithms remain usable from real scripts

## Deno

I open `packages/sdk/ts_js/examples/example-deno/` when I want to validate:

- `deno task dev`
- `deno task build`
- `deno task inspect`

This example confirms that the package-first contract does not depend on Node.js and that the Deno-safe surface remains consumable from the runtime itself.