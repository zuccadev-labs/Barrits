# Automation and Configuration

Barrits acts as a package with an integrated automation engine. Project configuration is declared once and the SDK derives discovery, manifest generation, and watch behavior from that declaration.

## Configuring the Project

To establish stable project defaults, create one of the following files at the consumer's root:

- `barrits.config.ts`
- `barrits.config.mts`
- `barrits.config.js`
- `barrits.config.mjs`

```ts
import { defineBarritsConfig } from "@zuccadev-labs/barrits";

export default defineBarritsConfig({
  runtime: "react",
  watch: "auto",
  autoManifest: true,
  automationDirectory: ".cache/barrits",
  namespace: "myApp", // optional: changes the dynamic namespace injected by createBarrits()
});
```

When a `namespace` is provided, the auto-discovery design in Vite, Node, and other integrations respects it while keeping types clean through the `createBarrits()` async factory.

## Low-Config Contracts from `barrits.config.*`

To reduce reliance on JSDoc headers, manual contracts can be declared directly in the configuration:

```ts
import { defineBarritsConfig } from "@zuccadev-labs/barrits";

export default defineBarritsConfig({
  contracts: {
    traits: [
      {
        name: "runtime-node",
        sourceFile: "traits/runtime.ts",
        bindingName: "nodeRuntimeTrait",
        provides: ["runtime:node"],
      },
    ],
    exports: [
      {
        sourceFile: "logic/path.ts",
        exportName: "buildSecretPath",
        visibility: "internal",
      },
    ],
  },
});
```

**Recommended decision rule:**

- If the project already uses `@barrits-*` JSDoc headers, keep JSDoc as the source of truth.
- If lower configuration cost is preferred, centralize contracts in `barrits.config.*`.
- Barrits merges detected contracts with manual contracts and prioritizes the manual entry when `sourceFile + bindingName` match.

## Reducing Re-Exports

Barrits detects exports from the file tree and generates named imports automatically when the name is unique in the graph. This means `barrits/index.ts` barrels can often be simplified or eliminated.

- Methods that are part of the normal API do not need to be re-exported in every `index.ts`.
- Methods that must remain outside the visible API should be marked in `contracts.exports` with `visibility: "internal"`.

## Configuration Priority

- The root configuration file defines project defaults.
- Inline options in the package definition or adapter always take precedence.
- If `automationDirectory` is not specified, the default value is `.barrits`.

## Automation Lifecycle

Automation is not a permanent system daemon.

Standard lifecycle rule:

1. Watch does not start on package installation.
2. Watch starts when a `dev` or `watch` session requires it.
3. The process closes when the parent session ends.

## Moving Artifacts

To separate automation artifacts from the visible project domain, set a custom `automationDirectory`. This moves manifests, snapshots, and generated imports outside of `.barrits` into the configured path.

## Custom Main Method

A custom main method can be declared in the configuration to control application startup behavior:

```ts
import { defineBarritsConfig } from "@zuccadev-labs/barrits";

export default defineBarritsConfig({
  runtime: "node",
  main: async () => {
    console.log("Application starting with custom configuration");
  },
});
```

## Safe Instantiation with Factory Pattern

When the `namespace` field is configured, `createBarrits()` returns a typed, isolated object without polluting global scope:

```ts
import { createBarrits } from "@zuccadev-labs/barrits";

const boot = async () => {
  const system = await createBarrits();
  // IDE autocomplete is fully guaranteed under the configured namespace
  system.myApp.logic.orderBy(items, criteria);
};
```

## Expert Integration Patterns (Corporate Level)

For high-demand implementations in large-scale ecosystems, the following architectural patterns are recommended:

### 1. Environment Isolation (Monorepos)

In monorepo structures (NX, Turborepo), the Barrits configuration should preferably reside in the root package of the SDK or in each consuming application independently. To prevent artifact contamination between applications, use a segregated `automationDirectory` per project:

```ts
// apps/api-gateway/barrits.config.ts
export default defineBarritsConfig({
  automationDirectory: "../../.cache/barrits/api-gateway",
  namespace: "gateway",
});
```

### 2. Dependency Injection and State

An expert engineer avoids direct dependency on the `barrits` singleton in favor of controlled instantiation. Using `createBarrits()` allows the system to be injected into IoC (Inversion of Control) containers, ensuring testability:

```ts
import { createBarrits } from "@zuccadev-labs/barrits";

export class ApplicationService {
  constructor(private readonly barrits: Awaited<ReturnType<typeof createBarrits>>) {}

  public async execute() {
    return this.barrits.myApp.logic.executeWorkflow();
  }
}
```

### 3. Security and Visibility Restrictions

In corporate environments, protecting the API surface is critical. The use of `contracts.exports` is prescribed to hide infrastructure utilities that should not be consumed by business logic:

```ts
export default defineBarritsConfig({
  contracts: {
    exports: [
      {
        sourceFile: "internal/db-connection.ts",
        visibility: "internal", // Prevents automatic export in the discovery manifest
      },
    ],
  },
});
```

### 4. Watch Governance in CI/CD

Note that the `watch: "auto"` property must be carefully evaluated in continuous integration environments. Although Barrits detects the environment, the expert recommendation is to force `watch: "off"` in build pipelines to ensure deterministic results:

```ts
const isCI = !!process.env.CI;
export default defineBarritsPackage({
  runtime: "node",
  watch: isCI ? "off" : "auto",
});
```

---

[← Best Practices](04-best-practices.md) | [Commands and Runtimes →](06-commands-and-runtimes.md)
