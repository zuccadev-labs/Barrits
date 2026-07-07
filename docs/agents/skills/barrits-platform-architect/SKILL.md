---
name: barrits-platform-architect
description: Enterprise architectural oversight for the Barrits SDK platform: trait design patterns, cross-package discovery, monorepo layout strategy, and API surface governance.
---

# Barrits Platform Architect

## When To Use

This specialist role is activated for architectural-level decisions:

- **Trait design**: Review or design new trait descriptor patterns and composition strategies
- **Cross-package discovery**: Establish discovery boundaries and domain mapping across packages
- **Monorepo layout**: Define package boundaries, barrel structure, and module visibility rules
- **API surface review**: Audit public API surfaces for consistency, completeness, and future-proofing
- **Technical debt strategy**: Prioritize refactoring based on coupling, fan-out, and maintenance cost

## Responsibilities

### 1. Trait System Governance

Ensure trait descriptors follow the canonical pattern:

```typescript
export const myTrait = createTraitDescriptor({
  name: "MyDomain",
  provides: ["capability:a", "capability:b"],
  consumes: ["dependency:x"],
  state: ["StateTypeA", "StateTypeB"],
  initialize: () => ({ /* default state */ }),
});
```

**Review criteria**:
- [ ] `name` is unique across the discovery domain
- [ ] `provides` capabilities are granular, not overlapping
- [ ] `consumes` dependencies exist somewhere in the domain
- [ ] `state` types are minimal (extensible later)
- [ ] JSDoc `@barrits-*` annotations match the code

### 2. Cross-Package Discovery Architecture

Define how the AST discovery layer traverses packages:

```
packages/
├── sdk/ts_js/src/     — Primary discovery root (public API)
│   └── barrits/
│       ├── api/       — Public surface (flat, domains, hybrid)
│       ├── internal/  — Internal services (not discovered)
│       ├── plugins/   — Bundler plugins (domain-exported)
│       ├── sdk/       — Core services (domain-exported)
│       ├── traits/    — IoC traits (trait-discovered)
│       └── shared/    — Shared types (re-exported)
```

**Rules**:
- Only directories under `discoveryRoots` are scanned
- `internal/` directories are excluded from public discovery
- Barrel files (`index.ts`) define the public contract
- Trait descriptors must be in `trait-discovered` directories

### 3. API Surface Evolution

Before adding a new public export, verify:

1. **Is there an existing abstraction?** Check `api/`, `sdk/contracts.ts`, and existing adapters
2. **Does it need to be public?** If only used by internal services, keep it internal
3. **Is the naming consistent?** Follow existing conventions (`create*`, `*Trait`, `build*`)
4. **Is it typed?** Full TypeScript types, no `any`, no `as` casts
5. **Is it documented?** Bilingual JSDoc with `@module` at file level

## Decision Log

All architectural decisions must be recorded as ADRs:

| Decision | ADR | Status |
| :------- | :-- | :----- |
| Trait-first orchestration | `docs/investigations/adr/0001-trait-first-architecture.md` | Accepted |
| Bilingual documentation | `docs/investigations/adr/0008-bilingual-documentation.md` | Accepted |
| Cross-runtime adapters | `docs/investigations/adr/0005-cross-runtime-adapters.md` | Accepted |

## Acceptance Criteria

- [ ] Trait names are unique and follow domain conventions
- [ ] Discovery boundaries are documented and enforced
- [ ] Public API surfaces are reviewed for consistency
- [ ] New abstractions don't duplicate existing ones
- [ ] Architectural decisions are recorded as ADRs

## References

- ADR template: `docs/investigations/adr/TEMPLATE.md`
- Trait system: `docs/agents/skills/barrits-package-first-implementation/SKILL.md`
- API surface: `packages/sdk/ts_js/src/barrits/api/`
- Discovery source: `packages/sdk/ts_js/src/barrits/sdk/`
