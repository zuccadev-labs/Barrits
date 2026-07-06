# Package Publication Documentation

This directory contains the operational and regulatory guide for the preparation, versioning, and publication of Barrits as a distributable product.

## Documentation Scope

This section focuses exclusively on release governance. It does not include user manuals, SDK architecture details, or internal implementation guides, which are located in their respective documentation directories.

## Active Publication Model

- **npm**: Releases managed via "Trusted Publishing" and OIDC protocol.
- **JSR**: Automated publication from GitHub Actions using OIDC identities.
- The elimination of static tokens (`JSR_TOKEN`, `NPM_TOKEN`) from standard operational flows is confirmed, following supply chain security best practices.

## Document Map

1.  **[00_indice.md](00_indice.md)**: General section index.
2.  **[01_publication-and-channels.md](01_publication-and-channels.md)**: Channel strategy.
3.  **[02_versioning-and-releases.md](02_versioning-and-releases.md)**: Version and SemVer management.
4.  **[03_secrets-actions-and-environments.md](03_secrets-actions-and-environments.md)**: CI Infrastructure and Security.
5.  **[04_environment-variables.md](04_environment-variables.md)**: Technical variable reference.
6.  **[05_release-readiness.md](05_release-readiness.md)**: Final preparation checklist.
7.  **[06_jsr-and-github-actions-configuration.md](06_jsr-and-github-actions-configuration.md)**: JSR-GitHub technical link.
8.  **[07_first-publication-step-by-step.md](07_first-publication-step-by-step.md)**: Release protocol.
9.  **[08_cicd-pipeline-and-branch-strategy.md](08_cicd-pipeline-and-branch-strategy.md)**: CI/CD pipeline and branching model.
