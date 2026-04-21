# 00 Índice de publicación

Este directorio constituye la guía operativa para la preparación, validación y ejecución de lanzamientos (releases) de los paquetes del SDK `barrits`. Centraliza la gobernanza de canales, versionado y automatización de despliegue.

## Resumen del Flujo de Publicación

- **Ecosistema npm**: Autenticación gestionada mediante tokens almacenados en GitHub Secrets.
- **Ecosistema JSR**: Publicación mediante "Trusted Publishing" utilizando OIDC desde GitHub Actions.
- **Estrategia Inicial**: Lanzamiento de la versión base `0.1.0`.

## Orden de lectura recomendado

1.  **[01_publicacion-y-canales.md](01_publicacion-y-canales.md)**: Definición de los canales de distribución oficiales y su justificación técnica.
2.  **[02_versionado-y-releases.md](02_versionado-y-releases.md)**: Establecimiento de la estrategia de versionado (SemVer), gestión de tags y ciclos de release.
3.  **[03_secrets-actions-y-entornos.md](03_secrets-actions-y-entornos.md)**: Documentación de secretos de seguridad, entornos (environments) y flujos de trabajo de GitHub Actions.
4.  **[04_variables-de-entorno.md](04_variables-de-entorno.md)**: Guía de configuración de variables y mapa de referencia del archivo `.env` local.
5.  **[05_release-readiness.md](05_release-readiness.md)**: Lista de verificación (checklist) técnica final previa al primer lanzamiento oficial.
6.  **[06_configuracion-jsr-y-github-actions.md](06_configuracion-jsr-y-github-actions.md)**: Detalle del vínculo técnico entre JSR y GitHub Actions mediante el protocolo OIDC.
7.  **[07_primera-publicacion-paso-a-paso.md](07_primera-publicacion-paso-a-paso.md)**: Protocolo secuencial para la ejecución de la release inicial y actualizaciones posteriores.
8.  **[08_cicd-pipeline-and-branch-strategy.md](08_cicd-pipeline-and-branch-strategy.md)**: Documentación del pipeline de integración continua y la estrategia corporativa de ramificación.
