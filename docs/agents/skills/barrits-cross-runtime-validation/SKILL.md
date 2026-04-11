---
name: barrits-cross-runtime-validation
description: Use this skill when validating barrits behavior across Node.js, Deno, and Bun in local development and CI. Apply it for runtime parity checks, example verification, and regression prevention for adapters and CLI flows.
---

# Barrits Cross-Runtime Validation

## When To Use
Use this skill when the user requests:
- End-to-end runtime validation in Node, Deno, and Bun.
- Confidence that examples and adapter CLIs behave consistently.
- CI hardening for multi-runtime verification.

## Validation Workflow
1. Confirm dependencies are installed with npm ci at workspace root.
2. Run SDK typecheck, build, and tests.
3. Validate Deno example tasks.
4. Validate Bun example tasks.
5. Validate representative framework examples where relevant.
6. Report parity gaps and propose minimal fixes.

## Required Commands
```bash
npm ci
npm run typecheck
npm run build
npm test
```

```bash
cd packages/sdk/ts_js/examples/example-deno
deno task build
deno task inspect
```

```bash
cd packages/sdk/ts_js/examples/example-bun
bun run dev
bun run inspect
```

## CI Expectations
- Include Bun setup in CI jobs that already validate Node and Deno.
- Keep commands non-interactive and deterministic.
- Fail fast on runtime-specific errors with actionable logs.

## Gotchas
- Bun and Node path behavior can diverge if relative roots are implicit.
- Deno permissions and config can hide failures if not explicit.
- Example workspace dependency links must match lockfile state.

## Validation Report Format
```markdown
## Runtime Matrix
- Node: pass/fail
- Deno: pass/fail
- Bun: pass/fail

## Regressions
- List any runtime-specific breakages.

## Follow-up
- Minimal fixes required before release.
```
