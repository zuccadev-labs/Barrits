# 08 Pipeline de CI/CD y Estrategia de Ramas

Este documento describe los flujos de integración, validación, lanzamiento y publicación del repositorio Barrits, garantizando la integridad técnica de cada entrega.

## Modelo de Ramificación (Branching Model)

Se establece una estructura jerárquica para la gobernanza del código:

| Rama | Propósito |
| :--- | :--- |
| `feature/*` (o ramas de trabajo) | Desarrollo de funcionalidades o correcciones técnicas. |
| `dev` | Integración, validación y base para pre-lanzamientos (staging). |
| `main` | Reservada exclusivamente para versiones estables certificadas. |

Las publicaciones no se activan directamente desde las ramas de trabajo; se disparan exclusivamente mediante la creación de tags tras la aprobación de un Pull Request.

## Disparadores del Pipeline (Triggers)

| Evento | Pipeline | Tareas Ejecutadas |
| :--- | :--- | :--- |
| Push a `dev` / `main` | Integración CI + Seguridad | `typecheck → build → test → examples → jsr-dry-run` y auditoría de seguridad. |
| Pull Request a `dev` / `main` | Integración CI + Seguridad | Validación técnica completa y revisión de dependencias. |
| Envío de tag `pre-v*` | Pre-lanzamiento (Prerelease) | Validación de tag, publicación en npm (tag `next`), JSR y GitHub Pre-release. |
| Envío de tag `v*` | Lanzamiento Estable | Validación de tag, publicación en npm (tag `latest`), JSR y GitHub Release oficial. |

## Ciclo de Vida de una Release

### Ciclo de Pre-lanzamiento

1. El desarrollo se consolida en ramas `feature/*` y se integra en `dev` mediante Pull Request.
2. Una vez certificada la rama `dev`, se incrementa la versión en los manifiestos (ej. `0.2.0-rc.1`).
3. Se genera y envía el tag `pre-vX.Y.Z-rc.N`.
4. El pipeline publica en npm bajo el tag `next`, publica en JSR y genera el artefacto en GitHub.

### Ciclo de Lanzamiento Estable

1. Se promueven los cambios de `dev` a `main` mediante un Pull Request formal.
2. Tras la fusión, se establece la versión estable (ej. `0.2.0`).
3. Se genera y envía el tag oficial `vX.Y.Z`.
4. El pipeline ejecuta la distribución final hacia npm (`latest`), JSR y formaliza la Release en GitHub.

## Reglas de Etiquetado (Tags)

| Patrón de Tag | Rama Origen | npm dist-tag | Objetivo |
| :--- | :--- | :--- | :--- |
| `pre-vX.Y.Z-rc.N` | `dev` | `next` | Pre-release para evaluación técnica profunda. |
| `vX.Y.Z` | `main` | `latest` | Versión estable para producción. |

El sistema de automatización valida que el tag corresponda a la rama esperada y que la versión declarada en los manifiestos coincida con el identificador del tag.

## Cobertura de Publicación

- **npm**: Cubre entornos Node.js, Frontend (React, Vue, Solid, Svelte), Bundlers, Tauri y Bun. Distribuido bajo tags `next` o `latest`.
- **JSR**: Cubre específicamente el ecosistema Deno, alineado con el contrato de `jsr.json`.

No se considera necesaria la adición de registros públicos adicionales para cubrir los escenarios de integración vigentes.
