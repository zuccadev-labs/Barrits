# 00 Publication Index

This directory serves as the operational guide for the preparation, validation, and execution of releases for the Barrits SDK packages. It centralizes the governance of channels, versioning, and deployment automation.

## Publication Workflow Summary

- **npm Ecosystem**: Authentication managed via tokens stored in GitHub Secrets.
- **JSR Ecosystem**: Publication via "Trusted Publishing" using OIDC from GitHub Actions.
- **Initial Strategy**: Baseline release version `0.1.0`.

## Recommended Reading Order

1.  **[01-publication-and-channels.md](01-publication-and-channels.md)**: Definition of official distribution channels and their technical justification.
2.  **[02-versioning-and-releases.md](02-versioning-and-releases.md)**: Establishment of the versioning strategy (SemVer), tag management, and release cycles.
3.  **[03-secrets-actions-and-environments.md](03-secrets-actions-and-environments.md)**: Documentation of security secrets, environments, and GitHub Actions workflows.
4.  **[04-environment-variables.md](04-environment-variables.md)**: Configuration guide for variables and reference map for the local `.env` file.
5.  **[05-release-readiness.md](05-release-readiness.md)**: Final technical checklist prior to the first official release.
6.  **[06-jsr-and-github-actions-configuration.md](06-jsr-and-github-actions-configuration.md)**: Technical details of the link between JSR and GitHub Actions via OIDC.
7.  **[07-first-publication-step-by-step.md](07-first-publication-step-by-step.md)**: Sequential protocol for executing the initial release and subsequent updates.
8.  **[08-cicd-pipeline-and-branch-strategy.md](08-cicd-pipeline-and-branch-strategy.md)**: Documentation of the continuous integration pipeline and corporate branching strategy.
