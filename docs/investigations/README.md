# Documentación de Investigación

Este directorio alberga el registro técnico y arquitectónico de la evolución de Barrits. Documenta el razonamiento detrás de la estructura actual, los problemas de diseño resueltos y las decisiones estratégicas que rigen el ecosistema.

## Guía de Navegación

Para consultar el registro de investigación de un componente específico, se establece el siguiente flujo operativo:

1.  Selección del idioma de preferencia.
2.  Selección de la familia de componentes (ej. `packages`).
3.  Acceso al directorio del SDK correspondiente.
4.  Seguimiento de la secuencia numérica lógica para comprender el desarrollo del pensamiento arquitectónico.

## Directorio de Acceso Actual

### EN (English)

#### packages

##### ts_js
- **[Investigations Index](EN/packages/ts_js/00-index.md)**
- **[Purpose and Problem](EN/packages/ts_js/01-purpose-and-problem.md)**
- **[Architectural Decisions](EN/packages/ts_js/02-architectural-decisions.md)**
- **[Path to the Monorepo](EN/packages/ts_js/03-path-to-monorepo.md)**
- **[Microservices and Orchestration](EN/packages/ts_js/04-microservices-and-orchestration.md)**
- **[Conclusions and Design Limits](EN/packages/ts_js/05-conclusions-and-limits.md)**
- **[Deno BaaS Architecture](EN/packages/ts_js/06-deno-baas-architecture.md)**
- **[Algorithm Catalogue Standardization](EN/packages/ts_js/07-algorithm-catalogue-standardization.md)**
- **[Bilingual Documentation Consolidation](EN/packages/ts_js/08-bilingual-documentation-consolidation.md)**
- **[Agent Skills and Development Automation](EN/packages/ts_js/09-agent-skills-and-automation.md)**
- **[Comprehensive Forensic Audit](EN/packages/ts_js/10-forensic-integral-audit.md)**

### ES (Español)

#### packages

##### ts_js
- **[Índice de Investigación](ES/packages/ts_js/00-indice.md)**
- **[Propósito y Problemática](ES/packages/ts_js/01_proposito-y-problema.md)**
- **[Decisiones de Arquitectura](ES/packages/ts_js/02_decisiones-de-arquitectura.md)**
- **[Evolución hacia Monorepo](ES/packages/ts_js/03_camino-hacia-el-monorepo.md)**
- **[Micro-servicios y Orquestación](ES/packages/ts_js/04_arquitectura-microservicios-y-orquestacion.md)**
- **[Conclusiones y Límites](ES/packages/ts_js/05_conclusiones-y-limites.md)**
- **[Arquitectura Deno BaaS](ES/packages/ts_js/06_arquitectura-deno-baas.md)**
- **[Estandarización del Catálogo de Algoritmos](ES/packages/ts_js/07_estandarizacion-catalogo-algoritmos.md)**
- **[Consolidación de la Documentación Bilingüe](ES/packages/ts_js/08_consolidacion-documentacion-bilingue.md)**
- **[Skills para Agentes y Automatización](ES/packages/ts_js/09_skills-agentes-y-automatizacion.md)**
- **[Auditoría Forense Integral](ES/packages/ts_js/10-auditoria-forense-integral.md)**

### Technical Decision Records (Low-Level ADRs)

The `adr/` directory contains fine-grained technical decision records following a traditional ADR format. These document specific implementation choices:

- **[ADR 0001](adr/0001-use-conventional-commits-and-lint-staged.md)**: Use Conventional Commits and Lint-Staged for Code Quality
- **[ADR 0002](adr/0002-use-sha-256-for-manifest-checksums.md)**: Use SHA-256 for Manifest Checksums
- **[ADR 0003](adr/0003-extract-shared-cli-parser-module.md)**: Extract Shared CLI Parser Module
- **[ADR 0004](adr/0004-split-consume-ts-into-single-responsibility-modules.md)**: Split Consume.ts into Single-Responsibility Modules

## Alcance del Repositorio de Investigación

Esta sección documenta:
- Los objetivos fundacionales y la visión del proyecto.
- El análisis de tradeoffs y la justificación de decisiones estructurales.
- La crónica de la transición arquitectónica hacia modelos escalables.
- Las conclusiones vigentes y la definición de las fronteras tecnológicas del SDK.

## Notas sobre Documentación Heredada

Los registros históricos y borradores de arquitectura previos se conservan como punteros para trazabilidad, pero la fuente de verdad autoritativa para el diseño actual se encuentra centralizada en la estructura de archivos por idioma y componente.