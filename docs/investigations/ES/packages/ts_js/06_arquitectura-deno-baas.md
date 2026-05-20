---
title: "06 — Arquitectura Deno BaaS (Parse-Server Alternative)"
description: "ADR y registro de investigación para la arquitectura Deno BaaS, Inversión de Control y la delegación de bases de datos."
---

# 06 — Arquitectura Deno BaaS (Parse-Server Alternative)

## Contexto e Investigación

El objetivo original de `barrits` era proveer descubrimiento AST para unificar bundlers. Sin embargo, la madurez del modelo de **Programación Orientada a Traits** demostró que la misma metadata estática (qué módulo necesita qué y qué provee) podía usarse para provisionar servicios en tiempo de ejecución.

Se detectó una oportunidad corporativa: construir un núcleo de Backend-as-a-Service (BaaS) en Deno puro que rivalice con *Parse-Server*, pero sin el overhead de frameworks monolíticos. Deno provee `Deno.KV` (base de datos nativa) nativamente, lo cual es ideal para este caso de uso.

## Decisiones Arquitectónicas (ADR)

1. **Inversión de Control (IoC) basada en AST en lugar de Decoradores Runtime:**
   - **Decisión:** En lugar de usar decoradores en runtime y `reflect-metadata` (que acopla el código a un framework y degrada el rendimiento), el contenedor IoC lee el manifiesto generado en tiempo de compilación.
   - **Por qué:** Permite mantener el código limpio (solo comentarios JSDoc / Traits) y 100% agnóstico del runtime.
   - **Implementación:** `BarritsIoCContainer` en `src/barrits/ioc/index.ts`.

2. **Autogeneración de Esquemas (OpenAPI) desde JSDoc:**
   - **Decisión:** Inferir esquemas OpenAPI v3.1 dinámicamente usando las etiquetas (ej. `@barrits-trait http-endpoint`).
   - **Por qué:** Elimina la desincronización clásica entre la implementación y la documentación YAML/Swagger.
   - **Implementación:** `generateOpenApiSchema` en `src/barrits/schema/openapi.ts`.

3. **Delegación Estricta de Bases de Datos (Principio de Responsabilidad Única):**
   - **Decisión:** Originalmente se implementó un adaptador oficial seguro para Deno KV dentro del core. Sin embargo, se decidió eliminarlo completamente.
   - **Por qué:** Un motor orquestador AST no debe mantener implementaciones físicas de bases de datos. Deno KV, Postgres o Mongo deben ser proveídos e inyectados exclusivamente por el *BaaS Consumidor* (como el nuevo Parse-Server), manteniendo a Barrits como un sistema puramente lógico que opera en memoria.
   - **Impacto:** Reducción del tamaño del SDK, eliminación de responsabilidades de seguridad sobre I/O del filesystem, e incremento en la cohesión del código base.

## Resultados y Siguientes Pasos

Esta purificación convierte a Barrits en la fundación definitiva para orquestadores generados por Inteligencia Artificial (LLMs) y sistemas corporativos autoconfigurables. El próximo paso natural para el desarrollo del *Parse-Server replacement* será implementar los adaptadores de bases de datos en la capa superior (el BaaS) e integrar verificadores de runtime (Zod/Valibot).

---

[← Conclusiones y Límites de Diseño](05_conclusiones-y-limites.md) | [Índice](00_indice.md)
