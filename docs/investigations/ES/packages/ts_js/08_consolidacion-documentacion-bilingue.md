---
title: "08 — Consolidación de la Documentación Bilingüe"
description: "ADR y registro de investigación sobre la arquitectura de documentación bilingüe EN/ES y la estrategia de migración a Docusaurus."
---

# 08 — Consolidación de la Documentación Bilingüe

## Contexto e Investigación

A medida que el proyecto crecía, la documentación se había expandido orgánicamente en dos idiomas (ES y EN) sin una convención clara de nomenclatura, estructura o propiedad. Esto generó varios problemas:

- **Duplicación inadvertida:** En `docs/users/ES/packages/ts_js/` se identificaron 12 pares de archivos con naming underscore vs guion (ej. `01_instalacion.md` y `01-instalacion.md`) que contenían el mismo contenido en el mismo idioma.
- **Rutas redundantes:** Directorios como `docs/package/ES/packages/ts_js/` estaban vacíos, creando confusión sobre dónde residía la documentación autoritativa.
- **Gaps de cobertura:** La documentación EN carecía de archivos que sí existían en ES (ej. `04_validacion-y-publicacion.md`), y viceversa.
- **Sección "How it works" duplicada:** El mismo texto de 12 líneas sobre trait discovery aparecía en 7 READMEs de ejemplos, creando riesgo de desincronización.

Se realizó un inventario completo de la documentación existente:

```
docs/
├── architecture/      ← 2 archivos (diagramas C4 PlantUML + visión estructural)
├── development/       ← 8 ES + 6 EN (guías técnicas internas)
├── investigations/    ← 8 ES + 7 EN (ADRs e investigaciones)
├── package/           ← 9 ES + 9 EN (publicación, versionado, CI/CD)
├── users/             ← 20+ ES + 20+ EN (documentación de usuario final)
├── agents/            ← README + skills
└── README.md          ← Landing page del sistema documental
```

## Decisiones Arquitectónicas (ADR)

1. **Arquitectura de Documentación en Árbol con Separación por Idioma:**
   - **Decisión:** Se estableció una estructura de directorios donde cada subdirectorio temático (`architecture/`, `development/`, `investigations/`, `package/`, `users/`, `agents/`) contiene subdirectorios `EN/` y `ES/` con documentos específicos.
   - **Por qué:** La separación física por idioma permite traducciones independientes, navegación clara y herramientas de linting específicas por idioma. Los archivos EN usan guiones (`00-index.md`), los ES usan guiones bajos (`00_indice.md`) para diferenciación visual inmediata.
   - **Implementación:** Convención documentada en `docs/README.md` y en `AGENTS.md` como regla obligatoria.

2. **Migración Target a Docusaurus en Repositorio Separado:**
   - **Decisión:** La documentación actual en Markdown plano está diseñada para ser migrada a Docusaurus en un repositorio separado en el futuro. La estructura de directorios refleja la organización esperada de Docusaurus (sidebar, categorías, bilingüe).
   - **Por qué:** Docusaurus proporciona navegación con buscador, versionado de documentación, soporte multidioma nativo y despliegue automatizado. Mantener la estructura compatible desde el inicio evita una migración traumática.
   - **Implementación:** Cada subdirectorio `docs/<categoria>/` mapea a una categoría de Docusaurus. Los archivos `00-index.md` / `00_indice.md` mapean a la página de inicio de cada categoría.

3. **Deduplicación y Limpieza de Rutas Huérfanas:**
   - **Decisión:** Se eliminaron todas las rutas redundantes (ej. `docs/package/ES/packages/ts_js/` → fusionado a `docs/package/ES/`) y directorios vacíos con `.gitkeep` sin propósito documentado.
   - **Por qué:** La presencia de rutas múltiples para el mismo contenido crea ambigüedad sobre cuál es la fuente autoritativa. Cada concepto debe existir en exactamente un lugar.
   - **Implementación:** Barrido manual con verificación de `git ls-files` para confirmar que ninguna ruta eliminada contenía archivos trackeados.

## Resultados y Siguientes Pasos

La consolidación documental redujo la superficie de documentación en ~15%, eliminó rutas ambiguas y estableció una convención clara para contribuciones futuras. La cobertura bilingüe quedó documentada en `docs/README.md` con tabla de estado.

El siguiente paso es la migración efectiva a Docusaurus, que incluye: configuración del proyecto Docusaurus, definición de sidebars, despliegue automatizado vía GitHub Pages y redirección desde los READMEs actuales.

---

[← Estandarización del Catálogo de Algoritmos](07_estandarizacion-catalogo-algoritmos.md) | [Índice](00_indice.md)
