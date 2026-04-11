# 02 Flujos operativos de ts_js

Yo mantengo `barrits` como paquete con motor integrado de automatizacion. Eso significa que no pienso el producto solo como una libreria de imports ni solo como una CLI.

## Flujo de discovery

Yo uso el core para localizar la carpeta `barrits/` del proyecto consumidor y construir un grafo actual de dominios, archivos y exports.

Mi flujo base es este:

1. yo detecto el runtime y el directorio de trabajo
2. yo localizo la carpeta visible `barrits/` del consumidor
3. yo inspecciono dominios, barrels, exports y traits
4. yo proyecto esa informacion a manifests, snapshots o salidas de tooling

## Flujo de build

Cuando yo ejecuto build, mi expectativa es esta:

1. yo compilo el SDK desde `packages/sdk/ts_js`
2. yo genero `dist/` solo para el paquete publicable
3. yo dejo que los ejemplos consuman el paquete ya resuelto desde el workspace
4. yo valido que manifests y helpers de consumo sigan consistentes

## Flujo de watch y dev

Yo no trato el watch como daemon del sistema. Yo lo ato a una sesion viva de desarrollo.

Mi regla es esta:

- yo no inicio watchers al instalar el paquete
- yo inicio watch cuando una sesion `dev` realmente lo necesita
- yo cierro watch cuando termina la sesion de trabajo

## Flujo de consumo

Yo mantengo tres superficies de consumo complementarias:

- imports del paquete raiz para funciones y namespaces
- subpaths puros para plugins, adapters y helpers de consumo
- comandos como fallback operativo y diagnostico

## Flujo de ejemplos

Yo uso `packages/sdk/ts_js/examples/` como banco de integracion real. Cada ejemplo me sirve para una experiencia distinta:

- Node.js para scripts, build y consumo local
- Deno para runtime alternativo y publicacion JSR
- React, Vue, Solid y Svelte para package-first con Vite
- Tauri para lectura segura de manifests y snapshots desde backend
- bundlers para integraciones tecnicas separadas