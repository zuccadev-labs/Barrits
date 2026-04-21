# 03 Dependencies and Surfaces

The governance of external dependencies and the definition of the public export surface are critical for maintaining a stable, industrial-grade SDK.

## Dependency Strategy

Barrits follows a minimal dependency philosophy to reduce the attack surface and prevent version conflicts in consumer projects:

- **Dev Dependencies**: Tools like TypeScript, Vitest, and @swc/core used for build and test phases.
- **Peer/Optional Dependencies**: Frameworks and bundlers supported via plugins (Vite, esbuild, etc.) are treated as external.
- **Zero Runtime Bloat**: The core orchestration engine is designed to be lightweight, delegating complex utility logic to the internal `barrits_lib`.

## Export Surfaces

The SDK exposes its capabilities through structured entry points defined in the `exports` map of `package.json`:

- **`.`**: Main entry point for the runtime-agnostic core.
- **`./node`**: Specific surface for Node.js environments and CLI.
- **`./deno`**: Specific surface for Deno environments.
- **`./vite`, `./esbuild`, `./rollup`, `./webpack`**: Dedicated subpaths for bundler plugins.
- **`./consume`**: Specialized surface for reading and validating automation artifacts.

## Surface Protection Rules

1.  **Path Hygiene**: Internal files (e.g., those in `internal/` or `sdk/`) must not be exported directly to the public surface to preserve flexibility for future refactoring.
2.  **Version Stability**: Any change that modifies the public export surface must be evaluated under SemVer rules (Minor or Major).
3.  **Documentation Sync**: All public members must be documented in the API Reference to ensure high discovery and correct usage.
