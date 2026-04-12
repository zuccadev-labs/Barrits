# Agent Skills for Barrits

This folder documents the skill strategy for Barrits. The Copilot-native files that agents load automatically are now under `.github/skills` and `.github/agents`.

## Effective Copilot Locations

- Skills: `.github/skills/<skill-name>/SKILL.md`
- Agents: `.github/agents/<agent-name>.agent.md`

## Skill Model Split

The repository now separates skills by audience:

### 1) Barrits project maintainers (inside this repo)

- `barrits-maintainer-full-cycle`
- `barrits-contribution-workflow`
- `barrits-incident-troubleshooting`
- `barrits-jsdoc-authoring`

### 2) Teams consuming `@zuccadev-labs/barrits` in other projects

- `barrits-package-consumer-onboarding`

## Specialist Agent Team

Defined in `.github/agents`:

- `barrits-platform-architect`
- `barrits-runtime-quality`
- `barrits-release-manager`
- `barrits-incident-commander`

## Legacy Skill Docs

The skills under `docs/agents/skills` are kept as narrative references. For active Copilot discovery and invocation, prefer `.github/skills`.

## Operational Notes

- Every skill includes YAML frontmatter (`name`, `description`, optional `argument-hint`).
- Descriptions are keyword-rich for model-triggered discovery.
- Workflows are non-interactive and evidence-oriented.
- Enterprise readiness requires both build/release skills and incident/contribution governance skills.
