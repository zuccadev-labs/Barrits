# 03 Frontend Vite

I treat `example-react/`, `example-vue/`, `example-solid/`, and `example-svelte/` as one documentation family because all of them validate the package-first contract on top of Vite.

Shared goal:

- install `@zuccadev-labs/barrits`
- define the consumer package with `defineBarritsPackage()`
- use `@zuccadev-labs/barrits/vite`
- let the virtual manifest be generated automatically instead of running manual engine commands

Useful differences:

- `example-react/`: the most direct frontend baseline.
- `example-vue/`: the same contract, while proving discovery under `src/barrits/`.
- `example-solid/`: the same visible pattern on Solid.
- `example-svelte/`: the same visible pattern on Svelte.

Base commands:

- `npm run dev`
- `npm run build`