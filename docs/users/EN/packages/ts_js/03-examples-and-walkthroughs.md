# Examples and Walkthroughs

This document covers common integration scenarios with `@zuccadev-labs/barrits` step by step. Each section corresponds to a concrete use case with a matching real example in the repository.

## Integration Directory Setup

Barrits reads and orchestrates a dedicated folder. The consumer project should create a directory named `.barrits` or `barrits/` at its execution root, or configure a custom path in `barrits.config.ts`.

```bash
mkdir barrits
```

Once the directory exists, the SDK detects this convention and applies Differential Caching in 0ms. Every file placed here or declared in the configuration falls under deterministic orchestration.

## Declaring a Domain Module

Domains are declared by placing typed files inside the `barrits/` directory. The discovery engine reads them statically from the AST without any runtime overhead.

```ts
// barrits/auth-domain.ts
import { createTraitDescriptor } from "@zuccadev-labs/barrits";

/**
 * @barrits-trait
 * @barrits-provides auth-session, database-adapter
 * @barrits-conflicts legacy-adapter
 */
export const authDomainTrait = createTraitDescriptor({
  name: "AuthDomain",
  provides: ["auth-session", "database-adapter"],
  conflicts: ["legacy-adapter"],
});
```

The engine resolves this declaration into the build graph without requiring a re-export barrel.

## Connecting a Bundler (Vite)

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

The plugin generates the manifest artifact and injects `virtual:barrits/manifest` for use in the frontend application.

## Reading the Build Manifest

```ts
import { createBuildManifestSummary } from "@zuccadev-labs/barrits";
import manifest from "virtual:barrits/manifest";

const summary = createBuildManifestSummary(manifest);
console.log(summary.domains);   // Resolved domains
console.log(summary.exports);   // Public export surfaces
```

## Preventing Namespace Collisions

When Barrits detects a semantic collision between two exports of different domains, it generates a diagnostic with the exact source of the collision — without silently breaking the application.

This behavior is automatic. No additional configuration is required to activate boundary governance.

---

[← Getting Started](02-getting-started.md) | [Best Practices →](04-best-practices.md)
