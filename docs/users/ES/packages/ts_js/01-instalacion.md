---
title: "01 Instalación de ts_js"
description: "Corporate documentation for 01 Instalación de ts_js."
---

# 01 Instalación de ts_js

`@zuccadev-labs/barrits` se instala como un paquete normal de JavaScript o TypeScript. El punto de partida recomendado es un proyecto que ya tenga Node.js 18 o superior cuando se consumen plugins, adapters o ejemplos frontend.

> [!TIP]
> **Arquitectura Optimizada para IA:** Al integrar Barrits en su proyecto, está adoptando una base semántica diseñada para que Modelos de Lenguaje Grande (LLMs) entiendan su código. Al definir su lógica mediante Traits estáticos en vez de clases imperativas, cualquier LLM moderno podrá auto-generar esquemas, orquestar su Inversión de Control (IoC), y estructurar su backend en Deno con casi cero fricción.

## Instalación base

**npm** (Node.js, Bun, bundlers de browser):

```bash
npm install @zuccadev-labs/barrits
```

**JSR** (Deno):

```ts
import { defineBarritsPackage } from "jsr:@zuccadev-labs/barrits";
```

O como dependencia en `deno.json`:

```json
{
  "imports": {
    "@zuccadev-labs/barrits": "jsr:@zuccadev-labs/barrits@^0.1.0"
  }
}
```

## Qué se recibe al instalar

Al instalar el paquete, el consumidor recibe:

- La superficie principal `@zuccadev-labs/barrits`
- Subpaths para Node, Deno y plugins de bundler
- Helpers de consumo en `@zuccadev-labs/barrits/consume`
- Una CLI disponible como fallback operativo (`barrits` y `brt`)

## Requisitos de runtime

| Runtime | Versión mínima |
| :--- | :--- |
| Node.js | 18.x o posterior |
| Deno | 1.40 o posterior |
| Bun | 1.0 o posterior |

## Cuando también se necesita Deno

Si se va a validar publicación JSR o consumo Deno, se requiere Deno instalado en la máquina. No es un requisito universal para todos los consumidores, sino específico para esa superficie.

---

[← Índice](00-indice.md) | [Primeros Pasos →](02-primeros-pasos.md)