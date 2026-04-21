# 07 Primera publicación paso a paso

Esta guía detalla el protocolo secuencial para la ejecución del lanzamiento inicial (`0.1.0`) y los procedimientos para actualizaciones posteriores del SDK.

## Requisitos Previos al Lanzamiento

Antes de modificar la versión del paquete, se deben certificar los siguientes controles:

1.  Validación completa de la lista de verificación en [05_release-readiness.md](05_release-readiness.md).
2.  Vinculación técnica del paquete en JSR con el repositorio de GitHub.
3.  Configuración de "Trusted Publishing" en npm para el flujo `release.yml`.
4.  Existencia de los entornos (Environments) `npm` y `jsr`.
5.  Implementación de protecciones en las ramas `dev` y `main`, garantizando que la integración ocurra mediante PR.

## Disciplina de Ramificación y Flujo de Trabajo

El proceso de release sigue un modelo de progresión estricto:

1.  Las tareas técnicas se consolidan en ramas de trabajo independientes.
2.  Se ejecuta un Pull Request hacia la rama de integración `dev`.
3.  Se validan las versiones de pre-lanzamiento desde `dev` si es necesaria la distribución de prueba.
4.  La promoción a la rama de producción `main` se realiza tras la aprobación final de la integración.
5.  La publicación de versiones estables se ejecuta exclusivamente desde la rama `main`.

## Protocolo de Pre-lanzamiento (Prerelease)

Ante la necesidad de una distribución de evaluación, se sigue este orden operativo:

1.  Consolidación de cambios en la rama `dev`.
2.  Incremento de la versión a formato prerelease (ej. `0.2.0-rc.1`) en los archivos `package.json` y `jsr.json`.
3.  Actualización del archivo `CHANGELOG.md` con las novedades incorporadas.
4.  Creación y envío (push) del tag `pre-vX.Y.Z-rc.N`.
5.  Monitorización del proceso de publicación automatizada hacia los canales correspondientes.

## Ejecución de la Release Inicial `0.1.0`

1.  Certificación del merge PR desde `dev` hacia `main`.
2.  Validación de la versión `0.1.0` en los manifiestos del SDK y en el `CHANGELOG.md`.
3.  Verificación de que todas las pruebas técnicas, builds y simulaciones de publicación se encuentren satisfactorias.
4.  Creación y envío del tag oficial `v0.1.0`.
5.  Seguimiento del workflow [release.yml](../../.github/workflows/release.yml) hasta su finalización exitosa.

## Procedimiento para Releases de Mantenimiento (`0.1.1`)

Para actualizaciones de nivel patch, se repite el flujo operativo ajustando la versión a `0.1.1` en npm y JSR, asegurando la actualización de los registros históricos de cambios y la validación integral de la suite de pruebas antes de la generación del nuevo tag oficial.
