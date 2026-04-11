# 03 Secrets, Actions y entornos

Yo preparo la publicacion con GitHub Actions, GitHub Environments y el minimo set de secrets reales.

Para `JSR` en GitHub Actions uso trusted publishing con OIDC. Eso significa que no necesito guardar un token de JSR en secrets si el paquete ya esta vinculado al repositorio desde la configuracion de JSR.

Workflows actuales:

- `.github/workflows/ci.yml`: build, typecheck, tests, ejemplos y dry-run JSR
- `.github/workflows/security.yml`: dependency review y `npm audit`
- `.github/workflows/release.yml`: publicacion a `npm` y `JSR`

Environments recomendados en GitHub:

- `npm`: para la publicacion del paquete Node.js
- `jsr`: para la publicacion de la superficie Deno

Regla importante de GitHub:

- no creo un secret para guardar el nombre del environment
- los environments `npm` y `jsr` se crean en `Settings -> Environments`
- GitHub no permite secrets cuyo nombre empiece por `GITHUB_`
- si quiero recordar esos nombres en local, los guardo como variables de referencia en `.env`, agrupadas por environment y con comentarios

Secrets opcionales o de compatibilidad en GitHub:

- `NPM_TOKEN_PUBLICAR_NPM`: no es necesario en el flujo recomendado porque npm debe publicar con trusted publishing y OIDC; solo lo mantengo documentado como referencia de compatibilidad si en algun momento se usa un flujo manual o temporal fuera del camino recomendado

Requisito adicional para JSR:

- vincular el paquete de JSR con este repositorio en la configuracion de `jsr.io`
- mantener `permissions.id-token: write` en el workflow de release

Configuracion adicional que yo recomiendo fuera del YAML:

- branch protection sobre la rama principal
- status checks obligatorios para `CI` y `Security`
- required reviews antes de merge
- release solo mediante tags o `workflow_dispatch` controlado

Mi criterio de seguridad:

- no pongo tokens reales en `.env`
- uso `.env` solo como mapa local de variables de referencia, agrupadas por `npm` y `jsr`
- los valores reales viven en secrets de GitHub o en el secret manager corporativo

Regla vigente del repo:

- para `JSR` publicado desde GitHub Actions no uso `JSR_TOKEN`
- el flujo actual del repo no requiere documentar un token JSR operativo porque ya no forma parte del camino principal de release
