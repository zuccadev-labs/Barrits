---
name: barrits-contribution-workflow
description: 'Use this skill when preparing contributions in Barrits: branch strategy, commit hygiene, PR quality gates, review readiness, and documentation/test expectations.'
argument-hint: 'Describe contribution type: feature, fix, docs, release, or security.'
---

# Barrits Contribution Workflow

## When To Use
Use this skill for any contribution entering protected branches.

## Branching Policy
- Work starts in `feature/*`, `fix/*`, or `docs/*` branch.
- PRs target `dev` first.
- Promotion to `main` happens by PR from `dev`.
- Never push directly to protected branches.

## Commit Policy
- Use explicit scope: `feat`, `fix`, `docs`, `chore`, `ci`, `release`.
- Keep one logical change per commit when possible.
- Include version sync in same change set when release-related.

## PR Checklist
- [ ] Quality gates pass.
- [ ] Affected examples validated.
- [ ] User-facing docs updated when behavior changes.
- [ ] Security impact reviewed for release-adjacent changes.
- [ ] No unresolved review threads.

## Quality Gates
```bash
npm run typecheck
npm run build
npm test
```

## Review Readiness
- Provide concise change summary.
- Include validation evidence and runtime impact.
- Mention migration notes for export or API changes.

## Output Template
```markdown
## Contribution Type
- Feature | Fix | Docs | Release | Security

## Branch And PR
- Source branch, target branch, PR link.

## Validation
- Commands executed and outcomes.

## Reviewer Notes
- Risk, compatibility, and follow-up tasks.
```
