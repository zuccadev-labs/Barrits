# examples

Yo uso este `README` como mapa rapido de la carpeta. La documentacion oficial detallada vive en:

- [../../../../docs/users/ES/packages/ts_js/examples/00_indice.md](../../../../docs/users/ES/packages/ts_js/examples/00_indice.md)
- [../../../../docs/users/ES/packages/ts_js/09_referencia-de-api.md](../../../../docs/users/ES/packages/ts_js/09_referencia-de-api.md)

## Que cubre esta carpeta

- `example-nodejs/`: showcase operativo, scripts, benchmark y familias completas de algoritmos.
- `example-deno/`: consumo desde Deno y JSR con `deno task`.
- `example-bun/`: consumo desde Bun con scripts package-first y helper de rutas.
- `example-react/`: caso base package-first con Vite + React.
- `example-vue/`: mismo contrato package-first en Vue con discovery bajo `src/barrits/`.
- `example-solid/`: validacion del mismo contrato en Solid.
- `example-svelte/`: validacion equivalente en Svelte.
- `example-tauri/`: consumo seguro de artifacts desde backend Tauri hacia UI.
- `bundlers/`: integraciones directas de Vite, esbuild, Rollup y Webpack sin app de ejemplo completa.

## Como leerla sin perder tiempo

1. Yo elijo el runtime o bundler que quiero validar.
2. Leo el README local de esa demo para entender que problema resuelve y que archivos mirar.
3. Si necesito la semantica exacta de una funcion, vuelvo a la referencia central de API.

## Regla arquitectonica

- los consumidores muestran `barrits/` o `src/barrits/` como capa visible
- cada ejemplo incluye `barrits.config.ts` para defaults de runtime/watch y contratos low-config
- cada demo explica el recorrido local, no reescribe toda la API del paquete
- la referencia completa de metodos vive en `docs/users/ES/packages/ts_js/09_referencia-de-api.md`
