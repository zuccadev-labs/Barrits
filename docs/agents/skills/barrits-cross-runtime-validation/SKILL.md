---
name: barrits-cross-runtime-validation
description: Use this skill when validating Barrits behavior across Node.js, Deno, and Bun. Ensure consistency between internal services, adapters, and public API consumption in real-world integration scenarios.
opencode_skill: .opencode/skills/barrits-cross-runtime-validation/skill.jsonc
---

# Barrits Cross-Runtime Validation

## Validation Strategy

Barrits is a **portable SDK** that relies on specialized runtime adapters. Validation must certify that the core orchestration behaves identically regardless of the execution environment.

## Integration Matrix

| Environment | Entry Point | Target Validation |
| :--- | :--- | :--- |
| Node.js | `examples/example-nodejs/` | CLI / Direct Export Consumption |
| Deno | `examples/example-deno/` | JSR / Deno-native surface |
| Bun | `examples/example-bun/` | Fast-runtime compatibility |
| Frameworks | `examples/example-react/`, etc. | Bundler integration (Vite) |
| Desktop | `examples/example-tauri/` | Security and path restrictions |

## Full Quality Gate Workflow

1. **Core Validation**: Run `typecheck`, `build`, and `test` from the SDK root.
2. **Discovery Verification**: Ensure the internal normalization service handles current configurations correctly.
3. **Example Certification**: Build and run representative examples for each runtime.
4. **Adapter Audit**: Verify that `node` and `deno` specific entrypoints are correctly exported and functional.

## Execution Reference

```bash
# Build and verify the industrialized core
npm run build && npm test

# Verify JSR surface in isolation
npm run publish:jsr:dry-run

# Run cross-runtime example checks
deno task build # Inside example-deno
node src/main.js # Inside example-nodejs
```

## Critical Verification Areas

- **Path Normalization**: Ensure consistency between Windows (`\`) and POSIX (`/`) separators in discovery manifests.
- **Incremental Caching**: Validate that `.cache` and `.barrits` artifacts are correctly updated and respected across runs.
- **Security Boundaries**: Verify that path restrictions in the Tauri environment are strictly enforced.

## Reporting Standard

Validation success is measured by the total pass rate of the 65 unit/integration tests and the successful build of all 10+ integrated examples.
