# example-vue

Yo uso este ejemplo cuando quiero mostrar el mismo contrato package-first de React, pero sobre Vue y con discovery visible bajo `src/barrits/`.

## Para que sirve

- prueba que la integracion no depende de React
- muestra el mismo flujo de Vite con una estructura de consumidor distinta
- reutiliza el manifest virtual y analitica de UI sobre Vue

## Que archivos mirar primero

- `vite.config.ts`: integracion con `defineBarritsPackage`, `toBarritsAutomationOptions` y `barritsVitePlugin`
- `src/App.vue`: consumo de `createBuildManifestSummary`, `orderBy`, `movingAverageSeries` y `maxDrawdown`
- `src/barrits/`: capa visible del consumidor

## APIs que este ejemplo usa

- `defineBarritsPackage`
- `toBarritsAutomationOptions`
- `barritsVitePlugin`
- `createBuildManifestSummary`
- `orderBy`
- `movingAverageSeries`
- `maxDrawdown`

## Como leerlo

Si yo vengo del caso React, aca comparo dos cosas: el plugin casi no cambia y la capa `src/barrits/` sigue siendo la frontera visible del consumidor.

Si necesito la descripcion completa de esas funciones, vuelvo a [../../../../../docs/users/ES/packages/ts_js/09_referencia-de-api.md](../../../../../docs/users/ES/packages/ts_js/09_referencia-de-api.md).

## Comandos utiles

- `npm run dev`
- `npm run build`
