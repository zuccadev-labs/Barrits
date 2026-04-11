# 04 Bundlers

Yo uso `packages/sdk/ts_js/examples/bundlers/` para validar integraciones tecnicas de build sin mezclar esa prueba con el ejemplo runtime de Node.js.

Herramientas cubiertas:

- Vite
- esbuild
- Rollup
- Webpack

Comandos disponibles:

- `npm run build:vite`
- `npm run build:esbuild`
- `npm run build:rollup`
- `npm run build:webpack`
- `npm run build:all`

Esta carpeta me sirve para verificar dos cosas concretas:

- que los plugins de `barrits` siguen autogenerando el manifest donde corresponde
- que los adaptadores de bundling no contaminan la narrativa del consumidor Node.js puro

Si yo quiero una demo visible para producto o experiencia de usuario, abro un ejemplo de runtime o frontend. Si quiero una validacion tecnica de integracion, entro aqui.