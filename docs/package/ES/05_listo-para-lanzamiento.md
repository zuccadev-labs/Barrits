# 05 Release readiness

Este documento constituye la lista de verificación (checklist) técnica final que debe ser validada integralmente antes de proceder con la publicación de la primera versión del SDK.

## Checklist Técnico de Preparación

Para certificar que el repositorio se encuentra en estado de lanzamiento, se deben verificar los siguientes puntos:

1.  **Metadatos de Paquetes**: Consistencia de licencias, autores y versiones en los archivos `package.json` del monorepo y del SDK.
2.  **Sincronización JSR**: Alineación del archivo `jsr.json` con los metadatos del paquete npm.
3.  **Documentación Obligatoria**: Presencia y actualidad de los archivos `LICENSE`, `README.md`, `SECURITY.md` y `CHANGELOG.md`.
4.  **Configuración de Automatización**: Integridad de los flujos de trabajo en `.github/workflows/` (ci, security, release).
5.  **Infraestructura de GitHub**: Definición completa de secretos y entornos en la interfaz de gestión del repositorio.
6.  **Certificación Funcional**: Estado óptimo ("verde") en la construcción, pruebas unitarias y todos los ejemplos de integración.

## Configuración de Publicación de Confianza (Trusted Publishing)

- Configuración del entorno `npm` vinculando el repositorio `zuccadev-labs/Barrits` con el workflow `release.yml`.
- Vinculación del paquete en `jsr.io` habilitando OIDC mediante el permiso `id-token: write` en el sistema de CI.
- Se confirma la eliminación de la dependencia de tokens estáticos como `JSR_TOKEN` para los flujos principales de release.

## Criterios de Aprobación Final

La aprobación de una release está supeditada al cumplimiento de los siguientes estándares de calidad:

- Cobertura total de los escenarios Node.js, Frontend, Bundlers y Tauri mediante el canal npm.
- Cobertura nativa de implementación en Deno mediante el canal JSR.
- Ausencia de metadatos residuales o incorrectos (ej. `UNLICENSED`).
- Validación de que los artefactos generados y directorios de caché (ej. `dist/`, `.barrits/`) se encuentran correctamente excluidos mediante el archivo `.gitignore`.

## Certificación de Estado Actual

Se ha verificado la integridad de los siguientes componentes en la fase actual:

- **Núcleo del SDK**: Construcción, validación de tipos y pruebas unitarias aprobadas.
- **Automatización**: Simulación de publicación en JSR (dry-run) finalizada sin advertencias.
- **Ejemplos de Integración**: Certificación de `example-nodejs`, `example-deno`, suites de frontend, empaquetadores (bundlers) y soporte para escritorio (Tauri).
- **Control de Artefactos**: Verificación de la política de exclusión de archivos temporales y generados.
