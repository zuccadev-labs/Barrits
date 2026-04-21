# 07 First publication step-by-step

This guide details the sequential protocol for executing the initial public release (`0.1.0`) and the procedures for subsequent SDK updates.

## Prerequisites Before Versioning

Before modifying the package version, the following controls must be certified:

1.  Full validation of the checklist in [05_release-readiness.md](05_release-readiness.md).
2.  Technical linkage of the JSR package with the GitHub repository.
3.  "Trusted Publishing" configuration in npm for the `release.yml` flow.
4.  Existence of the `npm` and `jsr` environments.
5.  Implementation of protections on the `dev` and `main` branches, ensuring integration occurs via PR.

## Branching Discipline and Workflow

The release process follows a strict progression model:

1.  Technical tasks are consolidated into independent working branches.
2.  A Pull Request is performed toward the `dev` integration branch.
3.  Pre-release versions are validated from `dev` if trial distribution is required.
4.  Promotion to the `main` production branch occurs after final integration approval.
5.  Stable versions are published exclusively from the `main` branch.

## Prerelease Protocol

Should trial distribution be necessary, the following operational order is followed:

1.  Consolidate changes into the `dev` branch.
2.  Increment version to prerelease format (e.g., `0.2.0-rc.1`) in `package.json` and `jsr.json`.
3.  Update the `CHANGELOG.md` file with the incorporated features.
4.  Create and push the `pre-vX.Y.Z-rc.N` tag.
5.  Monitor the automated publication process to the corresponding channels.

## Execution of the Initial Release `0.1.0`

1.  Certify the PR merge from `dev` to `main`.
2.  Validate version `0.1.0` in the SDK manifests and `CHANGELOG.md`.
3.  Verify that all technical tests, builds, and publication simulations are successful.
4.  Create and push the official `v0.1.0` tag.
5.  Follow the [release.yml](../../.github/workflows/release.yml) workflow until successful completion.

## Procedure for Maintenance Releases (`0.1.1`)

For patch-level updates, the operational flow is repeated by adjusting the version to `0.1.1` in npm and JSR, ensuring the update of historical change logs and the full validation of the test suite before generating the new official tag.
