# 02 Versioning and releases

The project adopts a consistent and predictable versioning strategy based on the **Semantic Versioning (SemVer)** standard to manage the SDK lifecycle.

## Version Increment Rules

- **MAJOR**: Changes that break compatibility with the public contract or irreversibly modify consumption flows.
- **MINOR**: Incorporation of new compatible features, addition of adapters, or visible SDK enhancements.
- **PATCH**: Bug fixes, hardening tasks, internal validations, or tooling adjustments that do not affect the contract.

## Unified Version Policy

The principle of a single version for the SDK is established: both npm and JSR must publish under the same numerical version to represent an identical functional release. For example, following the initial `0.1.0` release, increments will follow the `0.1.1`, `0.1.2` sequence as long as patch-level compatibility is maintained.

## Branching Strategy

Code governance is organized through two primary branches:

- **`dev`**: Continuous integration branch and base for pre-release launches.
- **`main`**: Production branch housing certified stable versions.

All modifications must enter `dev` via a Pull Request (PR). Promoting code from `dev` to `main` also requires a formal validation via PR.

## Release Protocol

1.  Consolidation of changes in a technical working branch.
2.  Opening a PR toward `dev`.
3.  Full validation of the CI suite (tests and security).
4.  **Optional Prerelease**: Updating versions in `package.json` and `jsr.json` to a pre-release format (e.g., `0.2.0-rc.1`).
5.  Creating the `pre-vX.Y.Z` tag on the `dev` branch. The automated workflow will publish the version to npm (with the `next` tag) and JSR, also generating a GitHub pre-release.
6.  **Stable Launch**: Opening a PR from `dev` to `main` once integration is validated.
7.  Updating versions to the certified stable release (e.g., `0.2.0`).
8.  Creating the official `vX.Y.Z` tag on the `main` branch. The workflow will execute stable publication to npm and JSR, and create the official GitHub Release.

## Tag Governance and Licensing

- Tags represent the stable state of the SDK at a specific point in time.
- The `pre-v` prefix is used for pre-release identifiers, and `v` for stable versions.
- Currently, a global tagging system is maintained for the monorepo given the presence of a single active SDK.

The project is distributed under the **MIT** license, with the corresponding authorship recognition in official license files.
