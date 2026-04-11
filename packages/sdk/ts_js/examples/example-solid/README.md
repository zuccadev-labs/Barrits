# example-solid

Yo uso este ejemplo para comprobar que el contrato package-first y el plugin de Vite siguen siendo validos en Solid sin depender del ecosistema React o Vue.

## Para que sirve

- valida compatibilidad de la integracion con otro framework Vite
- mantiene el mismo modelo de consumidor visible en `src/barrits/`
- usa una muestra pequena de APIs del paquete para que la lectura sea rapida

## Que archivos mirar primero

- `vite.config.ts`: contrato package-first y plugin Vite
- `src/main.tsx`: consumo de `createBuildManifestSummary` y `sumar`
- `src/barrits/`: capa visible del consumidor

## APIs que este ejemplo usa

- `defineBarritsPackage`
- `toBarritsAutomationOptions`
- `barritsVitePlugin`
- `createBuildManifestSummary`
- `sumar`

## Como leerlo

Este ejemplo no intenta cubrir toda la API. Su valor esta en demostrar que el mismo contrato funciona en otro framework y que tambien puedo mezclar una utilidad funcional simple como `sumar` dentro de la UI.

Para la descripcion completa de las funciones, voy a [../../../../../docs/users/ES/packages/ts_js/09_referencia-de-api.md](../../../../../docs/users/ES/packages/ts_js/09_referencia-de-api.md).

## Comandos utiles

- `npm run dev`
- `npm run build`
