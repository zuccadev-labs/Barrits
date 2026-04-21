# 06 Tooling, publicación y plataformas de ts_js

La gestión del SDK `ts_js` contempla múltiples superficies de distribución y diversas integraciones de herramientas de terceros. Por este motivo, las restricciones de construcción, publicación y compatibilidad de plataformas se documentan de forma centralizada.

## Estrategia de Distribución: npm y JSR

El SDK sincroniza dos modelos de entrega diferenciados para cubrir las necesidades del ecosistema moderno de JavaScript:

- **npm**: Centrado en la distribución de la salida compilada y optimizada (`dist/`), asegurando la integridad de los paquetes CommonJS y ESM.
- **JSR**: Focalizado en la publicación de código fuente para entornos Deno, validando la compatibilidad nativa mediante el archivo `jsr.json`.

## Integración con Ecosistemas de Construcción (Bundlers)

Se proveen adaptadores ligeros y certificados para Vite, esbuild, Rollup y Webpack. Todos los plugins están diseñados para consumir el contrato de manifest estándar del orquestador, evitando la duplicación de lógica de descubrimiento en cada herramienta.

## Compatibilidad con Windows y Scripting

En entornos Windows, y considerando la presencia de caracteres especiales (`&`) en las rutas del espacio de trabajo, se prioriza la ejecución directa de scripts mediante `node` sobre archivos de origen (`.ts`/`.js`). Esta práctica evita la fragilidad inherente a los wrappers `.cmd` y garantiza una ejecución consistente entre sistemas operativos.

## Criterios de Validación Multiplataforma

Cualquier cambio que impacte una superficie específica del SDK debe ser validado en el entorno correspondiente para certificar su estabilidad:

- **Capa CLI/Servidor**: Validación mediante Node.js para interfaces de comando y lectores de sistema.
- **Capa de Portabilidad**: Validación mediante Deno para adaptadores nativos y contratos JSR.
- **Capa de Construcción**: Validación mediante plugins en entornos de bundling reales.
- **Capa de Escritorio**: Validación mediante Tauri para consumos seguros de artefactos.