---
title: "06 Comandos y runtimes de ts_js"
description: "Corporate documentation for 06 Comandos y runtimes de ts_js."
---

# 06 Comandos y runtimes de ts_js

La CLI de Barrits no representa la experiencia principal de integración, pero sirve como fallback operativo, herramienta de diagnóstico y automatización puntual cuando se necesita resolver el proyecto directamente desde Node.js o Deno.

## CLI en Node.js

El paquete instala dos alias de binario: `barrits` y `brt`.

```bash
npx barrits detect
npx brt detect --json
barrits info
barrits watch
barrits imports --write
barrits build -- npm run build
barrits dev -- npm run dev
```

## CLI en Deno

En Deno se usa el entrypoint de runtime directamente, no el campo `bin` de npm.

```bash
deno run -A ./dist/adapters/deno/cli.js detect
deno run -A ./dist/adapters/deno/cli.js watch
deno run -A ./dist/adapters/deno/cli.js imports --write
deno run -A ./dist/adapters/deno/cli.js build -- deno task build
deno run -A ./dist/adapters/deno/cli.js dev -- deno task dev
```

## Referencia de comandos

| Comando | Qué hace |
| :--- | :--- |
| `detect` | Confirma dónde está la carpeta `barrits/` |
| `info` | Inspecciona dominios, archivos, exports, traits y acciones de import |
| `watch` | Mantiene el discovery activo durante una sesión de trabajo |
| `imports` | Genera acciones sugeridas e imports gestionados |
| `build` | Materializa un manifest listo para el pipeline de compilación |
| `dev` | Acopla watch al proceso padre de desarrollo |

## Cuándo basta el discovery automático

El discovery automático funciona sin configuración de ruta explícita cuando el proceso arranca:

- Desde la raíz del consumidor
- Desde una subcarpeta del consumidor
- Desde `barrits/` directamente
- Desde casos como `src/barrits/`

## Cuándo fijar `projectRoot`

La configuración explícita es necesaria cuando `cwd` no es una señal fiable — por ejemplo en wrappers, entornos CI, monorepos con varios candidatos o ejecuciones desde directorios padres.