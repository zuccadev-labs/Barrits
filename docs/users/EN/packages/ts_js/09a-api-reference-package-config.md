---
title: "API Reference — Package Configuration"
description: "Corporate documentation for API Reference — Package Configuration."
---

# API Reference — Package Configuration

This reference covers the package-first API surface of `@zuccadev-labs/barrits`. For each function, the documentation describes what it does, what problem it solves, how to use it, and where it appears in the repository examples.

---

## Package-First Configuration

### `defineBarritsPackage(options)`

Normalizes the consumer project's description into a validated contract.

Solves: Repeated runtime, watch, and autoManifest declarations across Vite, esbuild, Rollup, Webpack, and custom scripts.

```ts
import { defineBarritsPackage } from "@zuccadev-labs/barrits";

const pkg = defineBarritsPackage({
  runtime: "react",
  watch: "auto",
  autoManifest: true,
});
```

Appears in: `examples/example-react/vite.config.ts`, `examples/example-vue/vite.config.ts`, `examples/example-solid/vite.config.ts`, `examples/example-svelte/vite.config.ts`, `examples/bundlers/*`, `examples/example-bun/src/main.ts`.

---

### `toBarritsAutomationOptions(options)`

Adapts the package definition to the operational options expected by plugins.

Solves: Prevents the bundler plugin from requiring configuration details it does not own.

```ts
import { defineBarritsPackage, toBarritsAutomationOptions } from "@zuccadev-labs/barrits";

const pkg = defineBarritsPackage({ runtime: "react", watch: "auto" });
const automationOptions = toBarritsAutomationOptions(pkg);
```

Appears in: `examples/example-react/vite.config.ts`, `examples/bundlers/`.

---

### `defineBarritsConfig(options)`

Creates a validated configuration for `barrits.config.*`.

Solves: Eliminates repeated project-level defaults across automation scripts.

```ts
// barrits.config.ts
import { defineBarritsConfig } from "@zuccadev-labs/barrits";

export default defineBarritsConfig({
  runtime: "react",
  watch: "auto",
  autoManifest: true,
  automationDirectory: ".barrits",
});
```

Appears in: documented in `05-automation-and-configuration.md`.

---

### `loadBarritsConfig()`

Loads the project configuration from disk.

Solves: Tooling, CLI, and automation can resolve the configuration without duplicating the file-reading logic.

Appears in: internal flows and documented in `06-commands-and-runtimes.md`.

---

### `findBarritsConfigFile()`

Locates the project's configuration file.

Solves: Controlled discovery of `barrits.config.*` before loading or resolving configuration.

Useful for tooling and diagnostics when existence of the config file needs to be checked first.

---

### `resolveBarritsConfig()`

Resolves the effective project configuration.

Solves: Applies defaults and returns an object ready for operation, as opposed to the raw source file.

Appears in: automation flows and CLI internals.

---

### `createBarrits(options?)`

Initializes the SDK by dynamically building the context based on the configuration file.

Solves: Enables renaming the root system namespace (dynamic namespace injection) while keeping the IDE and typings tooling intact.

```ts
import { createBarrits } from "@zuccadev-labs/barrits";

const app = await createBarrits();
// app.logic, app.traits, app.routes — available under the configured namespace
```

Appears in: `examples/example-nodejs/` main scripts as the namespace-aware boot entry.

---

## Routes, Names, and Domains

### `buildPath(...parts)`

Composes an operational path from safe segments.

```ts
import { buildPath } from "@zuccadev-labs/barrits";

const artifactPath = buildPath(".barrits", "manifest.json");
```

### `parsePath(path)`

Splits a public path into its parts.

Useful for inspecting, validating, or transforming package-first paths.

### `PACKAGE_NAME`

Exposes the canonical package name.

### `PACKAGE_ALIAS`

Exposes the short alias of the package (`brt`).

### `barrits` and `brt`

Namespaced access to all API domains: `logic`, `routes`, `traits`.

```ts
import { barrits, brt } from "@zuccadev-labs/barrits";

barrits.logic.orderBy(items, [{ project: (the developer) => the developer.score, direction: "asc" }]);
brt.traits.composePipeline(initialValue, step1, step2);
```

---

## Manifest and Snapshot Consumption

### `parseBuildManifest(value)`

Parses and validates a raw build manifest structure.

### `parseWatchSnapshot(value)`

Parses and validates a raw watch snapshot.

### `createBuildManifestSummary(manifest)`

Generates a condensed summary of the build manifest.

```ts
import { createBuildManifestSummary } from "@zuccadev-labs/barrits";

const summary = createBuildManifestSummary(manifest);
console.log(summary.domains);
```

Appears in: `examples/example-react/src/main.jsx`, `examples/example-vue/src/App.vue`, `examples/example-solid/src/main.tsx`, `examples/example-svelte/src/App.svelte`, `examples/bundlers/*-manifest-entry.mjs`.

### `createWatchSnapshotSummary(snapshot)`

Summarizes a watch snapshot for observability, panels, or quick diagnostics.

### `createLanguageToolSnapshot(input)`

Constructs a language tooling-compatible snapshot of the domain state.

---

## Traits and Declarative Composition

### `composePipeline(initialValue, ...steps)`

Composes a pipeline of sequential transformations.

```ts
import { composePipeline } from "@zuccadev-labs/barrits";

const result = composePipeline(
  rawData,
  (data) => normalize(data),
  (data) => filter(data),
  (data) => rank(data),
);
```

### `composeTraitDescriptors(input)`

Composes multiple trait descriptors into a final merged structure.

### `createTraitDescriptor(input)`

Creates a reusable trait descriptor from explicit metadata.

```ts
import { createTraitDescriptor } from "@zuccadev-labs/barrits";

/**
 * @barrits-trait
 * @barrits-provides auth-session, database-adapter
 * @barrits-conflicts legacy-adapter
 */
export const authTrait = createTraitDescriptor({
  name: "AuthDomain",
  provides: ["auth-session", "database-adapter"],
  conflicts: ["legacy-adapter"],
});
```

### `createTraitDescriptorFromJsDoc(jsDoc, descriptor)`

Creates a descriptor from an existing JSDoc block.

### `parseTraitDescriptorJsDoc(value)`

Parses JSDoc into structured trait metadata.

**Recognized declarative tags:**

| Tag | Purpose |
| :--- | :--- |
| `@barrits-trait` | Marks a JSDoc block as a trait contract |
| `@barrits-summary` | Short description of the trait |
| `@barrits-requires` | Traits this descriptor depends on |
| `@barrits-conflicts` | Traits that cannot coexist with this one |
| `@barrits-state` | State owned by this trait |
| `@barrits-consumes` | Capabilities consumed from other traits |
| `@barrits-provides` | Capabilities exposed to other traits |
| `@barrits-tags` | Classification labels |
| `@barrits-runtime` | Target runtime constraint |
| `@barrits-version` | Version constraint |
| `@barrits-stability` | Stability level (stable, experimental, deprecated) |

### `mergeTraits(...traits)`

Merges traits into a single consolidated result.

---

## Public Types

The main entrypoint and all subpaths export typed contracts for consumers that require explicit type declarations:

| Type | Source |
| :--- | :--- |
| `PathParts` | Path decomposition structure |
| `RuntimeName`, `BarritsRuntimeKind`, `BarritsWatchMode` | Runtime and watch configuration types |
| `BarritsBuildManifest`, `BarritsWatchSnapshot`, `BarritsConsumedStateSummary` | Artifact contract types |
| `BarritsLanguageToolSnapshot` | Language tooling snapshot type |
| `OrderCriterion`, `TimeSeriesPoint`, `PaginatedResult`, `GraphEdge` | Algorithm-related types |

## Comprehensive Reference: Configuration Schema

The project configuration via `barrits.config.ts` is governed by the `BarritsRootConfig` type. The following table details the available properties and their technical implications:

| Property | Type | Default | Expert Recommendation |
| :--- | :--- | :--- | :--- |
| `runtime` | `BarritsRuntimeKind` | `"node"` | Define explicitly (`"react"`, `"deno"`, etc.) to optimize the type crawler. |
| `watch` | `BarritsWatchMode` | `"auto"` | Use `"auto"` in development and ensure `"off"` in heavy audit processes. |
| `autoManifest` | `boolean` | `true` | Keep `true` to ensure the automation contract stays synchronized with the code. |
| `automationDirectory` | `string` | `".barrits"` | Change to a specific path (e.g., `.cache/barrits`) in monorepos to avoid root noise. |
| `namespace` | `string` | `undefined` | Mandatory in corporate projects to prevent collisions in multiple instantiations. |
| `projectRoot` | `string` | `process.cwd()` | Do not modify unless the configuration file resides outside the project root. |
| `debugCommands` | `boolean` | `false` | Enable only during initial integration to audit the AST discovery flow. |
| `contracts` | `BarritsContractsConfig` | `{}` | Use to define API visibility and traits that cannot use decorative JSDoc. |
| `main` | `Function` | `undefined` | Implement to centralize startup orchestration in standalone applications. |

### Contract Configuration (`contracts`)

#### `traits`
Allows manual declaration of Trait descriptors. This is the expert alternative when source code should not be polluted with extensive JSDoc blocks or when the trait is generated dynamically.

#### `exports`
Controls visibility in the discovery graph. Marking a file or export as `"internal"` is the standard practice for maintaining a clean and secure API, reducing cognitive load for the final integrator.

---

[← Index](00-index.md) | [API Reference — Algorithms →](09b-api-reference-algorithms.md)
