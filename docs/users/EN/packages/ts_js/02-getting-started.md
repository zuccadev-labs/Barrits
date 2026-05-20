---
title: "Getting Started"
description: "Corporate documentation for Getting Started."
---

# Getting Started

This guide covers the first integration of `@zuccadev-labs/barrits` in a consumer project, walking through the four foundational APIs in the order most projects reach for them.

## Step 1 — Declare the Consumer Package

`defineBarritsPackage` normalizes the consumer project's description so it remains consistent across plugins, CLI, and tooling.

```ts
import { defineBarritsPackage } from "@zuccadev-labs/barrits";

export const barritsPackage = defineBarritsPackage({
  runtime: "react",    // Informs the discovery engine about the target runtime
  watch: "auto",       // Enables incremental watch mode automatically
  autoManifest: true,  // Generates the build manifest on every change
});
```

**What it does**: normalizes the consumer description into a single, validated contract.  
**Why it exists**: eliminates repeated `runtime`, `watch`, and `autoManifest` declarations across Vite, esbuild, Rollup, Webpack, and custom scripts.  
**Where it appears**: `examples/example-react/vite.config.ts`, `examples/example-vue/vite.config.ts`, `examples/bundlers/*`.

## Step 2 — Declare Project-Level Defaults

`defineBarritsConfig` stores persistent defaults for the project in `barrits.config.ts`.

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

**What it does**: declares the project's default configuration in a discoverable file.  
**Why it exists**: centralizes runtime, automation directory strategy, and watch mode so tooling can read them without duplication.  
**Where it appears**: documented in [Automation and Configuration](05-automation-and-configuration.md).

## Step 3 — Connect a Bundler

`toBarritsAutomationOptions` adapts the package description to the operational options expected by bundler plugins.

```ts
// vite.config.ts
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

**What it does**: bridges the package definition and the bundler plugin without coupling the plugin to configuration details it does not need.  
**Where it appears**: `examples/example-react/vite.config.ts`, `examples/bundlers/`.

## Step 4 — Read the Manifest

`createBuildManifestSummary` produces a condensed view of the build manifest for UI, dashboards, or tooling consumers.

```ts
import { createBuildManifestSummary } from "@zuccadev-labs/barrits";
import manifest from "virtual:barrits/manifest"; // injected by the Vite plugin

const summary = createBuildManifestSummary(manifest);
console.log(summary.domains);   // Resolved domains
console.log(summary.exports);   // Public export surfaces
```

**What it does**: summarizes the build manifest into a compact, typed structure.  
**Why it exists**: prevents UI or tooling from depending on the full manifest JSON when only domains, exports, or a status summary are needed.  
**Where it appears**: `examples/example-react/src/main.jsx`, `examples/example-vue/src/App.vue`, `examples/example-svelte/src/App.svelte`.

---

## Next Steps

- For CLI and runtime-specific commands: [Commands and Runtimes](06-commands-and-runtimes.md)
- For trait contract design: [Traits and Composition](08-traits-and-composition.md)
- For built-in algorithms: [API Reference — Algorithms](09b-api-reference-algorithms.md)
- For all available functions: [API Reference — Package Config](09a-api-reference-package-config.md)

---

[← Installation](01-installation.md) | [Examples and Walkthroughs →](03-examples-and-walkthroughs.md)
