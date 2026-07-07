---
name: barrits-contribution-workflow
description: Use this skill when handling external contributions to Barrits: PR review, CI validation, merge criteria, and changelog attribution.
---

# Barrits Contribution Workflow

## When To Use

Apply this skill when:
- Reviewing a pull request from an external contributor
- Validating CI pipeline results for a contribution
- Deciding whether to merge a contribution into `dev`
- Attributing a contribution in the changelog

## PR Intake Process

### 1. Validate Conventions

- **Branch name**: `fix/<description>`, `feat/<description>`, `docs/<description>`, or `refactor/<description>`
- **Commit history**: Conventional commits (`type(scope): description`)
- **Single responsibility**: One PR should address one concern

### 2. CI Gate Checklist

| Check | Required | Command |
|:---|---|:---|
| TypeScript typecheck | ✅ | `npm run typecheck` — 0 errors |
| ESLint | ✅ | `npm run lint` — 0 errors, 0 warnings |
| Unit + integration tests | ✅ | `npm test` — 935+ passing |
| Build | ✅ | `npm run build` — exits 0 |
| JSR dry-run | ✅ | `npm run publish:jsr:dry-run` — passes |

### 3. Code Review Checklist

- [ ] Follows SRP: domain logic in `barrits/`, utilities in `barrits_lib/`
- [ ] Named exports only — no `export default`
- [ ] JSDoc bilingual (`[EN]` / `[ES]`) on exported symbols
- [ ] No runtime dependencies added (SDK is zero-dep)
- [ ] Tests added or updated for changed behavior
- [ ] No `as any`, `@ts-ignore`, or `@ts-expect-error`
- [ ] No debugging artifacts (`console.log`, commented code)
- [ ] If new API surface: added to relevant barrel export (`index.ts`)

### 4. Merge Protocol

```bash
# From dev branch
git checkout dev
git pull
git merge --no-ff feature/<branch>
git push origin dev
```

Use `--no-ff` to preserve branch history.

### 5. Changelog Attribution

Add an entry under `[Unreleased]` in `CHANGELOG.md`:

```markdown
### Added
- ... (by @contributor in #PR_NUMBER)
```

## Handling Common Issues

| Issue | Action |
|:---|---|
| Tests fail | Request contributor to fix; do not merge |
| Lint errors | Ask for `npm run lint -- --fix` |
| Missing JSDoc | Request bilingual documentation |
| Large PR (>500 lines) | Suggest splitting into multiple PRs |
| Security-sensitive change | Route through `barrits-security-audit` skill |

## References

- `.opencode/skills/development-workflow/` — Commit conventions and branch strategy
- `docs/development/` — Internal development guides (EN/ES)
- `AGENTS.md` — Repository operational rules for agents
