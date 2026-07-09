# 06 JSR and GitHub Actions Configuration

This document details the technical procedure for correctly linking the JSR package with the GitHub repository, enabling tokenless "Trusted Publishing" from GitHub Actions using OIDC.

## Final State Objective

The publication model aims to achieve the following security and automation milestones:

- **npm**: Tokenless publication from GitHub Actions using OIDC-based trusted publishing.
- **JSR**: Tokenless publication from GitHub Actions using OIDC.
- **Governance**: The operational flow does not normally depend on `NPM_TOKEN_PUBLICAR_NPM` or `JSR_TOKEN` for its execution.

## Step 1: Prepare GitHub

The following conditions must be verified in the GitHub interface:

1.  The correct repository already exists and is the one that will be used for release.
2.  The release workflow ([release.yml](../../.github/workflows/release.yml)) maintains `permissions.id-token: write`.
3.   The `jsr` environment exists.
4.  The `npm` environment exists.

### Important Note on Initial Bootstrap for npm
If `@zuccadev-labs/barrits` does not yet exist on npm, and the UI prevents configuring trusted publishing because it requires selecting an existing package first, the following bootstrap protocol is applied:

1.  Perform a first publish (manual or automated) using a granular `NPM_TOKEN_PUBLICAR_NPM`.
2.  Once the package is created, configure "Trusted Publishing" by linking the repository and the `release.yml` workflow.
3.  The initial token is subsequently retired from the standard operational flow.

## Step 2: Create or Review the Package in JSR

In `jsr.io`, perform the following actions:

1.  Log in with the account that will own the `@zuccadev-labs` scope.
2.  Verify the existence of the `@zuccadev-labs/barrits` package.
3.  Confirm that the name exactly matches [packages/sdk/ts_js/jsr.json](../../../packages/sdk/ts_js/jsr.json).

## Step 3: Link the Repository in JSR

In the package configuration on `jsr.io`, perform the following link:

1.  Open package `Settings`.
2.  Link the exact GitHub repository.

The expected result is that JSR recognizes the repository and allows trusted publishing from GitHub Actions.

## Step 4: Verify the Release Workflow

Audit the `release.yml` file to confirm the following components:

- Publication jobs run on secure GitHub Actions runners.
- Implementation of identity token write permissions (`id-token: write`).
- Use of native publication commands (`npx jsr publish` and `npm publish`).
- Inclusion of the `--provenance` flag in npm to certify the supply chain.
- Prior execution of technical validations (`dry-run`).

## Indicators of Successful Configuration

Configuration is considered certified when:

- GitHub Actions can publish to JSR and npm without requiring static authentication tokens.
- JSR releases generate provenance metadata linked to the GitHub workflow.
- The package reflects the official link to the source code in the JSR interface.
- Duplicate executions of the same version are handled deterministically and safely.
