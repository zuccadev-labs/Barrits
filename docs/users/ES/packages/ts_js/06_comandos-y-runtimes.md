# 06 Comandos y runtimes de ts_js

Yo no tomo la CLI como experiencia principal, pero si la uso como fallback, diagnostico y automatizacion puntual cuando necesito resolver el proyecto desde Node o Deno.

## Como la uso en Node

Yo tengo binario npm para Node con `barrits` y `brt`.

Ejemplos:

```bash
npx barrits detect
npx brt detect --json
barrits info
barrits watch
barrits imports --write
barrits build -- npm run build
barrits dev -- npm run dev
```

## Como la uso en Deno

En Deno yo uso el entrypoint de runtime y no el campo `bin` de npm.

Ejemplos:

```bash
deno run -A ./dist/adapters/deno/cli.js detect
deno run -A ./dist/adapters/deno/cli.js watch
deno run -A ./dist/adapters/deno/cli.js imports --write
deno run -A ./dist/adapters/deno/cli.js build -- deno task build
deno run -A ./dist/adapters/deno/cli.js dev -- deno task dev
```

## Que espero de los comandos principales

- `detect`: yo confirmo donde esta la carpeta `barrits/`
- `info`: yo inspecciono dominios, archivos, exports, traits y acciones de import
- `watch`: yo mantengo discovery vivo durante una sesion de trabajo
- `imports`: yo genero acciones sugeridas e imports gestionados
- `build`: yo materializo un manifest listo para el pipeline de compilacion
- `dev`: yo acoplo watch al proceso padre de desarrollo

## Cuando discovery automatico me basta

Normalmente me basta cuando el proceso arranca:

- desde la raiz del consumidor
- desde una subcarpeta del consumidor
- desde `barrits/` directamente
- desde casos como `src/barrits/`

## Cuando fijo ruta o `projectRoot`

Yo fijo ruta explicita cuando el `cwd` ya no es una señal fiable, por ejemplo en wrappers, CI, monorepos con varios candidatos o ejecuciones desde directorios padres.