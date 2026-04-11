# bundlers

Yo uso esta carpeta cuando quiero revisar la integracion del SDK con bundlers sin el ruido adicional de una app completa. Cada subcarpeta demuestra como el mismo contrato package-first se traduce a una API de build distinta.

## Para que sirve

- valida que Vite, esbuild, Rollup y Webpack reciben la misma intencion funcional
- separa los plugins de bundler del showcase de runtime puro
- deja manifest entries minimos para comprobar el consumo resumido de artifacts

## Que archivos mirar primero

- `vite/vite.config.ts` y `vite/vite-manifest-entry.mjs`
- `esbuild/esbuild.config.mjs` y `esbuild/bundler-manifest-entry.mjs`
- `rollup/rollup.config.mjs` y `rollup/bundler-manifest-entry.mjs`
- `webpack/webpack.config.mjs` y `webpack/webpack-manifest-entry.mjs`

## APIs que esta carpeta usa

- `defineBarritsPackage`: describe el consumidor compartido
- `toBarritsAutomationOptions`: adapta la configuracion al plugin concreto
- `barritsVitePlugin`: integracion con Vite
- `barritsEsbuildPlugin`: integracion con esbuild
- `barritsRollupPlugin`: integracion con Rollup
- `barritsWebpackPlugin`: integracion con Webpack
- `createBuildManifestSummary`: resume el manifest generado por cada recorrido

## Como leerla

Si estoy decidiendo bundler, comparo los cuatro archivos de configuracion lado a lado. La parte realmente estable es el contrato del paquete; lo que cambia es la interfaz del bundler.

Si necesito la semantica detallada de cada plugin o helper, voy a [../../../../../docs/users/ES/packages/ts_js/09_referencia-de-api.md](../../../../../docs/users/ES/packages/ts_js/09_referencia-de-api.md).

## Comandos utiles

- `npm run build:vite`
- `npm run build:esbuild`
- `npm run build:rollup`
- `npm run build:webpack`
- `npm run build:all`
