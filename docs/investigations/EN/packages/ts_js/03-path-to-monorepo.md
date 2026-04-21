# 03 Path to Monorepo

The initial architecture of the project did not include a monorepo structure. Originally, the SDK was distributed from the root of the repository, with examples and support tools coexisting in the same logical space. This design, functional in earlier stages, demonstrated scalability limitations when faced with the need to support multiple SDKs.

## Structural Limitation Assessment

Three critical problems were identified in the initial centralized model:

1.  **Role Confusion**: The repository root mixed global orchestration responsibilities with TS/JS package publication tasks.
2.  **Level Overlap**: Example directories, source code, tests, and adapters shared the same hierarchical plane, making technical navigation difficult.
3.  **Lack of Growth Path**: The structure did not facilitate the future incorporation of SDKs in other languages (e.g., Go or Python) without generating governance conflicts.

## Resolution: Migration and Segmentation

A strategic migration was executed by moving the publishable package to the `packages/sdk/ts_js/` subdirectory. Simultaneously, examples were relocated within the SDK's own structure, ensuring that the integration experience was directly linked to the surface of the corresponding package.

## Benefits of the New Architecture

The adoption of the monorepo structure has achieved the following operational milestones:

- **Centralized Governance**: A private root that exclusively coordinates workspaces.
- **Hermetic Publication**: A package with a clear and isolated output surface in `packages/sdk/ts_js`.
- **Context Coherence**: Usage examples reside alongside the SDK that supports them, respecting each language's family.
- **Multilanguage Scalability**: A reproducible pattern has been established for incorporating new SDKs under the `packages/sdk/` hierarchy.
