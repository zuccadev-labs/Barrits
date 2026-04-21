# 06 Tooling, Publication and Platforms

This document describes the validation and distribution constraints necessary to maintain high availability and reliability across multiple execution platforms.

## Multi-Runtime Support

The SDK core is strictly portable. Runtime-dependent logic is injected via specialized adapters:

- **Node.js**: Leveraged for building, testing, and classic server-side orchestration.
- **Deno**: Supported natively via JSR, ensuring first-class integration with modern Deno toolchains.
- **Bun**: Validated for high-performance execution and dev-mode agility.

## Bundler Integration

Barrits provides first-class support for the modern web stack. Plugins for Vite, esbuild, Rollup, and Webpack ensure that discovery-based orchestration is integrated directly into the build pipeline, allowing frontend applications to consume the same domain graph as the backend.

## Cross-Platform Validation Gates

Every change is verified against the **Example Matrix**:
- Validating path resolution on both Windows and POSIX-compliant systems.
- Certifying that the build manifest is consumable by all supported bundlers.
- Ensuring that Tauri-based desktop integrations respect security and filesystem restrictions.

## Publication Governance

The publication process is fully automated via GitHub Actions, using OIDC for both npm and JSR. This ensures that the released artifacts are cryptographically signed and linked to the verified source code in the repository.
