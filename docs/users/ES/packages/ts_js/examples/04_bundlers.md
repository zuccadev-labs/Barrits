# 04 Bundlers

La carpeta `packages/sdk/ts_js/examples/bundlers/` se utiliza para auditar y validar las integraciones técnicas de build de forma aislada, evitando mezclar estas pruebas con la lógica operativa de los ejemplos de runtime.

## Herramientas de build cubiertas

El SDK provee soporte oficial y validación para los siguientes bundlers:

- **Vite**: Plugin para despliegues modernos y desarrollo rápido.
- **esbuild**: Integración de alto rendimiento para builds de servidor y CLI.
- **Rollup**: Configuración optimizada para librerías distributivas.
- **Webpack**: Soporte para ecosistemas corporativos legados o configuraciones complejas.

## Comandos de validación técnica

```bash
# Validaciones individuales
npm run build:vite
npm run build:esbuild
npm run build:rollup
npm run build:webpack

# Validación integral de la suite
npm run build:all
```

## Propósito arquitectónico

Esta suite de ejemplos permite verificar dos aspectos críticos del sistema:

1. Que los plugins de Barrits autogeneran correctamente el manifest en la ubicación configurada según las reglas de cada bundler.
2. Que los adaptadores de bundling funcionan de forma hermética, sin contaminar la narrativa ni las dependencias del consumidor de runtime puro (ej. Node.js).

Para demostraciones visuales de producto o recorridos de experiencia de usuario, se recomienda consultar los ejemplos de runtime o frontend. Esta carpeta está reservada exclusivamente para validación técnica de integración de herramientas de build.