---
name: barrits-package-consumer-onboarding
description: 'Use this skill when onboarding a new project that consumes @zuccadev-labs/barrits. Covers setup, package-first config, runtime-specific integration, and verification commands for application teams.'
argument-hint: 'Provide target runtime (node, deno, bun, vite, tauri) and project type.'
---

# Barrits Package Consumer Onboarding

## When To Use
Use this skill for teams building a new product that consumes the package:
- Install and configure `@zuccadev-labs/barrits`.
- Create first package-first contract.
- Integrate Vite/bundlers or runtime adapters.
- Validate manifests and snapshots consumption.

## Required Inputs
- Runtime: Node, Deno, Bun, or frontend stack.
- Desired integration type: CLI, bundler plugin, consume helpers.
- Project root path and package manager.

## Onboarding Flow
1. Install dependency from npm or JSR.
2. Create `barrits/` or `src/barrits/` visible domain folder.
3. Define package-first contract with `defineBarritsPackage`.
4. If frontend, wire `barritsVitePlugin`.
5. Build once and inspect generated manifest/snapshot artifacts.
6. Add one real consumption path using `consume` or runtime adapter.
7. Document local commands for the team.

## Validation Commands (baseline)
```bash
npm run build
npm run dev
```

If Deno surface is used:
```bash
deno task build
deno task inspect
```

## Common Mistakes
- Importing legacy package name instead of `@zuccadev-labs/barrits`.
- Not exposing a visible `barrits` domain folder.
- Runtime-specific APIs imported from wrong subpath.

## Output Template
```markdown
## Project Onboarding Summary
- Runtime and integration selected.

## Applied Configuration
- Files created/updated.

## Verification
- Commands and outcomes.

## Adoption Checklist
- Team-ready commands.
- Next integration milestone.
```
