---
name: barrits-maintainer-full-cycle
description: 'Use this skill for full maintainer lifecycle in Barrits: implement, validate runtimes, prepare prerelease, promote to stable, and verify npm+JSR publication with branch policy compliance.'
argument-hint: 'Describe the requested lifecycle stage and target branch (feature/dev/main).'
---

# Barrits Maintainer Full Cycle

## When To Use
Use this skill when a maintainer needs end-to-end execution inside this repository:
- Feature implementation in SDK core or adapters.
- Runtime validation across Node, Deno, Bun.
- Prerelease preparation on dev.
- Stable promotion to main.
- Publication verification in npm and JSR.

## Required State
- Clean working tree.
- Current branch known (`feature/*`, `dev`, or `main`).
- Node, Deno, Bun available.
- GitHub auth available for PR and workflow operations.

## Operating Rules
1. Never publish directly from feature branches.
2. Dev carries prerelease versions (`X.Y.Z-rc.N`).
3. Main carries stable versions (`X.Y.Z`).
4. Use PR-based flow for all protected branches.
5. Keep `package.json`, `jsr.json`, and lockfile in sync when version changes.

## Workflow
1. Implement change in feature branch.
2. Run quality gates.
3. Open PR to dev.
4. For prerelease, bump version in SDK manifests to `-rc.N` and tag `pre-vX.Y.Z-rc.N`.
5. Verify release workflow results and registry visibility.
6. Promote dev to main using PR.
7. Normalize main version to stable if needed.
8. Tag stable `vX.Y.Z` and verify publication.

## Quality Gates
```bash
npm run typecheck
npm run build
npm test
```

## Evidence Checklist
- PR URLs and merge SHAs.
- Workflow run IDs (CI, Security, Release).
- npm version and readme visibility checks.
- JSR version visibility checks.

## Common Failure Modes
- Version mismatch between manifests and tags.
- Open review thread blocking merge.
- Branch protection blocking direct push.
- Lockfile drift after package version bump.

## Output Template
```markdown
## Lifecycle Stage
- Implement | Validate | Prerelease | Promotion | Stable Release

## Actions Executed
- Commands and key changes.

## Validation Results
- CI/Security/Release outcomes.

## Registry Status
- npm and JSR verification.

## Next Step
- Exact follow-up action.
```
