# 01 Arquitectura de carpetas de ts_js

El SDK `barrits` se organiza como un paquete publicable dentro de un monorepo, manteniendo una separación estricta entre el núcleo operativo, los adaptadores de entorno y las herramientas de validación.

## Estructura de Responsabilidades

Cada Directorio cumple una función específica dentro del ciclo de vida del SDK:

- **`packages/sdk/ts_js/src/`**: Contiene la lógica central y la superficie reusable del SDK.
- **`packages/sdk/ts_js/src/barrits/`**: Centraliza la capa pública, la orquestación interna y la lógica operativa del nivel de entrada.
- **`packages/sdk/ts_js/src/barrits_lib/`**: Alberga algoritmos y soporte interno aislados de la arquitectura visible del consumidor final.
- **`packages/sdk/ts_js/adapters/`**: Resuelve las disparidades tecnológicas entre runtimes (Node.js y Deno principalmente).
- **`packages/sdk/ts_js/examples/`**: Contiene implementaciones reales que consumen el SDK, sirviendo como prueba de concepto y referencia de integración.
- **`packages/sdk/ts_js/tests/`**: Valida los contratos del paquete, plugins, adaptadores y flujos de automatización.
- **`packages/sdk/ts_js/benchmarks/`**: Mide el rendimiento de componentes críticos por costo computacional o volumen de datos.

## Gobernanza del Monorepo

La raíz del repositorio actúa exclusivamente como coordinadora de espacios de trabajo (workspaces), siguiendo normas estrictas de publicación:

- El archivo `package.json` de la raíz se mantiene como privado.
- El paquete distribuible reside de forma autónoma en `packages/sdk/ts_js/package.json`.
- La documentación se segmenta por área y lenguaje dentro del directorio `docs/`.

## Capas de Abstracción

Se establece el siguiente orden jerárquico para las comunicaciones internas:

1.  **Exposición**: Funciones, namespaces y contratos se exponen desde `src/`.
2.  **Encapsulamiento**: Los detalles técnicos de cada runtime se aislan en `adapters/`.
3.  **Consumo**: Los ejemplos en `examples/` actúan como clientes externos que validan la experiencia de uso sin interferir en el núcleo.
4.  **Validación**: Las pruebas y métricas aseguran la integridad y el cumplimiento de los contratos de diseño.

## Criterios de Evolución y Crecimiento

Al incorporar nuevos componentes, la ubicación se determina bajo los siguientes criterios técnicos:

- **API Reusable**: Se ubica en `src/`.
- **Dependencias de Runtime**: Se delegan a `adapters/`.
- **Referencia de Consumo**: Se añade a `examples/`.
- **Validación de Comportamiento**: Se integra en `tests/`.
- **Métricas de Rendimiento**: Se destinan a `benchmarks/`.

Esta disciplina arquitectónica previene la degradación del diseño y evita la mezcla de artefactos de soporte con el código distribuible.