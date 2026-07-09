# 05 Release Readiness

This document constitutes the final technical checklist that must be fully validated before proceeding with the publication of the SDK's first version.

## Technical Preparation Checklist

To certify that the repository is in a release-ready state, the following points must be verified:

1.  **Package Metadata**: Consistency of licenses, authors, and versions in the `package.json` files of both the monorepo and the SDK.
2.  **JSR Synchronization**: Alignment of the `jsr.json` file with the npm package metadata.
3.  **Mandatory Documentation**: Presence and timeliness of the `LICENSE`, `README.md`, `SECURITY.md`, and `CHANGELOG.md` files.
4.  **Automation Configuration**: Integrity of workflows in `.github/workflows/` (ci, security, release).
5.  **GitHub Infrastructure**: Full definition of secrets and environments in the repository management interface.
6.  **Functional Certification**: Optimal state ("green") in the build, unit tests, and all relevant integration examples.

## Trusted Publishing Configuration

- Configuration of the `npm` environment linking the `zuccadev-labs/Barrits` repository with the `release.yml` workflow.
- Package linkage in `jsr.io` enabling OIDC via the `id-token: write` permission in the CI system.
- Confirmed elimination of dependence on static tokens like `JSR_TOKEN` for primary release flows.

## Final Approval Criteria

Release approval is contingent on meeting the following quality standards:

- Full coverage of Node.js, Frontend, Bundlers, and Tauri scenarios through the npm channel.
- Native Deno implementation coverage through the JSR channel.
- Absence of residual or incorrect metadata (e.g., `UNLICENSED`).
- Validation that generated artifacts and cache directories (e.g., `dist/`, `.barrits/`) are correctly excluded via the `.gitignore` file.

## Current State Certification

The integrity of the following components has been verified in the current phase:

- **SDK Core**: Build, type checking, and unit tests approved.
- **Automation**: JSR publication simulation (dry-run) finalized without warnings.
- **Integration Examples**: Certification of `example-nodejs`, `example-deno`, frontend suites, bundler packages, and desktop support (Tauri).
- **Artifact Control**: Verification of the exclusion policy for temporary and generated files.
