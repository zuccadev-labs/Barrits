# Índice de Guía de Usuario — @zuccadev-labs/barrits

Bienvenido a la documentación para usuarios y consumidores del SDK `@zuccadev-labs/barrits`.

> **Nota:** Esta sección está diseñada para desarrolladores que integran Barrits en sus proyectos. Si estás buscando entender las decisiones de diseño o el desarrollo interno del SDK, consulta la [Guía de Desarrollo](../../../development/ES/packages/ts_js/00-indice.md) o el [Índice de Investigaciones](../../../investigations/ES/packages/ts_js/00-indice.md).

---

## Orden de lectura

| # | Documento | Propósito |
| :--- | :--- | :--- |
| 01 | [Instalación](01-instalacion.md) | Instalación del paquete y prerequisitos |
| 02 | [Primeros Pasos](02-primeros-pasos.md) | Configuración mínima de un proyecto consumidor |
| 03 | [Ejemplos y Recorridos](03-ejemplos-y-recorridos.md) | Guía paso a paso por escenarios comunes |
| 04 | [Buenas Prácticas](04-buenas-practicas.md) | Patrones y convenciones recomendadas |
| 05 | [Automatización y Configuración](05-automatizacion-y-configuracion.md) | `barrits.config.*`, `automationDirectory` y ciclo de vida |
| 06 | [Comandos y Runtimes](06-comandos-y-runtimes.md) | CLI en Node.js y Deno |
| 07 | [Manifests, Bundlers y Consumo](07-manifests-bundlers-y-consumo.md) | Lectura de artefactos e integración con bundlers |
| 08 | [Traits y Composición](08-traits-y-composicion.md) | Descriptores declarativos de traits y composición de pipelines |
| 09 | [Referencia de API — Superficie Completa](09-referencia-de-api.md) | Referencia consolidada de toda la superficie pública (archivo histórico) |
| 09a | [Referencia de API — Configuración](09a-referencia-de-api-configuracion.md) | `defineBarritsPackage`, `createTraitDescriptor`, manifests |
| 09b | [Referencia de API — Algoritmos](09b-referencia-de-api-algoritmos.md) | Colecciones, búsqueda, ordenamiento, series temporales, grafos |
| 09c | [Referencia de API — Consume y Adapters](09c-referencia-de-api-consume-y-adapters.md) | Readers de manifests, adapters Node/Deno, plugins de bundlers |
| 09d | [Referencia de API — Traits y Composición](09d-referencia-de-api-traits-y-composicion.md) | Descriptores de traits, composición y tipado avanzado |
| 10 | [Deno BaaS Core (IoC, Schema)](10-deno-baas-core.md) | Contenedor IoC dinámico y primitivas OpenAPI |
| 11 | [Guía de Migración 0.1.x → 0.2.x](11_migracion-0.1-a-0.2.md) | Cambios rupturistas, nuevas exportaciones y pasos de actualización |
| 12 | [Estructura del Proyecto y Discovery](12-estructura-del-proyecto-y-discovery.md) | Layout, resolución de config, estrategias de discovery, lectura de manifiesto por runtime |

---

## Índice de Ejemplos

En el repositorio, dentro de `packages/sdk/ts_js/examples/`, encontrarás proyectos listos para ejecutar que demuestran la integración de Barrits en diversos entornos:

- `example-nodejs/`: Scripting, showcase y benchmarking en Node.js.
- `example-deno/`: Consumo package-first en Deno/JSR.
- `example-deno-baas/`: Contenedor IoC dinámico y generación de OpenAPI para backends.
- `example-bun/`: Contrato package-first con scripts de alto rendimiento en Bun.
- `example-react/`: Integración con Vite + React y empaquetado de traits en frontend.
- `example-vue/`: Discovery bajo `src/barrits/` con Vite + Vue.
- `example-solid/`: Validación del mismo contrato en Solid.
- `example-svelte/`: Cobertura package-first en Svelte.
- `example-tauri/`: Consumo seguro de artefactos desde aplicaciones de escritorio.
- `bundlers/`: Integración directa con esbuild, Rollup, Vite y Webpack.

Cada ejemplo cuenta con su propio `README.md` con instrucciones de ejecución (`npm run dev`, `deno run`, etc.).

## Regla editorial

- El `README.md` del paquete es la portada pública que se ve en npm y JSR.
- Esta carpeta expande el uso real en español.
- Los README de los ejemplos enlazan aquí en lugar de repetir la referencia completa de API.

## Navegación

- [← Raíz del repositorio](../../../../README.es.md)
- [Inicio Rápido del Paquete](../../../../packages/sdk/ts_js/README.md)
- [Guía de Desarrollo](../../../development/ES/packages/ts_js/00-indice.md)
- [Investigaciones](../../../investigations/ES/packages/ts_js/00-indice.md)
