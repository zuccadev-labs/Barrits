# 06 Tooling, publicacion y plataformas de ts_js

Yo mantengo dos superficies de distribucion y varias integraciones de tooling, asi que documento juntas las restricciones que afectan build, publicacion y plataforma.

## npm y JSR

Yo publico npm desde `dist/` y valido JSR desde `jsr.json`. Por eso cuido dos cosas distintas:

- que el build CommonJS y ESM del paquete siga sano
- que la superficie Deno publicada siga limpia y analizable

## Tooling de bundlers

Yo expongo adaptadores pequenos para Vite, esbuild, Rollup y Webpack. Todos deben consumir el mismo contrato de manifest, no reglas de discovery duplicadas.

## Windows y scripts

Como el workspace contiene `&`, yo prefiero scripts que llamen a `node` sobre rutas JS reales en vez de depender de wrappers fragiles `.cmd` cuando el entorno lo permite.

## Mi criterio de validacion por plataforma

Cuando toco una superficie concreta, valido la plataforma concreta:

- Node para CLI y readers
- Deno para adapter y JSR
- Vite y bundlers para plugins
- Tauri para consumo seguro desktop