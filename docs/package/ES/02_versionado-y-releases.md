# 02 Versionado y releases

El proyecto adopta una estrategia de versionado coherente y predecible basada en el estándar **Semantic Versioning (SemVer)** para gestionar el ciclo de vida del SDK.

## Reglas de Incremento de Versión

- **MAJOR**: Cambios que rompen la compatibilidad con el contrato público o modifican de forma irreversible los flujos de consumo.
- **MINOR**: Incorporación de nuevas funcionalidades compatibles, adición de adaptadores o mejoras visibles del SDK.
- **PATCH**: Correcciones de errores (bugs), tareas de hardening, validaciones internas o ajustes en las herramientas de construcción sin afectar el contrato.

## Política de Versión Unificada

Se establece el principio de versión única para el SDK: tanto npm como JSR deben publicar bajo la misma versión numérica para representar idéntica release funcional. Por ejemplo, tras la salida inicial `0.1.0`, los incrementos seguirán la secuencia `0.1.1`, `0.1.2`, mientras se mantenga la compatibilidad a nivel de patch.

## Estrategia de Ramificación (Branching)

La gobernanza del código se organiza mediante dos ramas principales:

- **`dev`**: Rama de integración continua y base para los lanzamientos de pre-release.
- **`main`**: Rama de producción que alberga las versiones estables certificadas.

Toda modificación debe ingresar a `dev` mediante un Pull Request (PR). La promoción de código de `dev` a `main` requiere igualmente una validación formal vía PR.

## Protocolo de Release

1.  Consolidación de cambios en una rama de trabajo técnica.
2.  Apertura de PR hacia `dev`.
3.  Validación total de la suite de CI (pruebas y seguridad).
4.  **Opcional Prerelease**: Actualización de la versión en `package.json` y `jsr.json` a un formato pre-release (ej. `0.2.0-rc.1`).
5.  Creación del tag `pre-vX.Y.Z` sobre la rama `dev`. El workflow automatizado publicará la versión en npm (con tag `next`) y JSR, generando además una pre-release en GitHub.
6.  **Lanzamiento Estable**: Apertura de PR de `dev` hacia `main` una vez validada la integración.
7.  Actualización de versiones a la salida estable certificada (ej. `0.2.0`).
8.  Creación del tag oficial `vX.Y.Z` sobre la rama `main`. El workflow ejecutará la publicación estable en npm y JSR, y creará la GitHub Release oficial.

## Gobernanza de Tags y Licenciamiento

- Los tags representan el estado estable del SDK en un punto determinado del tiempo.
- Se emplea el prefijo `pre-v` para identificadores de pre-lanzamiento y `v` para versiones estables.
- Por el momento, se mantiene un sistema de etiquetado global para el monorepo dada la presencia de un único SDK activo.

El proyecto se distribuye bajo la licencia **MIT**, con el reconocimiento autoral correspondiente en los archivos de licencia oficiales.
