---
name: barrits-release-orchestration
description: Use this skill when preparing and executing Barrits releases for npm, JSR, and GitHub. Follow the formal corporate governance for versioning, branch management, and OIDC-based publication.
---

# Barrits Release Orchestration

## Release Governance

Release management follows a formal branching and tagging strategy to ensure supply chain integrity and stability.

| Type | Tag format | Origin Branch | npm Tag |
| :--- | :--- | :--- | :--- |
| Prerelease | `pre-vX.Y.Z-rc.N` | `dev` | `next` |
| Stable release | `vX.Y.Z` | `main` | `latest` |

## Documentation Mesh
Release procedures and CI/CD governance are documented in detail within the following structure:
- `docs/package/ES/`: Spanish release procedures.
- `docs/package/README.md`: Bilingual entry point for publication governance.

## Pre-Publication Protocol

1. **Version Alignment**: Synchronize `package.json` and `jsr.json` versions.
2. **Integration Verification**: Ensure a green pipeline on the target branch (`dev` or `main`).
3. **Security Audit**: Validate `npm audit` and dependency reviews are clean.
4. **Release Readiness**: Verify the checklist in `docs/package/ES/05_release-readiness.md`.

## Execution Workflow

### Prerelease (Evaluation)
1. Consolidate changes into the `dev` branch.
2. Update versions to `X.Y.Z-rc.N`.
3. Create and push the `pre-v*` tag.
4. Monitor the OIDC-based publication to npm (`next`) and JSR.

### Stable Release (Production)
1. Promote `dev` to `main` via formal Pull Request.
2. Update versions to stable `X.Y.Z`.
3. Create and push the `v*` tag.
4. Finalize the release in GitHub and verify visibility in public registries.

## Publication Verification

```bash
# Verify NPM state
npm view @zuccadev-labs/barrits version --tag latest

# Verify JSR state
npx jsr info @zuccadev-labs/barrits
```

## Security Posture
The repository enforces **Trusted Publishing** via OIDC. Static tokens (`JSR_TOKEN`, `NPM_TOKEN`) are restricted from the primary release pipeline to prevent credential exposure.
