---
name: barrits-incident-troubleshooting
description: Use this skill when debugging incidents, build failures, test regressions, or runtime errors in the Barrits SDK. Covers diagnostic collection, error classification, and resolution paths.
---

# Barrits Incident Troubleshooting

## When To Use

Apply this skill when:
- A build fails unexpectedly
- Tests regress (previously passing → failing)
- A runtime error occurs in Node.js, Deno, or Bun
- A consumer reports unexpected behavior
- CI pipeline is red on `dev` or `main`

## Incident Triage

### 1. Collect Diagnostics

```bash
# Full diagnostic suite
npm run typecheck    # TypeScript errors?
npm run lint         # ESLint violations?
npm test             # Which tests fail? Count pass/fail
npm run build        # Build artifacts intact?
```

### 2. Classify the Incident

| Category | Symptoms | Typical Root Cause |
|:---|---|:---|
| Type error | `tsc --noEmit` fails | API signature change, missing export, type mismatch |
| Test regression | Previously passing test fails | Behavior change, edge case uncovered, async timing |
| Build failure | `npm run build` exits non-zero | Import resolution, barrel export missing, syntax error |
| Runtime crash | CLI throws unhandled exception | Adapter mismatch, file not found, permission denied |
| Cross-runtime | Works in Node, fails in Deno/Bun | Runtime API incompatibility, adapter gap |

### 3. Reproduce in Isolation

For test regressions:
```bash
# Run single failing test file
node ../../node_modules/tsx/dist/cli.mjs --test tests/<module>.test.ts

# Run with timeout (some tests are async)
node ../../node_modules/tsx/dist/cli.mjs --test --test-concurrency=1 tests/<module>.test.ts
```

### 4. Common Resolution Paths

#### Test Regression
1. Check if source code changed in the same area
2. Verify test assertions match new behavior
3. Run with `--test-concurrency=1` to rule out race conditions
4. Check temp directory cleanup (tests use `os.tmpdir()`)

#### Type Error
1. Check if new exports were added to barrel files (`index.ts`)
2. Verify `types` paths in `package.json` resolve to `dist/`
3. Check for stale `.d.ts` files in `src/` (should be gitignored)

#### Build Failure
1. Run `tsc --noEmit` for type-level diagnosis
2. Check `tsup.config.ts` for entry point mismatches
3. Verify `package.json` `exports` map matches actual `dist/` contents

#### Cross-Runtime Issue
1. Identify which runtime API the failing code uses
2. Check `adapters/node/` or `adapters/deno/` for the equivalent implementation
3. Verify the adapter is correctly wired in the entry point

## Rollback Decision

If the incident is on `main` and blocks consumers:

```bash
# Revert to last known good commit
git log --oneline -10
git revert HEAD
git push origin main
```

Then fix forward on `dev` and re-release.

## Post-Incident

1. Create or update a test that covers the gap
2. Document the incident in the relevant ADR if architectural
3. Add a changelog entry describing the fix

## References

- `docs/agents/skills/barrits-testing-patterns/` — Understanding the test suite structure
- `.opencode/skills/security-audit/` — For security-related incidents
- `.opencode/skills/emergency-release/` — For hotfix release procedure
