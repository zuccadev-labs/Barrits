# Documentacion de publicacion del repositorio

Yo uso esta carpeta para documentar como preparo, versiono y publico `barrits` como producto distribuible.

En esta area no documento el uso del SDK ni su arquitectura interna. Aqui concentro el gobierno operativo de publicacion.

Modelo vigente de publicacion:

- `npm` publica con `NPM_TOKEN_PUBLICAR_NPM`
- `JSR` publica desde GitHub Actions con OIDC
- no uso `JSR_TOKEN` en el flujo actual del repositorio

Orden de lectura:

1. [00_indice.md](00_indice.md)
2. [01_publicacion-y-canales.md](01_publicacion-y-canales.md)
3. [02_versionado-y-releases.md](02_versionado-y-releases.md)
4. [03_secrets-actions-y-entornos.md](03_secrets-actions-y-entornos.md)
5. [04_variables-de-entorno.md](04_variables-de-entorno.md)
6. [05_release-readiness.md](05_release-readiness.md)
7. [06_configuracion-jsr-y-github-actions.md](06_configuracion-jsr-y-github-actions.md)
8. [07_primera-publicacion-paso-a-paso.md](07_primera-publicacion-paso-a-paso.md)
