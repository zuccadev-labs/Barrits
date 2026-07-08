# 08 CI/CD Pipeline and Branching Strategy

This document describes the integration, validation, release, and publication flows for the Barrits repository, ensuring technical integrity for every delivery.

## Branching Model

A hierarchical structure is established for code governance:

| Branch | Purpose |
| :--- | :--- |
| `feature/*` (or task branches) | Development of features or technical fixes. |
| `dev` | Integration, validation, and base for pre-releases (staging). |
| `main` | Reserved exclusively for certified stable versions. |

Publications are not triggered directly from task branches; they are exclusively activated by creating tags after a Pull Request is approved.

## Pipeline Triggers

| Event | Pipeline | Tasks Executed |
| :--- | :--- | :--- |
| Push to `dev` / `main` | Integration CI + Security | `typecheck → build → test → examples → jsr-dry-run` and security audit. |
| Pull Request to `dev` / `main` | Integration CI + Security | Full technical validation and dependency review. |
| Tag push `pre-v*` | Pre-release (Prerelease) | Tag validation, publication to npm (`next` tag), JSR, and GitHub Pre-release. |
| Tag push `v*` | Stable Release | Tag validation, publication to npm (`latest` tag), JSR, and official GitHub Release. |

## Release Lifecycle

### Prerelease Cycle

1. Development is consolidated in `feature/*` branches and integrated into `dev` via Pull Request.
2. Once the `dev` branch is certified, the version is incremented in manifests (e.g., `0.2.0-rc.1`).
3. The `pre-vX.Y.Z-rc.N` tag is generated and pushed.
4. The pipeline publishes to npm under the `next` tag, publishes to JSR, and generates the GitHub artifact.

### Stable Release Cycle

1. Changes are promoted from `dev` to `main` via a formal Pull Request.
2. After the merge, the stable version is established (e.g., `0.2.0`).
3. The official `vX.Y.Z` tag is generated and pushed.
4. The pipeline executes the final distribution to npm (`latest`), JSR, and formalizes the GitHub Release.

## Tagging Rules

| Tag Pattern | Origin Branch | npm Tag | Objective |
| :--- | :--- | :--- | :--- |
| `pre-vX.Y.Z-rc.N` | `dev` | `next` | Pre-release for deep technical evaluation. |
| `vX.Y.Z` | `main` | `latest` | Stable version for production. |

The automation system validates that the tag corresponds to the expected branch and that the version declared in the manifests exactly matches the tag identifier.

## Publication Coverage

- **npm**: Covers Node.js, Frontend (React, Vue, Solid, Svelte), Bundlers, Tauri, and Bun environments. Distributed under `next` or `latest` tags.
- **JSR**: Specifically covers the Deno ecosystem, aligned with the `jsr.json` contract.

The addition of further public registries is not considered necessary to cover existing integration scenarios.
