---
title: "09 — Skills para Agentes y Automatización del Desarrollo"
description: "ADR y registro de investigación sobre la creación de Skills para agentes de IA, la estandarización del ciclo de desarrollo y la transición a Fase 3."
---

# 09 — Skills para Agentes y Automatización del Desarrollo

## Contexto e Investigación

Con el SDK funcional, los ejemplos validados y la documentación consolidada, el equipo identificó una oportunidad crítica: **automatizar el ciclo de desarrollo mediante agentes de IA especializados**. El repositorio ya contaba con una base de agentes GitHub (`.github/agents/`) y skills (`.github/skills/`), pero con importantes gaps:

- **3 de 9 skills listadas en `docs/agents/README.md` tenían SKILL.md real**; las otras 6 eran solo referencias.
- **No existía un skill de testing** que documentara el framework, patrones y cobertura esperada.
- **No existía un skill de auditoría forense** que guiara revisiones de seguridad como la documentada en el ADR 10.
- **No existía un contexto de repositorio canónico** (`REPOSITORY_CONTEXT.md` o similar) para que los agentes entendieran la arquitectura, convenciones y reglas del proyecto.
- **Los agentes listados no tenían boundaries claros** — no se especificaba qué agente hacía qué, generando overlap.

Se realizó un análisis de los flujos de trabajo recurrentes que podían ser automatizados:

| Flujo | Frecuencia | Automatizable | Prioridad |
|-------|-----------|:-------------:|:---------:|
| Code review | Cada PR | Alta | 🔴 |
| Testing (setup, ejecución, validación) | Cada commit | Alta | 🔴 |
| Release (versionado, changelog, publish) | Semanal | Alta | 🔴 |
| Onboarding de nuevos desarrolladores | Mensual | Media | 🟡 |
| Auditoría de seguridad | Trimestral | Media | 🟡 |
| Benchmarking de rendimiento | Por release | Baja | 🟢 |

## Decisiones Arquitectónicas (ADR)

1. **Arquitectura de Skills como Documentación Modular por Caso de Uso:**
   - **Decisión:** Cada skill se estructura como un documento Markdown independiente con metadatos, contexto, procedimiento paso a paso, ejemplos, criterios de aceptación y referencias a ADRs relacionados. Los skills residen en `docs/agents/skills/` con un README que lista el inventario completo.
   - **Por qué:** La modularidad permite que los agentes carguen solo el skill necesario para la tarea actual, reduciendo el ruido contextual. Los metadatos (versión, tags, agentes objetivo) permiten descubrimiento automatizado.
   - **Implementación:** Formato estándar definido en `docs/agents/skills/README.md` con plantilla.

2. **Skills Esenciales vs. Aspiracionales:**
   - **Decisión:** Se clasificaron los skills en tres niveles: esenciales (deben existir para el ciclo básico), recomendados (mejoran la calidad) y aspiracionales (visión futura). La Fase 3 se enfoca en los esenciales: `testing-patterns`, `security-audit`, `onboarding` y `emergency-release`.
   - **Por qué:** Intentar crear todos los skills simultáneamente diluye la calidad y retrasa la entrega. El enfoque iterativo permite validar cada skill con uso real antes de pasar al siguiente.
   - **Implementación:** Priorización documentada en `docs/agents/README.md` con tabla de estado y target de completitud por fase.

3. **Contexto de Repositorio Canónico para Agentes:**
   - **Decisión:** Se creará un archivo `REPOSITORY_CONTEXT.md` en la raíz que describa la arquitectura del proyecto, convenciones de código, reglas de documentación y referencias a ADRs clave. Este archivo es el primer documento que un agente debe leer al incorporarse al repositorio.
   - **Por qué:** Sin un contexto canónico, cada agente debe inferir la arquitectura desde cero, lo que lleva a decisiones inconsistentes y sugerencias fuera de lugar.
   - **Implementación:** `REPOSITORY_CONTEXT.md` con secciones: propósito, arquitectura, stack tecnológico, convenciones, documentación, agentes y skills.

## Resultados y Siguientes Pasos

La arquitectura de skills permitió:
- Separación clara entre conocimiento del dominio (skills) y ejecución (agentes).
- Priorización realista con entrega iterativa por fase.
- Base para la Fase 3 completa, que incluye la implementación de los 4 skills esenciales.

Los siguientes pasos son:
1. Implementar `testing-patterns` skill (alta prioridad, base para calidad).
2. Implementar `security-audit` skill (hereda hallazgos del ADR 10).
3. Implementar `onboarding` skill (reduce fricción para nuevos contribuidores).
4. Implementar `emergency-release` skill (hotfix y rollback).
5. Crear `REPOSITORY_CONTEXT.md` como fuente de verdad para agentes.

---

[← Consolidación de la Documentación Bilingüe](08_consolidacion-documentacion-bilingue.md) | [Índice](00_indice.md)
