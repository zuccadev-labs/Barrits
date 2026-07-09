# Agent Skills for Barrits

This folder documents the complete agent skill ecosystem for Barrits. Skills are organized in two layers:

- **`.opencode/skills/`** — OpenCode-native skill registrations (`skill.jsonc`) discoverable by the agent runtime
- **`docs/agents/skills/`** — Narrative skill documents (`SKILL.md`) with full workflows, examples, and acceptance criteria

## Skill Inventory

### Tier 1 — Core Development Cycle (Essential)

| OpenCode Skill | Narrative Doc | Domain | Status |
|:---|---|:---|---|
| `testing-patterns` | `barrits-testing-patterns` | Test conventions, property-based tests, mutation testing | ✅ Implementado |
| `security-audit` | `barrits-security-audit` | Threat model, vulnerability scanning, supply chain audit | ✅ Implementado |
| `onboarding` | `barrits-onboarding` | Developer setup, project structure, first contribution | ✅ Implementado |
| `emergency-release` | `barrits-emergency-release` | Hotfix process, security patch, rollback | ✅ Implementado |
| `development-workflow` | `barrits-development-workflow` | Commit conventions, branch strategy, PR process | ✅ Implementado |

### Tier 2 — Maintainer Workflows (Planned)

| Skill | Domain | Status |
|:---|---|:---:|
| `barrits-maintainer-full-cycle` | Full maintenance lifecycle: version bump, release prep, changelog, publish | ✅ Implementado |
| `barrits-contribution-workflow` | External contribution intake: PR review, CI validation, merge | ✅ Implementado |
| `barrits-incident-troubleshooting` | Debugging incidents: diagnostics, error analysis, rollback decision | ✅ Implementado |
| `barrits-jsdoc-authoring` | Bilingual JSDoc patterns, `@barrits-*` annotation conventions | ✅ Implementado |

### Tier 3 — Consumer & Integration

| OpenCode Skill | Narrative Doc | Domain | Status |
|:---|---|:---|---|
| `integration-points` | `barrits-integration-points` | Bundler plugin configuration (Vite, esbuild, Rollup, Webpack) | ✅ Implementado |
| `llm-protocols` | `barrits-llm-protocols` | AI agent protocols, documentation standards, coding conventions | ✅ Implementado |
| `architecture-decision-records` | `barrits-architecture-decision-records` | ADR creation, template, lifecycle management | ✅ Implementado |
| `automation-showcase` | `barrits-automation-showcase` | Live demonstrations of SDK features via CLI | ✅ Implementado |
| `barrits-package-consumer-onboarding` | — | Consumer-side integration: import guide, API surface, best practices | ✅ Implementado |
| `barrits-cross-runtime-validation` | `barrits-cross-runtime-validation` | Cross-runtime validation strategy (Node.js, Deno, Bun) | ✅ Implementado |
| `barrits-package-first-implementation` | `barrits-package-first-implementation` | Implementation using package-first APIs, manifests, adapters, traits | ✅ Implementado |
| `barrits-release-orchestration` | `barrits-release-orchestration` | Release governance, versioning, npm + JSR publication | ✅ Implementado |

### Specialist Agent Roles (Enterprise)

| Role | Purpose | Status |
|:---|---|:---:|
| `barrits-platform-architect` | Architectural oversight: trait design, cross-package discovery, monorepo layout | ✅ Implementado |
| `barrits-runtime-quality` | Cross-runtime quality: adapter validation, CI matrix, example certification | ✅ Implementado |
| `barrits-release-manager` | Release orchestration: version alignment, changelog governance, registry publication | ✅ Implementado |
| `barrits-incident-commander` | Incident response: troubleshooting, root-cause analysis, rollback leadership | ✅ Implementado |

## Format Reference

### OpenCode Native (`.opencode/skills/<name>/skill.jsonc`)

```jsonc
{
  "name": "skill-name",
  "description": "Keyword-rich description for model-triggered discovery.",
  "prompts": [
    {
      "name": "prompt-name",
      "description": "Short action description.",
      "prompt": "Detailed instruction for the AI model."
    }
  ]
}
```

### Narrative (`docs/agents/skills/<name>/SKILL.md`)

```markdown
---
name: skill-name
description: Keyword-rich description.
---

# Skill Title

## Context
## Workflow
## Examples
## Acceptance Criteria
## References
```

## Operational Notes

- Every `.opencode/skills/` entry should reference its narrative counterpart in `docs/agents/skills/` via the prompt text.
- Descriptions are keyword-rich for model-triggered discovery.
- Workflows are non-interactive and evidence-oriented.
- Enterprise readiness requires both build/release skills and incident/contribution governance skills.
