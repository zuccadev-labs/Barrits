---
name: barrits-llm-protocols
description: LLM agent protocols, documentation standards, AI-friendly coding practices, and JSDoc conventions for the Barrits project. Use when writing code for LLM consumption, applying JSDoc standards, or setting up agent context.
---

# Barrits LLM Protocols

## When To Use

Apply this skill when working with AI agents on the Barrits codebase:

- **Onboard an LLM**: Load project context for effective AI-assisted development
- **Write JSDoc**: Apply the bilingual [EN]/[ES] standard consistently
- **Code with LLMs**: Follow patterns that AI agents can understand and modify
- **Create or update skills**: Maintain the two-layer skill architecture

## Workflow

### 1. Load Project Context for LLM

Before starting any AI-assisted development:

```markdown
1. Read `REPOSITORY_CONTEXT.md` from project root
2. Read `AGENTS.md` for operational rules and phase status
3. For deep module context, read the `@module` JSDoc and `index.ts` barrel exports
4. For workflow-specific guidance, use `docs/agents/skills/<skill>/SKILL.md`
5. For OpenCode integration, use `.opencode/skills/<skill>/skill.jsonc`
```

### 2. Apply the Bilingual JSDoc Standard

Every public export must follow this pattern:

```typescript
/**
 * [EN] Description in English.
 * [ES] Descripción en español.
 *
 * @param paramName [EN] English description. [ES] Descripción en español.
 * @returns [EN] English description. [ES] Descripción en español.
 */
```

**File-level module annotation**:
```typescript
/**
 * @module
 * [EN] Module description.
 * [ES] Descripción del módulo.
 */
```

**Trait descriptor annotations**:
```typescript
/**
 * My trait description.
 *
 * @barrits-trait
 * @barrits-provides capability:name
 * @barrits-consumes dependency:name (optional)
 * @barrits-state StateType
 */
```

**Rules**:
- [EN] first, then [ES]
- Keep under 120 characters per line
- No default exports — always named exports
- Use `@param` and `@returns` for non-void functions

### 3. Write AI-Friendly Code

Guidelines for code that AI agents can effectively understand and modify:

1. **Explicit named exports** — no default exports
2. **Small functions** — single responsibility, under 30 lines
3. **JSDoc on all public API surfaces** — bilingual
4. **Descriptive variable names** — avoid single-letter (except math)
5. **Pure functions** — prefer over side effects
6. **Type annotations** — TypeScript inference is good, but explicit types help LLM reasoning
7. **Flat barrel files** — keep `index.ts` explicit and readable
8. **Constants** — no magic numbers or strings

### 4. Maintain the Skill Architecture

The project uses two skill layers:

| Layer | Location | Format | Purpose |
| :---- | :------- | :----- | :------ |
| A | `.opencode/skills/<name>/skill.jsonc` | JSONC | OpenCode registration with prompts |
| B | `docs/agents/skills/<name>/SKILL.md` | Markdown | Narrative workflow documentation |

**Creating a new skill**:
1. Create `skill.jsonc` with `name`, `description`, and `prompts` array
2. Create `SKILL.md` with YAML frontmatter and narrative sections
3. Add entry to `docs/agents/README.md` inventory

## Acceptance Criteria

- [ ] JSDoc follows the [EN]/[ES] bilingual pattern
- [ ] No default exports in SDK source
- [ ] Functions are small and single-responsibility
- [ ] Barrel files are explicit and flat
- [ ] Skill files exist in both layers when applicable
- [ ] `docs/agents/README.md` inventory is up to date

## References

- Project context: `REPOSITORY_CONTEXT.md`
- Operational rules: `AGENTS.md`
- JSDoc deep-dive: `docs/agents/skills/barrits-jsdoc-authoring/SKILL.md`
- Skill inventory: `docs/agents/README.md`
- `.opencode/skills/llm-protocols/skill.jsonc`
