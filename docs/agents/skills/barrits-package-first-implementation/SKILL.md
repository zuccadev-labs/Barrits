---
name: barrits-package-first-implementation
description: Use this skill when implementing or refactoring TypeScript/JavaScript features with @zuccadev-labs/barrits package-first APIs, manifests, and adapters. Apply it for framework integrations (Vite, Rollup, Webpack, esbuild), path graph orchestration, and contract-aligned module design.
---

# Barrits Package-First Implementation

## When To Use
Use this skill when the user asks to:
- Add or refactor a feature around package-first APIs in barrits.
- Integrate barrits into framework build pipelines.
- Design reusable manifests and adapters that work in Node and Deno.
- Improve SDK ergonomics while keeping compatibility with existing exports.

## Default Approach
1. Read the current public API surface in packages/sdk/ts_js/src/index.ts and package exports.
2. Preserve existing import paths and behavior unless migration is explicitly requested.
3. Prefer composable primitives over one-off helper logic.
4. Keep adapter-specific logic isolated under adapters/node or adapters/deno.
5. Verify build, typecheck, and tests before proposing release changes.

## Implementation Checklist
- [ ] Confirm whether the change is runtime-agnostic or adapter-specific.
- [ ] Keep TypeScript declarations aligned with runtime behavior.
- [ ] Update docs for user-facing API changes.
- [ ] Validate examples affected by API changes.
- [ ] Run quality gates listed below.

## Quality Gates
```bash
npm run typecheck
npm run build
npm test
```

## Framework Integration Defaults
- Vite: use the Vite plugin entrypoint exposed by barrits.
- Rollup/Webpack/esbuild: prefer plugin wrappers from the package exports.
- Keep plugin options minimal and declarative, with validated defaults.

## Gotchas
- Do not add Node-only APIs to runtime-agnostic core modules.
- Do not break `exports` mappings without explicit migration notes.
- Keep file path handling consistent across Windows and POSIX.
- Avoid hidden side effects during manifest generation.

## Output Template
```markdown
## Change Summary
- What was added/changed.

## Compatibility
- Runtime impact (Node, Deno, Bun).
- Export surface impact.

## Validation
- Commands executed and outcomes.
```
