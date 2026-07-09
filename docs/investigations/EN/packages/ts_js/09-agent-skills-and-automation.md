---
title: "09 — Agent Skills and Development Automation"
description: "ADR and investigation record on the creation of AI agent Skills, development cycle standardization, and the transition to Phase 3."
---

# 09 — Agent Skills and Development Automation

## Context and Investigation

With the SDK functional, examples validated, and documentation consolidated, the team identified a critical opportunity: **automating the development cycle through specialized AI agents**. The repository already had a base of GitHub agents (`.github/agents/`) and skills (`.github/skills/`), but with significant gaps:

- **3 of 9 skills listed in `docs/agents/README.md` had an actual SKILL.md**; the other 6 were mere references.
- **No testing skill existed** documenting the framework, patterns, and expected coverage.
- **No forensic audit skill existed** to guide security reviews like the one documented in ADR 10.
- **No canonical repository context** (`REPOSITORY_CONTEXT.md` or similar) existed for agents to understand the project's architecture, conventions, and rules.
- **Listed agents had no clear boundaries** — no specification of which agent did what, creating overlap.

An analysis of recurring workflows that could be automated was conducted:

| Workflow | Frequency | Automatable | Priority |
|----------|-----------|:-----------:|:--------:|
| Code review | Per PR | High | 🔴 |
| Testing (setup, execution, validation) | Per commit | High | 🔴 |
| Release (versioning, changelog, publish) | Weekly | High | 🔴 |
| New developer onboarding | Monthly | Medium | 🟡 |
| Security audit | Quarterly | Medium | 🟡 |
| Performance benchmarking | Per release | Low | 🟢 |

## Architectural Decisions (ADR)

1. **Skills Architecture as Modular Use-Case Documentation:**
   - **Decision:** Each skill is structured as an independent Markdown document with metadata, context, step-by-step procedure, examples, acceptance criteria, and references to related ADRs. Skills reside in `docs/agents/skills/` with a README listing the complete inventory.
   - **Why:** Modularity allows agents to load only the skill needed for the current task, reducing contextual noise. Metadata (version, tags, target agents) enables automated discovery.
   - **Implementation:** Standard format defined in `docs/agents/skills/README.md` with a template.

2. **Essential vs. Aspirational Skills:**
   - **Decision:** Skills were classified into three tiers: essential (must exist for the basic cycle), recommended (improve quality), and aspirational (future vision). Phase 3 focuses on essentials: `testing-patterns`, `security-audit`, `onboarding`, and `emergency-release`.
   - **Why:** Attempting to create all skills simultaneously dilutes quality and delays delivery. The iterative approach allows validating each skill with real use before moving to the next.
   - **Implementation:** Prioritization documented in `docs/agents/README.md` with a status table and completion target per phase.

3. **Canonical Repository Context for Agents:**
   - **Decision:** A `REPOSITORY_CONTEXT.md` file will be created at the root describing the project architecture, code conventions, documentation rules, and references to key ADRs. This file is the first document an agent must read when joining the repository.
   - **Why:** Without a canonical context, each agent must infer the architecture from scratch, leading to inconsistent decisions and out-of-place suggestions.
   - **Implementation:** `REPOSITORY_CONTEXT.md` with sections: purpose, architecture, technology stack, conventions, documentation, agents, and skills.

## Results and Next Steps

The skills architecture enabled:
- Clear separation between domain knowledge (skills) and execution (agents).
- Realistic prioritization with iterative delivery per phase.
- Foundation for complete Phase 3, including implementation of the 4 essential skills.

The next steps are:
1. Implement `testing-patterns` skill (high priority, quality foundation).
2. Implement `security-audit` skill (inherits findings from ADR 10).
3. Implement `onboarding` skill (reduces friction for new contributors).
4. Implement `emergency-release` skill (hotfix and rollback).
5. Create `REPOSITORY_CONTEXT.md` as the source of truth for agents.

---

[← Bilingual Documentation Consolidation](08-bilingual-documentation-consolidation.md) | [Index](00-index.md)
