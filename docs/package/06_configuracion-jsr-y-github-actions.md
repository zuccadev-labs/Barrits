# 06 Configuracion JSR y GitHub Actions

Yo uso este documento para enlazar correctamente el paquete de JSR con el repositorio y habilitar trusted publishing sin token desde GitHub Actions.

## Objetivo

Quiero llegar a este estado:

- `npm` publica con `NPM_TOKEN_PUBLICAR_NPM`
- `JSR` publica sin token desde GitHub Actions usando OIDC
- el workflow de release del repo no depende de `JSR_TOKEN`

## Paso 1: preparar GitHub

En GitHub yo verifico estas condiciones:

1. el repositorio correcto ya existe y es el que usare para release
2. el workflow [release.yml](../../.github/workflows/release.yml) conserva `permissions.id-token: write`
3. existe el environment `jsr`
4. existe el environment `npm`
5. existe el secret `NPM_TOKEN_PUBLICAR_NPM` en GitHub

Matiz importante:

- `npm` y `jsr` se crean como GitHub Environments, no como secrets
- si intento crear un secret llamado `GITHUB_ENVIRONMENT_*`, GitHub lo rechazara porque el prefijo `GITHUB_` esta reservado

Para `JSR` en GitHub Actions no creo `JSR_TOKEN_PUBLICAR_JSR` porque no forma parte del flujo actual.

## Paso 2: crear o revisar el paquete en JSR

En `jsr.io` yo hago esto:

1. entro con la cuenta que sera duena del scope `@barrits`
2. creo el scope si todavia no existe
3. creo o reviso el paquete `@zuccadev-labs/barrits`
4. confirmo que el nombre coincide con [packages/sdk/ts_js/jsr.json](../../../packages/sdk/ts_js/jsr.json)

## Paso 3: vincular el repositorio en JSR

En la configuracion del paquete en `jsr.io` yo hago esto:

1. abro `Settings` del paquete
2. busco la opcion de vincular repositorio GitHub
3. escribo el repositorio exacto
4. confirmo el enlace

El resultado esperado es que JSR reconozca el repositorio y permita trusted publishing desde GitHub Actions.

## Paso 4: comprobar el workflow de release

Yo reviso en [release.yml](../../.github/workflows/release.yml) estas piezas:

- el job `publish-jsr` corre en GitHub Actions
- el job tiene `permissions.id-token: write` a nivel de workflow
- el paso final usa `npx jsr publish`
- antes corre `npm run publish:jsr:dry-run`

## Paso 5: validar antes de publicar

Yo espero tener en verde esto antes del primer tag:

- `npm run typecheck`
- `npm run build`
- `npm test`
- `npm run publish:jsr:dry-run`
- ejemplos representativos en verde

## Señales de que quedo bien

Yo considero que la configuracion quedo correcta si:

- GitHub Actions puede publicar JSR sin pedir `JSR_TOKEN`
- la release de JSR genera provenance o trust ligado al workflow de GitHub
- el paquete aparece vinculado al repo correcto en JSR
- una segunda ejecucion con la misma version no intenta republicar de forma invalida
