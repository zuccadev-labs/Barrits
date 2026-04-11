# example-react

Yo uso este ejemplo como caso base del flujo package-first en frontend. Si necesito explicar `barrits` a un equipo web sin meter mas complejidad de la necesaria, esta es la demo correcta.

## Para que sirve

- demuestra como conectar `defineBarritsPackage()` con Vite sin duplicar configuracion
- muestra como consumir un manifest virtual dentro de la UI
- mezcla integracion de tooling con algoritmos reales del paquete en el mismo archivo de entrada

## Que archivos mirar primero

- `vite.config.ts`: integracion de `defineBarritsPackage`, `toBarritsAutomationOptions` y `barritsVitePlugin`
- `src/main.jsx`: consumo del manifest y uso de `orderBy`, `movingAverageSeries` y `maxDrawdown`
- `src/barrits/`: capa visible del consumidor React

## APIs que este ejemplo usa

- `defineBarritsPackage`: define el consumidor
- `toBarritsAutomationOptions`: adapta la configuracion al plugin
- `barritsVitePlugin`: integra el contrato package-first con Vite
- `createBuildManifestSummary`: resume el manifest virtual para la UI
- `orderBy`: ordena dominios detectados en el manifest
- `movingAverageSeries`: suaviza la serie de latencia
- `maxDrawdown`: calcula la mayor caida de la serie

## Donde se usa cada API

- la integracion de bundler vive en `vite.config.ts`
- la parte de analitica y UI vive en `src/main.jsx`
- la capa del consumidor vive en `src/barrits/`

Si necesito la semantica detallada de cualquier funcion, voy a [../../../../../docs/users/ES/packages/ts_js/09_referencia-de-api.md](../../../../../docs/users/ES/packages/ts_js/09_referencia-de-api.md).

## Comandos utiles

- `npm run dev`: arranca la app con el plugin activo
- `npm run build`: genera el build y materializa el recorrido de artifacts del ejemplo
