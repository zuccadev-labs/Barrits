# 04 Variables de entorno

En `.env` las agrupo por environment con comentarios para que el archivo siga siendo solo un mapa de variables, no una lista mezclada de conceptos sueltos.

Mapa actual usado en este repo:

- `NPM_TOKEN_PUBLICAR_NPM`: opcional y solo de compatibilidad temporal si no se usa trusted publishing en npm
- `ENTORNO_PUBLICAR_NPM`: nombre del environment GitHub para npm
- `ENTORNO_PUBLICAR_JSR`: nombre del environment GitHub para JSR
- `RUTA_PAQUETE_PUBLICAR_NODE`: ruta del paquete npm dentro del monorepo
- `RUTA_CONFIG_PUBLICAR_JSR`: ruta del `jsr.json` que define la publicacion Deno
- `TAG_VERSION_PUBLICAR`: tag esperado para la release, por ejemplo `v0.1.0`
- `RAMA_PROTEGIDA_INTEGRAR`: rama protegida objetivo, por ejemplo `main`

Uso correcto:

- en local yo puedo tener un `.env` para recordar el mapa de variables, agrupado por `npm` y `jsr`
- en CI uso secrets o variables protegidas de GitHub, no el `.env` del workspace
- si una variable contiene credenciales, su valor real nunca debe salir del gestor de secretos corporativo
- en GitHub Actions, JSR puede publicarse sin token si el paquete esta vinculado al repo y el workflow usa OIDC
- los nombres de environments no los guardo como secrets de GitHub; los creo directamente en la seccion de environments
- evito prefijos reservados por GitHub como `GITHUB_` al nombrar variables locales de referencia

Regla vigente del repo:

- `JSR_TOKEN_PUBLICAR_JSR` ya no forma parte del flujo principal documentado
- si algun dia apareciera otro CI distinto de GitHub Actions, esa necesidad se documentaria como un cambio nuevo y no como parte del baseline actual

Archivo local de referencia:

- la raiz del repo contiene `.env` con placeholders y comentarios de guia
- `.gitignore` ya evita que ese archivo entre por error al repositorio
