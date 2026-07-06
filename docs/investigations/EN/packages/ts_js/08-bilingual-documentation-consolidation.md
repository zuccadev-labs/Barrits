---
title: "08 — Bilingual Documentation Consolidation"
description: "ADR and investigation record on the EN/ES bilingual documentation architecture and Docusaurus migration strategy."
---

# 08 — Bilingual Documentation Consolidation

## Context and Investigation

As the project grew, documentation had expanded organically in two languages (ES and EN) without a clear naming convention, structure, or ownership. This generated several issues:

- **Inadvertent duplication:** In `docs/users/ES/packages/ts_js/`, 12 file pairs with underscore vs hyphen naming (e.g., `01_instalacion.md` and `01-instalacion.md`) were identified containing the same content in the same language.
- **Redundant paths:** Directories like `docs/package/ES/packages/ts_js/` were empty, creating confusion about where authoritative documentation resided.
- **Coverage gaps:** EN documentation lacked files that existed in ES (e.g., `04_validacion-y-publicacion.md`), and vice versa.
- **Duplicate "How it works" section:** The same 12-line text about trait discovery appeared in 7 example READMEs, creating desynchronization risk.

A complete inventory of existing documentation was conducted:

```
docs/
├── architecture/      ← 2 files (C4 PlantUML diagrams + structural vision)
├── development/       ← 8 ES + 6 EN (internal technical guides)
├── investigations/    ← 8 ES + 7 EN (ADRs and investigations)
├── package/           ← 9 ES + 9 EN (publishing, versioning, CI/CD)
├── users/             ← 20+ ES + 20+ EN (end-user documentation)
├── agents/            ← README + skills
└── README.md          ← Documentation system landing page
```

## Architectural Decisions (ADR)

1. **Tree Documentation Architecture with Language Separation:**
   - **Decision:** A directory structure was established where each thematic subdirectory (`architecture/`, `development/`, `investigations/`, `package/`, `users/`, `agents/`) contains `EN/` and `ES/` subdirectories with specific documents.
   - **Why:** Physical separation by language enables independent translations, clear navigation, and language-specific linting tools. EN files use hyphens (`00-index.md`), ES files use underscores (`00_indice.md`) for immediate visual differentiation.
   - **Implementation:** Convention documented in `docs/README.md` and in `AGENTS.md` as a mandatory rule.

2. **Migration Target to Docusaurus in a Separate Repository:**
   - **Decision:** The current flat Markdown documentation is designed to be migrated to Docusaurus in a separate repository in the future. The directory structure reflects the expected Docusaurus organization (sidebar, categories, bilingual).
   - **Why:** Docusaurus provides searchable navigation, documentation versioning, native multilingual support, and automated deployment. Maintaining compatible structure from the start avoids a traumatic migration.
   - **Implementation:** Each `docs/<category>/` subdirectory maps to a Docusaurus category. The `00-index.md` / `00_indice.md` files map to each category's landing page.

3. **Deduplication and Orphan Path Cleanup:**
   - **Decision:** All redundant paths (e.g., `docs/package/ES/packages/ts_js/` → merged into `docs/package/ES/`) and empty directories with undocumented `.gitkeep` were removed.
   - **Why:** The presence of multiple paths for the same content creates ambiguity about the authoritative source. Each concept must exist in exactly one location.
   - **Implementation:** Manual sweep with `git ls-files` verification to confirm no removed path contained tracked files.

## Results and Next Steps

Documentation consolidation reduced the documentation surface by ~15%, eliminated ambiguous paths, and established a clear convention for future contributions. Bilingual coverage was documented in `docs/README.md` with a status table.

The next step is the effective migration to Docusaurus, including: Docusaurus project setup, sidebar definition, automated deployment via GitHub Pages, and redirection from current READMEs.

---

[← Algorithm Catalogue Standardization](07-algorithm-catalogue-standardization.md) | [Index](00-index.md)
