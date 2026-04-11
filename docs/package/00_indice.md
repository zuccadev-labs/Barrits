# 00 Indice de publicacion

Yo uso esta carpeta como guia operativa para preparar el repositorio antes de publicar paquetes.

Flujo actual resumido:

- `npm`: token en GitHub Secrets
- `JSR`: trusted publishing con OIDC desde GitHub Actions
- version inicial: `0.1.0`

Orden de lectura:

1. `01_publicacion-y-canales.md`: yo explico donde publico hoy y por que.
2. `02_versionado-y-releases.md`: yo fijo la estrategia de versionado, tags y releases.
3. `03_secrets-actions-y-entornos.md`: yo documento secretos, environments y workflows de GitHub Actions.
4. `04_variables-de-entorno.md`: yo dejo la guia de variables y el mapa con el `.env` local de referencia.
5. `05_release-readiness.md`: yo cierro el checklist tecnico final antes de publicar la primera version.
6. `06_configuracion-jsr-y-github-actions.md`: yo documento el enlace exacto entre JSR y GitHub Actions usando OIDC.
7. `07_primera-publicacion-paso-a-paso.md`: yo dejo el orden exacto de la primera release `0.1.0` y de la siguiente `0.1.1`.
