# 03 Secrets, Actions y entornos

La gestión de la publicación y la integración continua se orquestan mediante GitHub Actions, haciendo uso de los entornos de GitHub (Environments) y un conjunto mínimo de secretos de seguridad.

## Estrategia de Publicación con OIDC

Para el registro JSR, el sistema emplea "Trusted Publishing" mediante el protocolo OIDC en GitHub Actions. Esta configuración permite realizar la publicación sin necesidad de almacenar tokens persistentes en los secretos del repositorio, siempre que el paquete esté debidamente vinculado a la cuenta de JSR.

## Definición de Workflows

El repositorio mantiene tres flujos de trabajo principales:

- **`.github/workflows/ci.yml`**: Ejecuta los procesos de construcción (build), validación de tipos (typecheck), pruebas unitarias, ejecución de ejemplos y simulación de publicación en JSR (dry-run).
- **`.github/workflows/security.yml`**: Realiza la revisión de dependencias y auditorías de seguridad mediante `npm audit`.
- **`.github/workflows/release.yml`**: Orquesta el despliegue oficial hacia npm y JSR.

## Entornos de GitHub (Environments)

Se recomienda la creación y configuración de los siguientes entornos en la sección `Settings -> Environments` del repositorio:

- **`npm`**: Destinado a la gobernanza de la publicación del paquete Node.js.
- **`jsr`**: Orientado a la gestión de la superficie Deno y publicación en JSR.

## Gestión de Secretos y Seguridad

Se establecen las siguientes normativas de seguridad para el manejo de credenciales:

- **Prohibición de Credenciales en Texto Plano**: No se almacenan tokens reales en los archivos `.env` del repositorio; estos se reservan para mapas de referencia local.
- **Trusted Publishing en npm**: Aunque se recomienda OIDC para npm, se admite el uso temporal del secreto `NPM_TOKEN_PUBLICAR_NPM` para el lanzamiento inicial de paquetes nuevos, hasta que el registro permita la configuración de publicación de confianza.
- **Permisos de Workflow**: Es obligatorio declarar `permissions.id-token: write` en el flujo de release para habilitar el intercambio de tokens OIDC.

## Controles de Rama y Aprobación

Se prescribe la implementación de protecciones en la rama principal (`main`), incluyendo revisiones obligatorias, aprobación de cambios y la certificación de que todos los checks de CI y Seguridad se encuentren en estado óptimo previo a cualquier fusión o lanzamiento de release.
