---
title: "Best Practices"
description: "Corporate documentation for Best Practices."
---

# Best Practices

This document describes patterns and conventions that preserve the package-first contract and prevent common integration drift.

## Core Conventions

1. Keep only the `barrits/` directory visible in the consumer project as the declared domain boundary.
2. Do not expose `barrits_lib` as a public contract of the consumer project — it is the SDK's internal base library.
3. Prefer declaring configuration over chaining manual commands.
4. Use the repository examples as authoritative integration references per runtime.
5. Validate changes against the example that covers the affected surface.

## Handling External Dependencies

The deciding criteria is the runtime layer, not style preferences:

- If the module is Node-specific, Node dependencies are acceptable.
- If the module is Deno-specific, Deno-compatible dependencies are acceptable.
- If the module is frontend-facing, browser or framework dependencies are acceptable.

Runtime-specific dependencies belong in the runtime adapter layer, not in shared or universal code.

## Thinking About Imports

Barrits resolves from the consumer's project root. There is no "magic folder" required — standard module resolution from the project or workspace applies. Importing from the correct public subpath is sufficient.

## Patterns to Avoid

The following decisions break the package-first experience:

- Hiding configuration behind ad-hoc scripts without `defineBarritsPackage()` or `defineBarritsConfig()`.
- Mixing runtime-specific code inside the reusable package layer.
- Using a frontend example as a reference for Node or Deno integrations.
- Importing from `dist/` paths directly when a public subpath is available.

## Working with Examples

Identify the experience needed first, then select only the example that covers that specific surface. Copying entire examples without adapting them to the actual runtime and project shape introduces unmaintainable coupling.

## Documenting New Capabilities

When adding a new capability, document:

- Which runtime it covers.
- Which example demonstrates it.
- Which public subpath or API function exposes it.
- Which minimum validation is required to trust it.

---

[← Examples and Walkthroughs](03-examples-and-walkthroughs.md) | [Automation and Configuration →](05-automation-and-configuration.md)
