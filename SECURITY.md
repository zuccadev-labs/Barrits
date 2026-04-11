# Security Policy

## Security posture

I treat this repository as audit-ready engineering work, not as a self-certified compliance program.

What I can assert from the repository itself:

- the SDK centralizes automation contracts through manifests and snapshots instead of scattering ad hoc filesystem parsing across integrations
- the Tauri example restricts reads to `.cache/**` and `.barrits/**`, rejects absolute paths, and blocks path traversal
- the release path now includes CI, dependency review, production `npm audit`, and JSR validation gates through GitHub Actions
- the JSR release path can use GitHub OIDC trusted publishing instead of storing a long-lived JSR token in repository secrets
- user, development, and investigation documentation are separated so operational claims can be reviewed against source and process

What this repository alone does not prove:

- SOC 2 compliance
- ISO 27001 certification
- external penetration testing or independent third-party audit completion
- organization-wide security governance outside this codebase

## Supported publication surfaces

Current supported public distribution targets:

- npm for the Node.js and bundler-facing package surface
- JSR for the Deno-facing package surface

If an organization needs internal distribution, I recommend evaluating an internal registry or mirror rather than multiplying public registries without a clear consumer need.

## Reporting a vulnerability

If you identify a security issue, do not open a public issue with exploit details.

Use a private disclosure path controlled by the maintainers. At minimum, include:

- affected surface or package entrypoint
- reproduction steps
- expected impact
- whether the issue affects npm, JSR, examples, or local tooling only

## Release hardening expectations

Before publishing, I expect at least:

1. successful CI on supported platforms
2. successful test, build, and selected example validation
3. a clean `npm audit --omit=dev --audit-level=high`
4. a clean `deno publish --dry-run` for the JSR surface
5. review of release notes and package metadata by a maintainer