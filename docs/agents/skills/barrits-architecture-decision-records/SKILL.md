---
name: barrits-architecture-decision-records
description: Architecture Decision Record (ADR) creation, review, and lifecycle management following the Barrits project template. Use when documenting architectural decisions, investigating trade-offs, or recording design rationale.
---

# Barrits Architecture Decision Records

## When To Use

Apply this skill when you need to create, review, or supersede an ADR:

- **Create**: A significant architectural decision has been made that affects the project's direction, performance, security, or maintainability.
- **Review**: An existing ADR needs validation for completeness, consistency, and alignment with current architecture.
- **Supersede**: A previous decision has been revisited and a new approach adopted.

## ADR Lifecycle

```
proposed → accepted → deprecated → superseded
                ↑                        |
                └—— (revision) ←—————————
```

## Workflow

### Create an ADR

1. **Read the template**: `docs/investigations/adr/TEMPLATE.md`
2. **Determine the next number**: Check existing ADRs in `docs/investigations/adr/` for the highest `NNNN-` prefix
3. **Create the ADR file**: `docs/investigations/adr/<NNNN>-<kebab-case-title>.md` with sections:
   - **Title**: Clear, descriptive summary of the decision
   - **Status**: `proposed`, `accepted`, `deprecated`, or `superseded`
   - **Context**: Problem statement, constraints, and forces at play
   - **Decision**: The chosen approach with rationale
   - **Consequences**: Positive, negative, and neutral implications
   - **Implementation**: Key files changed, migration path if any
4. **High-level ADRs** (cross-cutting concerns, multi-package): Also create bilingual versions:
   - `docs/investigations/EN/packages/ts_js/<NNNN>-<title>.md`
   - `docs/investigations/ES/packages/ts_js/<NNNN>-<title>.md`
5. **Update indexes**: Add entries to `docs/investigations/EN/packages/ts_js/00-index.md` and `docs/investigations/ES/packages/ts_js/00_indice.md`

### Review an ADR

1. Read the ADR (check both EN and ES versions)
2. Verify:
   - [ ] Status reflects current reality
   - [ ] Context describes the problem fully
   - [ ] Decision is specific and actionable
   - [ ] Consequences are honest (positive AND negative)
   - [ ] Implementation section references actual files
3. Update status or content if the architecture has diverged

### Supersede an ADR

1. In the old ADR, change status to `superseded`
2. Add a `Superseded by` section linking to the new ADR
3. Create the new ADR referencing what changed and why

## Acceptance Criteria

- [ ] ADR follows the template structure exactly
- [ ] Status is correctly set
- [ ] Context explains the problem without assuming prior knowledge
- [ ] Decision is concrete (not "we should consider...")
- [ ] Consequences include at least one positive and one negative
- [ ] Implementation references real files or modules
- [ ] Bilingual versions are in sync
- [ ] Indexes are updated

## References

- ADR template: `docs/investigations/adr/TEMPLATE.md`
- Existing ADRs: `docs/investigations/adr/`
- Bilingual index EN: `docs/investigations/EN/packages/ts_js/00-index.md`
- Bilingual index ES: `docs/investigations/ES/packages/ts_js/00_indice.md`
- `.opencode/skills/architecture-decision-records/skill.jsonc`
