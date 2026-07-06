# Documentación de Desarrollo

Este directorio centraliza la documentación técnica relativa al diseño interno, la arquitectura y los flujos operativos de los distintos SDKs del proyecto Barrits. Provee los lineamientos necesarios para la evolución del código sin comprometer la integridad de la superficie pública.

## Guía de Navegación

Para acceder a la documentación específica de un SDK, se recomienda seguir este flujo:

1.  Selección del idioma preferido (ej. `ES` o `EN`).
2.  Selección de la familia de componentes (ej. `packages`).
3.  Acceso al directorio del SDK correspondiente (ej. `ts_js`).
4.  Seguimiento del orden numérico establecido (`00_`, `01_`, etc.).

## Directorio de Acceso Actual

### EN (English)

#### packages

##### ts_js
- **[Development Index](EN/packages/ts_js/00-index.md)**
- **[Folder Architecture](EN/packages/ts_js/01-folder-architecture.md)**
- **[Operational Flows](EN/packages/ts_js/02-operational-flows.md)**
- **[Dependencies and Surfaces](EN/packages/ts_js/03-dependencies-and-surfaces.md)**
- **[Validation and Publication](EN/packages/ts_js/04-validation-and-publication.md)**
- **[Discovery, Inspection, and Contracts](EN/packages/ts_js/05-discovery-inspection-and-contracts.md)**
- **[Tooling, Publication, and Platforms](EN/packages/ts_js/06-tooling-publication-and-platforms.md)
- **[Phase 1 Extension — Examples](EN/packages/ts_js/08-phase1-extension-examples.md)****

### ES (Español)

#### packages

##### ts_js
- **[Índice de Desarrollo](ES/packages/ts_js/00-indice.md)**
- **[Arquitectura de Carpetas](ES/packages/ts_js/01_arquitectura-de-carpetas.md)**
- **[Flujos Operativos](ES/packages/ts_js/02_flujos-operativos.md)**
- **[Dependencias y Superficies](ES/packages/ts_js/03_dependencias-y-superficies.md)**
- **[Validación y Publicación](ES/packages/ts_js/04_validacion-y-publicacion.md)**
- **[Descubrimiento e Inspección](ES/packages/ts_js/05_descubrimiento-inspeccion-y-contratos.md)**
- **[Tooling y Plataformas](ES/packages/ts_js/06_tooling-publicacion-y-plataformas.md)**
- **[Extensión Fase 1 — Ejemplos](ES/packages/ts_js/08_extension-fase1-examples.md)**

## Alcance Técnico

Esta sección cubre las siguientes áreas de responsabilidad:
- Definición de la jerarquía de directorios y responsabilidades.
- Descripción de los procesos de construcción, monitoreo y validación.
- Documentación de la jerarquía de dependencias y subpaths.
- Especificación de contratos internos (Manifests y Snapshots).
- Validación multiplataforma y compatibilidad con herramientas de construcción.

## Gestión de Documentación Histórica

Los archivos de arquitectura previos se mantienen exclusivamente como referencia histórica y no constituyen la fuente de verdad vigente. La documentación oficial y actualizada reside en la estructura de directorios por idioma y paquete.