# 03 Camino hacia el monorepo de ts_js

La arquitectura inicial del proyecto no contemplaba una estructura de monorepo. Originalmente, el SDK se distribuía desde la raíz del repositorio, con ejemplos y herramientas de soporte coexistiendo en el mismo espacio lógico. Este diseño, funcional en etapas tempranas, demostró limitaciones en escalabilidad ante la necesidad de dar soporte a múltiples SDKs.

## Evaluación de Limitaciones Estructurales

Se identificaron tres problemas críticos en el modelo centralizado inicial:

1.  **Confusión de Roles**: La raíz del repositorio mezclaba responsabilidades de orquestación global con tareas de publicación del paquete TS/JS.
2.  **Solapamiento de Niveles**: Directorios de ejemplos, código fuente, pruebas y adaptadores convivían en el mismo plano jerárquico, dificultando la navegación técnica.
3.  **Falta de Ruta de Crecimiento**: La estructura no facilitaba la incorporación futura de SDKs en otros lenguajes (ej. Go o Python) sin generar conflictos de gobernanza.

## Resolución: Migración y Segmentación

Se ejecutó una migración estratégica moviendo el paquete publicable al subdirectorio `packages/sdk/ts_js/`. Simultáneamente, se reubicaron los ejemplos dentro de la estructura del propio SDK, asegurando que la experiencia de integración estuviera vinculada directamente a la superficie del paquete correspondiente.

## Beneficios de la Nueva Arquitectura

La adopción de la estructura de monorepo ha permitido alcanzar los siguientes hitos operativos:

- **Gobernanza Centralizada**: Una raíz privada que coordina exclusivamente los espacios de trabajo (workspaces).
- **Publicación Hermética**: Un paquete con superficie de salida clara y aislada en `packages/sdk/ts_js`.
- **Coherencia de Contexto**: Los ejemplos de uso residen junto al SDK que los sustenta, respetando la familia de cada lenguaje.
- **Escalabilidad Multilenguaje**: Se ha establecido un patrón reproducible para la incorporación de nuevos SDKs bajo la jerarquía de `packages/sdk/`.