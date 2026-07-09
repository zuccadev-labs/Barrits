---
name: barrits-testing-patterns
description: Use this skill when writing or reviewing tests for Barrits SDK. Covers property-based testing with fast-check, mutation testing with Stryker, integration tests across runtimes, and structural testing patterns.
opencode_skill: .opencode/skills/testing-patterns/skill.jsonc
---

# Barrits Testing Patterns

## Test Pyramid

| Layer | Tool | Scope |
| :--- | :--- | :--- |
| Unit | `node:test` + `node:assert/strict` | Individual functions, pure logic |
| Property-based | `fast-check` | Invariants, idempotency, edge cases |
| Integration | `node:test` + child process | CLI commands, adapters, filesystem |
| E2E | CI pipelines | Cross-runtime, bundlers, examples |
| Mutation | Stryker | Coverage quality, survived mutants |

## Key Patterns

### Property-Based Tests (PBT)
- Import `fast-check` and use `fc.assert(fc.property(...))`
- Test invariants: idempotency, determinism, "never throws" for any input
- Use `fc.string()` / `fc.stringArray()` for path/string operations
- Example: `normalizePath is idempotent`, `joinPath never throws`

### Mutation Testing
- Run via `npx stryker run` from SDK root
- Break threshold: 50%, High threshold: 80%
- Current score: ~69.51%
- Config in root `stryker.config.json`

### Integration Tests
- Use temp directories with `mkdtemp` from `node:fs/promises`
- Spawn real CLI processes for command-level tests
- Assert on stdout, exit codes, and generated artifacts

### Module Structure
- Test files mirror source file layout under `tests/`
- File naming: `<module>.test.ts`
- Group with `test("description", async () => { ... })`

## Execution Commands

```bash
# All tests
npm test

# Coverage
npm run test:coverage

# Mutation (from root)
npx stryker run

# Single test file
node ../../node_modules/tsx/dist/cli.mjs --test tests/<file>.test.ts
```

