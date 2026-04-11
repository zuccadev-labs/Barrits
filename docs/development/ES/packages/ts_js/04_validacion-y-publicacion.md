# 04 Validacion y publicacion de ts_js

Yo considero completa una modificacion de `ts_js` solo cuando pasa por una validacion tecnica minima y coherente con el tipo de cambio.

## Mi baseline de validacion

Cuando toco arquitectura, build, adapters o ejemplos, yo reviso al menos esto:

1. `npm install`
2. `npm run build`
3. `npm test`
4. ejemplos representativos segun la superficie afectada
5. `npm run publish:jsr:dry-run` cuando toco compatibilidad Deno o publicacion

## Como valido ejemplos

Yo no corro todos los ejemplos por costumbre. Yo selecciono los que cubren la superficie que toque:

- Node.js si toco CLI, manifests, tooling o filesystem
- Deno si toco adapter Deno, `jsr.json` o imports ESM publicados
- React o Vite si toco package-first frontend
- bundlers si toco plugins de build
- Tauri si toco lectura segura de manifests y snapshots

## Como publico

Yo trato npm y JSR como superficies distintas pero compatibles:

- npm consume la salida `dist/`
- JSR publica la fuente y valida la compatibilidad Deno desde `jsr.json`

Antes de una publicacion real, yo quiero tener:

1. build verde
2. tests verdes
3. ejemplos relevantes verdes
4. `deno publish --dry-run` sin warnings nuevos no entendidos

## Mi regla de calidad documental

Si yo cambio estructura, rutas, workspaces o flujos, actualizo esta carpeta antes de cerrar la tarea. No dejo que el codigo migre sin arrastrar su documentacion de desarrollo.