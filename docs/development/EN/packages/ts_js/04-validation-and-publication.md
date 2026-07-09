# 04 Validation and Publication

Technical validation is a mandatory prerequisite for considering any modification to the `ts_js` SDK complete. Acceptance criteria are adjusted according to the scope of the change, ensuring the stability of the public surface and operational flows.

## Technical Validation Baseline

When changes affect the architecture, the build system, the adapters, or the integration examples, the following verification suite must be executed:

1. **Synchronization**: `npm install` to validate dependency integrity.
2. **Build**: `npm run build` to ensure correct artifact materialization.
3. **Unit and Integration Tests**: `npm test` to certify compliance with logical contracts.
4. **Scenario Coverage**: Execution of representative examples linked to the modified surface.
5. **Publication Simulation**: `npm run publish:jsr:dry-run` for changes affecting Deno compatibility or the JSR contract definition.

## Example Validation Strategy

The selection of examples for smoke tests is performed surgically, prioritizing those that cover the impacted domain:

- **Core Infrastructure**: Validated through `example-nodejs/` (CLI, manifests, tooling, filesystem).
- **Deno Portability**: Validated through `example-deno/` (adapter, `jsr.json`, ESM imports).
- **Frontend Ecosystem**: Validated through Vite-based examples (React, Vue, Solid, Svelte).
- **Tooling Integration**: Validated through the `bundlers/` folder (build plugins).
- **Controlled Environments**: Validated through `example-tauri/` (security and artifact reading).

## Publication Governance

The SDK maintains a dual distribution strategy, treating npm and JSR as complementary platforms:

- **npm**: Distributes the binaries and artifacts generated in `dist/`.
- **JSR**: Publishes the source code and validates native Deno compatibility through `jsr.json`.

Before proceeding with a release publication, it is imperative to certify that the build, tests, and relevant examples are in an optimal ("green") state and that the Deno publication simulation yields no unexpected warnings.

## Documentation and Quality Maintenance

Any structural change to the logic, file paths, workspaces, or orchestration flows must be immediately reflected in this development support folder. Technical documentation must evolve in sync with the source code to ensure operational transparency of the project.
