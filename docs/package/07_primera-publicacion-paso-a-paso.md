# 07 Primera publicacion paso a paso

Yo uso esta guia para ejecutar la primera release publica `0.1.0` y dejar claro como sigo luego con `0.1.1`.

## Antes de tocar la version

Yo verifico estas condiciones:

1. [docs/package/05_release-readiness.md](05_release-readiness.md) esta en verde
2. el paquete JSR ya esta vinculado al repositorio en `jsr.io`
3. GitHub tiene `NPM_TOKEN_PUBLICAR_NPM`
4. los environments `npm` y `jsr` existen
5. la rama protegida esta estable

En esta primera release no espero configurar `JSR_TOKEN`.

## Primera release `0.1.0`

Yo sigo este orden:

1. confirmo que [packages/sdk/ts_js/package.json](../../../packages/sdk/ts_js/package.json) esta en `0.1.0`
2. confirmo que [packages/sdk/ts_js/jsr.json](../../../packages/sdk/ts_js/jsr.json) esta en `0.1.0`
3. confirmo que [CHANGELOG.md](../../../CHANGELOG.md) describe `0.1.0`
4. confirmo que `npm run typecheck`, `npm run build`, `npm test` y `npm run publish:jsr:dry-run` estan verdes
5. creo el tag `v0.1.0`
6. hago push del tag al repositorio remoto
7. dejo que GitHub Actions ejecute [release.yml](../../.github/workflows/release.yml)

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
