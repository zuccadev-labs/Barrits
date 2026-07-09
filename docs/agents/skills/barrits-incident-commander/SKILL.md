---
name: barrits-incident-commander
description: Enterprise incident response for the Barrits SDK: troubleshooting, root-cause analysis, rollback leadership, and post-incident documentation. Use when a production issue is reported or a regression is detected.
opencode_skill: .opencode/skills/incident-commander/skill.jsonc
---

# Barrits Incident Commander

## When To Use

This specialist role is activated during incident response scenarios:

- **Production regression**: A published version breaks consumer builds or runtime behavior
- **Security incident**: A vulnerability is reported via GitHub, npm audit, or external disclosure
- **Publication failure**: npm or JSR publication fails mid-release, leaving registries in an inconsistent state
- **Cross-runtime bug**: A runtime-specific defect blocks consumers on Node.js, Deno, or Bun
- **Silent data corruption**: The SDK produces incorrect manifests or trait compositions without errors

## Incident Levels

| Level | Example | Response SLA | Escalation |
| :---- | :------ | :----------- | :--------- |
| **P0** | Security vulnerability, consumer-blocking regression | < 1 hour | CTO |
| **P1** | Publication failure, broken example | < 4 hours | Release Manager |
| **P2** | Non-blocking bug, documentation gap | < 24 hours | Platform Architect |
| **P3** | Feature request, minor enhancement | Next release | Normal triage |

## Triage Workflow

### 1. Acknowledge & Classify

```
Time: T+0min
Action: Acknowledge incident, determine level (P0-P3)
Output: Incident log entry with timestamp and severity
```

### 2. Gather Evidence

```bash
# Check current state
npm view @zuccadev-labs/barrits version --tag latest
npm view @zuccadev-labs/barrits version --tag next
git log --oneline -5

# Reproduce the issue
cd packages/sdk/ts_js
npm run build
npm test
npm run typecheck
```

### 3. Isolate Root Cause

**Common failure modes**:

| Symptom | Likely Root Cause | Diagnostic |
| :------ | :---------------- | :--------- |
| Build fails | Missing export, type error | `tsc --noEmit --pretty` |
| Tests fail | Regressed behavior, fixture mismatch | `npm test -- --reporter json` |
| Publication failure | OIDC token expired, version conflict | Check CI logs |
| Cross-runtime discrepancy | Adapter not synced | Compare output across runtimes |
| Manifest checksum mismatch | Non-deterministic ordering | `deterministicStringify` debug |

### 4. Decide: Fix or Rollback

**Fix in place** (for non-blocking P2/P3):
```bash
git checkout dev
git checkout -b fix/<issue-description>
# Apply fix
git commit -m 'fix(<scope>): <description>'
```

**Rollback** (for P0/P1 blocking issues):
```bash
# If published within 72h
npm unpublish @zuccadev-labs/barrits@<bad-version>

# Revert on main
git checkout main
git revert HEAD
git push origin main

# Revert on dev (cherry-pick the revert)
git checkout dev
git cherry-pick main~1
git push origin dev
```

### 5. Post-Incident Documentation

Create a post-incident report in `docs/investigations/`:

```markdown
# Post-Incident Report: <title>

## Summary
<one-line description>

## Timeline
| Time | Event |
| :--- | :---- |
| T+0 | Incident reported |
| T+30m | Root cause identified |
| T+2h | Fix deployed |

## Root Cause
<what went wrong>

## Impact
<affected users, duration, severity>

## Action Items
- [ ] Fix the root cause
- [ ] Add regression test
- [ ] Update monitoring
- [ ] Document lessons learned
```

## Communication Template

```
Subject: [INCIDENT] <level> — <brief description>

Status: Investigating | Mitigated | Resolved
Severity: P0/P1/P2/P3
Affected: <component, runtime, version>
Timeline: <key events>
Root Cause: <preliminary or confirmed>
Action: <rollback, fix deployed, monitoring>
```

## Acceptance Criteria

- [ ] Incident is classified by level and SLA is met
- [ ] Root cause is documented with evidence
- [ ] Fix or rollback is applied within SLA
- [ ] Regression test is added to prevent recurrence
- [ ] Post-incident report is filed in `docs/investigations/`
- [ ] Communication is sent to stakeholders

## References

- Troubleshooting skill: `docs/agents/skills/barrits-incident-troubleshooting/SKILL.md`
- Emergency release: `docs/agents/skills/barrits-emergency-release/SKILL.md`
- Security audit: `docs/agents/skills/barrits-security-audit/SKILL.md`
- ADR template: `docs/investigations/adr/TEMPLATE.md`

