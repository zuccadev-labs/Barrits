# 07 Primera publicacion paso a paso

Yo uso esta guia para ejecutar la primera release publica `0.1.0` y dejar claro como sigo luego con `0.1.1`.

## Antes de tocar la version

Yo verifico estas condiciones:

1. [docs/package/05_release-readiness.md](05_release-readiness.md) esta en verde
2. el paquete JSR ya esta vinculado al repositorio en `jsr.io`
3. GitHub tiene `NPM_TOKEN_PUBLICAR_NPM`
4. los environments `npm` y `jsr` existen
5. las ramas `dev` y `main` estan protegidas y el merge ocurre por PR

En esta primera release no espero configurar `JSR_TOKEN`.

## Flujo de ramas antes de publicar

Yo sigo esta disciplina:

1. desarrollo en una rama de trabajo
2. hago PR hacia `dev`
3. valido prerelease desde `dev` si necesito distribucion de prueba
4. hago PR de `dev` hacia `main` cuando la integracion ya esta aprobada
5. publico release estable solo despues del merge a `main`

## Prerelease desde `dev`

Si necesito una salida de prueba, yo sigo este orden:

1. confirmo que el cambio ya esta mergeado en `dev`
2. subo version prerelease en [packages/sdk/ts_js/package.json](../../../packages/sdk/ts_js/package.json), por ejemplo `0.2.0-rc.1`
3. subo la misma version prerelease en [packages/sdk/ts_js/jsr.json](../../../packages/sdk/ts_js/jsr.json)
4. actualizo [CHANGELOG.md](../../../CHANGELOG.md) si corresponde
5. confirmo validaciones verdes en `dev`
6. creo el tag `pre-v0.2.0-rc.1`
7. hago push del tag al remoto
8. dejo que GitHub Actions publique npm con dist-tag `next`, publique en JSR y cree GitHub prerelease

## Primera release `0.1.0`

Yo sigo este orden:

1. confirmo que el contenido ya fue promovido por PR desde `dev` hacia `main`
1. confirmo que [packages/sdk/ts_js/package.json](../../../packages/sdk/ts_js/package.json) esta en `0.1.0`
1. confirmo que [packages/sdk/ts_js/jsr.json](../../../packages/sdk/ts_js/jsr.json) esta en `0.1.0`
1. confirmo que [CHANGELOG.md](../../../CHANGELOG.md) describe `0.1.0`
1. confirmo que `npm run typecheck`, `npm run build`, `npm test` y `npm run publish:jsr:dry-run` estan verdes
1. creo el tag `v0.1.0`
1. hago push del tag al repositorio remoto
1. dejo que GitHub Actions ejecute [release.yml](../../.github/workflows/release.yml)

## Segunda release `0.1.1`

Si el siguiente cambio es patch, yo repito el mismo flujo con estas diferencias:

1. subo version a `0.1.1` en npm y JSR
2. actualizo [CHANGELOG.md](../../../CHANGELOG.md) con la nueva entrada
3. repito validaciones
4. creo el tag `v0.1.1`
5. publico desde el tag

## Cuando no uso patch

- si agrego capacidad compatible pero visible, subo `MINOR`
- si rompo contrato publico, subo `MAJOR`

Mientras el trabajo siga siendo hardening, correccion o ajuste compatible, mi secuencia natural es `0.1.0`, `0.1.1`, `0.1.2` y asi sucesivamente.

## Nota sobre `.env`

Yo trato [/.env](../../../.env) como archivo local ignorado por Git. Eso significa:

- no lo subo a GitHub
- no uso su contenido como fuente de verdad en CI
- si contiene tokens reales, los conservo solo como configuracion local mientras me sean utiles
- los secretos operativos reales para release viven en GitHub Secrets o en el secret manager corporativo
