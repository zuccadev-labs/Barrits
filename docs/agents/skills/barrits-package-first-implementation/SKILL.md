---
name: barrits-package-first-implementation
description: Use this skill when implementing or refactoring TypeScript/JavaScript features using @zuccadev-labs/barrits package-first APIs, manifests, adapters, traits, and built-in algorithms. Follow the industrialized core architecture using specialized internal services for normalization and orchestration.
opencode_skill: .opencode/skills/barrits-package-first-implementation/skill.jsonc
---

# Barrits Package-First Implementation

## When To Use

Apply this skill when the task requires:

- Implementing or refactoring features around package-first APIs in Barrits.
- Integrating Barrits into framework build pipelines (Vite, esbuild, Rollup, Webpack).
- Designing reusable manifests and adapters that work across Node and Deno.
- Extending core logic while maintaining the Single Responsibility Principle (SRP).
- Creating or composing `createTraitDescriptor()` contracts within a consumer project.
- Improving SDK ergonomics while preserving compatibility with published exports.

## Industrialized Architecture Context

The core has been refactored into modular internal services to strictly follow SRP.

```
packages/sdk/ts_js/src/
├── barrits/          # Core orchestration engine
│   ├── api/          # Public API surfaces (flat, domains, hybrid)
│   ├── internal/     # Specialized internal services (e.g., config_normalization.ts)
│   ├── plugins/      # Framework adapters (vite, esbuild, rollup, webpack)
│   ├── sdk/          # Inspection, manifests, and AST-layer discovery
│   ├── traits/       # Trait descriptors and pipeline composition
│   └── shared/       # Shared types and base definitions
├── barrits_lib/      # Internal reusable utilities and domain logic
adapters/
├── node/             # Node.js CLI and system adapters
└── deno/             # Deno CLI and system adapters
```

**Architectural Rules**:
1. **SRP Compliance**: Domain-agnostic orchestration lives in `barrits/`. Domain-specific logic or general utilities live in `barrits_lib/`.
2. **Internal Services**: Business logic for configuration and state normalization must reside in `barrits/internal/` and be consumed by the API layer.
3. **AST Layer**: Metadata extraction and incremental caching (0ms) are handled by the `barrits/sdk/ast/` subsystem.

## Key APIs

### Configuration and Normalization
The SDK uses an internal normalization service to bridge the gap between `defineBarritsPackage` and internal options.

```ts
import { defineBarritsPackage, defineBarritsConfig } from "@zuccadev-labs/barrits";

// Normalized via src/barrits/internal/config_normalization.ts
const pkg = defineBarritsPackage({ runtime: "react", watch: "auto" });
```

### Trait Contracts
```ts
import { createTraitDescriptor, composePipeline } from "@zuccadev-labs/barrits";

/**
 * @barrits-trait
 * @barrits-provides auth-session
 */
export const authTrait = createTraitDescriptor({
  name: "AuthDomain",
  provides: ["auth-session"],
});
```

## Implementation Guidelines

1. **Follow the Normalized Path**: When adding configuration options, update the internal normalization service to ensure consistency across entries.
2. **Maintain Portability**: Shared logic must remain runtime-agnostic. Use adapters for filesystem or process-specific calls.
3. **Verify Contract Integrity**: Any change to the core must be validated against the full test suite (65/65 tests) and the integrated examples.

## Quality Gates

Verify all changes using the corporate build pipeline:

```bash
npm run typecheck
npm run build
npm test
```
