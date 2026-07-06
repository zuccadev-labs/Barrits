---
title: "00 — Índice de Investigaciones"
description: "Documentación corporativa para 00 — Índice de Investigaciones."
---

# Decisiones Arquitectónicas e Investigaciones — @zuccadev-labs/barrits

Este índice centraliza el historial de descubrimientos, refactorizaciones y decisiones de diseño técnico (ADRs) que han modelado la evolución de Barrits, desde su concepción para unificación de bundlers hasta su establecimiento como un SDK transversal y base del monorepo corporativo.

---

## Orden de lectura recomendado

| Orden | Documento | Enfoque |
| :--- | :--- | :--- |
| 01 | [Propósito y Problema](01_proposito-y-problema.md) | Análisis de la problemática inicial y los objetivos de diseño del SDK |
| 02 | [Decisiones de Arquitectura](02_decisiones-de-arquitectura.md) | Separación de runtime vs pre-build y contratos puros |
| 03 | [Camino Hacia el Monorepo](03_camino-hacia-el-monorepo.md) | Por qué Barrits se convierte en la fundación de ZuccaDev Labs |
| 04 | [Microservicios y Orquestación](04_arquitectura-microservicios-y-orquestacion.md) | Reflexiones sobre inyección de dependencias distribuidas |
| 05 | [Conclusiones y Límites de Diseño](05_conclusiones-y-limites.md) | Lo que Barrits es, y lo que no intenta ser |
| 06 | [Arquitectura Deno BaaS (Parse Alternative)](06_arquitectura-deno-baas.md) | IoC basado en AST y delegación estricta de bases de datos |
| 07 | [Estandarización del Catálogo de Algoritmos](07_estandarizacion-catalogo-algoritmos.md) | Taxonomía de 10 familias algorítmicas y validación mediante ejemplos |
| 08 | [Consolidación de la Documentación Bilingüe](08_consolidacion-documentacion-bilingue.md) | Arquitectura de documentación EN/ES y estrategia de migración a Docusaurus |
| 09 | [Skills para Agentes y Automatización del Desarrollo](09_skills-agentes-y-automatizacion.md) | Skills modulares para IA y ciclo de desarrollo automatizado |
| 10 | [Auditoría Forense Integral](10-auditoria-forense-integral.md) | Seguridad, gaps, buenas prácticas, optimización, UX/DX y skills |

---

## Estándares Editoriales Corporativos

- Los documentos preservan una narrativa evolutiva: registran tanto los éxitos como las pivotaciones tecnológicas sin borrar el historial.
- Se mantiene un relato objetivo en tercera persona para representar la gobernanza del proyecto con profesionalismo.
- La segregación desde la carpeta `development` permite aislar el contexto histórico del manual de procedimientos vigente.