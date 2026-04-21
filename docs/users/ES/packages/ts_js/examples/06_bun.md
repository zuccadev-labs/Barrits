# 06 Bun

El ejemplo `packages/sdk/ts_js/examples/example-bun/` valida la integración del SDK en el runtime de Bun, aplicando scripts operativos bajo el contrato **package-first**.

## Objetivos del escenario de validación

Este ejemplo responde a tres requisitos fundamentales de portabilidad:

1. Ejecución íntegra del SDK mediante `bun run` sin requerir Node.js como motor principal de ejecución.
2. Mantenimiento de la capa de dominio visible del consumidor bajo el directorio estándar `barrits/`.
3. Aplicación simultánea del contrato de descubrimiento, utilidades funcionales de alto rendimiento y gestión de rutas operativas en un flujo único.

## APIs validadas en este entorno

- **`defineBarritsPackage`**: Establece la configuración del consumidor nativo de Bun.
- **`orderBy` / `averageBy`**: Procesamiento de datos y resúmenes estadísticos.
- **`movingAverage` / `topK`**: Análisis de series temporales y detección de picos operativos.
- **`buildPath` / `parsePath`**: Construcción y auditoría de rutas de archivos operativas.

## Recorrido de verificación recomendado

1. Ejecutar `bun run dev` para validar la integridad de la salida del sistema.
2. Inspeccionar `src/main.ts` para comprender la secuencia lógica de ejecución del orquestador.
3. Revisar `barrits/index.ts` para auditar la configuración de la superficie visible del consumidor.
4. Ejecutar `bun run inspect` para validar el motor de descubrimiento sobre el proyecto.

## Comandos disponibles

```bash
bun run dev       # Ejecución de lógica de negocio
bun run showcase  # Demostración de algoritmos integrados
bun run build     # Generación de artefactos de producción
bun run inspect   # Auditoría y discovery del proyecto
```

## Escenarios de uso recomendados

- Proyectos que han adoptado **Bun** como entorno de ejecución corporativo principal.
- Implementaciones que requieren demostraciones funcionales rápidas y de alto rendimiento sin capa visual.
- Auditorías de portabilidad que necesiten confirmar que la lógica del orquestador se mantiene inmutable ante el cambio de runtime.
