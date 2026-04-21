# 04 Validación y publicación de ts_js

El proceso de validación técnica es un requisito indispensable para considerar completa cualquier modificación en el SDK `ts_js`. Los criterios de aceptación se ajustan según el alcance del cambio, garantizando la estabilidad de la superficie pública y de sus flujos operativos.

## Baseline de Validación Técnica

Ante cambios en la arquitectura, el sistema de construcción (build), los adaptadores o los ejemplos de integración, se debe ejecutar la siguiente suite de verificación:

1.  **Sincronización**: `npm install` para validar la integridad de las dependencias.
2.  **Construcción**: `npm run build` para asegurar la materialización correcta de los artefactos.
3.  **Pruebas Unitarias e Integración**: `npm test` para certificar el cumplimiento de los contratos lógicos.
4.  **Cobertura de Escenarios**: Ejecución de ejemplos representativos vinculados a la superficie modificada.
5.  **Simulación de Publicación**: `npm run publish:jsr:dry-run` ante cambios en la compatibilidad con Deno o en la definición del contrato JSR.

## Estrategia de Validación de Ejemplos

La selección de ejemplos para pruebas de humo se realiza de forma quirúrgica, priorizando los que cubren el dominio impactado:

- **Infraestructura Core**: Se validan mediante `example-nodejs/` (CLI, manifests, tooling, filesystem).
- **Portabilidad Deno**: Se validan mediante `example-deno/` (adaptador, `jsr.json`, importaciones ESM).
- **Ecosistema Frontend**: Se validan mediante ejemplos basados en Vite (React, Vue, Solid, Svelte).
- **Integración de Herramientas**: Se validan mediante la carpeta `bundlers/` (plugins de construcción).
- **Entornos Controlados**: Se validan mediante `example-tauri/` (seguridad y lectura de artefactos).

## Gobernanza de Publicación

El SDK mantiene una estrategia de distribución dual, tratando a npm y JSR como plataformas complementarias:

- **npm**: Distribuye los binarios y artefactos generados en `dist/`.
- **JSR**: Publica el código fuente y valida la compatibilidad nativa con Deno a través de `jsr.json`.

Antes de proceder con una publicación de release, es imperativo certificar que tanto el build como los tests y los ejemplos relevantes se encuentran en estado óptimo ("verde") y que la simulación de publicación de Deno no arroja advertencias imprevistas.

## Mantenimiento Documental y de Calidad

Cualquier cambio estructural en la lógica, rutas de archivos, espacios de trabajo o flujos de orquestación debe reflejarse inmediatamente en esta carpeta de soporte al desarrollo. La documentación técnica debe evolucionar en sincronía con el código fuente para asegurar la transparencia operativa del proyecto.