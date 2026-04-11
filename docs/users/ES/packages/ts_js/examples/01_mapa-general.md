# 01 Mapa general de ejemplos

Yo organizo `packages/sdk/ts_js/examples/` por experiencia de consumo, no por detalle interno del motor.

Mapa actual:

- `example-nodejs/`: showcase operativo, scripts locales y consumo del paquete desde Node.js.
- `example-deno/`: consumo desde Deno con tareas `deno task` y adapter Deno.
- `example-react/`: frontend Vite + React usando `barrits/vite`.
- `example-vue/`: frontend Vite + Vue usando el mismo contrato package-first.
- `example-solid/`: frontend Vite + Solid con discovery sobre `src/barrits/`.
- `example-svelte/`: frontend Vite + Svelte con el mismo patron visible.
- `example-tauri/`: frontend Vite + backend Tauri para lectura segura de artifacts.
- `bundlers/`: validacion tecnica separada para Vite, esbuild, Rollup y Webpack.

Lo que yo valido con esta malla:

- runtimes puros de Node.js y Deno
- frontend package-first con plugin Vite
- consumo visible desde `barrits/` o `src/barrits/`
- lectura segura de manifests y snapshots desde backend controlado
- plugins de bundlers sin contaminar el ejemplo runtime principal

Reglas arquitectonicas que sigo:

- el consumidor expone `barrits/` o `src/barrits/` como capa visible
- `barrits_lib` sigue siendo una decision interna del paquete, no del ejemplo consumidor
- los README locales sirven como entrada rapida, pero la cobertura oficial vive en `docs/users/ES/packages/ts_js/examples/`