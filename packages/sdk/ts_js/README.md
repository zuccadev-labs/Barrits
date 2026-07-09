<div align="center">

<img src="https://raw.githubusercontent.com/zuccadev-labs/Barrits/main/assets/img/logo.png" alt="Barrits Logo" width="96" />

# Barrits
### Barrels and Traits

[![npm version](https://img.shields.io/npm/v/%40zuccadev-labs%2Fbarrits?color=%230f0f0f&label=npm)](https://www.npmjs.com/package/@zuccadev-labs/barrits)
[![JSR](https://jsr.io/badges/@zuccadev-labs/barrits)](https://jsr.io/@zuccadev-labs/barrits)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/zuccadev-labs/Barrits/blob/main/LICENSE)

**[English](#english)** | [Español](#español)

</div>

---

<a name="english"></a>

## English

`@zuccadev-labs/barrits` is a deterministic orchestration engine built on the **Single Responsibility Principle (SRP)**. It provides an AST-level discovery graph, predictive module resolution, sealed build manifests (SHA-256), and strongly-typed Domain APIs — fully agnostic of runtime and framework.

> [!NOTE]
> **The LLM-Optimized Foundation for Deno BaaS:** Barrits is designed to minimize friction for AI-driven code generation. By leveraging static AST analysis and declarative traits (`@barrits-consumes`, `@barrits-provides`), it allows Large Language Models (LLMs) to understand, orchestrate, and generate complex backend logic, Inversion of Control (IoC), and API Schemas (OpenAPI/GraphQL) without hallucinating implementations.

### Installation

**npm** (Node.js, Bun, browser bundlers)
```bash
npm install @zuccadev-labs/barrits
```

**JSR** (Deno)
```ts
import { defineBarritsPackage } from "jsr:@zuccadev-labs/barrits";
```

or in `deno.json`:
```json
{
  "imports": {
    "@zuccadev-labs/barrits": "jsr:@zuccadev-labs/barrits"
  }
}
```

### Quick Start

#### 1. Declare the consumer package
```ts
import { defineBarritsPackage } from "@zuccadev-labs/barrits";

export const pkg = defineBarritsPackage({
  runtime: "react",
  watch: "auto",
  autoManifest: true,
});
```

#### 2. Connect a bundler (Vite)
```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { defineBarritsPackage, toBarritsAutomationOptions } from "@zuccadev-labs/barrits";
import { barritsVitePlugin } from "@zuccadev-labs/barrits/vite";

const pkg = defineBarritsPackage({ runtime: "react", watch: "auto" });

export default defineConfig({
  plugins: [
    react(),
    barritsVitePlugin({ package: toBarritsAutomationOptions(pkg) }),
  ],
});
```

#### 3. Read the build manifest
```ts
import { createBuildManifestSummary } from "@zuccadev-labs/barrits";
import manifest from "virtual:barrits/manifest";

const summary = createBuildManifestSummary(manifest);
console.log(summary.domains);
```

#### 4. Use built-in algorithms
```ts
import { orderBy, movingAverageSeries, maxDrawdown, binarySearch } from "@zuccadev-labs/barrits";

const sorted = orderBy(items, [{ project: (i) => i.score, direction: "desc" }]);
const trend  = movingAverageSeries(priceSeries, 5);
const risk   = maxDrawdown(priceSeries);
```

#### 5. Declare a trait contract
```ts
import { createTraitDescriptor } from "@zuccadev-labs/barrits";

/**
 * @barrits-trait
 * @barrits-provides auth-session
 * @barrits-conflicts legacy-auth
 */
export const authTrait = createTraitDescriptor({
  name: "AuthDomain",
  provides: ["auth-session"],
  conflicts: ["legacy-auth"],
});
```

### Available Entrypoints

| Import path | Purpose |
| :--- | :--- |
| `@zuccadev-labs/barrits` | Main API: package config, traits, algorithms, paths |
| `@zuccadev-labs/barrits/consume` | Runtime-agnostic manifest and snapshot readers |
| `@zuccadev-labs/barrits/node` | Node.js filesystem helpers and CLI wrapper |
| `@zuccadev-labs/barrits/deno` | Deno filesystem helpers and CLI wrapper |
| `@zuccadev-labs/barrits/vite` | Vite plugin |
| `@zuccadev-labs/barrits/esbuild` | esbuild plugin |
| `@zuccadev-labs/barrits/rollup` | Rollup plugin |
| `@zuccadev-labs/barrits/webpack` | Webpack plugin |
| `@zuccadev-labs/barrits/node/cli` | Node.js CLI entry |
| `@zuccadev-labs/barrits/deno/cli` | Deno CLI entry |

### Key Capabilities

| Capability | Description |
| :--- | :--- |
| **AST Differential Cache** | 0ms incremental caching at syntax-tree level |
| **Supply Chain Integrity** | SHA-256 checksums sealed in every build manifest |
| **Trait Engine** | Dependency-ordered composition with collision detection |
| **Agnostic Runtime** | Identical behavior on Node, Deno, Bun, React, Vue, Solid, Svelte, Tauri |
| **Contract-First** | Manifests and snapshots as first-class contracts |

### Documentation

- [User Guide (EN)](https://github.com/zuccadev-labs/Barrits/tree/main/docs/users/EN/packages/ts_js)
- [API Reference — Package Config](https://github.com/zuccadev-labs/Barrits/blob/main/docs/users/EN/packages/ts_js/09a-api-reference-package-config.md)
- [API Reference — Algorithms](https://github.com/zuccadev-labs/Barrits/blob/main/docs/users/EN/packages/ts_js/09b-api-reference-algorithms.md)
- [API Reference — Consume & Adapters](https://github.com/zuccadev-labs/Barrits/blob/main/docs/users/EN/packages/ts_js/09c-api-reference-consume-and-adapters.md)
- [Examples](https://github.com/zuccadev-labs/Barrits/tree/main/packages/sdk/ts_js/examples)

---

<a name="español"></a>

## Español

`@zuccadev-labs/barrits` es un motor de orquestación determinístico construido sobre el **Principio de Responsabilidad Única (SRP)**. Provee un grafo de descubrimiento a nivel de AST, resolución predictiva de módulos, manifests de build sellados (SHA-256) y Domain APIs fuertemente tipadas — completamente agnósticas del runtime y el framework.

> [!NOTE]
> **Fundación Optimizada para LLMs (Deno BaaS):** Barrits está diseñado para simplificar drásticamente la generación de código mediante Inteligencia Artificial. Al utilizar análisis AST estático y Traits declarativos (`@barrits-consumes`, `@barrits-provides`), permite a un LLM entender, orquestar y generar lógica de backend compleja, Inversión de Control (IoC) y Esquemas de API (OpenAPI/GraphQL) minimizando drásticamente las alucinaciones.

### Instalación

**npm** (Node.js, Bun, bundlers de browser)
```bash
npm install @zuccadev-labs/barrits
```

**JSR** (Deno)
```ts
import { defineBarritsPackage } from "jsr:@zuccadev-labs/barrits";
```

### Inicio Rápido

#### 1. Declarar el paquete consumidor
```ts
import { defineBarritsPackage } from "@zuccadev-labs/barrits";

export const pkg = defineBarritsPackage({
  runtime: "react",
  watch: "auto",
  autoManifest: true,
});
```

#### 2. Conectar un bundler (Vite)
```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { defineBarritsPackage, toBarritsAutomationOptions } from "@zuccadev-labs/barrits";
import { barritsVitePlugin } from "@zuccadev-labs/barrits/vite";

const pkg = defineBarritsPackage({ runtime: "react", watch: "auto" });

export default defineConfig({
  plugins: [
    react(),
    barritsVitePlugin({ package: toBarritsAutomationOptions(pkg) }),
  ],
});
```

#### 3. Leer el build manifest
```ts
import { createBuildManifestSummary } from "@zuccadev-labs/barrits";
import manifest from "virtual:barrits/manifest";

const summary = createBuildManifestSummary(manifest);
console.log(summary.domains);
```

#### 4. Usar algoritmos integrados
```ts
import { orderBy, movingAverageSeries, maxDrawdown } from "@zuccadev-labs/barrits";

const sorted = orderBy(items, [{ project: (i) => i.score, direction: "desc" }]);
const trend  = movingAverageSeries(priceSeries, 5);
```

#### 5. Declarar un contrato de trait
```ts
import { createTraitDescriptor } from "@zuccadev-labs/barrits";

/**
 * @barrits-trait
 * @barrits-provides auth-session
 * @barrits-conflicts legacy-auth
 */
export const authTrait = createTraitDescriptor({
  name: "AuthDomain",
  provides: ["auth-session"],
  conflicts: ["legacy-auth"],
});
```

### Capacidades Principales

| Capacidad | Descripción |
| :--- | :--- |
| **Caché Diferencial AST** | Overhead de 0ms en recálculo de árboles sintácticos |
| **Integridad de Supply Chain** | Checksums SHA-256 sellados en cada build manifest |
| **Motor de Traits** | Composición ordenada por dependencias con detección de colisiones |
| **Runtime Agnóstico** | Comportamiento idéntico en Node, Deno, Bun, React, Vue, Solid, Svelte, Tauri |
| **Contract-First** | Manifests y snapshots como contratos de primera clase |

### Documentación

- [Guía de Usuario (ES)](https://github.com/zuccadev-labs/Barrits/tree/main/docs/users/ES/packages/ts_js)
- [Referencia de API — Configuración](https://github.com/zuccadev-labs/Barrits/blob/main/docs/users/ES/packages/ts_js/09a-referencia-de-api-configuracion.md)
- [Referencia de API — Algoritmos](https://github.com/zuccadev-labs/Barrits/blob/main/docs/users/ES/packages/ts_js/09b-referencia-de-api-algoritmos.md)
- [Referencia de API — Consume y Adapters](https://github.com/zuccadev-labs/Barrits/blob/main/docs/users/ES/packages/ts_js/09c-referencia-de-api-consume-y-adapters.md)
- [Referencia de API — Traits y Composición](https://github.com/zuccadev-labs/Barrits/blob/main/docs/users/ES/packages/ts_js/09d-referencia-de-api-traits-y-composicion.md)
- [Ejemplos](https://github.com/zuccadev-labs/Barrits/tree/main/packages/sdk/ts_js/examples)

---

This `README` is the public package page displayed on npm and JSR. Full reference documentation, architecture decisions, and development internals live in [`docs/`](https://github.com/zuccadev-labs/Barrits/tree/main/docs).
