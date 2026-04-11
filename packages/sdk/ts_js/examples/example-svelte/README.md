# example-svelte

Yo uso este ejemplo cuando quiero cerrar la validacion del flujo package-first sobre Svelte sin cambiar el contrato del paquete.

## Para que sirve

- confirma que la integracion package-first sigue estable en otro framework Vite
- muestra que puedo mezclar manifests y utilidades funcionales dentro de la misma UI
- mantiene `src/barrits/` como frontera visible del consumidor

## Que archivos mirar primero

- `vite.config.ts`: integracion del plugin con la definicion del paquete
- `src/App.svelte`: uso de `createBuildManifestSummary`, `movingAverageSeries` y `sumar`
- `src/barrits/`: capa visible del consumidor

## APIs que este ejemplo usa

- `defineBarritsPackage`
- `toBarritsAutomationOptions`
- `barritsVitePlugin`
- `createBuildManifestSummary`
- `movingAverageSeries`
- `sumar`

## Como leerlo

Si ya revise React o Vue, este ejemplo sirve para comprobar que el contrato del plugin se mantiene mientras cambia solo la capa UI.

Si necesito la semantica de cada funcion, voy a [../../../../../docs/users/ES/packages/ts_js/09_referencia-de-api.md](../../../../../docs/users/ES/packages/ts_js/09_referencia-de-api.md).

## Comandos utiles

- `npm run dev`
- `npm run build`
