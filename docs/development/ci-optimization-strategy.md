# CI Optimization Strategy

## Context

When developers push documentation-only changes (README updates, docs/* modifications), the current CI workflow executes the complete suite: typecheck, build, tests, examples validation, and JSR dry-run. This is inefficient for non-code changes.

## Recommendation: Path-Ignore Strategy

**Chosen approach:** Use `paths-ignore` in GitHub Actions workflows to skip heavy CI jobs when only documentation is modified.

**Rationale (engineering perspective):**

1. **Simplicity over fragmentation**: Maintaining a single CI workflow with conditional job execution is simpler than splitting into separate "light" and "heavy" workflows. Split workflows create maintenance burden and risk logic divergence.

2. **Industry standard**: This pattern is proven in large codebases:
   - Kubernetes (k/k): ignores docs/*, CHANGELOG.md for CI triggers
   - Next.js: skips build for markdown and config-only changes
   - Deno: uses path filtering for non-code updates

3. **Cost efficiency**: Avoids unnecessary GitHub Actions minutes for documentation PRs, reducing operational overhead in teams with frequent doc updates.

4. **Correctness**: No false negatives. If someone accidentally edits code in a docs/ file (rare), they can force-push. The gate exists only for known-safe paths.

## Implementation

### Files updated

**`.github/workflows/ci.yml`**

Added `paths-ignore` to both trigger events:

```yaml
on:
  push:
    branches: [main, dev]
    paths-ignore:
      - 'docs/**'
      - 'README.md'
      - 'CHANGELOG.md'
      - '.gitignore'
      - '*.md'
  pull_request:
    branches: [main, dev]
    paths-ignore:
      - 'docs/**'
      - 'README.md'
      - 'CHANGELOG.md'
      - '.gitignore'
      - '*.md'
```

**`.github/workflows/security.yml`** - Keep as-is

Security scans (dependency-review, npm audit) should run on all changes including docs PRs, as they validate manifest consistency.

**`.github/workflows/release.yml`** - Already correct

Already correctly ignores doc changes (release happens via tags, not push to docs/).

### Exception handling

If a PR touches **both** code and docs, the full CI runs (correct behavior).

Example scenarios:
- `docs/README.md` + `package.json` → Full CI runs ✅
- `docs/README.md` only → CI skipped ✅
- `src/index.ts` + `docs/guide.md` → Full CI runs ✅

## Security considerations

- Path-ignore is evaluated **before** job execution, not as an escape hatch
- Security workflows still run (npm audit/dependency-review always execute)
- If malicious code is hidden in docs/ (practically impossible), it doesn't execute
- No edge cases that compromise safety

## Monitoring

After implementation, track:
1. Number of skipped CI runs (expect increase for docs PRs)
2. Average CI time for mixed PRs (should remain unchanged)
3. Developer feedback on documentation update workflows (expect improvement)
