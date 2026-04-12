# Agent Skills for Barrits

This folder documents the agent skill strategy for Barrits and keeps reusable skill content in versioned documentation.

## Skill Model Split

The skill strategy is separated by audience:

### 1) Barrits project maintainers (inside this repo)

- `barrits-maintainer-full-cycle`
- `barrits-contribution-workflow`
- `barrits-incident-troubleshooting`
- `barrits-jsdoc-authoring`

### 2) Teams consuming `@zuccadev-labs/barrits` in other projects

- `barrits-package-consumer-onboarding`

## Specialist Agent Team

Recommended specialist roles for enterprise workflows:

- `barrits-platform-architect`
- `barrits-runtime-quality`
- `barrits-release-manager`
- `barrits-incident-commander`

## Current Source Of Truth

- Narrative and workflow guidance stays under `docs/agents/skills`.
- Teams can copy these skills into project-level Copilot customization folders when needed.

## Operational Notes

- Every skill includes YAML frontmatter (`name`, `description`, optional `argument-hint`).
- Descriptions are keyword-rich for model-triggered discovery.
- Workflows are non-interactive and evidence-oriented.
- Enterprise readiness requires both build/release skills and incident/contribution governance skills.
