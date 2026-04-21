# 00 Publication Index

This directory serves as the operational guide for the preparation, validation, and execution of releases for the Barrits SDK packages. It centralizes the governance of channels, versioning, and deployment automation.

## Publication Workflow Summary

- **npm Ecosystem**: Authentication managed via tokens stored in GitHub Secrets.
- **JSR Ecosystem**: Publication via "Trusted Publishing" using OIDC from GitHub Actions.
- **Initial Strategy**: Baseline release version `0.1.0`.

## Recommended Reading Order

1.  **[01_publication-and-channels.md](01_publication-and-channels.md)**: Definition of official distribution channels and their technical justification.
2.  **[02_versioning-and-releases.md](02_versioning-and-releases.md)**: Establishment of the versioning strategy (SemVer), tag management, and release cycles.
3.  **[03_secrets-actions-and-environments.md](03_secrets-actions-and-environments.md)**: Documentation of security secrets, environments, and GitHub Actions workflows.
4.  **[04_environment-variables.md](04_environment-variables.md)**: Configuration guide for variables and reference map for the local `.env` file.
5.  **[05_release-readiness.md](05_release-readiness.md)**: Final technical checklist prior to the first official release.
6.  **[06_jsr-and-github-actions-configuration.md](06_jsr-and-github-actions-configuration.md)**: Technical details of the link between JSR and GitHub Actions via OIDC.
7.  **[07_first-publication-step-by-step.md](07_first-publication-step-by-step.md)**: Sequential protocol for executing the initial release and subsequent updates.
8.  **[08_cicd-pipeline-and-branch-strategy.md](08_cicd-pipeline-and-branch-strategy.md)**: Documentation of the continuous integration pipeline and corporate branching strategy.
