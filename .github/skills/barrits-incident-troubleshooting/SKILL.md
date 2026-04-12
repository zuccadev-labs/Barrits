---
name: barrits-incident-troubleshooting
description: 'Use this skill when CI, release, publish, or runtime integration fails in Barrits. Provides triage, diagnosis, recovery, rollback/hotfix decision path, and escalation criteria for enterprise operations.'
argument-hint: 'Describe incident type, failing workflow/run ID, and branch/tag.'
---

# Barrits Incident And Troubleshooting

## When To Use
Use this skill when something breaks:
- CI job failure.
- Security workflow failure.
- Release workflow failure.
- npm/JSR publication issue.
- Runtime-specific regression (Node, Deno, Bun).

## Severity Model
- Sev 1: production release blocked or broken published package.
- Sev 2: prerelease blocked or CI fully red.
- Sev 3: non-blocking runtime regression with workaround.
- Sev 4: docs/process issue without runtime impact.

## Triage Procedure
1. Capture failing run IDs and branch/tag.
2. Classify severity.
3. Identify failing stage: build, test, security, publish, registry visibility.
4. Determine scope: one runtime or all runtimes.
5. Decide action: retry, fix-forward, hotfix, or rollback.

## Recovery Playbooks
### CI Failure
- Re-run only if transient infrastructure signs exist.
- If deterministic failure repeats, fix code and re-open PR validation.

### Release Failure
- Validate tag format and tag branch containment.
- Validate version parity in `package.json` and `jsr.json`.
- Validate publish credentials and OIDC requirements.

### Registry Mismatch
- Check npm dist-tags (`next` vs `latest`).
- Check JSR info for expected version.
- Confirm README visibility from registry metadata.

## Hotfix vs Rollback
- Rollback when published stable artifact is invalid and fix is not immediate.
- Hotfix when patch can be delivered safely and quickly with clear diff.

## Escalation
Escalate to maintainer owners when:
- Sev 1 incidents.
- Security-related release blockers.
- Repeated release failures across two attempts.

## Output Template
```markdown
## Incident Summary
- Type, severity, impact.

## Diagnosis
- Root cause hypothesis and evidence.

## Action Taken
- Retry | Fix-forward | Hotfix | Rollback.

## Status
- Resolved | Monitoring | Escalated.

## Follow-up
- Preventive changes and owner.
```
