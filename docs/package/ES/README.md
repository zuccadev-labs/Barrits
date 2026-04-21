# Documentación de Publicación de Paquetes

Este directorio contiene la guía operativa y normativa para la preparación, versionado y publicación de Barrits como un producto distribuible.

## Ámbito de la Documentación

Esta sección se centra exclusivamente en la gobernanza de lanzamientos (releases). No incluye manuales de uso, detalles de arquitectura del SDK ni guías de implementación interna, los cuales se encuentran en sus respectivos directorios de documentación.

## Modelo de Publicación Activo

- **npm**: Lanzamientos gestionados mediante "Trusted Publishing" y protocolo OIDC.
- **JSR**: Publicación automatizada desde GitHub Actions empleando identidades OIDC.
- Se confirma la eliminación de tokens estáticos (`JSR_TOKEN`, `NPM_TOKEN`) de los flujos operativos estándar, siguiendo las mejores prácticas de seguridad de la cadena de suministro.

## Mapa de Documentos

1.  **[00_indice.md](00_indice.md)**: Índice general de la sección de publicación.
2.  **[01_publicacion-y-canales.md](01_publicacion-y-canales.md)**: Estrategia de canales.
3.  **[02_versionado-y-releases.md](02_versionado-y-releases.md)**: Gestión de Versiones y SemVer.
4.  **[03_secrets-actions-y-entornos.md](03_secrets-actions-y-entornos.md)**: Infraestructura de CI y Seguridad.
5.  **[04_variables-de-entorno.md](04_variables-de-entorno.md)**: Referencia técnica de variables.
6.  **[05_release-readiness.md](05_release-readiness.md)**: Checklist de preparación final.
7.  **[06_configuracion-jsr-y-github-actions.md](06_configuracion-jsr-y-github-actions.md)**: Vínculo técnico JSR-GitHub.
8.  **[07_primera-publicacion-paso-a-paso.md](07_primera-publicacion-paso-a-paso.md)**: Protocolo de lanzamiento.
9.  **[08_cicd-pipeline-and-branch-strategy.md](08_cicd-pipeline-and-branch-strategy.md)**: Pipeline de CI/CD y modelo de ramas.
