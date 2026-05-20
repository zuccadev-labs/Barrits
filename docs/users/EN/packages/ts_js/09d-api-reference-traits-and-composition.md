---
title: "API Reference — Traits and Composition"
description: "Corporate documentation for API Reference — Traits and Composition."
---

# API Reference — Traits and Composition

This reference covers the trait-based composition system of `@zuccadev-labs/barrits`. Traits are a core concept in Barrits for defining capabilities, dependencies, and contracts between different parts of your system.

---

## Trait Descriptor

### `createTraitDescriptor(input)`

Creates a reusable trait descriptor from explicit metadata.

**Parameters:**
- `input`: TraitDescriptorInput - The trait definition object

**Returns:** TraitDescriptor - A composable trait descriptor

**Example:**
```ts
import { createTraitDescriptor } from "@zuccadev-labs/barrits";

/**
 * @barrits-trait
 * @barrits-provides auth-session, database-adapter
 * @barrits-conflicts legacy-adapter
 * @barrits-state currentUser, connectionPool
 * @barrits-consumes logger, config
 */
export const authTrait = createTraitDescriptor({
  name: "AuthDomain",
  provides: ["auth-session", "database-adapter"],
  conflicts: ["legacy-adapter"],
  state: ["currentUser", "connectionPool"],
  consumes: ["logger", "config"]
});
```

### `createTraitDescriptorFromJsDoc(jsDoc, descriptor)`

Creates a descriptor from an existing JSDoc block.

**Parameters:**
- `jsDoc`: string - The JSDoc comment block
- `descriptor`: Partial<TraitDescriptor> - Optional overrides for the descriptor

**Returns:** TraitDescriptor - A composable trait descriptor

**Example:**
```ts
import { createTraitDescriptorFromJsDoc } from "@zuccadev-labs/barrits";

/**
 * @barrits-trait
 * @barrits-provides auth-session, database-adapter
 * @barrits-conflicts legacy-adapter
 * @barrits-state currentUser, connectionPool
 * @barrits-consumes logger, config
 */
export const authTrait = createTraitDescriptorFromJsDoc(`
/**
 * @barrits-trait
 * @barrits-provides auth-session, database-adapter
 * @barrits-conflicts legacy-adapter
 * @barrits-state currentUser, connectionPool
 * @barrits-consumes logger, config
 */
`);
```

### `parseTraitDescriptorJsDoc(value)`

Parses JSDoc into structured trait metadata.

**Parameters:**
- `value`: string - The JSDoc comment block

**Returns:** TraitDescriptorJsDocMetadata - The parsed JSDoc metadata

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

**Example:**
```ts
import { parseTraitDescriptorJsDoc } from "@zuccadev-labs/barrits";

const jsDoc = `
 * @barrits-trait
 * @barrits-provides auth-session
 * @barrits-state user
`;

const metadata = parseTraitDescriptorJsDoc(jsDoc);
// Returns: { provides: ["auth-session"], state: ["user"] }
```

### `mergeTraits(...traits)`

Merges traits into a single consolidated result.

**Parameters:**
- `traits`: TraitDescriptor[] - Array of trait descriptors to merge

**Returns:** ComposedTraitDescriptorsResult - The merged trait composition result

**Example:**
```ts
import { mergeTraits, createTraitDescriptor } from "@zuccadev-labs/barrits";

const authTrait = createTraitDescriptor({
  name: "Auth",
  provides: ["session"],
  state: ["user"]
});

const dbTrait = createTraitDescriptor({
  name: "Database",
  provides: ["connection"],
  state: ["pool"]
});

const result = mergeTraits(authTrait, dbTrait);
// result contains combined provides, state, etc.
```

### `composeTraitDescriptors(input)`

Composes multiple trait descriptors into a final merged structure.

**Parameters:**
- `input`: ComposeTraitDescriptorsOptions - Options for trait composition

**Returns:** ComposedTraitDescriptorsResult - The composed trait descriptors

**Example:**
```ts
import { composeTraitDescriptors, createTraitDescriptor } from "@zuccadev-labs/barrits";

const traits = [
  createTraitDescriptor({ name: "Auth", provides: ["session"] }),
  createTraitDescriptor({ name: "DB", provides: ["connection"] })
];

const result = composeTraitDescriptors({ input: traits });
```

### `composePipeline(initialValue, ...steps)`

Composes a pipeline of sequential transformations.

**Parameters:**
- `initialValue`: any - The initial value to process
- `steps`: Function[] - Array of transformation functions

**Returns:** any - The final processed value

**Example:**
```ts
import { composePipeline } from "@zuccadev-labs/barrits";

const result = composePipeline(
  rawData,
  (data) => normalize(data),
  (data) => filter(data),
  (data) => rank(data)
);
```

---

## Trait Descriptor Properties

### TraitDescriptorInput

Properties accepted by `createTraitDescriptor`:

| Property | Type | Description |
| :--- | :--- | :--- |
| `name` | string | The unique name of the trait |
| `provides` | string[] | Capabilities this trait exposes to other traits |
| `consumes` | string[] | Capabilities this trait requires from other traits |
| `state` | string[] | State variables owned by this trait |
| `conflicts` | string[] | Trait names that cannot coexist with this trait |
| `requires` | string[] | Trait names this trait depends on (deprecated, use consumes) |
| `tags` | string[] | Classification labels for the trait |
| `runtime` | string | Target runtime constraint (e.g., "node", "deno", "browser") |
| `version` | string | Version constraint for the trait |
| `stability` | "stable" \| "experimental" \| "deprecated" | Stability level |

### ComposeTraitDescriptorsOptions

Options for `composeTraitDescriptors`:

| Property | Type | Description |
| :--- | :--- | :--- |
| `input` | TraitDescriptor[] | Array of trait descriptors to compose |
| `conflictStrategy` | TraitConflictStrategy | How to resolve conflicts (see below) |

### TraitConflictStrategy

Defines how to handle conflicts during trait composition:

| Value | Description |
| :--- | :--- |
| `"error"` | Throw an error when conflicts are detected (default) |
| `"warn"` | Log a warning but continue composition |
| `"ignore"` | Silently ignore conflicts |
| `"replace"` | Replace conflicting traits with later ones |

### ComposedTraitDescriptorsResult

Result of trait composition:

| Property | Type | Description |
| :--- | :--- | :--- |
| `provides` | string[] | All capabilities provided by the composed traits |
| `consumes` | string[] | All capabilities consumed by the composed traits |
| `state` | string[] | All state variables owned by the composed traits |
| `conflicts` | string[] | All conflicts detected during composition |
| `traits` | TraitDescriptor[] | The original trait descriptors |
| `metadata` | Record<string, any> | Additional metadata from composition |

---

## Usage in Package Configuration

Traits can also be defined in the package configuration via the `contracts` trait in `barrits.config.ts`:

```ts
// barrits.config.ts
import { defineBarritsConfig } from "@zuccadev-labs/barrits";

export default defineBarritsConfig({
  contracts: {
    traits: [
      {
        name: "AuthDomain",
        provides: ["auth-session", "database-adapter"],
        conflicts: ["legacy-adapter"],
        state: ["currentUser", "connectionPool"],
        consumes: ["logger", "config"]
      }
    ]
  }
});
```

This is equivalent to defining the trait with JSDoc or `createTraitDescriptor` but avoids modifying source files.

---

## Best Practices

1. **Keep traits focused**: Each trait should represent a single cohesive capability or concern.
2. **Explicit dependencies**: Use `consumes` to declare what your trait needs from others.
3. **Declare conflicts**: Use `conflicts` to prevent incompatible traits from being composed together.
4. **Own your state**: Use `state` to declare what state your trait manages.
5. **Use JSDoc for documentation**: Place trait definitions near where they are used and document with JSDoc tags.
6. **Leverage composition**: Build complex systems by composing simple, focused traits.
7. **Version and stability**: Use `@barrits-version` and `@barrits-stability` to communicate maturity.
8. **Runtime constraints**: Use `@barrits-runtime` to specify where a trait can run (node, deno, browser).

---

## Related API

- [`defineBarritsPackage`](../09a-api-reference-package-config.md#define-barrits-package-options) - For defining package-level configuration
- [`toBarritsAutomationOptions`](../09a-api-reference-package-config.md#to-barrits-automation-options-options) - For adapting package definitions to plugin options
- [`parseBuildManifest`](../09c-api-reference-consume-and-adapters.md#parse-build-manifest-value) - For consuming build manifests
- [`parseWatchSnapshot`](../09c-api-reference-consume-and-adapters.md#parse-watch-snapshot-value) - For consuming watch snapshots

---

[← API Reference — Consume and Adapters](09c-api-reference-consume-and-adapters.md) | [API Reference — Index](../09a-api-reference-package-config.md)

## Automatic Trait Discovery (Convention-Based)

Barrits can automatically discover traits by following conventions, reducing the need for explicit trait descriptor calls.

### Convention 1: Files in 	raits/ folder
Any TypeScript or JavaScript file placed in a 	raits/ folder (relative to the project root or the src/ directory) is automatically considered a trait.

### Convention 2: *.trait.ts or *.trait.tsx files
Files with the extension .trait.ts or .trait.tsx anywhere in the source tree are automatically considered traits.

### How it works
When automatic discovery is enabled (via arrits.config.ts or plugin options), Barrits:

1. Scans the source tree for files matching the above conventions.
2. For each file, it collects:
   - **Provides**: All exported functions, classes, and constants.
   - **Consumes**: Analyzes imports to determine what external capabilities are needed (can be supplemented with JSDoc @barrits-consumes).
   - **State**: Can be declared via JSDoc @barrits-state or left empty (inferred as none).
   - **Name**: Derived from the filename (without extension) or can be overridden with @barrits-trait { name: \"MyTrait\" }.

### Example
Given the file src/traits/auth.trait.ts:

`	s
/**
 * @barrits-trait
 * @barrits-summary Authentication trait
 * @barrits-consumes logger, config
 * @barrits-state sessionToken, user
 */
export function login(username: string, password: string): Promise<User> {
    // implementation
}

export function logout(): void {
    // implementation
}
`

Barrits will automatically create a trait descriptor equivalent to:

`	s
createTraitDescriptor({
  name: "auth",
  provides: ["login", "logout"],
  consumes: ["logger", "config"],
  state: ["sessionToken", "user"]
})
`

### Enabling Automatic Discovery
To enable automatic discovery, add to your arrits.config.ts:

`	s
import { defineBarritsConfig } from "@zuccadev-labs/barrits";

export default defineBarritsConfig({
  traitsDiscovery: {
    conventions: [
      "traits/**/*.ts",
      "traits/**/*.tsx",
      "**/*.trait.ts",
      "**/*.trait.tsx"
    ]
  }
});
`

### Notes
- Automatic discovery is optional and can be combined with manual trait descriptors.
- When both conventions and manual descriptors exist for the same trait name, they are merged (with manual descriptors taking precedence in case of conflict).
- The automatic discovery feature is available in Barrits v0.2.0 and above (planned).

