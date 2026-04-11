# 05 Release readiness

Yo uso este documento como checklist final antes de publicar la primera version.

## Checklist tecnico minimo

1. `package.json` del monorepo y del SDK con licencia, autor, version y metadatos publicos coherentes.
2. `jsr.json` alineado en version y licencia con el paquete npm.
3. `LICENSE`, `README.md`, `SECURITY.md` y `CHANGELOG.md` presentes y consistentes.
4. `.github/workflows/ci.yml`, `.github/workflows/security.yml` y `.github/workflows/release.yml` listos para ejecutarse.
5. secrets y environments definidos en GitHub antes de disparar la release.
6. build, tests y ejemplos relevantes en verde.

## Secrets y environments esperados

- environment `npm`
- environment `jsr`
- trusted publishing de npm apuntando a `zuccadev-labs/Barrits` con `release.yml`

Condicion adicional para JSR:

- paquete vinculado al repositorio en `jsr.io`
- trusted publishing con OIDC habilitado mediante `id-token: write`

Lo que ya no forma parte del baseline:

- un `JSR_TOKEN` para GitHub Actions

## Criterio de aprobacion

Yo considero la release lista solo si:

- npm cubre los recorridos Node.js, frontend, bundlers y Tauri
- JSR cubre el recorrido Deno
- no necesito un tercer registro publico para los ejemplos actuales
- no queda metadata residual de `UNLICENSED`
- los artefactos locales como `node_modules/`, `dist/`, `.barrits/`, `.cache/` y `target/` siguen cubiertos por el `.gitignore` raiz

## Estado actual verificado

En esta pasada yo valide:

- `npm run typecheck`
- `npm run build`
- `npm test`
- `npm run publish:jsr:dry-run`
- `npm run build --workspace example-nodejs`
- `npm run showcase --workspace example-nodejs`
- `deno task build` y `deno task inspect` en `example-deno`
- `npm run build` en `example-react`, `example-vue`, `example-solid` y `example-svelte`
- `npm run build:all --workspace examples-bundlers`
- `npm run tauri:build --workspace example-tauri`

Resultado de la pasada actual:

- baseline del SDK: verde
- ejemplos Node.js y Deno: verde
- ejemplos frontend y bundlers: verde
- ejemplo Tauri: verde
- cobertura de `node_modules/` y artefactos generados en `.gitignore`: confirmada
