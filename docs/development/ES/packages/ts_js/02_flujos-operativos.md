# 02 Flujos operativos de ts_js

`barrits` se diseña como una solución integral que incorpora un motor de automatización nativo. El ecosistema del SDK trasciende el concepto de una librería tradicional de importaciones, actuando como un orquestador de flujos de trabajo.

## Flujo de Descubrimiento (Discovery)

El núcleo (core) localiza la estructura del proyecto consumidor para construir un grafo dinámico de dominios, archivos y exportaciones.

El proceso se ejecuta en la siguiente secuencia:

1.  Detección del runtime activo y del directorio de trabajo actual.
2.  Localización de la carpeta de dominio visible del consumidor.
3.  Inspección exhaustiva de dominios, barrels, exportaciones y traits.
4.  Proyección de resultados hacia artefactos técnicos (manifests y snapshots).

## Flujo de Construcción (Build)

Durante el proceso de compilación, el sistema garantiza la integridad de los artefactos:

1.  Compilación del SDK desde el directorio raíz del paquete (`packages/sdk/ts_js`).
2.  Generación del directorio de distribución (`dist/`) exclusivo para el paquete publicable.
3.  Resolución de dependencias locales para asegurar que los ejemplos consuman la versión más reciente del código.
4.  Validación de consistencia de los manifests y asistentes de consumo.

## Flujos de Desarrollo y Monitoreo (Watch/Dev)

La funcionalidad de monitoreo no opera como un servicio persistente del sistema, sino que se vincula estrictamente a las sesiones activas de desarrollo:

- El proceso de monitoreo automático no se inicia durante la instalación del paquete.
- El sistema de watch se activa solo cuando la sesión de desarrollo actual lo requiere específicamente.
- El proceso finaliza automáticamente al concluir la sesión de trabajo principal.

## Estrategia de Consumo de la API

Se mantienen tres superficies de interacción complementarias para el usuario:

- **Estructural**: Importaciones directas para acceso a funciones y namespaces.
- **Infraestructura**: Subpaths especializados para plugins de bundler y adaptadores de runtime.
- **Operacional**: Comandos de CLI disponibles para diagnóstico y tareas puntuales.

## Entornos de Integración (Ejemplos)

El directorio `packages/sdk/ts_js/examples/` actúa como el banco oficial de validación de escenarios de uso:

- **Node.js**: Scripts de servidor y consumo de lógica de negocio.
- **Deno**: Validación de portabilidad y publicación en JSR.
- **Frontend (Vite)**: Integración nativa con React, Vue, Solid y Svelte.
- **Escritorio (Tauri)**: Lectura segura de estados desde backends locales.
- **Bundling**: Pruebas técnicas específicas de integración de herramientas de construcción.