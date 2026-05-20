---
title: "Traits and Composition"
description: "Corporate documentation for Traits and Composition."
---

# Traits and Composition

Declarative traits are the mechanism for composing domains with explicit contracts, reducing drift between implementation, metadata, and tooling.

## The Base Contract

The foundation is `createTraitDescriptor()` with the following fields:

| Field | Purpose |
| :--- | :--- |
| `name` | Unique identifier for the trait |
| `requires` | Other traits this descriptor depends on |
| `conflicts` | Traits that cannot coexist with this one |
| `state` | State owned exclusively by this trait |
| `provides` | Capabilities exposed to other traits |
| `create` | Factory function that initializes the trait |

```ts
import { createTraitDescriptor } from "@zuccadev-labs/barrits";

export const authTrait = createTraitDescriptor({
  name: "AuthDomain",
  requires: ["DatabaseTrait"],
  provides: ["auth-session"],
  conflicts: ["legacy-auth"],
  state: { sessionCache: null },
  create: (deps) => ({
    getSession: async (userId: string) => deps.database.query("sessions", { userId }),
  }),
});
```

## Declarative JSDoc Tags

When lower friction is preferred over explicit descriptor objects, JSDoc tags declare the same contract:

```ts
/**
 * @barrits-trait
 * @barrits-summary Authentication domain providing session management
 * @barrits-requires DatabaseTrait
 * @barrits-provides auth-session
 * @barrits-conflicts legacy-auth
 * @barrits-state sessionCache
 * @barrits-stability stable
 * @barrits-runtime node,deno
 */
export const authTrait = createTraitDescriptor({ ... });
```

The discovery engine reads these tags statically from the AST and integrates them into the build graph.

## Pipeline Composition

`composePipeline` chains sequential transformations with a typed initial value:

```ts
import { composePipeline } from "@zuccadev-labs/barrits";

const result = composePipeline(
  rawData,
  (data) => validate(data),
  (data) => normalize(data),
  (data) => enrich(data),
);
```

## Benefits of the Trait Model

1. **Ordering** is resolved from declared dependencies, not from manual object merging.
2. **Missing dependencies** fail explicitly before executing opaque logic.
3. **Collisions** become visible diagnostics rather than silent runtime errors.
4. **State ownership** is declared, preventing shared mutable state conflicts between domains.

## When to Use Traits

This layer is appropriate when composing domain capabilities with explicit contracts. For a trivial combination of two utilities, `mergeTraits` is sufficient. For serious domain contracts — especially in distributed systems or large monorepos — `createTraitDescriptor` with explicit `requires`, `provides`, and `conflicts` should be the first choice.

---

[← Manifests, Bundlers, and Consumption](07-manifests-bundlers-and-consumption.md) | [API Reference →](09a-api-reference-package-config.md)
