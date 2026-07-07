---
name: barrits-package-consumer-onboarding
description: Use this skill when onboarding a team that wants to consume @zuccadev-labs/barrits in their project. Covers installation, configuration, API surface exploration, and integration patterns.
---

# Barrits Package Consumer Onboarding

## When To Use

Apply this skill when:
- A new team wants to integrate `@zuccadev-labs/barrits` into their project
- A developer needs to understand the SDK's API surface
- Setting up package-first automation in a consumer project
- Choosing between flat API, factory, or domain-scoped access

## Quick Start

### 1. Install

```bash
npm install @zuccadev-labs/barrits
# or
yarn add @zuccadev-labs/barrits
# or
pnpm add @zuccadev-labs/barrits
```

### 2. Choose Your API Style

The SDK offers three API styles:

#### Flat API (recommended for most projects)

```typescript
import { findBarritsDirectory, inspectBarritsIntegrations, createBuildManifestSummary } from "@zuccadev-labs/barrits";
```

#### Factory API (dynamic configuration)

```typescript
import { createBarrits } from "@zuccadev-labs/barrits";

const barrits = createBarrits({ runtime: "node" });
const integrations = await barrits.inspect();
```

#### Domain API (scoped to `barrits` or `brt` namespace)

```typescript
import { barrits, brt } from "@zuccadev-labs/barrits";

await barrits.logic.aggregateAlgorithms();
await brt.path.buildPath("src", "barrits");
```

### 3. Configure Package-First Mode

```typescript
// barrits.config.ts or barrits.config.mjs
import { defineBarritsConfig } from "@zuccadev-labs/barrits";

export default defineBarritsConfig({
  runtime: "node",
  discoveryRoots: ["src/barrits"],
});
```

## API Surface Overview

### Core Discovery

| Function | Purpose |
|:---|---|
| `findBarritsDirectory()` | Locate `.barrits/` automation directory |
| `inspectBarritsIntegrations()` | Build integration graph with filters |
| `defineBarritsPackage()` | Declare package-level configuration |

### Manifest Consumption

| Function | Purpose |
|:---|---|
| `parseBuildManifest()` | Read and validate a build manifest |
| `createBuildManifestSummary()` | Summarize build state |
| `parseWatchSnapshot()` | Read watch-mode snapshot |

### Trait Composition

```typescript
import { createTraitDescriptor, composePipeline, mergeTraits } from "@zuccadev-labs/barrits";
```

### Algorithm Families

| Family | Exports |
|:---|---|
| Aggregation | `aggregateAlgorithms`, `algorithms` |
| Collection | `binarySearch`, `breadthFirstSearch`, `quickSort` |
| Arithmetic | `sum`, `subtract` |
| Datetime | `toIsoString`, `fromIsoString`, `diffMs`, `toRelativeTime` |
| Hashing | `sha256Hex`, `murmurHash3`, `deterministicStringify` |
| Resilience | `retryWithBackoff`, `withTimeout`, `createCircuitBreaker` |
| Strings | `capitalize`, `slugify`, `truncate` |
| Validation | `isEmail`, `isUrl`, `isUuid`, `isIsoDate` |

### Bundler Plugins

```typescript
import { barritsVitePlugin } from "@zuccadev-labs/barrits/vite";
import { barritsEsbuildPlugin } from "@zuccadev-labs/barrits/esbuild";
import { barritsRollupPlugin } from "@zuccadev-labs/barrits/rollup";
import { BarritsWebpackPlugin } from "@zuccadev-labs/barrits/webpack";
```

### CLI

```bash
npx barrits detect     # Detect barrits directory
npx barrits info       # Show integration graph
npx barrits build      # Generate build manifest
npx barrits watch      # Watch mode
```

## Integration Examples

Full working examples are available in the repository:
- `examples/example-nodejs/` — Node.js CLI consumption with 8 tests
- `examples/example-bun/` — Bun runtime with package-first config and 14 tests
- `examples/example-deno/` — Deno native surface
- `examples/example-deno-baas/` — IoC + OpenAPI generation
- `examples/example-react/`, `example-vue/`, `example-solid/`, `example-svelte/` — Framework integrations
- `examples/bundlers/` — Direct bundler plugin integration

## References

- `packages/sdk/ts_js/README.md` — SDK package documentation
- `packages/sdk/ts_js/ARCHITECTURE.md` — Enterprise architecture reference
- `docs/users/` — End-user documentation (EN/ES)
