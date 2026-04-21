# Guía de Usuario — @zuccadev-labs/barrits (ts_js)

Esta carpeta documenta cómo instalar `barrits`, cómo empezar a consumirlo y qué prácticas seguir para mantener el contrato package-first.

## Orden de lectura

| # | Documento | Propósito |
| :--- | :--- | :--- |
| 01 | [Instalación](01_instalacion.md) | Instalación del paquete y prerequisitos |
| 02 | [Primeros Pasos](02_primeros-pasos.md) | Configuración mínima de un proyecto consumidor |
| 03 | [Ejemplos y Recorridos](03_ejemplos-y-recorridos.md) | Guía paso a paso por escenarios comunes |
| 04 | [Buenas Prácticas](04_buenas-practicas.md) | Patrones y convenciones recomendadas |
| 05 | [Automatización y Configuración](05_automatizacion-y-configuracion.md) | `barrits.config.*`, `automationDirectory` y ciclo de vida |
| 06 | [Comandos y Runtimes](06_comandos-y-runtimes.md) | CLI en Node.js y Deno |
| 07 | [Manifests, Bundlers y Consumo](07_manifests-bundlers-y-consumo.md) | Lectura de artefactos e integración con bundlers |
| 08 | [Traits y Composición](08_traits-y-composicion.md) | Descriptores declarativos de traits y composición de pipelines |
| 09a | [Referencia de API — Configuración](09a_referencia-de-api-configuracion.md) | `defineBarritsPackage`, `createTraitDescriptor`, manifests |
| 09b | [Referencia de API — Algoritmos](09b_referencia-de-api-algoritmos.md) | Colecciones, búsqueda, ordenamiento, series temporales, grafos |
| 09c | [Referencia de API — Consume y Adapters](09c_referencia-de-api-consume-y-adapters.md) | Readers de manifests, adapters Node/Deno, plugins de bundlers |

> El archivo `09_referencia-de-api.md` original está disponible como referencia de respaldo. Los documentos `09a`, `09b` y `09c` son la versión activa.

## Índice de Ejemplos

- [Mapa General de Ejemplos](examples/00_indice.md)
- [Node.js y Deno](examples/02_nodejs-y-deno.md)
- [Frontend con Vite](examples/03_frontend-vite.md)
- [Bundlers](examples/04_bundlers.md)
- [Tauri](examples/05_tauri.md)
- [Bun](examples/06_bun.md)

## Regla editorial

- El `README.md` del paquete es la portada pública que se ve en npm y JSR.
- Esta carpeta expande el uso real en español.
- Los README de los ejemplos enlazan aquí en lugar de repetir la referencia completa de API.

## Navegación

- [← Raíz del repositorio](../../../../README.es.md)
- [Inicio Rápido del Paquete](../../../../packages/sdk/ts_js/README.md)
- [Guía de Desarrollo](../../../development/ES/packages/ts_js/00_indice.md)
- [Investigaciones](../../../investigations/ES/packages/ts_js/00_indice.md)
